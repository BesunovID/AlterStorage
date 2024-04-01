import React, { useEffect, useRef, useState } from "react"
import { Form, Accordion, useAccordionButton } from "react-bootstrap"
import { createPortal } from "react-dom";
import { BaseElement, BaseField, urlList } from "../../../../models/models";
import { ModalForm } from "./index";


export function SubdataField(props: any) {
    const {name, value, element, index, table, isEdit, setNewElement}: 
    {name: string, value: BaseField, element: BaseElement, index: number, table: urlList, isEdit: boolean, setNewElement: any} = props;
    const [isOpen, setIsOpen] = useState(false);
    const accordionRef = useRef<HTMLInputElement>(null);
    const portalRef = useRef<HTMLDivElement>(null);

/*
    const formElement: BaseElement = Object.entries(element).reduce((newObj, [elKey, elValue]) => {
        if ((value.childrens as Array<string>).includes(elKey)){
            newObj[elKey] = {
                ...elValue,
                'value': [elValue.value[index] as any]
            }
        }
        return(newObj)
    }, {} as BaseElement) */

    return(
        <Form.Group key={index}>
          <Form.Label>{`${value.key} ${index + 1}`}</Form.Label>
          <CustomAccordionInput
            name={name}
            value={element[value.valueFrom as string].value[index]}
            index={index}
            eventKey={index.toString()}
            onClick={() => setIsOpen(!isOpen)}
            isEdit={isEdit}
            ref={accordionRef}
          />
          <Accordion.Collapse eventKey={index.toString()}>
            <div className="accordionContainer" ref={portalRef}>
              {
              (portalRef.current !== undefined && portalRef.current !== null 
              && accordionRef.current !== undefined && accordionRef.current !== null) 
              ? createPortal2(portalRef, accordionRef, element, index, table, name, setNewElement, isEdit) 
              : <div className="1"></div>
              }
            </div>
          </Accordion.Collapse>
        </Form.Group>   
    )
}

const createPortal2 = (portalRef: any, accordionRef: any, element: any, index: number, table: any, subject: string, setNewElement: any, isEdit: boolean) => {
    return(
        createPortal(
        <ModalForm accordionRef={accordionRef} isEdit={isEdit} isCreate={true} isSubField={true} table={table} element={element} subject={subject} index={index} setNewElement={setNewElement} />
        , portalRef.current)
    )
}

const CustomAccordionInput = React.forwardRef(({name, value, index, eventKey, onClick, isEdit}: any, ref) => {
    const decoratedOnClick = useAccordionButton(eventKey, () => onClick());

    return (
        <Form.Control
            name={name} 
            value={value} 
            type={value.type} 
            readOnly={true}
            onClick={decoratedOnClick}
            style={{cursor: 'pointer'}}
            ref={ref as any}
        />
    );
})