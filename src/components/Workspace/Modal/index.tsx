import { Button, Modal } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { defaultElementOfTable } from "../../../models/models";
import { showModalElement, showProductsTable } from "../../../store/actions/tableActions";
import { ModalForm } from "./ModalForm";

export function ModalWindow() {
    const dispatch = useAppDispatch();

    const isOpen = useAppSelector(state => state.tables.modalIsOpen)
    const currentUrl = useAppSelector(state => state.tables.currentUrl)
    const element = useAppSelector(state => state.tables.element)

    const handleClose = () => {
        dispatch(showModalElement(false, defaultElementOfTable.get(currentUrl)));
        dispatch(showProductsTable(currentUrl));
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