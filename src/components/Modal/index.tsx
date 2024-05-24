import { Modal, ModalDialog } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { showModalElement } from "../../store/actions/tableActions";
import { ModalForm } from "./ModalForm/index";

export function Form() {
    const dispatch = useAppDispatch();

    const isOpen = useAppSelector(state => state.tables.modalIsOpen)
    const currentUrl = useAppSelector(state => state.tables.currentUrl)
    const element = useAppSelector(state => state.tables.element)

    const handleClose = () => {
        dispatch(showModalElement(false));
    }

    return(
        <>
            <Modal show={isOpen} onHide={handleClose} style={{overflowY: 'scroll'}}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <ModalForm element={element} table={currentUrl}/>
                </Modal.Body>
            </Modal>
        </>
    )
}