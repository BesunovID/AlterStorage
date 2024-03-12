import { Navigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../hooks/redux"
import { useEffect } from "react";
import { getProfile } from "../store/actions/usersActions";


export function Main() {
    const isAuth = useAppSelector(state => state.auth.isAuth)

    if (!isAuth) {
        return <Navigate to='/login' />
    }
    
    return(
        <div className="main"></div>
    )
}