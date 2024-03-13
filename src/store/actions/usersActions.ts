import { AppDispatch } from ".."
import axios from "axios"
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
            await axios.get(`${process.env.REACT_APP_BASE_CUSTOMUSERS_URL}/users/`, { headers: {
                'Authorization': `Token ${localStorage.getItem('TOKEN')}`,
            }})
            .then((res) => {
                const profile = res.data.find((profile: any) => profile.username === localStorage.getItem('USERNAME'))
                dispatch(usersSlice.actions.myProfile({data: profile}))
            })
        } catch(e) {
            alert('Ошибка!')
            console.log('Ошибка ', e)
        }
    }
}