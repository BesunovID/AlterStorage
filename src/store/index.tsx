import { combineReducers, configureStore } from "@reduxjs/toolkit";
import tableReducer from "./slices/tableSlice";
import authReducer from "./slices/authSlice";
import particlesReducer from "./slices/particlesSlice";
import usersReducer from "./slices/usersSlice";
import alertsReducer from "./slices/alertsSlice";


const rootReducer = combineReducers({
    auth: authReducer,
    particles: particlesReducer,
    tables: tableReducer,
    users: usersReducer,
    alerts: alertsReducer
})

export function setupStore() {
    return configureStore({
        reducer: rootReducer,
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']