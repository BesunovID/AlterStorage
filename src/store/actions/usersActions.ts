import { AppDispatch } from ".."
import axios from "axios"
import { IUser } from "../../models/models"
import { usersSlice } from "../slices/usersSlice"

const customAxios = axios.create({
    baseURL: process.env.REACT_APP_BASE_CUSTOMUSERS_URL,
    timeout: 15000,
    headers: {
        'Authorization': `Token ${localStorage.getItem('TOKEN')}`,
    }
})

export const getProfile = () => {
    return async (dispatch: AppDispatch) => {
        try{
            await customAxios.get('/users/')
            .then((res) => {
                console.log(res.data)
                dispatch(usersSlice.actions.myProfile(res.data))
            })
        } catch(e) {
            alert('Ошибка!')
            console.log('Ошибка ', e)
        }
    }
}