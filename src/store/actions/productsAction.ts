import axios from "../../axios"
import { AppDispatch } from ".."
import { AnyDataTable, defaultElementOfTable, urlList } from "../../models/models"
import { tableSlice } from "../slices/tableSlice"


export const showProductsTable = (link: urlList) => {
    return async (dispatch: AppDispatch) => {
        try{
            await axios.get('storage/' + link + '/').then((res) => {
                const emptyElement = defaultElementOfTable.get(link).value;
                console.log(emptyElement)
                dispatch(tableSlice.actions.showTable({data: res.data, table: link, emptyElement: emptyElement}));
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

        dispatch(tableSlice.actions.sortTable({data: newData, sortedByField: field, sortedRevers: revers}))
    }
}

export const showModalElement = (isOpen: boolean, element: AnyDataTable) => {
    return(dispatch: AppDispatch) => {
        dispatch(tableSlice.actions.showModalElement({isOpen: isOpen, element: element}))
    }
}

export const createElement = (element: any, link: urlList) => {
    return async() => {
        await axios.post(`storage/${link}/`, element)
        .then(() => {
            alert('Элемент успешно создан!');
            showProductsTable(link);
        })
        .catch((e) => {
            alert('Ошибка создания!' + e.message);
        }) 
        .finally(() => {
            showModalElement(false, {});
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