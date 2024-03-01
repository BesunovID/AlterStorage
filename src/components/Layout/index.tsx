import { Container, Row } from 'react-bootstrap'
import { Header } from './Header'
import { MainMenu } from './MainMenu'
import { Workspace } from './Workspace/index'

export function Layout() {
    return(
        <Container fluid className={'min-vh-100 d-flex flex-md-column p-0'}>
            <Header />
            <Container fluid className={'flex-md-grow-1'}>
                <Row className={''}>
                    <MainMenu />
                    <Workspace />
                </Row>
            </Container>
        </Container>
    )
}