import { useEffect, useState } from "react"
import { Button, ButtonGroup, Dropdown, DropdownButton, DropdownToggle, Form, Modal } from "react-bootstrap"
import { useAppDispatch, useAppSelector } from "../../../hooks/redux"
import { BaseElement, defaultElementOfTable, urlList } from "../../../models/models";
import { createElement, updateElement } from "../../../store/actions/tableActions"
import axios from "axios";
import React from "react";

export function ModalForm(props: any) {
    const dispatch = useAppDispatch();

    const element: BaseElement = props.element;
    const table: urlList = props.table;
    const userRole = useAppSelector(state => state.users.myProfile.role)

    const [isEdit, setIsEdit] = useState((element['id'].value === -1));
    const [validated, setValidated] = useState(isEdit);
    const [isOpenNewModal, setIsOpenNewModal] = useState('');
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
                                <Dropdown
                                className="w-100 d-flex" 
                                onSelect={(value) => 
                                    handleChange({target:{name: key, value: value}})
                                }>
                                    <DropdownToggle as={CustomToggle} isEdit={isEdit}>
                                        {(value.type === 'number' && (value.value as number <= 0)) ? '' : value.value}
                                    </DropdownToggle>
                                    <Dropdown.Menu as={CustomMenu}>
                                        {value.subData?.map((el: Object) => {              
                                            return (
                                                <Dropdown.Item key={(el as any).id} eventKey={(el as any).id}>
                                                    {Object.entries(el).map(([key2, value2]) => {
                                                    if (key2 !== 'id') return `${value2} `
                                                    })}
                                                </Dropdown.Item>)
                                            }
                                        )}
                                    </Dropdown.Menu>
                                </Dropdown>
                                {isEdit && <>
                                <Button onClick={() => setIsOpenNewModal(value.subject as string)}>+</Button>
                                <Modal show={isOpenNewModal === value.subject} onHide={() => setIsOpenNewModal('')}>
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
                {!isEdit && <Button disabled={userRole === 'user'} className="mt-3" onClick={() => {setIsEdit(true); setValidated(true)}}>Редактировать</Button>}
                {isEdit && <Button className="mt-3" type="submit">Сохранить</Button>}
            </Form>

        </>
    )
}


const CustomDropdown = React.forwardRef(({ value, data }: any, ref) => {
    const [showMenu, setShowMenu] = useState(false);

    return(
        <>
        <Form.Control value={value} readOnly>
        </Form.Control>
        &#x25bc;
        <Dropdown.Menu as={CustomMenu} show={showMenu}>
            {data.map((el: Object) => {              
                return (
                    <Dropdown.Item eventKey={(el as any).id}>
                        {Object.entries(el).map(([key2, value2]) => {
                        if (key2 !== 'id') return `${value2} `
                        })}
                    </Dropdown.Item>)
                }
            )}
        </Dropdown.Menu>
        </>
    );
  },);

const CustomToggle = React.forwardRef(({ children, onClick, isEdit }: any, ref) => (
    <Form.Control
      value={children}
      ref={ref as any}
      onClick={(e) => {
        e.preventDefault();
        isEdit && onClick(e);
      }}
      className="d-block w-100"
      onChange={() => (null)}
    >

    </Form.Control>
  ));

const CustomMenu = React.forwardRef(
    ({ children, style, className, 'aria-labelledby': labeledBy }:any, ref) => {
        const [value, setValue] = useState('');
    
      return (
        <div
          ref={ref as any}
          style={style}
          className={className}
          aria-labelledby={labeledBy}
        >
          <Form.Control
            autoFocus
            className="mx-3 my-2 w-auto"
            placeholder="Поиск..."
            onChange={(e) => setValue(e.target.value)}
            value={value}
          />
          <ul className="list-unstyled">
            {React.Children.toArray(children).filter(
              (child) =>
                !value || (child as any).props.children.toString().toLowerCase().indexOf(value.toLowerCase()) != -1
            ).slice(0, 5)}
          </ul>
        </div>
      );
    },
  );