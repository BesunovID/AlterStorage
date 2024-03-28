import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Accordion, Button, Form } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { BaseElement, defaultElementOfTable, urlList } from "../../../../models/models";
import { createElement, showModalElement, updateElement } from "../../../../store/actions/tableActions";
import { SelectableField } from "./SelectableField";
import { SubdataField } from "./SubdataField";


export function ModalForm(props: any) {
    const dispatch = useAppDispatch();

    const element: BaseElement = props.element;
    const table: urlList = props.table;
    const valIndex = props.index ? props.index : 0;
    const userRole = useAppSelector(state => state.users.myProfile.role)

    const [isEdit, setIsEdit] = useState(('id' in element && element['id'].value[0] === -1) 
        || ('id_2' in element && element['id_2'].value[valIndex] === -1));
    const [validated, setValidated] = useState(isEdit);
    const submitRef = useRef<HTMLElement>(null);
    const [newElement, setNewElement] = useState<BaseElement>(JSON.parse(JSON.stringify(element)));
    
    if (props.isSubField)
        console.log(newElement);  

    const getTableData = (link: string, key: string) => {
        axios.get(`${process.env.REACT_APP_BASE_STORAGE_URL}/${link}/`, {
            headers: {
                'Authorization': `Token ${localStorage.getItem('TOKEN')}`,
            }
        }).then((res) => {
            console.log(res.data);
            setNewElement(prevState => ({
                ...prevState,
                [key]: {
                    ...prevState[key],
                    value: [...(prevState[key].value as any)],
                    selectData: res.data
                }
            }));
        }) 
    }

    const handleChange = (event: any) => {
        const newValue = [...newElement[event.target.name].value];
        newValue[valIndex] = event.target.value;

        setNewElement(prevState => ({
            ...prevState,
            [event.target.name]: {
                ...prevState[event.target.name],
                value: newValue
            }
        }));
        (props.setNewElement) && 
        (props.setNewElement as React.Dispatch<React.SetStateAction<BaseElement>>)(prevState => ({
            ...prevState,
            [event.target.name]: {
                ...prevState[event.target.name],
                value: newValue
            }
        }));
    } 

    const handleSubmit = (event: any) => {
        if (event.nativeEvent.submitter.name === 'base'){
            handleSave(event)
        } else if (event.nativeEvent.submitter === submitRef.current) handleCreateSubData(event)
    }

    const handleSave = (event: any) => {
        const form = event.currentTarget;
        event.preventDefault();
        console.log(newElement);
        if (form.checkValidity() === false) {
            alert('Заполните поля!');
            event.stopPropagation();
        }else {
            setIsEdit(false);
            if (newElement['id'].value[0] === -1){ 
                alert("Создано!");
                dispatch(createElement(newElement, table));
            }else{
                alert("Обновлено!");
                dispatch(updateElement(newElement, table));
            }
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
            dispatch(createElement(newElement, table))
            .then(() => {
                if (props.accordionRef.current !== undefined && props.accordionRef.current !== null) {
                    props.accordionRef.current.click();
                }
            }); 
            //setNewElement(defaultElementOfTable.get(table));
        }
    }

    const handleAddField = (name: string) => {
        const formElement: BaseElement = Object.entries(newElement).reduce((newObj, [elKey, elValue]) => {
            if ((newElement[name].childrens as Array<string>).includes(elKey)){
                const newValue = [...elValue.value]
                if (elValue.type === 'number'){
                    newValue.push(-1);
                    newObj[elKey] = {
                        ...elValue,
                        value: newValue as number[]
                    }
                } else {
                    newValue.push('');
                    newObj[elKey] = {
                        ...elValue,
                        value: newValue as string[]
                    }
                }
            } else if (elKey === name && elValue.count !== undefined) {
                const newCount = elValue.count + 1;
                newObj[elKey] = {
                    ...elValue,
                    value: [...elValue.value as any],
                    count: newCount
                }
            } else {
                newObj[elKey] = {
                    ...elValue,
                    value: [...elValue.value as any]
                }
            }
            return(newObj)
        }, {} as BaseElement) 
        setNewElement(formElement);
    }

    useEffect(() => {
        if (!props.isCreate && !props.isSubField)
            Object.keys(newElement).map((e) => {
                if (newElement[e].selectable){
                    getTableData(newElement[e].selectable as string, e);
                }
            }) 
    }, [setNewElement, isEdit])
    
    return(
        <Form noValidate validated={validated} onSubmit={handleSubmit} className={props.isCreate ? 'rounded p-2 my-2' : ''} style={props.isCreate ? {backgroundColor: '#458b7460'} : undefined}>
            <Accordion>
            {Object.entries(newElement).map(([key, value], index) => {
                if (value.visable && value.childrens === undefined && value.subject === props.subject) {
                    if (value.selectable)
                        return(
                        <SelectableField 
                            name={key}
                            value={value}
                            index={index}
                            isEdit={isEdit} 
                            handleChange={handleChange}
                        />
                        )
                    else return(
                        <Form.Group key={key}>
                            <Form.Label>{value.key}</Form.Label>
                            <Form.Control 
                                name={key} 
                                value={(value.type === 'number' && (value.value[valIndex] as number <= 0)) ? '' : value.value[valIndex]} 
                                type={value.type} 
                                onChange={handleChange} 
                                readOnly={!isEdit} 
                                maxLength={value.maxLength} 
                                minLength={value.minLength} 
                                required={value.required} 
                            />
                        </Form.Group>
                    )
                } else if (value.visable && value.childrens && !props.subject) {
                    if (value.count !== undefined){
                        const arr = [...new Array(value.count)].map((_,i) => i+1);
                        return(
                        <>
                            {arr.map((_, index) => 
                                <SubdataField 
                                    name={key}
                                    value={value}
                                    element={newElement}
                                    index={index}
                                    table={table}
                                    isEdit={isEdit} 
                                    setNewElement={setNewElement}
                                />
                            )}
                            {isEdit && <Button className='d-block mt-3 mx-auto' onClick={() => handleAddField(key)}>Добавить позицию (+)</Button>}
                        </>
                        )
                    }
                }
            })}
            {!isEdit && <Button disabled={userRole === 'user'} className="d-block mt-3 mx-auto" onClick={() => {setIsEdit(true); setValidated(true)}}>Редактировать</Button>}
            {isEdit && !props.isCreate && <Button className="d-block mt-3 mx-auto" type="submit" name='base'>Сохранить</Button>}
            {isEdit && props.isCreate && !props.isSubField && <Button className='d-block mt-3 mx-auto' type="submit" name='sub' ref={submitRef as any}>Создать</Button>}
            </Accordion>
        </Form>
    )
}