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

export const showProductsTable = (link: string) => {
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
                                newElement[key].selectData = [...allSelectData[key]];
                                if (value !== ''){
                                    const fields: string[] = defaultElementOfTable.mainField(newElement[key].selectable);
                                    const findElement = allSelectData[key].find((el: any) => el.id.toString() === value);
                                    (newElement[key].visableValue as string[])[0] = fields.map(field => (findElement as any)[field]).join(' ');
                                }    
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
                                                if (value2 !== '') {
                                                    const fields: string[] = defaultElementOfTable.mainField(newElement[key2].selectable);
                                                    const findElement = allSelectData[key2].find((el: any) => el.id.toString() === value2);
                                                    (newElement[key2].visableValue as string[])[index] = fields.map(field => (findElement as any)[field]).join(' ');
                                                }
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

export const showModalElement = (isOpen: boolean, element?: BaseElement, table?: string) => {
    return(dispatch: AppDispatch) => {
        dispatch(tableSlice.actions.showModalElement({isOpen: isOpen, element: element}));
        if (table && !isOpen) dispatch(showProductsTable(table));
    }
}

export const createElement = (element: BaseElement, link: string) => {
    const returnedData = restructData(element);
    const table = {...urlList};

    return async(dispatch: AppDispatch) => {
        const result = await customAxios.post(`/${link}/`, returnedData)
        .then(() => {
            dispatch(showModalElement(false, undefined, link));
            dispatch(addAlert(
                'success', 
                `${table[link as keyof typeof urlList]}`, 
                `Элемент ${getElementName(link, element)} успешно создан!`, 
                10000)
            );
            return 'success'
        })
        .catch((e) => {
            if (e?.response?.status === 500) {
                dispatch(addAlert(
                    'danger', 
                    `${table[link as keyof typeof urlList]}`, 
                    `Ошибка на сервере (${e.response.statusText}), попробуйте позже!`, 
                    10000)
                )
            }
            if (e?.response?.status === 404) {
                dispatch(addAlert(
                    'danger', 
                    `${table[link as keyof typeof urlList]}`, 
                    `Ошибка создания, неверный формат данных!`, 
                    10000)
                );
            }
            return 'error'
        })
        return result
    }
}

export const updateElement = (element: BaseElement, link: string) => {
    const id = Number(element['id'].value[0]);
    const table = {...urlList};
    const returnedData = restructData(element);
    console.log(element);

    return async(dispatch: AppDispatch) => {
        const result = await customAxios.patch(`/${link}/${id}/`, returnedData)
        .then(() => {
            dispatch(showModalElement(false, undefined, link));
            dispatch(addAlert(
                'success', 
                `${table[link as keyof typeof urlList]}`, 
                `Элемент ${getElementName(link, element)} успешно обновлен!`, 
                10000)
            );
            return 'success'
        })
        .catch((e) => {
            if (e?.response?.status === 500) {
                dispatch(addAlert(
                    'danger', 
                    `${table[link as keyof typeof urlList]}`, 
                    `Ошибка на сервере (${e.response.statusText}), попробуйте позже!`, 
                    10000)
                )
            }
            if (e?.response?.status === 404) {
                dispatch(addAlert(
                    'danger', 
                    `${table[link as keyof typeof urlList]}`, 
                    `Ошибка обновления, неверный формат данных!`, 
                    10000)
                );
            }
            return 'error'
        })
        return result
    }
}

export const deleteElement = (element: BaseElement, link: string) => {
    const id = element['id'].value[0];
    const table = {...urlList};

    return async(dispatch: AppDispatch) => {
        const result = await customAxios.delete(`/${link}/${id}/`)
        .then(() => {
            dispatch(showProductsTable(link));
            dispatch(addAlert(
                'success', 
                `${table[link as keyof typeof urlList]}`, 
                `Элемент ${getElementName(link, element)} удален!`, 
                10000)
            );
            return 'success'
        })
        .catch((e) => {
            if (e?.response?.status === 500) {
                dispatch(addAlert(
                    'danger', 
                    `${table[link as keyof typeof urlList]}`, 
                    `Ошибка на сервере (${e.response.statusText}), попробуйте позже!`, 
                    10000)
                )
            }
            if (e?.response?.status === 404) {
                dispatch(addAlert(
                    'danger', 
                    `${table[link as keyof typeof urlList]}`, 
                    `Ошибка удаления, неверный формат данных!`, 
                    10000)
                );
            }
            return 'error'
        })
        return result
    }
}

const getElementName = (table: string, element: BaseElement) => {
    const name = `${element.id.value[0]}: ` + defaultElementOfTable.mainField(table).map((field: string) => 
        element[field].selectable ? 
        (
            defaultElementOfTable.mainField(element[field].selectable).map((field2: string) => 
                (element[field].selectData?.find((e: any) => (
                    e.id === Number(element[field].value[0])
                )) as {[key: string]: string})[field2]
            ).join(' ')
        )
        :
        element[field].value[0]
    ).join(' ');

    return name;
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
                        if (child === 'id_2' && data[child].value[index]){
                            newObj['id'] = Number(data[child].value[index])
                        }
                        else if (child === 'storage_position_2' && data[child].value[index]){
                            newObj['storage_position'] = Number(data[child].value[index])
                        }
                        else if (child === 'number_invoice_2' && data[child].value[index]){
                            newObj['number_invoice'] = Number(data[child].value[index])
                        }
                        else if (data[child].visable){
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