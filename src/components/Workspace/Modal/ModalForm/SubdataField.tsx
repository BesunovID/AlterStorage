import React, { useRef, useState } from "react"
import { Form, Accordion, useAccordionButton, Button } from "react-bootstrap"
import { BaseElement, BaseField } from "../../../../models/models";
import { SelectableField } from "./SelectableField";


export function SubdataField(props: any) {
    const {name, value, formikValue, errors, element, index, isEdit, handleChange, setFieldValue, setCreateSub, setNewElement}: 
    {name: string, value: BaseField, formikValue: any, errors: any, element: BaseElement, index: number, isEdit: boolean, handleChange: any, setFieldValue: any, setCreateSub: any, setNewElement: any} = props;
    const [isOpen, setIsOpen] = useState(false);
    const accordionRef = useRef<HTMLInputElement>(null);
    const portalRef = useRef<HTMLDivElement>(null);

    const handleDel = () => {
        const newElement = JSON.parse(JSON.stringify(element));
        Object.entries(formikValue).map(([key, value]) => {
            newElement[key].value = [...(value as Array<string>)]
        });
        (element[name].childrens as Array<string>).map((e: string) => {
            newElement[e].value.splice(index, 1)
        })
        newElement[name].count = newElement[name].count - 1;
        setNewElement(newElement);
    }

    return(
        <Form.Group key={index}>
          <Form.Label>{`${value.key} ${index + 1}`}</Form.Label>
          <div className={'d-flex'}>
            <CustomAccordionInput
                name={name}
                value={formikValue[element[name].valueFrom as string][index]}
                type={element[name].type}
                error={!!errors[name] && !!errors[name][index] && errors[name][index]}
                eventKey={index.toString()}
                onClick={() => setIsOpen(!isOpen)}
                ref={accordionRef}
            />
            {(element[name].count as number) > 1 && 
            <Button variant="danger" className="ms-2" onClick={() => handleDel()} style={{width: '35px', height: '40px'}}>-</Button>}
          </div>
          <Accordion.Collapse eventKey={index.toString()}>
            <Accordion>
            <div className="accordionContainer" ref={portalRef}>
              {
                <div className="rounded p-2 my-2" style={{backgroundColor: '#458b7460'}}>
                    {Object.entries(element).map(([key, value]) => (
                        (element[key].subject === name && element[key].visable) &&
                        (!element[key].selectable ? 
                        <Form.Group key={`${key} ${index}`}>
                            <Form.Label className="mt-1">{value.key}</Form.Label>
                            <Form.Control 
                                name={`${key}[${index}]`} 
                                value={formikValue[key][index]} 
                                type={value.type} 
                                onChange={handleChange} 
                                readOnly={!isEdit} 
                                maxLength={value.maxLength} 
                                minLength={value.minLength} 
                                isInvalid={!!errors[key] &&
                                    !!(errors[key] as string[])[index]}
                            />
                            <Form.Control.Feedback type="invalid">
                                {!!errors[key] &&
                                !!errors[key][index] &&
                                errors[key][index]}
                            </Form.Control.Feedback>
                        </Form.Group> :
                        <SelectableField 
                            key={`${key} ${index}`}
                            name={key}
                            value={element[key]}
                            formikValue={formikValue[key][index]}
                            index={index}
                            isEdit={isEdit}
                            setFieldValue={setFieldValue} 
                            setCreateSub={setCreateSub}
                            errors={errors}
                        />)
                    ))}
                </div>
              }
            </div>
            </Accordion>
          </Accordion.Collapse>
        </Form.Group>   
    )
}

const CustomAccordionInput = React.forwardRef(({name, value, type, error, eventKey, onClick}: any, ref) => {
    const decoratedOnClick = useAccordionButton(eventKey, () => onClick());

    return (
        <div className="d-flex flex-column flex-grow-1">
        <Form.Control
            name={name} 
            value={value} 
            type={type} 
            isInvalid={!!error}
            readOnly={true}
            onClick={decoratedOnClick}
            style={{cursor: 'pointer'}}
            ref={ref as any}
        />
        <Form.Control.Feedback type="invalid">
            {error}
        </Form.Control.Feedback>
        </div>
    );
})