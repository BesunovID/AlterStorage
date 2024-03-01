import { Container, Dropdown, Nav, Navbar, NavDropdown, Row } from "react-bootstrap"
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { logout } from '../../store/actions/authActions'
import style from '../../styles/Layout/Header.module.scss'

export function Header() {
    const userName = useAppSelector(state => state.auth.username)
    const dispatch = useAppDispatch();
    
    return(
        <Navbar bg='primary' data-bs-theme="dark">
            <Container fluid>
                <Nav className='w-100'>
                    <Nav.Link href='#page1'>Something 1</Nav.Link>
                    <Nav.Link href='#page2'>Something 2</Nav.Link>
                    <Dropdown id='dropdown-profile' className="col-md-2 ms-auto">
                        <Dropdown.Toggle>{localStorage.getItem('USERNAME')}</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item href='/profile-1'>Open profile</Dropdown.Item>
                            <Dropdown.Item href='/login' onClick={() => dispatch(logout)}>Exit</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Nav>
            </Container>
        </Navbar>
    )
}