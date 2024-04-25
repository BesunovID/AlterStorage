import { useEffect, useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { useAppSelector, useAppDispatch } from "../hooks/redux";

export function Toasts() {
    const toasts = useAppSelector(state => state.alerts.alerts);

    const [show, setShow] = useState<number[]>([]);

    useEffect(() => {
        setShow(show.concat(toasts.slice(-1).map((toast) => toast.id)))
    }, [toasts])
    
    return(
        <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 1 }}>    
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
                    </Toast.Header>
                    <Toast.Body className='text-white'>
                        {toast.message}
                    </Toast.Body>
                </Toast>
            ))}
        </ToastContainer>
    )
}
