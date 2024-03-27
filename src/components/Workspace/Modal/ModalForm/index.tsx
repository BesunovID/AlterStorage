import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Accordion, Button, Form } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { BaseElement, defaultElementOfTable, urlList } from "../../../../models/models";
import { showModalElement } from "../../../../store/actions/tableActions";
import { SelectableField } from "./SelectableField";
import { SubdataField } from "./SubdataField";


export function ModalForm(props: any) {
    const dispatch = useAppDispatch();

    const element: BaseElement = props.element;
    const table: urlList = props.table;
    const userRole = useAppSelector(state => state.users.myProfile.role)

    const [isEdit, setIsEdit] = useState((element['id'].value[0] === -1));
    const [isOpenNewModal, setIsOpenNewModal] = useState('');
    const [validated, setValidated] = useState(isEdit);
    const submitRef = useRef<HTMLElement>(null);
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
            if (newElement[e].selectable){
                getTableData(newElement[e].selectable as string, e);
            }
        }) 
    }, [isOpenNewModal, setNewElement, isEdit])

    const handleChange = (event: any) => {
        setNewElement(prevState => ({
            ...prevState,
            [event.target.name]: {
                ...prevState[event.target.name],
                value: event.target.value
            },
        }))
    } 

    const handleSubmit = (event: any) => {
        if (event.nativeEvent.submitter.name === 'base'){
            handleSave(event)
        } else if (event.nativeEvent.submitter === submitRef.current) handleCreateSubData(event)
    }

    const handleSave = (event: any) => {
        const form = event.currentTarget;
        event.preventDefault();

        if (form.checkValidity() === false) {
            alert('Заполните поля!');
            event.stopPropagation();
        }else {
            setIsEdit(false);
            if (newElement['id'].value[0] === -1) 
                alert("Создано!");
            // dispatch(createElement(newElement, table));
            else
                alert("Обновлено!");
                //dispatch(updateElement(newElement, table));
            dispatch(showModalElement(false, defaultElementOfTable.get(table), table));
        }
    }

    const handleCreateSubData = (event: any) => {
        const form = event.currentTarget;
        event.preventDefault();

        if (form.checkValidity() === false) {
            alert('Заполните поля!');
            event.stopPropagation();
        }else {
            alert(`Подформа ${table} создана!`);
            if (props.accordionRef !== undefined && props.accordionRef !== null) {
                props.accordionRef.click();
            }
            setNewElement(defaultElementOfTable.get(table));
        }
       /* dispatch(createElement(newElement, table))
        .then(() => {
            setIsOpenNewModal('');
            if (props.accordionRef.current !== undefined && props.accordionRef.current !== null) {
                props.accordionRef.current.click();
            }
        }); */
    }
    
    return(
        <Form noValidate validated={validated} onSubmit={handleSubmit} className={props.isCreate ? 'rounded p-2 my-2' : ''} style={props.isCreate ? {backgroundColor: '#458b7460'} : undefined}>
            <Accordion>
            {Object.entries(newElement).map(([key, value], index) => {
                if (value.visable && value.childrens === undefined && value.subject === undefined) {
                    if (value.selectable)
                        return(
                        <SelectableField 
                            name={key}
                            value={value}
                            index={index}
                            isEdit={isEdit} 
                            handleChange={handleChange}
                            setIsOpenNewModal={setIsOpenNewModal}
                        />
                        )
                    else return(
                        <Form.Group key={key}>
                            <Form.Label>{value.key}</Form.Label>
                            <Form.Control 
                                name={key} 
                                value={(value.type === 'number' && (value.value[0] as number <= 0)) ? '' : value.value[0]} 
                                type={value.type} 
                                onChange={handleChange} 
                                readOnly={!isEdit} 
                                maxLength={value.maxLength} 
                                minLength={value.minLength} 
                                required={value.required} 
                            />
                        </Form.Group>
                    )
                } else if (value.visable && value.childrens) {
                    if (value.count === 0) {
                        return(
                        <SubdataField 
                            name={key}
                            value={value}
                            element={newElement}
                            index={0}
                            table={table}
                            isEdit={isEdit} 
                            setIsOpenNewModal={setIsOpenNewModal}
                        />)
                    } else {
                        const arr = [...new Array(value.count)].map((_,i) => i+1);
                        arr.map((_, index) => 
                            <SubdataField 
                                name={key}
                                value={value}
                                element={newElement}
                                index={index}
                                table={table}
                                isEdit={isEdit} 
                                setIsOpenNewModal={setIsOpenNewModal}
                            />
                        )
                    }
                }
            })}
            {!isEdit && <Button disabled={userRole === 'user'} className="d-block mt-3 mx-auto" onClick={() => {setIsEdit(true); setValidated(true)}}>Редактировать</Button>}
            {isEdit && table === 'invoice_number' && <Button className='d-block mt-3 mx-auto'>Добавить позицию (+)</Button>}
            {isEdit && !props.isCreate && <Button className="d-block mt-3 mx-auto" type="submit" name='base'>Сохранить</Button>}
            {isEdit && props.isCreate && <Button className='d-block mt-3 mx-auto' type="submit" name='sub' ref={submitRef as any}>Создать</Button>}
            </Accordion>
        </Form>
    )
}