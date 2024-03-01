import axios from "../../axios"
import { AppDispatch } from ".."
import { AnyDataTable, IAssembling, IFinishedProduct, IFIOemploeey, IInvoiceNumber, IProvider, IRack, IShelf, IStoragePosition, IUnitOfMeasur, IWriteDown, urlList } from "../../models/models"
import { tableSlice } from "../slices/tableSlice"


export const showProductsTable = (link: urlList) => {
    return async (dispatch: AppDispatch) => {
        try{
            await axios.get('storage/' + link + '/').then((res) => {
               /* switch(link) {
                    case 'FIO_emploeey': 
                        dispatch(tableSlice.actions.showTable({data: res.data as IFIOemploeey[], table: link}));
                        break;
                    case 'assemblings': 
                        dispatch(tableSlice.actions.showTable({data: res.data as IAssembling[], table: link}));
                        break;
                    case 'finished_product': 
                        dispatch(tableSlice.actions.showTable({data: res.data as IFinishedProduct[], table: link}));
                        break;
                    case 'invoice_number': 
                        dispatch(tableSlice.actions.showTable({data: res.data as IInvoiceNumber[], table: link}));
                        break;
                    case 'provider': 
                        dispatch(tableSlice.actions.showTable({data: res.data as IProvider[], table: link}));
                        break;
                    case 'rack': 
                        dispatch(tableSlice.actions.showTable({data: res.data as IRack[], table: link}));
                        break;
                    case 'shelf': 
                        dispatch(tableSlice.actions.showTable({data: res.data as IShelf[], table: link}));
                        break;
                    case 'storage_positions': 
                        dispatch(tableSlice.actions.showTable({data: res.data as IStoragePosition[], table: link}));
                        break;
                    case 'unit_of_measure': 
                        dispatch(tableSlice.actions.showTable({data: res.data as IUnitOfMeasur[], table: link}));
                        break;
                    case 'write_down': 
                        dispatch(tableSlice.actions.showTable({data: res.data as IWriteDown[], table: link}));
                        break;
                }*/
                dispatch(tableSlice.actions.showTable({data: res.data, table: link}));
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