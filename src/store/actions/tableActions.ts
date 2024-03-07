import axios from "axios";
import { AppDispatch } from ".."
import { BaseElement, BaseElementFields, defaultElementOfTable, urlList } from "../../models/models"
import { tableSlice } from "../slices/tableSlice"

const customAxios = axios.create({
    baseURL: process.env.REACT_APP_BASE_STORAGE_URL,
    timeout: 15000,
    headers: {
        'Authorization': `Token ${localStorage.getItem('TOKEN')}`,
    }
})

export const showProductsTable = (link: urlList) => {
    const emptyElement: BaseElement = defaultElementOfTable.get(link);
    const data: BaseElement[] = new Array
    return async (dispatch: AppDispatch) => {
        try{
            await customAxios.get(`/${link}/`).then((res) => {   
                res.data.map((e: Object) => {
                    const newElement = JSON.parse(JSON.stringify(emptyElement));
                    Object.entries(e).map(([key, value]) => {
                        if (value !== null) {
                            if (key === 'positions' || key ==='connectAssembling_Storage_Position'){
                                Object.entries((value as Array<Object>)[0]).map(([key2, value2]) => (
                                    ((newElement[key] as [{ [field: string]: BaseElementFields}])[0][key2].type === 'text' 
                                    || (newElement[key] as [{ [field: string]: BaseElementFields}])[0][key2].type === 'datetime-local')
                                    ? (newElement[key] as [{ [field: string]: BaseElementFields}])[0][key2].value = (value2 as string).toString()
                                    : (newElement[key] as [{ [field: string]: BaseElementFields}])[0][key2].value = Number(value2 as number)
                                ))
                            } else {
                                ((newElement[key] as BaseElementFields).type === 'text' 
                                || (newElement[key] as BaseElementFields).type === 'datetime-local')
                                ? (newElement[key] as BaseElementFields).value = (value as string).toString()
                                : (newElement[key] as BaseElementFields).value = Number(value as number);
                            }
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
    const subFieldsInvoice = ['name_of_the_invoice', 'actual_quantity', 'price_per_unit', 
        'manufacturer', 'quantity_invoice', 'summa', 'number_invoice', 'provider']
    const subFieldsStorage = ['assembling', 'quantity']
    const arrayOfSort = [...data] as BaseElement[];
    const revers: boolean = (field === sortedByField);

    if (!revers) sortedDirection = 1;

    arrayOfSort.sort((a, b) => {
        let newA;
        let newB;
        if(subFieldsInvoice.includes(field)){
            newA = (a['positions'] as [{[field:string]: any}])[0][field];
            newB = (b['positions'] as [{[field:string]: any}])[0][field];
        } else if (subFieldsStorage.includes(field)) {
            newA = (a['connectAssembling_Storage_Position'] as [{[field:string]: any}])[0][field];
            newB = (b['connectAssembling_Storage_Position']  as [{[field:string]: any}])[0][field];
        } else {
            newA = (a[field] as BaseElementFields);
            newB = (b[field] as BaseElementFields);
        }
        
        if (newA.type === 'number' && newB.type === 'number') {
            if (newA.value == undefined && newB.value == undefined){
                const aID = (a['id'] as BaseElementFields).value as number
                const bID = (b['id'] as BaseElementFields).value as number
                return(aID > bID ? (1 * sortedDirection) : (-1 * sortedDirection))
            }
            else if (newA == undefined)
                return (-1 * sortedDirection)
            else if (newB == undefined)
                return (1 * sortedDirection)
            else{
                if (newA.value > newB.value) return (1 * sortedDirection)
                else if (newA.value < newB.value) return (-1 * sortedDirection)
                else{
                    const aID = (a['id'] as BaseElementFields).value as number
                    const bID = (b['id'] as BaseElementFields).value as number
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
                const aID = (a['id'] as BaseElementFields).value as number
                const bID = (b['id'] as BaseElementFields).value as number
                return(aID > bID ? (1 * sortedDirection) : (-1 * sortedDirection))
            }
        }
    }); 

    const newData = revers ? arrayOfSort.reverse() : arrayOfSort;

    return (dispatch: AppDispatch) => {
        dispatch(tableSlice.actions.sortTable({data: newData, sortedByField: field, sortedRevers: revers}))
    }
}

export const showModalElement = (isOpen: boolean, element?: BaseElement) => {
    return(dispatch: AppDispatch) => {
        dispatch(tableSlice.actions.showModalElement({isOpen: isOpen, element: element}))
    }
}

export const createElement = (element: BaseElement, link: urlList) => {
    const returnedData = restructData(element)
    return async(dispatch: AppDispatch) => {
        await customAxios.post(`/${link}/`, returnedData)
        .then(() => {
            alert('Элемент успешно создан!');
            dispatch(showProductsTable(link));
        })
        .catch((e) => {
            alert('Ошибка создания!' + e.message);
        }) 
        .finally(() => {
        })
    }
}

export const updateElement = (element: BaseElement, link: urlList) => {
    const id = (element['id'] as BaseElementFields).value as number
    const returnedData = restructData(element)
    return async(dispatch: AppDispatch) => {
        await customAxios.put(`/${link}/${id}/`, returnedData)
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
    Object.entries(data).map(([key, value]) => {
        if (key !== 'id' && key !== 'date'){
            if (key === 'connectAssembling_Storage_Position' || key === 'positions') {
                const subObj: [{[k: string]: any}] = [{}];
                Object.entries((value as [{ [field: string]: BaseElementFields}])[0]).map(([key2, value2]) => {
                    if (key2 !== 'id' && key2 !== 'date') {
                        if (((value2 as BaseElementFields).type === 'number') && ((value2 as BaseElementFields).value == 0))
                            subObj[0][key2] = null
                        else 
                            subObj[0][key2] = value2.value
                    }
                });
                newData[key] = subObj
            } else {
                if (((value as BaseElementFields).type === 'number') && ((value as BaseElementFields).value == 0)) {
                    newData[key] = null
                } else
                    newData[key] = (value as BaseElementFields).value
            }
        }
    })
    return newData
}