import { Navigate } from "react-router-dom";
import { Profile } from "../components/Profile";
import { useAppSelector } from "../hooks/redux";


export function UserProfile() {
    const isAuth = useAppSelector(state => state.auth.isAuth)

    if (!isAuth) {
        return <Navigate to='/login' />
    }
    
    return(
        <Profile />
    )
}