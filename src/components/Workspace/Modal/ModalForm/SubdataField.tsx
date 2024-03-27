import React, { useRef, useState } from "react"
import { Form, Dropdown, DropdownToggle, Accordion, useAccordionButton, Button } from "react-bootstrap"
import { createPortal } from "react-dom";
import { BaseElement, BaseField, defaultElementOfTable, urlList } from "../../../../models/models";
import { ModalForm } from "./index";


export function SubdataField(props: any) {
    const {name, value, element, index, table, isEdit, setIsOpenNewModal}: 
    {name: string, value: BaseField, element: BaseElement, index: number, table: urlList, isEdit: boolean, setIsOpenNewModal: any} = props;
    const [isOpen, setIsOpen] = useState(false);
    const accordionRef = useRef<HTMLInputElement>(null);
    const portalRef = useRef<HTMLDivElement>(null);

    const [formElement, setFormElement] = useState<BaseElement>({
        ...value.childrens?.map(child => {
            ...element[child],
            value: [...element[child].value[index]] 
        }),

    });

    const formElement2 = value.childrens?.map(child => {
       /* setFormElement(prevState => ({
            ...prevState,
            [child]: {
                ...element[child],
                value: [element[child].value[index] as any]
            }
        })) */
         [child]: {
                ...element[child],
                value: [element[child].value[index] as any]
            }
    })

    return(
        <Form.Group key={name}>
          <Form.Label>{`${value.key} ${index + 1}`}</Form.Label>
          <CustomAccordionInput
            name={name}
            value={value}
            index={index}
            isEdit={isEdit}
            eventKey={index.toString()}
            onClick={() => setIsOpen(true)}
            ref={accordionRef}
          />
          <Accordion.Collapse eventKey={index.toString()}>
            <div className="accordionContainer" ref={portalRef}>
              {
              (portalRef.current !== undefined && portalRef.current !== null 
              && accordionRef.current !== undefined && accordionRef.current !== null) 
              ? createPortal2(portalRef, formElement, table, setIsOpenNewModal) 
              : <div className="1"></div>
              }
            </div>
          </Accordion.Collapse>
        </Form.Group>   
    )
}

const createPortal2 = (portalRef: any, element: any, table: any, setIsOpenNewModal: any) => {

    return(
        createPortal(
        <ModalForm isCreate={true} table={table} setIsOpenNewModal={setIsOpenNewModal} element={element} />
        , portalRef.current)
    )
}

const CustomAccordionInput = React.forwardRef(({name, value, index, isEdit, eventKey, onClick}: any, ref) => {
    const decoratedOnClick = useAccordionButton(eventKey, () => onClick());

    return (
        <Form.Control
            name={name} 
            value={`${value.key} ${index + 1}`} 
            type={value.type} 
            readOnly={true}
            onClick={decoratedOnClick}
            ref={ref as any}
        />
    );
})