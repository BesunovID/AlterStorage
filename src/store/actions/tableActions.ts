import axios from "axios";
import { AppDispatch } from ".."
import { BaseElement, defaultElementOfTable, urlList } from "../../models/models"
import { tableSlice } from "../slices/tableSlice"
import { addAlert } from "./alertsActions";

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
                const promises: Array<Promise<any>> = [];
                const allSelectData: {[key: string]: Array<Object>} = {}

                Object.keys(emptyElement).map((key) => {
                    if (emptyElement[key].selectable) {
                        promises.push(getSubData(emptyElement[key].selectable as string, emptyElement, allSelectData, key))
                    }
                })
                Promise.all(promises).then(() => {
                    res.data.map((e: Object) => {
                        const newElement: BaseElement = defaultElementOfTable.get(link);
            
                        Object.entries(e).map(([key, val]) => {
                            const value = (val === null) ? '' : 
                            (newElement[key].childrens !== undefined ? val : val.toString());

                            if (newElement[key].selectable){
                                newElement[key].selectData = [...allSelectData[key]]
                                if (value !== '')
                                    (newElement[key].visableValue as any)[0] = (allSelectData[key].find((el: any) => el.id.toString() === value) as {[key: string]: any})[newElement[key].valueFrom as string]
                            } 
                            if (newElement[key].childrens !== undefined){
                                newElement[key].count = (value as Array<Object>).length;
                                Object.values((value as Array<Object>)).map((element, index) => (
                                    Object.entries(element).map(([key2, val2]) => {
                                        const value2 = (val2 === null) ? '' : val2.toString();
                                        if (key2 === 'id'){
                                            newElement['id_2'].value[index] = value2;
                                        } else if (key2 === 'number_invoice'){
                                            newElement['number_invoice_2'].value[index] = value2;
                                        } else if (key === 'connectAssembling_Storage_Position' && key2 === 'storage_position'){
                                            newElement['storage_position_2'].value[index] = value2;
                                        } else {
                                            if (newElement[key2].selectable){
                                                newElement[key2].selectData = [...allSelectData[key2]];
                                                if (value2 !== '') 
                                                    (newElement[key2].visableValue as any)[index] = (allSelectData[key2].find((el: any) => el.id.toString() === value2) as {[key: string]: any})[newElement[key2].valueFrom as string]
                                            } 
                                            newElement[key2].value[index] = value2;
                                        }
                                    })
                                ))
                            } else {
                                newElement[key].value[0] = value;
                            }
                        })
                        data.push(newElement)
                    })
                    dispatch(tableSlice.actions.showTable({data: data, table: link, emptyElement: emptyElement}));
                })
            })
        } catch(e) {
            console.log('error', e)
        }
    }
}

const getSubData = (table: string, emptyElement: BaseElement, selectData: {[key: string]: Array<Object>}, key: string) => {
    return axios.get(`${process.env.REACT_APP_BASE_STORAGE_URL}/${table}/`, {
        headers: {
            'Authorization': `Token ${localStorage.getItem('TOKEN')}`,
        }
    }).then((res) => {
        emptyElement[key].selectData = [...res.data];
        selectData[key] = [...res.data];
    })
}

export const showModalElement = (isOpen: boolean, element?: BaseElement, table?: urlList) => {
    return(dispatch: AppDispatch) => {
        dispatch(tableSlice.actions.showModalElement({isOpen: isOpen, element: element}));
        if (table && !isOpen) dispatch(showProductsTable(table));
    }
}

export const createElement = (element: BaseElement, link: urlList) => {
    const returnedData = restructData(element);
    return async(dispatch: AppDispatch) => {
        const result = await customAxios.post(`/${link}/`, returnedData)
        .then(() => {
            dispatch(showModalElement(false, undefined, link));
            dispatch(addAlert('success', 'Элемент успешно создан!', 5000));
            return 'success'
        })
        .catch((e) => {
            return 'error'
        })
        return result
    }
}

export const updateElement = (element: BaseElement, link: urlList) => {
    const id = Number(element['id'].value[0]);
    const returnedData = restructData(element);
    return async(dispatch: AppDispatch) => {
        const result = await customAxios.patch(`/${link}/${id}/`, returnedData)
        .then(() => {
            dispatch(showModalElement(false, undefined, link));
            dispatch(addAlert('success', 'Элемент успешно обновлен!', 5000));
            return 'success'
        })
        .catch((e) => {
            return 'error'
        })
        return result
    }
}

export const deleteElement = (elementID: string, link: urlList) => {
    return async(dispatch: AppDispatch) => {
        await customAxios.delete(`/${link}/${elementID}/`)
        .then(() => {
            dispatch(showProductsTable(link));
            return 'success'
        })
        .catch((e) => {
            return 'error'
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
                            if (data[child].type === 'number' && (Number(data[child].value[index])) > 0){
                                newObj[child] = Number(data[child].value[index])
                            } else if (data[child].type !== 'number' && data[child].value[index] !== '') {
                                newObj[child] = data[child].value[index];
                            }
                        }
                        return(newObj)
                    }, {} as BaseElement)
                    newData[key].push(subject);
                })
            } else {
                if (value.type === 'number') {
                    if (Number(value.value[0]) > 0)
                        newData[key] = Number(value.value[0]);
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