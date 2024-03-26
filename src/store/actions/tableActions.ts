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
        try{
            await customAxios.get(`/${link}/`).then((res) => {  
                res.data.map((e: Object) => {
                    const newElement = defaultElementOfTable.get(link);
                    Object.entries(e).map(([key, value]) => {
                        if (newElement[key].childrens !== undefined){
                            Object.entries((value as Array<Object>)[0]).map(([key2, value2]) => {
                                if(newElement[key2].type === 'text' 
                                || newElement[key2].type === 'datetime-local'){
                                    newElement[key2].value = value2 as string
                                } else {
                                    if (key2 === 'id')
                                        newElement['id_2'].value = Number(value2 as number);
                                    else newElement[key2].value = Number(value2 as number);
                                }   
                            })
                        } else {
                            if(newElement[key].type === 'text' 
                            || newElement[key].type === 'datetime-local'){
                                newElement[key].value = value as string
                            } else newElement[key].value = Number(value as number);
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

export const sortProductsTable = (field: string, data: BaseElement[], sortedByField: string, sortedDirection: number) => {
    const arrayOfSort = [...data];
    const revers: boolean = (field === sortedByField);

    if (!revers) sortedDirection = 1;

    arrayOfSort.sort((a, b) => {
        let newA = a[field];
        let newB = b[field];
        
        if (newA.type === 'number' && newB.type === 'number') {
            if (newA.value === undefined && newB.value === undefined){
                const aID = a['id'].value as number
                const bID = b['id'].value as number
                return(aID > bID ? (1 * sortedDirection) : (-1 * sortedDirection))
            }
            else if (newA === undefined)
                return (-1 * sortedDirection)
            else if (newB === undefined)
                return (1 * sortedDirection)
            else {
                if (newA.value > newB.value) return (1 * sortedDirection)
                else if (newA.value < newB.value) return (-1 * sortedDirection)
                else{
                    const aID = a['id'].value as number
                    const bID = b['id'].value as number
                    return(aID > bID ? (1 * sortedDirection) : (-1 * sortedDirection))
                }
            }
        } else {
            if ((newA.value as string).toLowerCase() >
                (newB.value as string).toLowerCase())
                return (1 * sortedDirection)
            else if ((newA.value as string).toLowerCase() <
                (newB.value as string).toLowerCase()) 
                return (-1 * sortedDirection)
            else{
                const aID = a['id'].value as number
                const bID = b['id'].value as number
                return(aID > bID ? (1 * sortedDirection) : (-1 * sortedDirection))
            }
        }
    }); 

    const newData = revers ? arrayOfSort.reverse() : arrayOfSort;

    return (dispatch: AppDispatch) => {
        dispatch(tableSlice.actions.sortTable({data: newData, sortedByField: field, sortedRevers: revers}))
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
    const id = element['id'].value as number;
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
                newData[key] = [{}];
                data[key].childrens?.map(field => {
                    if (field !== 'id_2' && field !== 'date') {
                        if (data[field].type === 'number'){
                            if (data[field].value as number > 0)
                                newData[key][0][field] = Number(data[field].value);
                        }else{
                            newData[key][0][field] = data[field].value;
                        }  
                    }
                })
            } else {
                if (value.type === 'number') {
                    if (value.value as number > 0)
                        newData[key] = value.value;
                } else
                    newData[key] = value.value;
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