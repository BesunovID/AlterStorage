import { AppDispatch } from ".."
import axios from "axios"
import { usersSlice } from "../slices/usersSlice"
import { IUser } from "../../models/models"

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

export const updateUser = (user: IUser) => {
    return async(dispatch: AppDispatch) => {
        await axios.patch(`${process.env.REACT_APP_BASE_CUSTOMUSERS_URL}/users/${user.id}/`, user, { headers: {
            'Authorization': `Token ${localStorage.getItem('TOKEN')}`,
        }})
        .then(() => {
            alert('Данные пользователя изменены!');
        })
        .catch((e) => {
            alert('Ошибка изменения!' + e.message);
        }) 
        .finally(() => {
        })
    }
}