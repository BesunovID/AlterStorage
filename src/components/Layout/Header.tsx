import { Container, Dropdown, Nav, Navbar } from "react-bootstrap"
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { logout } from '../../store/actions/authActions'

export function Header() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const username = useAppSelector(state => state.auth.username);
    const userRole = useAppSelector(state => state.users.myProfile.role);

    return(
        <Navbar bg='primary' data-bs-theme="dark">
            <Container fluid>
                <Nav className='w-100'>
                    <Nav.Link href='/storage' className="ms-10">Управление складом</Nav.Link>
                    {userRole === 'admin' && <Nav.Link href='/admin' className="ms-10">Администрирование</Nav.Link>}
                    <Dropdown id='dropdown-profile' className="col-md-2 ms-auto">
                        <Dropdown.Toggle>{username}</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item as='button' onClick={() => navigate('/profile')}>Профиль</Dropdown.Item>
                            <Dropdown.Item as='button' href='/login' onClick={() => dispatch(logout())}>Выйти</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Nav>
            </Container>
        </Navbar>
    )
}