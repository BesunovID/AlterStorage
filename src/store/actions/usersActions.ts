import { AppDispatch } from ".."
import axios from "axios"
import { usersSlice } from "../slices/usersSlice"

export const getProfile = () => {
    return async (dispatch: AppDispatch) => {
        const result = await axios.get(`${process.env.REACT_APP_BASE_CUSTOMUSERS_URL}/users/`, { headers: {
            'Authorization': `Token ${localStorage.getItem('TOKEN')}`,
        }})
        .then((res) => {
            const profile = res.data.find((profile: any) => profile.username === localStorage.getItem('USERNAME'))
            dispatch(usersSlice.actions.myProfile({data: profile}));
            return true
        })
        .catch((e) => {
            alert('Ошибка!')
            console.log('Ошибка ', e)
            return false
        })
        return result
    }
}

export const getAllUsers = () => {
    return async (dispatch: AppDispatch) => {
        const result = await axios.get(`${process.env.REACT_APP_BASE_CUSTOMUSERS_URL}/users/`, { headers: {
            'Authorization': `Token ${localStorage.getItem('TOKEN')}`,
        }})
        .then((res) => {
            dispatch(usersSlice.actions.allUsers({data: res.data}));
            return true
        })
        .catch((e) => {
            alert('Ошибка!')
            console.log('Ошибка ', e)
            return false
        })
        return result
    }
}