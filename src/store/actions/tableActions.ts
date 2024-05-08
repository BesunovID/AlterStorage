import axios from "axios";
import { AppDispatch } from ".."
import { AllSelectData, BaseElement, BaseField, defaultElementOfTable, urlList } from "../../models/models"
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
                const allSelectData: AllSelectData = {}

                setSubData(emptyElement, allSelectData, promises);

                Promise.all(promises).then(async () => {
                    const result = res.data.map(async (e: Object) => {
                        const newElement = await setElementValue(e, link, allSelectData);
                        data.push(newElement);
                    })
                    await Promise.all(result);
                    data.sort((a, b) => {
                        return Number(b.id.value[0]) - Number(a.id.value[0])
                    }); 
                    dispatch(tableSlice.actions.showTable({data: data, table: link, emptyElement: emptyElement, allSelectData: allSelectData}));
                })
            })
        } catch(e) {
            console.log('error', e)
        }
    }
}

export const setSubData = (element: BaseElement, allSelectData: AllSelectData, promises: Array<Promise<any>>) => {
    Object.keys(element).map((key) => {
        if (element[key].selectable) {
            !(key in allSelectData) && promises.push(getSubData(element, key, allSelectData));
        
            const subElement: BaseElement = defaultElementOfTable.get(element[key].selectable);
            element[key].valueFrom.map((field) => (
                subElement[field].selectable && !(field in allSelectData) &&
                setSubData(subElement, allSelectData, promises)
            ))
        }
    })
}

const getSubData = async (emptyElement: BaseElement, key: string, selectData: AllSelectData) => {
    const table = emptyElement[key].selectable;

    const result = await axios.get(`${process.env.REACT_APP_BASE_STORAGE_URL}/${table}/`, {
        headers: {
            'Authorization': `Token ${localStorage.getItem('TOKEN')}`,
        }
    }).then((res) => {
        emptyElement[key].selectData = [...res.data].sort((a, b) => {
            return Number(b.id) - Number(a.id)
        });
        selectData[key] = [...res.data].sort((a, b) => {
            return Number(b.id) - Number(a.id)
        });
        return 'success'
    }).catch(() => {
        return 'error'
    })

    return result
}

export const setAllSelectData = (allSelectData: AllSelectData) => {
    return (dispatch: AppDispatch) => {
        dispatch(tableSlice.actions.setAllSelectData({data: allSelectData}))
    }
}

const setElementValue = async (e: Object, link: string, allSelectData: AllSelectData) => {
    const newElement: BaseElement = defaultElementOfTable.get(link);
    Object.entries(e).map(([key, val]) => {
        if (newElement[key].childrens !== undefined){
            const value: Array<Object> = val;
            newElement[key].count = value.length;
            Object.values(value).map((element, index) => (
                Object.entries(element).map(([key2, val2]) => {
                    const value2: string = (val2 === null) ? '' : val2.toString();
                    if (key2 === 'id'){
                        newElement['id_2'].value[index] = value2;
                    } else if (key2 === 'number_invoice'){
                        newElement['number_invoice_2'].value[index] = value2;
                    } else if (key === 'connectAssembling_Storage_Position' && key2 === 'storage_position'){
                        newElement['storage_position_2'].value[index] = value2;
                    } else {
                        if (newElement[key2].selectable)
                            newElement[key2].selectData = [...allSelectData[key2]]
                        newElement[key2].value[index] = value2;
                    }
                })
            ))
        } else {;
            const value: string = (val === null) ? '' : val.toString();
            newElement[key].value[0] = value;
            if (newElement[key].selectable)
                newElement[key].selectData = [...allSelectData[key]]
        }
    });

    return await setElementVisableValues(newElement, allSelectData);
}

export const setElementVisableValues = async (newElement: BaseElement, allSelectData: AllSelectData) => {

    const setSelectableValue = (elementField: BaseField) => {
        const valueFrom: BaseElement = defaultElementOfTable.get(elementField.selectable);

        const result = elementField.value.map((val) => {
            const findValue = elementField.selectData?.find((el: any) => 
                el.id.toString() === val.toString());
            const visableValue = elementField.valueFrom.map((field) => { 
                if (valueFrom[field].selectable){
                    valueFrom[field].selectData = [...allSelectData[field]];
                    valueFrom[field].value = [(findValue as {[key: string]: string})[field]];
                    const res: string[] = setSelectableValue(valueFrom[field]);
                    return res.join(' ')
                } else {
                    return (findValue !== undefined ? 
                    (findValue as {[key: string]: string})[field] : '')
                }
            }).join(' ');

            return visableValue
        });

        return result
    }
    
    Object.values(newElement).map((value) => { 
        if (value.selectable) {
            value.visableValue = setSelectableValue(value);
        } else {
            value.visableValue = [...value.value];
        }
    });

    return newElement
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
        .then((res) => {
            dispatch(addAlert(
                'success', 
                `${table[link as keyof typeof urlList]}`, 
                `Элемент ${res.data.id}: ${getElementName(element)} успешно создан!`, 
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
            if (e?.response?.status === 400) {
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

    return async(dispatch: AppDispatch) => {
        const result = await customAxios.patch(`/${link}/${id}/`, returnedData)
        .then(() => {
            dispatch(showModalElement(false, undefined, link));
            dispatch(addAlert(
                'success', 
                `${table[link as keyof typeof urlList]}`, 
                `Элемент ${id}: ${getElementName(element)} успешно обновлен!`, 
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
            if (e?.response?.status === 400) {
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
                `Элемент ${id}: ${getElementName(element)} удален!`, 
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
            if (e?.response?.status === 400) {
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

const getElementName = (element: BaseElement) => {
    const name = Object.values(element).map((value) => {
        if (value.main) 
            return value.visableValue[0]
    }).join(' ')

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
                        else if (data[child].inForm){
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