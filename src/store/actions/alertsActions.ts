import { AppDispatch } from ".."
import { useAppSelector } from "../../hooks/redux"
import { AlertStatus, IAlert } from "../../models/models"
import {alertsSlice} from "../slices/alertsSlice"


export const addAlert = ( status: AlertStatus, message: string, delay?: number ) => {
    return async (dispatch: AppDispatch) => {
        dispatch(alertsSlice.actions.addAlert({status: status, message: message, delay: delay}))
    }
}

export const delAlert = ( id: number ) => {
    return async (dispatch: AppDispatch) => {
        dispatch(alertsSlice.actions.delAlert({id: id}))
    }
}