import { AppDispatch } from ".."
import axios from "../../axios"
import { IUser } from "../../models/models"
import {authSlice} from "../slices/authSlice"

interface RegisterResponse {
    data: IUser
}

export const register = ( data: IUser ) => {
    return async (dispatch: AppDispatch) => {
        try{
            await axios.post<RegisterResponse>('customusers/users/', data)
        } catch(e) {
            console.log('Ошибка ', e)
        }
    }
}

export const login = (username: string, password: string) => {
    const data = { 'username': username, 'password': password}
    return async (dispatch: AppDispatch) => {
        const res = await axios.post(`${process.env.REACT_APP_AUTH_URL}login`, data)
        .then(response => {
            dispatch(authSlice.actions.login({auth_token: response.data.auth_token as string, username: username}))
            return 'success'
        })
        .catch(e => {
            console.log(Object.keys(e.response.data)[0])
            if (Object.keys(e.response.data)[0] as string === 'non_field_errors')
                return 'non_field_errors'
            else return 'server_errors'
        })
        return res
    }
}

export const logout = () => {
    return async (dispatch: AppDispatch) => {
        await axios.post(`${process.env.REACT_APP_AUTH_URL}logout`)
        .then(response => dispatch(authSlice.actions.logout()))
        .catch(e => (
            console.log(e)
        ))
    }
}