import { Container, Row } from "react-bootstrap"
import { Navigate } from "react-router-dom"
import { Form } from "../components/Modal"
import { Table } from "../components/Table/Table"
import { Menu } from "../components/Menu/Menu"
import { useAppSelector } from "../hooks/redux"

export function Storage() {
    const isAuth = useAppSelector(state => state.auth.isAuth)

    if (!isAuth) {
        return <Navigate to='/login' />
    }

    return(
        <Container fluid className={'flex-md-grow-1'}>
            <Row className={''}>
                <Menu />
                <div className='d-flex flex-column align-items-start col-sm-9 col-md-10 p-0'>
                    <Table />
                    <Form />
                </div>
            </Row>
        </Container>
    )
}