import { useEffect, useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { useAppSelector } from "../../hooks/redux";
import { IAlert } from "../../models/models";

export function Toasts() {
    const toasts: IAlert[] = useAppSelector(state => state.alerts.alerts);

    const [show, setShow] = useState<number[]>([]);

    useEffect(() => {
        setShow(show.concat(toasts.slice(-1).map((toast) => toast.id)))
    }, [toasts])
    
    return(
        <ToastContainer position="bottom-end" className="p-4" style={{ zIndex: 2000 }}>    
            {[...toasts.slice(-4)].reverse().map((toast) => (
                <Toast 
                key={toast.id}
                bg={toast.status} 
                onClose={() => setShow(show.filter((id) => toast.id !== id))}
                show={show.includes(toast.id)} 
                delay={toast.timeout} 
                autohide
                >
                    <Toast.Header>
                        <strong className="me-auto">{toast.header}</strong>
                        <small>{new Date(toast.date).toLocaleTimeString("ru", {hour: '2-digit', minute: '2-digit'})}</small>
                    </Toast.Header>
                    <Toast.Body className='text-white'>
                        {toast.message}
                    </Toast.Body>
                </Toast>
            ))}
        </ToastContainer>
    )
}
