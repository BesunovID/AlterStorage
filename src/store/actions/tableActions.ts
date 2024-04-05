import axios from "axios";
import { AppDispatch } from ".."
import { BaseElement, defaultElementOfTable, urlList } from "../../models/models"
import { tableSlice } from "../slices/tableSlice"

const customAxios = axios.create({
    baseURL: process.env.REACT_APP_BASE_STORAGE_URL,
    timeout: 10000,
    headers: {
        'Authorization': `Token ${localStorage.getItem('TOKEN')}`,
    }
})

export const showProductsTable = (link: urlList) => {
    const emptyElement: BaseElement = defaultElementOfTable.get(link);
    const data: BaseElement[] = [];
    return async (dispatch: AppDispatch) => {
        dispatch(tableSlice.actions.startLoading());
        try{
            await customAxios.get(`/${link}/`).then((res) => {  
                res.data.map((e: Object) => {
                    const newElement = defaultElementOfTable.get(link);
                    Object.entries(e).map(([key, value]) => {
                        if (newElement[key].childrens !== undefined){
                            newElement[key].count = (value as Array<Object>).length;
                            Object.values((value as Array<Object>)).map((value2, index) => (
                                Object.entries(value2).map(([key2, value2]) => {
                                    if(newElement[key2].type === 'text' 
                                    || newElement[key2].type === 'datetime-local'){
                                        if (key2 === 'number_invoice'){
                                            newElement['number_invoice_2'].value[index] = (value2 as string).toString();
                                        } else newElement[key2].value[index] = value2 as string;
                                    } else {
                                        if (key2 === 'id'){
                                            newElement['id_2'].value[index] = Number(value2 as number);
                                        } else if (key2 === 'number_invoice'){
                                            newElement['number_invoice_2'].value[index] = Number(value2 as number);
                                        } else newElement[key2].value[index] = Number(value2 as number);
                                    }   
                                })
                            ))
                        } else {
                            if(newElement[key].type === 'text' 
                            || newElement[key].type === 'datetime-local'){
                                if (value !== null) newElement[key].value[0] = (value as string).toString();
                            } else newElement[key].value[0] = (Number(value as number));
                        }
                    })
                    data.push(newElement)
                })
                dispatch(tableSlice.actions.showTable({data: data, table: link, emptyElement: emptyElement}));
            })
        } catch(e) {
            console.log('error', e)
        }
    }
}

export const showModalElement = (isOpen: boolean, element?: BaseElement, table?: urlList) => {
    return(dispatch: AppDispatch) => {
        dispatch(tableSlice.actions.showModalElement({isOpen: isOpen, element: element}))
        if (table && !isOpen) dispatch(showProductsTable(table));
    }
}

export const createElement = (element: BaseElement, link: urlList) => {
    const returnedData = restructData(element);
    return async() => {
        await customAxios.post(`/${link}/`, returnedData)
        .then(() => {
            alert('Элемент успешно создан!');
        })
        .catch((e) => {
            alert('Ошибка создания!' + e.message);
        }) 
        .finally(() => {
        })
    }
}

export const updateElement = (element: BaseElement, link: urlList) => {
    const id = element['id'].value[0] as number;
    const returnedData = restructData(element);
    return async(dispatch: AppDispatch) => {
        await customAxios.patch(`/${link}/${id}/`, returnedData)
        .then(() => {
            alert('Элемент успешно обновлен!');
            dispatch(showProductsTable(link));
        })
        .catch((e) => {
            alert('Ошибка обновления!' + e.message);
        }) 
        .finally(() => {
        })
    }
}

export const deleteElement = (elementID: number, link: urlList) => {
    return async(dispatch: AppDispatch) => {
        await customAxios.delete(`/${link}/${elementID}/`)
        .then(() => {
            alert('Элемент удален!');
            dispatch(showProductsTable(link));
        })
        .catch((e) => {
            alert('Ошибка удаления!' + e.message);
        }) 
        .finally(() => {
        })
    }
}


const restructData = (data: BaseElement): {} => {
    const newData: {[k: string]: any} = {};
    const childrens: Array<string> = [];
    Object.keys(data).map(key => 
        data[key].childrens !== undefined && (data[key].childrens?.map(ch => 
        childrens.push(ch))));
    Object.entries(data).map(([key, value]) => {
        if (key !== 'id' && key !== 'date' && !(contains(childrens, key))){
            if (data[key].childrens !== undefined) {
                newData[key] = [];
                const arr = [...new Array(value.count)].map((_,i) => i+1);
                arr.map((_, index) => {
                    const subject = (data[key].childrens as Array<any>).reduce((newObj, child) => {
                        if (data[child].visable){
                            if (data[child].type === 'number' && (data[child].value[index] as number) > 0){
                                newObj[child] = Number(data[child].value[index])
                            } else if (data[child].type !== 'number' && (data[child].value[index] as string) !== '') {
                                newObj[child] = data[child].value[index].toString();
                            }
                        }
                        return(newObj)
                    }, {} as BaseElement)
                    newData[key].push(subject);
                })
            } else {
                if (value.type === 'number') {
                    if (value.value[0] as number > 0)
                        newData[key] = value.value[0];
                } else
                    newData[key] = value.value[0];
            }
        }
    })
    return newData
}

const contains = (arr: Array<string>, elem: string) => {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === elem)
            return true;
    }
    return false;
}