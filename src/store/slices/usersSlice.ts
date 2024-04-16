import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IUser } from "../../models/models"

interface UsersSlice {
    users: IUser[]
    myProfile: IUser
}

interface GetMyProfile {
    data: IUser
}

interface AllUsers {
    data: IUser[]
}

const initialState: UsersSlice = {
    users: [],
    myProfile: {
        id: Number(localStorage.getItem('USER_ID')) ?? '',
        username: localStorage.getItem('USERNAME') ?? '',
        email: '',
        password: '',
        role: localStorage.getItem('ROLE') ?? ''
    }
}

export const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        myProfile(state, action: PayloadAction<GetMyProfile>) {
            state.myProfile = action.payload.data

            localStorage.setItem('ROLE', action.payload.data.role as string)
            localStorage.setItem('USER_ID', (action.payload.data.id as number).toString())
        },
        allUsers(state, action: PayloadAction<AllUsers>) {
            state.users = action.payload.data
        },
    }
})

export default usersSlice.reducer