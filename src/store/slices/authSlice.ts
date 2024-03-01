import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const USERNAME = 'username'
const TOKEN = ''

interface AuthState {
    auth_token: string
    username: string
    isAuth: boolean
}

interface AuthPayloadLogin {
    auth_token: string,
    username: string
}

interface AuthPayloadRegister {
    auth_token: string,
    username: string
}

const initialState: AuthState = {
    auth_token: localStorage.getItem(TOKEN) ?? '',
    username: localStorage.getItem(USERNAME) ?? '',
    isAuth: Boolean(localStorage.getItem(USERNAME) && localStorage.getItem(TOKEN)),
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action: PayloadAction<AuthPayloadLogin>){
            state.auth_token = action.payload.auth_token
            state.username = action.payload.username
            state.isAuth = Boolean(action.payload.auth_token && action.payload.username)

            localStorage.setItem('TOKEN', action.payload.auth_token)
            localStorage.setItem('USERNAME', action.payload.username)
        },
        logout(state) {
            state.auth_token = ''
            state.username = ''
            state.isAuth = false

            localStorage.removeItem(TOKEN)
            localStorage.removeItem(USERNAME)
        },
        register(state, action: PayloadAction<AuthPayloadRegister>) {
            state.auth_token = action.payload.auth_token
            state.username = action.payload.username
        }
    }
})

export default authSlice.reducer