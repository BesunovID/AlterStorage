import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AlertStatus, IAlert } from "../../models/models"

interface PayloadAddAlert {
    alert: IAlert
}

interface PayloadDelAlert {
    id: number
}

interface AlertsState {
    alerts: IAlert[]
}

const initialState: AlertsState = {
    alerts: []
}

export const alertsSlice = createSlice({
    name: 'alert',
    initialState,
    reducers: {
        addAlert(state, action: PayloadAction<PayloadAddAlert>){
            state.alerts.push(action.payload.alert)
        },
        delAlert(state, action: PayloadAction<PayloadDelAlert>){
            state.alerts.splice(state.alerts.findIndex((el) => el.id === action.payload.id), 1)
        }
    }
})

export default alertsSlice.reducer