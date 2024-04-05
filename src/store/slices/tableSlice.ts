import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { urlList, BaseElement } from "../../models/models"


interface TableState {
    tableIsOpen: boolean
    loading: boolean
    data: BaseElement[]
    sortedByField: string
    sortedDirection: number
    modalIsOpen: boolean
    element: BaseElement
    currentUrl: urlList
}

interface PayloadShowTable {
    data: BaseElement[]
    table: urlList
    emptyElement: BaseElement
}

interface PayloadShowModalElement {
    isOpen: boolean
    element?: BaseElement
}

interface PayloadSortTable {
    data: BaseElement[]
    sortedByField: string
    sortedDirection: number
}

const initialState: TableState = {
    tableIsOpen: false,
    loading: true,
    data: [],
    sortedByField: 'id',
    sortedDirection: 1,
    modalIsOpen: false,
    element: {},
    currentUrl: urlList.main

}

export const tableSlice = createSlice({
    name: 'table',
    initialState,
    reducers: {
        startLoading(state: TableState){
            state.loading = true
        },
        showTable(state: TableState, action: PayloadAction<PayloadShowTable>){
            state.tableIsOpen = true
            state.modalIsOpen = false
            state.data = action.payload.data
            state.currentUrl = action.payload.table
            state.element = action.payload.emptyElement
            state.loading = false
        },
        sortTable(state, action: PayloadAction<PayloadSortTable>){
            state.data = action.payload.data
            state.sortedByField = action.payload.sortedByField
            state.sortedDirection = action.payload.sortedDirection
        },
        showModalElement(state, action: PayloadAction<PayloadShowModalElement>){
            state.modalIsOpen = action.payload.isOpen
            if(action.payload.element)
                state.element = action.payload.element
        },
    }
})

export default tableSlice.reducer