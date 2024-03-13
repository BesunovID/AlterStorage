import { Navigate } from "react-router-dom"
import { Workspace } from "../components/Workspace"
import { useAppDispatch, useAppSelector } from "../hooks/redux"
import { useEffect } from "react";
import { getProfile } from "../store/actions/usersActions";

export function Storage() {
    const isAuth = useAppSelector(state => state.auth.isAuth)

    const dispatch = useAppDispatch();

    useEffect(() => {
        isAuth && dispatch(getProfile())
    }, [isAuth])

    if (!isAuth) {
        return <Navigate to='/login' />
    }

    return(
        <Workspace />
    )
}