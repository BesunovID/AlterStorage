import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IProduct, IRequest } from "../../models/models"


interface TableState {
    tableIsOpen: boolean
    data: IProduct[] | IRequest[]
    sortedByField: string
    sortedDirection: number
    modalIsOpen: boolean
    modalElement?: IProduct
}

interface PayloadShowTable {
    data: IProduct[] | IRequest[]
}

interface PayloadShowModalElement {
    isOpen: boolean
    element?: IProduct
}

interface PayloadSortTable {
    data: IProduct[] | IRequest[]
    sortedByField: string
    sortedRevers: boolean
}

const initialState: TableState = {
    tableIsOpen: false,
    data: [],
    sortedByField: 'id',
    sortedDirection: 1,
    modalIsOpen: false,
}

export const tableSlice = createSlice({
    name: 'table',
    initialState,
    reducers: {
        showTable(state, action: PayloadAction<PayloadShowTable>){
            state.tableIsOpen = true
            state.data = action.payload.data
        },
        sortTable(state, action: PayloadAction<PayloadSortTable>){
            state.data = action.payload.data
            state.sortedByField = action.payload.sortedByField
            if (action.payload.sortedRevers)
                state.sortedDirection *= -1
        },
        showModalElement(state, action: PayloadAction<PayloadShowModalElement>){
            state.modalIsOpen = action.payload.isOpen
            state.modalElement = action.payload.element
        }
    }
})

export default tableSlice.reducer