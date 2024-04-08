import { Navigate } from "react-router-dom"
import { useAppSelector } from "../hooks/redux"


export function Main() {
    const isAuth = useAppSelector(state => state.auth.isAuth);
    
    if (!isAuth) {
        return <Navigate to='/login' />
    }
    
    return(
        <div className="main"></div>
    )
}