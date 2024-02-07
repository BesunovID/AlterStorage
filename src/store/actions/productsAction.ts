import axios from "axios"
import { AppDispatch } from ".."
import { IProduct } from "../../models/models"
import { tableSlice } from "../slices/tableSlice"


export const showProductsTable = () => {
    return async (dispatch: AppDispatch) => {
        try{
            await axios.get<IProduct[]>('http://localhost:8000/products').then((res) => {
                const data: IProduct[] = res.data;
                dispatch(tableSlice.actions.showTable({data: data}))
            })
        } catch(e) {
            console.log('error', e)
        }
    }
}

export const sortProductsTable = (field: string, data: IProduct[], sortedByField: string, sortedDirection: number) => {
    return (dispatch: AppDispatch) => {
        const arrayOfSort = [...data];
        const revers: boolean = field === sortedByField;

        arrayOfSort.sort((a, b) => (
            typeof a[field as keyof typeof data[0]] === 'string' ?
            ((a[field as keyof typeof data[0]] as string).toLowerCase() >
            (b[field as keyof typeof data[0]] as string).toLowerCase() ? 1 * sortedDirection : -1 * sortedDirection) :
            (a[field as keyof typeof data[0]] > b[field as keyof typeof data[0]] ? 1 * sortedDirection : -1 * sortedDirection)
        )); 

        const newData = revers ? arrayOfSort.reverse() : arrayOfSort;

        dispatch(tableSlice.actions.sortTable({data: newData, sortedByField: field, sortedRevers: revers}))
    }
}

export const showModalElement = (isOpen: boolean, element?: IProduct) => {
    return(dispatch: AppDispatch) => {
        console.log(isOpen, element)
        dispatch(tableSlice.actions.showModalElement({isOpen: isOpen, element: element}))
    }
}