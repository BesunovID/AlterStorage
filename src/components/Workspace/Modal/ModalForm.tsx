import { useState } from "react"
import { Button, Form } from "react-bootstrap"
import { useAppDispatch, useAppSelector } from "../../../hooks/redux"
import { BaseElement, BaseElementFields } from "../../../models/models";
import { createElement, updateElement } from "../../../store/actions/tableActions"
import axios from "axios";

export function ModalForm() {
    const dispatch = useAppDispatch();

    const element = useAppSelector(state => state.tables.element)
    const userRole = useAppSelector(state => state.users.myProfile.role)
    const currentTable = useAppSelector(state => state.tables.currentUrl)

    const [isEdit, setIsEdit] = useState((element['id'] as BaseElementFields).value === undefined);
    const [validated, setValidated] = useState(isEdit);
    const [newElement, setNewElement] = useState<BaseElement>(JSON.parse(JSON.stringify(element)))

    const subFields = ['assembling', 'quantity', 'storage_position', 'name_of_the_invoice', 
                    'actual_quantity', 'price_per_unit', 'manufacturer', 'quantity_invoice',
                'summa', 'number_invoice', 'provider']

    const handleChange = (event: any) => {
        if (subFields.includes(event.target.name)){    
            if (currentTable === 'invoice_number') {
                const newSub = Object.assign([], newElement['positions']);
                newSub[0][event.target.name].value = event.target.value
                setNewElement(prevState => ({
                    ...prevState,
                    'positions': newSub
                }))
            }
            else if (currentTable === 'storage_positions') { 
                const newSub =  Object.assign([], newElement['connectAssembling_Storage_Position'])
                if (newSub[0][event.target.name].type === 'number')
                    newSub[0][event.target.name].value = Number(event.target.value)
                else newSub[0][event.target.name].value = (event.target.value).toString()
                setNewElement(prevState => ({
                    ...prevState,
                    ['connectAssembling_Storage_Position']: newSub
                }))
            }
        } else {
            setNewElement(prevState => ({
                ...prevState,
                [event.target.name]: {
                    ...prevState[event.target.name],
                    value: event.target.value
                },
            }))
        }
    } 

    const handleSave = (event: any) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }else {
            setIsEdit(false);
            event.preventDefault();
            if ((newElement['id'] as BaseElementFields).value === undefined )
                dispatch(createElement(newElement, currentTable))
            else
                dispatch(updateElement(newElement, currentTable))
        }
        setValidated(true);
    }
    
    return(
        <Form noValidate validated={validated} onSubmit={handleSave}>
            {
                Object.entries(newElement).map(([key, value]) => {
                    if ((key !== 'id') && (key !== 'date')) {
                        if (key === 'connectAssembling_Storage_Position' || key === 'positions') {
                            return(
                                Object.entries((value as Array<Object>)[0]).map(([subKey, subValue]) => {
                                    const nValue = subValue as BaseElementFields;  
                                    if ((subKey !== 'id') && (subKey !== 'date') && (subKey !== 'storage_position'))
                                        return(
                                            <Form.Group key={subKey}>
                                                <Form.Label>{nValue.key}</Form.Label>
                                                {
                                                    subValue.selectable ? 
                                                    <Form.Select id={subKey}>
                                                        {subValue.subData.map((e: any) => {
                                                            console.log(subValue.subData);
                                                            return <select id={e.id}>{e.item}</select>
                                                        })}
                                                    </Form.Select>
                                                    : <Form.Control name={subKey} value={nValue.value} type={nValue.type} onChange={handleChange} readOnly={!isEdit} maxLength={nValue.maxLength} minLength={nValue.minLength} required={nValue.required}></Form.Control>
                                                }
                                    
                                            </Form.Group>
                                        )
                                })
                            )
                        } else {
                            const nValue = value as BaseElementFields;
                            return(
                                <Form.Group key={key}>
                                    <Form.Label>{nValue.key}</Form.Label>
                                    <Form.Control name={key} value={nValue.value} type={nValue.type} onChange={handleChange} readOnly={!isEdit} maxLength={nValue.maxLength} minLength={nValue.minLength} required={nValue.required}></Form.Control>
                                </Form.Group>
                            )
                        }
                    }
                })
            }
            {!isEdit && <Button disabled={userRole === 'user'} className="p-2" onClick={() => {setIsEdit(true); setValidated(true)}}>Редактировать</Button>}
            {isEdit && <Button className="p-2" type="submit">Сохранить</Button>}
        </Form>
    )
}