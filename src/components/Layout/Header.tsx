import { useState } from "react";
import { Button, Container, Dropdown, Nav, Navbar, Offcanvas } from "react-bootstrap"
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { logout } from '../../store/actions/authActions'

export function Header() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const username = useAppSelector(state => state.auth.username);
    const userRole = useAppSelector(state => state.users.myProfile.role);
    const alerts = useAppSelector(state => state.alerts.alerts);
    const [show, setShow] = useState(false);

    return(
        <Navbar bg='primary' data-bs-theme="dark">
            <Container fluid>
                <Nav className='w-100'>
                    <Button variant="primary" className="d-sm-none" onClick={() => setShow(true)}>
                        Меню
                    </Button>
                    <Offcanvas show={show} onHide={() => setShow(false)} responsive="">
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title>Меню</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <Nav.Link href='/storage' className="mt-4 ms-10">Управление складом</Nav.Link>
                            {userRole === 'admin' && <Nav.Link href='/admin' className=" mt-4 ms-10">Администрирование</Nav.Link>}
                            <Nav.Link href='/profile' className="mt-4 ms-10">Профиль</Nav.Link>
                            <Nav.Link href='/login' className=" mt-4 ms-10" onClick={() => dispatch(logout())}>Выйти</Nav.Link>
                        </Offcanvas.Body>
                    </Offcanvas>
                    <Nav.Link href='/storage' className="d-none d-sm-block ms-10">Управление складом</Nav.Link>
                    {userRole === 'admin' && <Nav.Link href='/admin' className="d-none d-sm-block ms-10">Администрирование</Nav.Link>}
                    <div className="d-none d-sm-flex col-sm-2 ms-auto">
                        <Button className="mx-2" variant="danger" onClick={() => console.log(alerts.map((alert) => alert.message))}> * </Button>
                        <Dropdown id='dropdown-profile' className="mx-2">
                            <Dropdown.Toggle>{username}</Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item as='button' onClick={() => navigate('/profile')}>Профиль</Dropdown.Item>
                                <Dropdown.Item as='button' href='/login' onClick={() => dispatch(logout())}>Выйти</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    
                </Nav>
            </Container>
        </Navbar>
    )
}