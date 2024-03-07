import { Container } from 'react-bootstrap'
import { Header } from './Header'

interface LayoutProps {
    children: React.ReactNode
}

export function Layout(props: LayoutProps) {
    return(
        <Container fluid className={'min-vh-100 d-flex flex-md-column p-0'}>
            <Header />
            {props.children}
        </Container>
    )
}