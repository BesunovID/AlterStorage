import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { urlList, AnyDataTable } from "../../models/models"


interface TableState {
    tableIsOpen: boolean
    data: AnyDataTable[]
    sortedByField: string
    sortedDirection: number
    modalIsOpen: boolean
    modalElement: AnyDataTable
    currentUrl: urlList
}

interface PayloadShowTable {
    data: AnyDataTable[]
    table: urlList
    emptyElement: AnyDataTable
}

interface PayloadShowModalElement {
    isOpen: boolean
    element: AnyDataTable
}

interface PayloadSortTable {
    data: AnyDataTable[]
    sortedByField: string
    sortedRevers: boolean
}

const initialState: TableState = {
    tableIsOpen: false,
    data: [],
    sortedByField: 'id',
    sortedDirection: 1,
    modalIsOpen: false,
    modalElement: {},
    currentUrl: urlList.main

}

export const tableSlice = createSlice({
    name: 'table',
    initialState,
    reducers: {
        showTable(state: TableState, action: PayloadAction<PayloadShowTable>){
            state.tableIsOpen = true
            state.data = action.payload.data
            state.currentUrl = action.payload.table
            state.modalElement = action.payload.emptyElement
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
        },
    }
})

export default tableSlice.reducer