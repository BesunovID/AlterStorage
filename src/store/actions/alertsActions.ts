import { AppDispatch } from ".."
import { AlertStatus } from "../../models/models"
import {alertsSlice} from "../slices/alertsSlice"


export const addAlert = ( status: AlertStatus, header: string, message: string, timeout?: number ) => {
    const date = new Date().toISOString();
    return async (dispatch: AppDispatch) => {
        dispatch(alertsSlice.actions.addAlert({status: status, header: header, date: date, message: message, timeout: timeout}))
    }
}

export const delAlert = ( id: number ) => {
    return async (dispatch: AppDispatch) => {
        dispatch(alertsSlice.actions.delAlert({id: id}))
    }
}