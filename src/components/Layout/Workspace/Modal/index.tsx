import { Button, Modal } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { showModalElement } from "../../../../store/actions/productsAction";
import { ModalForm } from "./ModalForm";

export function ModalWindow() {
    const isOpen = useAppSelector(state => state.tables.modalIsOpen)
    const element = useAppSelector(state => state.tables.modalElement)
    const dispatch = useAppDispatch();

    const handleClose = () => {
        dispatch(showModalElement(false, element))
    }

    return(
        <>
            <Modal show={isOpen} onHide={handleClose}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <ModalForm />
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Закрыть
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}