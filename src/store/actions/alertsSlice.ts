import { AppDispatch } from ".."
import { IAlert } from "../../models/models"
import {alertsSlice} from "../slices/alertsSlice"


export const addAlert = ( alert: IAlert ) => {
    return async (dispatch: AppDispatch) => {
        dispatch(alertsSlice.actions.addAlert({alert: alert}))
    }
}

export const delAlert = ( id: number ) => {
    return async (dispatch: AppDispatch) => {
        dispatch(alertsSlice.actions.delAlert({id: id}))
    }
}