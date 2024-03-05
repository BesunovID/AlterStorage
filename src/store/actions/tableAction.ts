import axios from "../../axios"
import { AppDispatch } from ".."
import { AnyDataTable, BaseElement, BaseElementFields, defaultElementOfTable, urlList } from "../../models/models"
import { tableSlice } from "../slices/tableSlice"


export const showProductsTable = (link: urlList) => {
    return async (dispatch: AppDispatch) => {
        try{
            await axios.get('storage/' + link + '/').then((res) => {
                const emptyElement: BaseElement = defaultElementOfTable.get(link);
                const data: BaseElement[] = []
                res.data.map((e: Object) => {
                    let newElement = emptyElement;
                    Object.entries(e).map(([key, value]) => {
                        if (value !== null) {
                            if (key === 'positions' || key ==='connectAssembling_Storage_Position'){
                                Object.entries((value as Array<Object>)[0]).map(([key2, value2]) => (
                                    (value2.type === ('text' || 'datetime-local') )
                                    ? (newElement[key] as [{ [field: string]: BaseElementFields}])[0][key2].value = (value2.value as string).toString()
                                    : (newElement[key] as [{ [field: string]: BaseElementFields}])[0][key2].value = Number(value2.value as number)
                                ))
                            } else 
                                ((newElement[key] as BaseElementFields).type === 'text' || 'datetime-local')
                                ? (newElement[key] as BaseElementFields).value = (value as string).toString()
                                : (newElement[key] as BaseElementFields).value = Number(value as number);
                        } else return(0)
                    })
                    return data.push(newElement)
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
    return async() => {
        await axios.post(`storage/${link}/`, element)
        .then(() => {
            alert('Элемент успешно создан!');
        })
        .catch((e) => {
            alert('Ошибка создания!' + e.message);
        }) 
        .finally(() => {
            showModalElement(false);
        })
    }
}

export const updateElement = (element: BaseElement, link: urlList) => {
    const id = (element['id'] as BaseElementFields).value as number
    const restructData: {[k: string]: any} = {};
    Object.entries(element).map(([key, value]) => {
        if (key === 'connectAssembling_Storage_Position' || key === 'positions') {
          /*  Object.entries((value as Array<Object>)[0]).map(([key2, value2]) => (
               // restructData[key][0][key2] = value2
                restructData[key] = [{
                    ...restructData[key],
                    [key2]: value2
                }]
            )); */
            const subObj: [{[k: string]: any}] = [{}];
            Object.entries((value as Array<Object>)[0]).map(([key2, value2]) => (
                 subObj[0][key2] = value2
             ));
            restructData[key] = subObj
        } else restructData[key] = (value as BaseElementFields).value
    })
    return async() => {
        await axios.put(`storage/${link}/${id}/`, restructData)
        .then(() => {
            alert('Элемент успешно обновлен!');
        })
        .catch((e) => {
            alert('Ошибка обновления!' + e.message);
        }) 
        .finally(() => {
            showModalElement(false);
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
            showProductsTable(link);
        })
    }
}