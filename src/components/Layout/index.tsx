import { Container, Row } from 'react-bootstrap'
import { Header } from './Header'
import { MainMenu } from './MainMenu'
import { Workspace } from './Workspace/index'

export function Layout() {
    return(
        <>
            <Header />
            <Container fluid>
                <Row>
                    <MainMenu />
                    <Workspace />
                </Row>
            </Container>
        </>
    )
}