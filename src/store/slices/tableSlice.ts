import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { urlList, BaseElement, AllSelectData } from "../../models/models"


interface TableState {
    tableIsOpen: boolean
    loading: boolean
    data: BaseElement[]
    allSelectData: AllSelectData
    sortedByField: string
    sortedDirection: number
    modalIsOpen: boolean
    emptyElement: BaseElement
    element: BaseElement
    currentUrl: string
}

interface PayloadShowTable {
    data: BaseElement[]
    table: string
    emptyElement: BaseElement
    allSelectData: AllSelectData
}

interface PayloadAllSelectData {
    data: AllSelectData
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
    loading: false,
    data: [],
    allSelectData: {},
    sortedByField: 'id',
    sortedDirection: 1,
    modalIsOpen: false,
    emptyElement: {},
    element: {},
    currentUrl: ''
}

export const tableSlice = createSlice({
    name: 'table',
    initialState,
    reducers: {
        startLoading(state: TableState){
            state.tableIsOpen = true
            state.loading = true
        },
        showTable(state: TableState, action: PayloadAction<PayloadShowTable>){
            state.modalIsOpen = false
            state.data = action.payload.data
            state.allSelectData = action.payload.allSelectData
            state.currentUrl = action.payload.table
            state.emptyElement = action.payload.emptyElement
            state.loading = false
        },
        setAllSelectData(state, action: PayloadAction<PayloadAllSelectData>){
            state.allSelectData = action.payload.data
        },
        sortTable(state, action: PayloadAction<PayloadSortTable>){
            state.data = action.payload.data
            state.sortedByField = action.payload.sortedByField
            state.sortedDirection = action.payload.sortedDirection
        },
        showModalElement(state, action: PayloadAction<PayloadShowModalElement>){
            state.modalIsOpen = action.payload.isOpen
            if(action.payload.element)
                state.element = action.payload.element;
        },
    }
})

export default tableSlice.reducer