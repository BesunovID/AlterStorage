import { AppDispatch } from ".."
import axios from "axios"
import { IUser } from "../../models/models"
import {authSlice} from "../slices/authSlice"

const axiosLogin = axios.create({
    baseURL: process.env.REACT_APP_BASE_AUTH_URL,
    timeout: 15000,
})

const axiosLogout = axios.create({
    baseURL: process.env.REACT_APP_BASE_AUTH_URL,
    timeout: 15000,
    headers: {
        'Authorization': `Token ${localStorage.getItem('TOKEN')}`,
    }
})

const axiosRegistration = axios.create({
    baseURL: process.env.REACT_APP_BASE_USERS_URL,
    timeout: 15000,
})


export const register = ( data: IUser ) => {
    return async () => {
        try{
            await axiosRegistration.post('/', data)
            .then(() => {
                alert('Вы успешно зарегистрировались!')
                window.location.href = '/login'
            })
        } catch(e) {
            alert('Ошибка!')
            console.log('Ошибка ', e)
        }
    }
}

export const login = (username: string, password: string) => {
    const data = { 'username': username, 'password': password}
    return async (dispatch: AppDispatch) => {
        const res = await axiosLogin.post('/login/', data)
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
        await axiosLogout.post('/logout/',)
        .then(() => {
            dispatch(authSlice.actions.logout())
        })
        .catch(e => (
            console.log(e)
        ))
    }
}