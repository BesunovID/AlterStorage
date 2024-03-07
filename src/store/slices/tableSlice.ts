import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { urlList, BaseElement } from "../../models/models"


interface TableState {
    tableIsOpen: boolean
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
    sortedRevers: boolean
}

const initialState: TableState = {
    tableIsOpen: false,
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
        showTable(state: TableState, action: PayloadAction<PayloadShowTable>){
            state.tableIsOpen = true
            state.modalIsOpen = false
            state.data = action.payload.data
            state.currentUrl = action.payload.table
            state.element = action.payload.emptyElement
        },
        sortTable(state, action: PayloadAction<PayloadSortTable>){
            state.data = action.payload.data
            state.sortedByField = action.payload.sortedByField
            if (action.payload.sortedRevers)
                state.sortedDirection *= -1
        },
        showModalElement(state, action: PayloadAction<PayloadShowModalElement>){
            state.modalIsOpen = action.payload.isOpen
            if(action.payload.element)
                state.element = action.payload.element
        },
    }
})

export default tableSlice.reducer