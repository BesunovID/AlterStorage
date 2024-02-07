import { combineReducers, configureStore } from "@reduxjs/toolkit";
import tableReducer from "./slices/tableSlice";


const rootReducer = combineReducers({
    tables: tableReducer
})

export function setupStore() {
    return configureStore({
        reducer: rootReducer,
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']