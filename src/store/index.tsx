import { combineReducers, configureStore } from "@reduxjs/toolkit";
import tableReducer from "./slices/tableSlice";
import authReducer from "./slices/authSlice";
import particlesReducer from "./slices/particlesSlice";
import usersReducer from "./slices/usersSlice";


const rootReducer = combineReducers({
    auth: authReducer,
    particles: particlesReducer,
    tables: tableReducer,
    users: usersReducer
})

export function setupStore() {
    return configureStore({
        reducer: rootReducer,
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']