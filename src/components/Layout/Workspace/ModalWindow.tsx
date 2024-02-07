import { Button, Modal } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { showModalElement } from "../../../store/actions/productsAction";

export function ModalWindow() {
    const isOpen = useAppSelector(state => state.tables.modalIsOpen)
    const element = useAppSelector(state => state.tables.modalElement)
    const dispatch = useAppDispatch();

    const handleClose = () => {
        dispatch(showModalElement(false))
    }

    return(
        <>
            <Modal show={isOpen} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>{element?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {element !== undefined && Object.keys(element).map(param => (
                        <>
                            <div className="1">{param}</div>
                            <div className="2">{element[param as keyof typeof element]}</div>
                        </>
                    ))}
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleClose}>
                    Save Changes
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}