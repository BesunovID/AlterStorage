import { Navigate } from "react-router-dom"
import { Workspace } from "../components/Workspace"
import { useAppSelector } from "../hooks/redux"

export function Storage() {
    const isAuth = useAppSelector(state => state.auth.isAuth)

    if (!isAuth) {
        return <Navigate to='/login' />
    }

    return(
        <Workspace />
    )
}