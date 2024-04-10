import { useEffect, useState } from "react";
import { Button, Card, ListGroup, Modal, Spinner } from "react-bootstrap";
import { Navigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../hooks/redux"
import { getAllUsers } from "../store/actions/usersActions";


export function AdminPanel() {
    const dispatch = useAppDispatch();
    const isAuth = useAppSelector(state => state.auth.isAuth);
    const allUsers = useAppSelector(state => state.users.users);

    const [loading, setLoading] = useState(true);
    const [openID, setOpenID] = useState(null);
    
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
                {allUsers.map((user) => (
                    <ListGroup.Item
                    as="li"
                   // onClick={() => setOpenID(user.username)}
                    className="d-flex justify-content-between align-items-start"
                    >
                    <div className="ms-2 me-auto">
                        <div className="fw-bold">{user.username}</div>
                    </div>
                    <Button>Редактировать</Button>
                    </ListGroup.Item>
                ))}
            </ListGroup>
            <Modal show={openID !== null ? true : false} onHide={() => setOpenID(null)}>
                <Modal.Header closeButton>
                    {openID}
                </Modal.Header>
                <Modal.Body>
                </Modal.Body>
            </Modal>
        </div>
    )
}