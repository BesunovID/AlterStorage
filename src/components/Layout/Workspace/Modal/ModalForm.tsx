import { useState } from "react"
import { Button, Form } from "react-bootstrap"
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux"
import { BaseElement, BaseElementFields } from "../../../../models/models";
import { createElement, updateElement } from "../../../../store/actions/tableAction"

export function ModalForm() {
    const dispatch = useAppDispatch();

    const element = useAppSelector(state => state.tables.element)
    const currentTable = useAppSelector(state => state.tables.currentUrl)

    const [validated, setValidated] = useState(false);
    const [isEdit, setIsEdit] = useState(element.id !== undefined);
    const [newElement, setNewElement] = useState<BaseElement>(JSON.parse(JSON.stringify(element)))

    const subFields = ['assembling', 'quantity', 'storage_position', 'name_of_the_invoice', 
                    'actual_quantity', 'price_per_unit', 'manufacturer', 'quantity_invoice',
                'summa', 'number_invoice', 'provider']
/*
    useEffect(() => {
        switch(currentTable) {
            case 'FIO_emploeey': 
                setNewElement({
                    id: undefined,
                    surname: '',
                    name: '',
                    patronymic: '',
                    post: '',
                    telephone: '',
                    email: '',
                } as IFIOemploeey)
                break;
            case 'assemblings': 
                setNewElement({
                    id: undefined,
                    item: undefined,
                    description: '',
                })
                break;
            case 'finished_product': 
                setNewElement({
                    id: undefined,
                    name: '',
                    description: '',
                })
                break;
            case 'invoice_number': 
                setNewElement({
                    number_invoice: '',
                    data: '',
                    positions: [
                        {
                            id: undefined,
                            name_of_the_invoice: '',
                            actual_quantity: undefined,
                            price_per_unit: 0,
                            manufacturer: '',
                            quantity_invoice: undefined,
                            summa: undefined,
                            number_invoice: undefined,
                            storage_position: undefined,
                            provider: undefined,
                        },
                    ],
                })
                break;
            case 'provider': 
                setNewElement({
                    id: undefined,
                    name: '',
                    refer_to: '',
                    address: '',
                    telephon: '',
                    email: '',
                })
                break;
            case 'rack': 
                setNewElement({
                    id: undefined,
                    rack: '',
                })
                break;
            case 'shelf': 
                setNewElement({
                    id: undefined,
                    shell: undefined,
                })
                break;
            case 'storage_positions': 
                setNewElement({
                    marking: '',
                    name: '',
                    date: '',
                    count: undefined,
                    units: undefined,
                    rack: undefined,
                    shelf: undefined,
                    box: '',
                    price: undefined,
                    comment: '',
                    connectAssembling_Storage_Position: [{
                        id: undefined,
                        quantity: undefined,
                        storage_position: undefined,
                        assembling: -1,
                    }]
                })
                break;
            case 'unit_of_measure': 
                setNewElement({
                    id: undefined,
                    name: '',
                    full_name: '',
                })
                break;
            case 'write_down': 
                setNewElement({
                    id: undefined,
                    date: '',
                    count: undefined,
                    storage_pos: undefined,
                    fio_employee: undefined,
                    purpose: undefined,
                })
                break;
        }
        if (element.id !== undefined && newElement.id === undefined){
            console.log('1')
            setNewElement((prevState) => ({
                ...prevState,
                ...element}))
        }
        console.log(newElement)
    }, [element])

*/
    const handleChange = (event: any) => {
        if (subFields.includes(event.target.name)){    
            if (currentTable == 'invoice_number') {
                const newSub = Object.assign([], newElement['positions']);
                newSub[0][event.target.name].value = event.target.value
                setNewElement(prevState => ({
                    ...prevState,
                    'positions': newSub
                }))
            }
            else if (currentTable == 'storage_positions') { 
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
                                    if ((subKey !== 'id') && (subKey !== 'date'))
                                        return(
                                            <Form.Group key={subKey}>
                                                <Form.Label>{nValue.key}</Form.Label>
                                                <Form.Control name={subKey} value={nValue.value} type={nValue.type} onChange={handleChange} readOnly={!isEdit} maxLength={nValue.maxLength} minLength={nValue.minLength} required={nValue.required}></Form.Control>
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
            {!isEdit && <Button className="p-2" onClick={() => setIsEdit(true)}>Редактировать</Button>}
            {isEdit && <Button className="p-2" type="submit">Сохранить</Button>}
        </Form>
    )
}

/*
 {('marking' in newElement) && 
            <Form.Group>
                <Form.Label>Обозначение</Form.Label>
                <Form.Control name="marking" value={newElement.marking} onChange={handleChange} readOnly={!isEdit} maxLength={100} minLength={1} required></Form.Control>
            </Form.Group>}
            {('name' in newElement) && 
            <Form.Group>
                <Form.Label>Наименование</Form.Label>
                <Form.Control name="name" value={newElement.name} onChange={handleChange} readOnly={!isEdit} maxLength={200} minLength={1} required></Form.Control>
            </Form.Group>}
            {('count' in newElement) &&
            <Form.Group>
                <Form.Label>Общее количество</Form.Label> 
                <Form.Control name="count" value={newElement.count} onChange={handleChange} readOnly={!isEdit} type="number"></Form.Control>
            </Form.Group>}
            {('connectAssembling_Storage_Position' in newElement) &&
            <>
                <Form.Group>
                    <Form.Label>Номер сборки</Form.Label> 
                    <Form.Control name="assembling" value={newElement.connectAssembling_Storage_Position[0]?.assembling <= 0 ? undefined : 
                    newElement.connectAssembling_Storage_Position[0]?.assembling} onChange={handleChange} readOnly={!isEdit} type="number" required></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Количество в сборке</Form.Label> 
                    <Form.Control name="quantity" value={newElement.connectAssembling_Storage_Position[0]?.quantity} onChange={handleChange} readOnly={!isEdit} type="number"></Form.Control>
                </Form.Group> 
                <Form.Group>
                    <Form.Label>Номер складской позиции</Form.Label> 
                    <Form.Control name="storage_position" value={newElement.connectAssembling_Storage_Position[0]?.storage_position} onChange={handleChange} readOnly={!isEdit} type="number"></Form.Control>
                </Form.Group>
            </>}
            {('units' in newElement) && 
            <Form.Group>
                <Form.Label>Единицы измерения</Form.Label>
                <Form.Control name="units" value={newElement?.units} onChange={handleChange} readOnly={!isEdit} type="number"></Form.Control>
            </Form.Group>}
            {('rack' in newElement) && 
            <Form.Group>
                <Form.Label>Стеллаж</Form.Label>
                <Form.Control name="rack" value={newElement?.rack} onChange={handleChange} readOnly={!isEdit} type="number"></Form.Control>
            </Form.Group>}
            {('shelf' in newElement) &&
            <Form.Group>
                <Form.Label>Полка</Form.Label>
                <Form.Control name="shelf" value={newElement?.shelf} onChange={handleChange} readOnly={!isEdit} type="number"></Form.Control>
            </Form.Group>}
            {('box' in newElement) && 
            <Form.Group>
                <Form.Label>Коробка</Form.Label>
                <Form.Control name="box" value={newElement?.box} onChange={handleChange} readOnly={!isEdit} type="text" maxLength={100}></Form.Control>
            </Form.Group>}
            {('price' in newElement) && 
            <Form.Group>
                <Form.Label>Цена за единицу</Form.Label>
                <Form.Control name="price" value={newElement?.price} onChange={handleChange} readOnly={!isEdit} type="number" maxLength={100}></Form.Control>
            </Form.Group>}
            {('comment' in newElement) && 
            <Form.Group>
                <Form.Label>Комментарий</Form.Label>
                <Form.Control name="comment" value={newElement?.comment} onChange={handleChange} readOnly={!isEdit} type="text" maxLength={200}></Form.Control>
            </Form.Group>}
            {('description' in newElement) && (currentTable === 'finished_product') &&
            <Form.Group>
                <Form.Label>Описание</Form.Label>
                <Form.Control name="description" value={newElement?.description} onChange={handleChange} readOnly={!isEdit} type="text" maxLength={200}></Form.Control>
            </Form.Group>}
            {('shell' in newElement) &&
            <Form.Group>
                <Form.Label>Номер</Form.Label>
                <Form.Control name="shell" value={newElement?.shell} onChange={handleChange} readOnly={!isEdit} type="number" required></Form.Control>
            </Form.Group>}
            {('item' in newElement) &&
            <Form.Group>
                <Form.Label>Готовый продукт</Form.Label>
                <Form.Control name="item" value={newElement?.item} onChange={handleChange} readOnly={!isEdit} type="number" required></Form.Control>
            </Form.Group>}
*/