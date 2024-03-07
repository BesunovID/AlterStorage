import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IUser } from "../../models/models"

interface UsersSlice {
    users: IUser[]
    myProfile: any
}

interface GetMyProfile {
    data: any
}

interface AllUsers {
    data: []
}

const initialState: UsersSlice = {
    users: [],
    myProfile: {}
}

export const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        myProfile(state, action: PayloadAction<GetMyProfile>) {
            state.myProfile = action.payload.data
        },
        allUsers(state, action: PayloadAction<AllUsers>) {
            state.users = action.payload.data
        },
    }
})

export default usersSlice.reducer