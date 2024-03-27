import { useEffect, useRef, useState } from "react"
import { Accordion, Button, Dropdown, DropdownToggle, Form, useAccordionButton } from "react-bootstrap"
import { useAppDispatch, useAppSelector } from "../../../hooks/redux"
import { BaseElement, defaultElementOfTable, urlList } from "../../../models/models";
import { createElement, showModalElement, updateElement } from "../../../store/actions/tableActions"
import axios from "axios";
import React from "react";
import { createPortal } from "react-dom";
/*
export function ModalForm2(props: any) {
    const dispatch = useAppDispatch();

    const element: BaseElement = props.element;
    const table: urlList = props.table;
    const userRole = useAppSelector(state => state.users.myProfile.role)

    const [isEdit, setIsEdit] = useState((element['id'].value === -1));
    const [isOpenNewModal, setIsOpenNewModal] = useState('');
    const [validated, setValidated] = useState(isEdit);
    const accordionRef = useRef<Array<HTMLElement | null>>([]);
    const portalRef = useRef<Array<HTMLElement | null>>([]);
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
            if (newElement[e].subject){
                getTableData(newElement[e].subject as string, e);
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
            if (newElement['id'].value === -1) 
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
 /*   }

    const handleAddField = () => {

    }
   
    return(
        <>
        <Form noValidate validated={validated} onSubmit={handleSubmit} className={props.isCreate ? 'rounded p-2 my-2' : ''} style={props.isCreate ? {backgroundColor: '#458b7460'} : undefined}>
        <Accordion>
            {Object.entries(newElement).map(([key, value], index) => {
                if (value.visable) {
                    return(
                    <Form.Group key={index}>
                        <Form.Label>{value.key}</Form.Label>
                        {(value.selectable) && 
                        <>
                            <div className="d-flex">
                                <Dropdown
                                className="w-100 d-flex"
                                onSelect={(value) => 
                                    handleChange({target:{name: key, value: value}})
                                }>
                                    <DropdownToggle as={CustomToggle} isEdit={isEdit}>
                                        {(value.type === 'number' && (value.value as number <= 0)) ? '' : value.value}
                                    </DropdownToggle>
                                    <Dropdown.Menu as={CustomMenu} style={{maxWidth: '420px'}}>
                                        {value.selectData?.map((el: Object) => {              
                                            return (
                                                <Dropdown.Item key={(el as any).id} eventKey={(el as any).id} style={{overflowX: 'hidden'}}>
                                                    {Object.entries(el).map(([key2, value2]) => {
                                                    if (key2 !== 'id') return `${value2} `
                                                    })}
                                                </Dropdown.Item>)
                                            }
                                        )}
                                    </Dropdown.Menu>
                                </Dropdown>
                                {isEdit &&
                                <CustomAccordionBut 
                                    eventKey={value.selectable} 
                                    onClick={() => setIsOpenNewModal(isOpenNewModal === value.selectable ? '' : value.selectable as string)}
                                    ref={ref => accordionRef.current[index] = ref as HTMLDivElement}
                                >
                                    {isOpenNewModal === value.selectable ? `-` : '+'}
                                </CustomAccordionBut>}
                            </div>
                            <Accordion.Collapse eventKey={value.selectable}>
                                <div className="1" ref={(ref: any) => portalRef.current[index] = ref}>{
                                (portalRef.current[index] !== undefined && portalRef.current[index] !== null 
                                && accordionRef.current[index] !== undefined && accordionRef.current[index] !== null) 
                                ? createPortal2(portalRef.current[index], accordionRef.current[index], value.selectable, setIsOpenNewModal) 
                                : <div className="1"></div>
                                }</div>
                            </Accordion.Collapse>
                        </>}
                        {value.count value.childrens?.map(child => {
                            return(
                                <Form.Group key={index}>
                                    <Form.Label>{value.key}</Form.Label>
                                    {(value.selectable) && 
                                    <>
                                        <div className="d-flex">
                                            <Dropdown
                                            className="w-100 d-flex"
                                            onSelect={(value) => 
                                                handleChange({target:{name: key, value: value}})
                                            }>
                                                <DropdownToggle as={CustomToggle} isEdit={isEdit}>
                                                    {(value.type === 'number' && (value.value as number <= 0)) ? '' : value.value}
                                                </DropdownToggle>
                                                <Dropdown.Menu as={CustomMenu} style={{maxWidth: '420px'}}>
                                                    {value.selectData?.map((el: Object) => {              
                                                        return (
                                                            <Dropdown.Item key={(el as any).id} eventKey={(el as any).id} style={{overflowX: 'hidden'}}>
                                                                {Object.entries(el).map(([key2, value2]) => {
                                                                if (key2 !== 'id') return `${value2} `
                                                                })}
                                                            </Dropdown.Item>)
                                                        }
                                                    )}
                                                </Dropdown.Menu>
                                            </Dropdown>
                                            {isEdit &&
                                            <CustomAccordionBut 
                                                eventKey={value.selectable} 
                                                onClick={() => setIsOpenNewModal(isOpenNewModal === value.selectable ? '' : value.selectable as string)}
                                                ref={ref => accordionRef.current[index] = ref as HTMLDivElement}
                                            >
                                                {isOpenNewModal === value.selectable ? `-` : '+'}
                                            </CustomAccordionBut>}
                                        </div>
                                        <Accordion.Collapse eventKey={value.selectable}>
                                            <div className="1" ref={(ref: any) => portalRef.current[index] = ref}>{
                                            (portalRef.current[index] !== undefined && portalRef.current[index] !== null 
                                            && accordionRef.current[index] !== undefined && accordionRef.current[index] !== null) 
                                            ? createPortal2(portalRef.current[index], accordionRef.current[index], value.selectable, setIsOpenNewModal) 
                                            : <div className="1"></div>
                                            }</div>
                                        </Accordion.Collapse>
                                    </>}
                                </Form.Group>
                            )
                        })}
                    </Form.Group>
                    )
                } 
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
                                <Dropdown.Menu as={CustomMenu} style={{maxWidth: '420px'}}>
                                    {value.selectData?.map((el: Object) => {              
                                        return (
                                            <Dropdown.Item key={(el as any).id} eventKey={(el as any).id} style={{overflowX: 'hidden'}}>
                                                {Object.entries(el).map(([key2, value2]) => {
                                                if (key2 !== 'id') return `${value2} `
                                                })}
                                            </Dropdown.Item>)
                                        }
                                    )}
                                </Dropdown.Menu>
                            </Dropdown>
                            {isEdit &&
                            <CustomAccordionBut 
                                eventKey={value.subject} 
                                onClick={() => setIsOpenNewModal(isOpenNewModal === value.subject ? '' : value.subject as string)}
                                ref={ref => accordionRef.current[index] = ref as HTMLDivElement}
                            >
                                {isOpenNewModal === value.subject ? `-` : '+'}
                            </CustomAccordionBut>}
                        </div>
                        <Accordion.Collapse eventKey={value.subject}>
                            <div className="1" ref={(ref: any) => portalRef.current[index] = ref}>{
                            (portalRef.current[index] !== undefined && portalRef.current[index] !== null 
                            && accordionRef.current[index] !== undefined && accordionRef.current[index] !== null) 
                            ? createPortal2(portalRef.current[index], accordionRef.current[index], value.subject, setIsOpenNewModal) 
                            : <div className="1"></div>
                            }</div>
                        </Accordion.Collapse>
                    </Form.Group>    
                    else
                    <Form.Group key={key}>
                        <Form.Label>{value.key}</Form.Label>
                        <Form.Control 
                        name={key} 
                        value={(value.type === 'number' && (value.value as number <= 0)) ? '' : value.value} 
                        type={value.type} 
                        onChange={handleChange} 
                        readOnly={!isEdit} 
                        maxLength={value.maxLength} 
                        minLength={value.minLength} 
                        required={value.required}>
                        
                        </Form.Control>
                    </Form.Group>
                }
            )}
            {!isEdit && <Button disabled={userRole === 'user'} className="d-block mt-3 mx-auto" onClick={() => {setIsEdit(true); setValidated(true)}}>Редактировать</Button>}
            {isEdit && table === 'invoice_number' && <Button className='d-block mt-3 mx-auto' onClick={handleAddField}>Добавить позицию (+)</Button>}
            {isEdit && !props.isCreate && <Button className="d-block mt-3 mx-auto" /* onClick={handleSave} */// type="submit" name='base'>Сохранить</Button>}
 /*           {isEdit && props.isCreate && <Button className='d-block mt-3 mx-auto' /*onClick={handleCreateSubData} */// type="submit" name='sub' ref={submitRef as any}>Создать</Button>}
            
/*            </Accordion>
        </Form>
        </>
    )
}

const createPortal2 = (portalRef: any, accordionRef: any, table: any, setIsOpenNewModal: any) => {

    return(
        createPortal(
        <ModalForm isCreate={true} table={table} setIsOpenNewModal={setIsOpenNewModal} element={defaultElementOfTable.get(table)} accordionRef={accordionRef} />
        , portalRef)
    )
}

const CustomAccordionBut = React.forwardRef(({children, eventKey, onClick}: any, ref) => {
    const decoratedOnClick = useAccordionButton(eventKey, () => onClick());

    return (
        <Button
        className="btn btn-primary d-flex ms-2"
        onClick={decoratedOnClick}
        ref={ref as any}
        >
        {children}
        </Button>
    );
})

const CustomToggle = React.forwardRef(({ children, onClick, isEdit }: any, ref) => (
    <Form.Control
      value={children}
      ref={ref as any}
      readOnly={!isEdit}
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
          <input
            autoFocus
            className="mx-3 my-2"
            style={{width: 'calc(100% - 2rem)'}}
            placeholder="Поиск..."
            onChange={(e) => setValue(e.target.value)}
            value={value}
          />
          <ul className="list-unstyled w-100">
            {React.Children.toArray(children).filter(
              (child) =>
                !value || (child as any).props.children.toString().toLowerCase().indexOf(value.toLowerCase()) != -1
            ).slice(0, 5)}
          </ul>
        </div>
      );
    },
  );


  /*  <Form noValidate validated={validated} onSubmit={handleSave} className={props.isCreate ? 'rounded p-2 my-2' : ''} style={props.isCreate ? {backgroundColor: '#e0eeee'} : undefined}>
                <Accordion>
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
                                    <Dropdown.Menu as={CustomMenu} style={{maxWidth: '420px'}}>
                                        {value.subData?.map((el: Object) => {              
                                            return (
                                                <Dropdown.Item key={(el as any).id} eventKey={(el as any).id} style={{overflowX: 'hidden'}}>
                                                    {Object.entries(el).map(([key2, value2]) => {
                                                    if (key2 !== 'id') return `${value2} `
                                                    })}
                                                </Dropdown.Item>)
                                            }
                                        )}
                                    </Dropdown.Menu>
                                </Dropdown>
                                {isEdit &&
                                <CustomAccordionBut 
                                    eventKey={value.subject} 
                                    onClick={() => setIsOpenNewModal(isOpenNewModal === value.subject ? '' : value.subject as string)}
                                    ref={accordionRef}
                                >
                                    {isOpenNewModal === value.subject ? `-` : '+'}
                                </CustomAccordionBut>}
                            </div>
                            <Accordion.Collapse eventKey={value.subject}>
                                <ModalForm isCreate={true} table={value.subject} setIsOpenNewModal={setIsOpenNewModal} element={defaultElementOfTable.get(value.subject)} accordionRef={accordionRef}/>
                            </Accordion.Collapse>
                        </Form.Group>    
                       :
                        <Form.Group key={key}>
                            <Form.Label>{value.key}</Form.Label>
                            <Form.Control name={key} value={(value.type === 'number' && (value.value as number <= 0)) ? '' : value.value} type={value.type} onChange={handleChange} readOnly={!isEdit} maxLength={value.maxLength} minLength={value.minLength} required={value.required}></Form.Control>
                        </Form.Group>
                    )
                ))}
                {!isEdit && <Button disabled={userRole === 'user'} className="d-block mt-3 mx-auto" onClick={() => {setIsEdit(true); setValidated(true)}}>Редактировать</Button>}
                {isEdit && !props.isCreate && <Button className="d-block mt-3 mx-auto" type="submit">Сохранить</Button>}
                {isEdit && props.isCreate && <Button className='d-block mt-3 mx-auto' onClick={handleCreateSubData}>Создать</Button>}
                {isEdit && table === 'invoice_number' && <Button className='mt-3 mx-auto' onClick={handleAddField}>Создать</Button>}
                </Accordion>
            </Form> */
