import React, { useContext, useRef, useState } from "react"
import { Form, Dropdown, DropdownToggle, Accordion, useAccordionButton, Button, AccordionContext } from "react-bootstrap"
import { createPortal } from "react-dom";
import { BaseField, defaultElementOfTable } from "../../../../models/models";
import { ModalForm } from "./index";


export function SelectableField(props: any) {
  const {name, value, index, formikValue, isEdit, setFieldValue, setCreateSub, errors}: 
  {name: string, value: BaseField, index: number, formikValue: any, isEdit: boolean, setFieldValue: any, setCreateSub: any, errors: any} = props;
  const [isOpen, setIsOpen] = useState(false);
  const portalRef = useRef<HTMLDivElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);

  return(
    <Form.Group key={name}>
      <Form.Label>{value.key}</Form.Label>
      <div className="d-flex">
        <Dropdown
        className="w-100 d-flex"
        onSelect={(value) => 
          setFieldValue(`${name}[${index}]`, value)
        }
        >
          <DropdownToggle 
          as={CustomToggle} 
          isEdit={isEdit} 
          error={!!errors[name] && !!errors[name][index] && errors[name][index]}>
            {formikValue}
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
          onClick={() => setIsOpen(!isOpen)} 
          ref={accordionRef}
        />}
      </div>
      <Accordion.Collapse eventKey={value.selectable as string}>
        <div className="accordionContainer" ref={portalRef}>
          {
          (portalRef.current !== undefined && portalRef.current !== null) 
          ? createPortal2(portalRef, value.selectable, accordionRef, setCreateSub) 
          : <div className="1"></div>
          }
        </div>
      </Accordion.Collapse>
    </Form.Group>   
  )
}

const createPortal2 = (portalRef: any, table: any, accordionRef: any, setCreateSub: any) => {
  return(
    createPortal(
    <ModalForm isCreate={true} isEdit={true} table={table} accordionRef={accordionRef} element={defaultElementOfTable.get(table)} setCreateSub={setCreateSub} />
    , portalRef.current)
  )
}

const CustomAccordionBut = React.forwardRef(({ eventKey, onClick}: any, ref) => {
  const { activeEventKey } = useContext(AccordionContext);
  const decoratedOnClick = useAccordionButton(eventKey, () => onClick());
  const isCurrentEventKey = activeEventKey === eventKey;
  return (
      <Button
      className="btn btn-primary d-flex ms-2"
      style={{width: '40px', height: '40px'}}
      onClick={decoratedOnClick}
      ref={ref as any}
      >
      {isCurrentEventKey ? `-` : '+'}
      </Button>
  );
})

const CustomToggle = React.forwardRef(({ children, onClick, isEdit, error }: any, ref) => (
  <div className="d-flex flex-column w-100">
    <Form.Control
      value={children}
      type='select'
      ref={ref as any}
      readOnly={!isEdit}
      onClick={(e) => {
        e.preventDefault();
        isEdit && onClick(e);
      }}
      className="d-block w-100"
      style={{cursor: 'pointer'}}
      onChange={() => (null)}
      isInvalid={!!error}
    />
    <Form.Control.Feedback type="invalid">
      {error}
    </Form.Control.Feedback>
   </div>
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
            onChange={(e) => {setValue(e.target.value)}}
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