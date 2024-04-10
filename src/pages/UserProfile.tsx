import { Navigate } from "react-router-dom";
import { Profile } from "../components/Profile";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { useEffect, useState } from "react";
import { getProfile } from "../store/actions/usersActions";
import { Spinner } from "react-bootstrap";


export function UserProfile() {
    const isAuth = useAppSelector(state => state.auth.isAuth)
    const [loading, setLoading] = useState(true);
    const dispatch = useAppDispatch();

    useEffect(() => {
        isAuth && dispatch(getProfile()).then((res) => res && setLoading(false))
    }, [isAuth])
    
    if (!isAuth) {
        return <Navigate to='/login' />
    }
    
    return(
        loading ? 
        <div className="bg-grey d-flex align-items-center justify-content-center">
            <Spinner animation="border" />
        </div> :
        <Profile />
        
    )
}