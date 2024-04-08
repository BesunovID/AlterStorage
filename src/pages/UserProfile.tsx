import { Navigate } from "react-router-dom";
import { Profile } from "../components/Profile";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { useEffect } from "react";
import { getProfile } from "../store/actions/usersActions";


export function UserProfile() {
    const isAuth = useAppSelector(state => state.auth.isAuth)
    const dispatch = useAppDispatch();

    useEffect(() => {
        isAuth && dispatch(getProfile())
    }, [isAuth])
    
    if (!isAuth) {
        return <Navigate to='/login' />
    }
    
    return(
        <Profile />
    )
}