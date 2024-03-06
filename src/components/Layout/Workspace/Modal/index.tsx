import { Button, Modal } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { defaultElementOfTable } from "../../../../models/models";
import { showModalElement } from "../../../../store/actions/tableAction";
import { ModalForm } from "./ModalForm";

export function ModalWindow() {
    const isOpen = useAppSelector(state => state.tables.modalIsOpen)
    const currentUrl = useAppSelector(state => state.tables.currentUrl)
    const dispatch = useAppDispatch();

    const handleClose = () => {
        dispatch(showModalElement(false, defaultElementOfTable.get(currentUrl)))
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