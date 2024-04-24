import { Modal } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { defaultElementOfTable } from "../../../models/models";
import { showModalElement } from "../../../store/actions/tableActions";
import { ModalForm } from "./ModalForm/index";

export function ModalWindow() {
    const dispatch = useAppDispatch();

    const isOpen = useAppSelector(state => state.tables.modalIsOpen)
    const currentUrl = useAppSelector(state => state.tables.currentUrl)
    const element = useAppSelector(state => state.tables.element)

    const handleClose = () => {
        dispatch(showModalElement(false));
    }

    return(
        <>
            <Modal show={isOpen} onHide={handleClose}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <ModalForm element={element} table={currentUrl}/>
                </Modal.Body>
            </Modal>
        </>
    )
}