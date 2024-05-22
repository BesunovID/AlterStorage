import { useState } from "react";
import { Badge, Button, Container, Dropdown, Nav, Navbar, Offcanvas } from "react-bootstrap"
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
                    <Nav.Link href='/' className="p-0">
                        <div 
                            style={{
                                backgroundColor: 'white',
                                color: 'black',
                                padding: '8px 40px'
                            }}
                        >
                            Лого
                        </div>
                    </Nav.Link>
                    <Nav.Link href='/storage' className="d-none d-sm-block ms-10">Управление складом</Nav.Link>
                    {userRole === 'admin' && <Nav.Link href='/admin' className="d-none d-sm-block ms-10">Администрирование</Nav.Link>}
                    <div className="d-none d-sm-flex col-sm-3 ms-auto">
                        <Dropdown>
                            <Dropdown.Toggle>
                                Уведомления
                                {alerts.length > 0 &&
                                <Badge bg="danger">{alerts.length}</Badge>}
                            </Dropdown.Toggle>
                            {alerts.length > 0 && <Dropdown.Menu align='end' variant="light">
                                {[...alerts.slice(-5)].reverse().map((alert) => (
                                    <Dropdown.Item>
                                        {new Date(alert.date).toLocaleTimeString("ru", {hour: '2-digit', minute: '2-digit'})} {alert.message}
                                    </Dropdown.Item>
                                ))}
                                {alerts.length > 5 && 
                                <a href={'/profile'}>Показать все</a>}
                            </Dropdown.Menu>}
                        </Dropdown>
    
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