import { useEffect, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import { useAppDispatch, useAppSelector } from "../../../hooks/redux"
import { BaseElement, defaultElementOfTable, urlList } from "../../../models/models";
import { createElement, updateElement } from "../../../store/actions/tableActions"
import axios from "axios";

export function ModalForm(props: any) {
    const dispatch = useAppDispatch();

    const element: BaseElement = props.element;
    const table: urlList = props.table;
    //const element = useAppSelector(state => state.tables.element);
    //const currentTable = useAppSelector(state => state.tables.currentUrl)
    const userRole = useAppSelector(state => state.users.myProfile.role)

    const [isEdit, setIsEdit] = useState((element['id'].value === -1));
    const [validated, setValidated] = useState(isEdit);
    const [isOpenNewModal, setIsOpenNewModal] = useState(false);
    const [newElement, setNewElement] = useState<BaseElement>(JSON.parse(JSON.stringify(element)));

    const getTableData = (link: string, key: string) => {
        axios.get(`${process.env.REACT_APP_BASE_STORAGE_URL}/${link}/`, {
            headers: {
                'Authorization': `Token ${localStorage.getItem('TOKEN')}`,
            }
        }).then((res) => {
            setNewElement(prevState => ({
                ...prevState,
                [key]: {
                    ...prevState[key],
                    subData: res.data
                }
            }));
        }) 
    }

    useEffect(() => {
        Object.keys(newElement).map((e) => {
            if (newElement[e].subject){
                getTableData(newElement[e].subject as string, e);
            }
        }) 
    }, [isOpenNewModal, setNewElement])

    const handleChange = (event: any) => {
        setNewElement(prevState => ({
            ...prevState,
            [event.target.name]: {
                ...prevState[event.target.name],
                value: event.target.value
            },
        }))
    } 

    const handleSave = (event: any) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }else {
            setIsEdit(false);
            event.preventDefault();
            if (newElement['id'].value === -1 ) {
                dispatch(createElement(newElement, table));
                if (props.setIsOpenNewModal)
                    props.setIsOpenNewModal(false)
            }else
                dispatch(updateElement(newElement, table))
        }
        setValidated(true);
    }

    
    return(
        <>
            <Form noValidate validated={validated} onSubmit={handleSave}>
                {Object.entries(newElement).map(([key, value]) => (
                    (key !== 'id') && (key !== 'date') && (key !== 'id_2') 
                    && (key !== 'number_invoice_2')  && !(value.childrens) 
                //  && (currentTable === 'storage_positions' && key !== 'storage_position')
                    && (value.subject ?  
                        <Form.Group key={key}>
                            <Form.Label>{value.key}</Form.Label>
                            <div className="d-flex">
                                <Form.Select name={key} value={(value.type === 'number' && (value.value as number <= 0)) ? '' : value.value} onChange={handleChange} required={value.required} disabled={!isEdit}>
                                    {value.subData?.map((select, index) => (
                                        <option key={index} value={(select as any).id}>{Object.entries(select).map(([key2, value2]) => {
                                            if (key2 !== 'id') return `${value2} `
                                        })}</option>
                                    ))}
                                </Form.Select> 
                                {isEdit && <>
                                <Button onClick={() => setIsOpenNewModal(true)}>+</Button>
                                <Modal show={isOpenNewModal} onHide={() => setIsOpenNewModal(false)}>
                                    <Modal.Body>
                                        <ModalForm isCreate={true} table={value.subject} setIsOpenNewModal={setIsOpenNewModal} element={defaultElementOfTable.get(value.subject)}/>
                                    </Modal.Body>
                                </Modal>
                                </>}
                            </div>
                        </Form.Group> :
                        <Form.Group key={key}>
                            <Form.Label>{value.key}</Form.Label>
                            <Form.Control name={key} value={(value.type === 'number' && (value.value as number <= 0)) ? '' : value.value} type={value.type} onChange={handleChange} readOnly={!isEdit} maxLength={value.maxLength} minLength={value.minLength} required={value.required}></Form.Control>
                        </Form.Group>
                    )
                ))}
                {!isEdit && <Button disabled={userRole === 'user'} className="p-2" onClick={() => {setIsEdit(true); setValidated(true)}}>Редактировать</Button>}
                {isEdit && <Button className="p-2" type="submit">Сохранить</Button>}
            </Form>

        </>
    )
}