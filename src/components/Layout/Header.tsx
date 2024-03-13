import { Container, Dropdown, Nav, Navbar } from "react-bootstrap"
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { logout } from '../../store/actions/authActions'
import { getProfile } from "../../store/actions/usersActions";

export function Header() {
    const dispatch = useAppDispatch();
    const username = useAppSelector(state => state.auth.username);
    
    return(
        <Navbar bg='primary' data-bs-theme="dark">
            <Container fluid>
                <Nav className='w-100'>
                    <Nav.Link href='/storage' className="ms-10">Управление складом</Nav.Link>
                    <Dropdown id='dropdown-profile' className="col-md-2 ms-auto">
                        <Dropdown.Toggle>{username}</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item as='button' onClick={() => dispatch(getProfile())}>Профиль</Dropdown.Item>
                            <Dropdown.Item as='button' href='/login' onClick={() => dispatch(logout())}>Выйти</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Nav>
            </Container>
        </Navbar>
    )
}