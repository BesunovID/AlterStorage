import { useEffect, useState } from "react";
import { Button, Form, ListGroup, Modal, Spinner } from "react-bootstrap";
import { Navigate } from "react-router-dom"
import { Profile } from "../components/Profile";
import { useAppDispatch, useAppSelector } from "../hooks/redux"
import { IUser, UserEnumField } from "../models/models";
import { getAllUsers, updateUser } from "../store/actions/usersActions";


export function AdminPanel() {
    const dispatch = useAppDispatch();
    const isAuth = useAppSelector(state => state.auth.isAuth);
    const allUsers = useAppSelector(state => state.users.users);

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<IUser>();
    
    useEffect(() => {
        isAuth && loading && dispatch(getAllUsers()).then((res) => res && setLoading(false))
    }, [isAuth, allUsers])

    if (!isAuth) {
        return <Navigate to='/login' />
    };
    
    return(
        loading ? 
        <div className="bg-grey d-flex align-items-center justify-content-center">
            <Spinner animation="border" />
        </div> :
        <div className="admin col-6 mx-auto">
            <ListGroup as="ol" numbered className="my-2">
                {allUsers.map((user, index) => (
                    <ListGroup.Item
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                    key={index}
                    >
                    <div className="ms-2 me-auto">
                        <div className="fw-bold">{user.username}</div>
                    </div>
                    <Button onClick={() => setUser(user)}>Открыть</Button>
                    
                    </ListGroup.Item>
                ))}
            </ListGroup>
            <Modal 
                show={user !== undefined ? true : false} 
                onHide={() => setUser(undefined)}
                className={'border'}
            >
                <Modal.Header closeButton className="fw-bold">
                    {(user as IUser)?.username}
                </Modal.Header>
                <Modal.Body>
                    {user !== undefined &&
                    <Profile user={user} />
                    }
                </Modal.Body>
            </Modal>
        </div>
    )
}