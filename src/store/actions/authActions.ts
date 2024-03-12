import { AppDispatch } from ".."
import axios from "axios"
import { IUser } from "../../models/models"
import {authSlice} from "../slices/authSlice"
import { getProfile } from "./usersActions"
import { usersSlice } from "../slices/usersSlice"

export const register = ( data: IUser ) => {
    return async () => {
        try{
            await axios.post(`${process.env.REACT_APP_BASE_USERS_URL}/`, data, {timeout: 10000})
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
        const res = await axios.post(`${process.env.REACT_APP_BASE_AUTH_URL}/login/`, data, {timeout: 10000})
        .then(response => {
            dispatch(authSlice.actions.login({auth_token: response.data.auth_token as string, username: username}));
            dispatch(getProfile());
            return 'success'
        })
        .catch(e => {
            console.log(Object.values(e.response.data)[0])
            if (Object.keys(e.response.data)[0] as string === 'non_field_errors')
                return 'non_field_errors'
            else return 'server_errors'
        })
        return res
    }
}

export const logout = () => {
    return async (dispatch: AppDispatch) => {
        await axios.post(`${process.env.REACT_APP_BASE_AUTH_URL}/logout/`, {}, { timeout: 10000, headers:{
            'Authorization': `Token ${localStorage.getItem('TOKEN')}`,
        }})
        .then(() => {
            dispatch(authSlice.actions.logout())
            dispatch(usersSlice.actions.myProfile({data: {username: '', email: '', first_name: '',
                last_name: '', role: '', password: ''}}))
        })
        .catch(e => (
            console.log(e)
        ))
    }
}