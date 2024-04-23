import { Container, Toast } from 'react-bootstrap'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { delAlert } from '../../store/actions/alertsSlice';
import { Header } from './Header'

interface LayoutProps {
    children: React.ReactNode
}

export function Layout(props: LayoutProps) {
    const toasts = useAppSelector(state => state.alerts.alerts);
    const dispatch = useAppDispatch();
    return(
        <Container fluid className={'min-vh-100 d-flex flex-column p-0'}>
            <Header />
            {props.children}
            {toasts.map((toast) => (
                <Toast 
                bg={toast.status} 
                onClose={() => dispatch(delAlert(toast.id))} 
                show={true} 
                delay={toast.timeout} 
                autohide>
                    <Toast.Body>
                        {toast.message}
                    </Toast.Body>
                </Toast>
            ))}
        </Container>
    )
}