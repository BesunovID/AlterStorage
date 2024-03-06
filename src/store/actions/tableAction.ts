import axios from "../../axios"
import { AppDispatch } from ".."
import { AnyDataTable, BaseElement, BaseElementFields, defaultElementOfTable, urlList } from "../../models/models"
import { tableSlice } from "../slices/tableSlice"


export const showProductsTable = (link: urlList) => {
    const emptyElement: BaseElement = defaultElementOfTable.get(link);
    const data: BaseElement[] = new Array

    return async (dispatch: AppDispatch) => {
        try{
            await axios.get(`storage/${link}/`).then((res) => {   
                res.data.map((e: Object) => {
                    console.log(e)
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

export const sortProductsTable = (field: string, data: AnyDataTable[], sortedByField: string, sortedDirection: number) => {
    return (dispatch: AppDispatch) => {
        const arrayOfSort = [...data] as AnyDataTable[];
        const revers: boolean = field === sortedByField;

     /*   arrayOfSort.sort((a, b) => (
            typeof a[field as keyof typeof data[0]] === 'string' ?
            ((a[field as keyof typeof data[0]] as string).toLowerCase() >
            (b[field as keyof typeof data[0]] as string).toLowerCase() ? 1 * sortedDirection : -1 * sortedDirection) :
            ((a[field as keyof typeof data[0]] as number) > (b[field as keyof typeof data[0]] as number) ? 1 * sortedDirection : -1 * sortedDirection)
        )); 
*/
        const newData = revers ? arrayOfSort.reverse() : arrayOfSort;

       // dispatch(tableSlice.actions.sortTable({data: newData, sortedByField: field, sortedRevers: revers}))
    }
}

export const showModalElement = (isOpen: boolean, element?: BaseElement) => {
    return(dispatch: AppDispatch) => {
        dispatch(tableSlice.actions.showModalElement({isOpen: isOpen, element: element}))
    }
}

export const createElement = (element: BaseElement, link: urlList) => {
    const returnedData = restructData(element)
    console.log(returnedData)
    return async() => {
        await axios.post(`storage/${link}/`, returnedData)
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
    const id = (element['id'] as BaseElementFields).value as number
    const returnedData = restructData(element)
    return async() => {
        await axios.patch(`storage/${link}/${id}/`, returnedData)
        .then(() => {
            alert('Элемент успешно обновлен!');
        })
        .catch((e) => {
            alert('Ошибка обновления!' + e.message);
        }) 
        .finally(() => {
        })
    }
}

export const deleteElement = (elementID: number, link: urlList) => {
    return async() => {
        await axios.delete(`storage/${link}/${elementID}/`)
        .then(() => {
            alert('Элемент удален!');
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
                Object.entries((value as [{ [field: string]: BaseElementFields}])[0]).map(([key2, value2]) => (
                    (key2 !== 'id' && key2 !== 'date') && (value2.value !== undefined) &&
                    (subObj[0][key2] = (value2.value))
                ));
                newData[key] = subObj
            } else {
                if ((value as BaseElementFields).type === 'number'){
                    if ((value as BaseElementFields).value === undefined)
                        newData[key] = null
                    else 
                        newData[key] = Number((value as BaseElementFields).value)
                }
                else newData[key] = (value as BaseElementFields).value
            }
        }
    })
    return newData
}