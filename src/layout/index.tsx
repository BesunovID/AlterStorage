import { Container, Toast } from 'react-bootstrap'
import { Header } from './Header'
import { Toasts } from '../components/Toasts/toasts'

interface LayoutProps {
    children: React.ReactNode
}

export function Layout(props: LayoutProps) {

    
    return(
        <Container fluid className={'min-vh-100 d-flex flex-column p-0'}>
            <Header />
            {props.children}
            <Toasts />
        </Container>
    )
}