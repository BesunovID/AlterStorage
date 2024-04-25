import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AlertStatus, IAlert } from "../../models/models"

interface PayloadAddAlert {
    status: AlertStatus
    message: string
    delay?: number
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
            state.alerts.push({
                id: state.alerts.length > 0 ? state.alerts[state.alerts.length - 1].id + 1 : 0, 
                status: action.payload.status, 
                message: action.payload.message,
                ...(action.payload.delay && {delay: action.payload.delay})
            })
            console.log(state.alerts.length);
        },
        delAlert(state, action: PayloadAction<PayloadDelAlert>){
            state.alerts.splice(state.alerts.findIndex((el) => el.id === action.payload.id), 1)
        }
    }
})

export default alertsSlice.reducer