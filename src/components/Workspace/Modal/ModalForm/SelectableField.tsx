import React, { useRef, useState } from "react"
import { Form, Dropdown, DropdownToggle, Accordion, useAccordionButton, Button } from "react-bootstrap"
import { createPortal } from "react-dom";
import { BaseField, defaultElementOfTable } from "../../../../models/models";
import { ModalForm } from "./index";


export function SelectableField(props: any) {
    const {name, value, isEdit, handleChange}: 
    {name: string, value: BaseField, isEdit: boolean, handleChange: (event: any) => void} = props;
    const [isOpen, setIsOpen] = useState(false);
    const accordionRef = useRef<HTMLElement>(null);
    const portalRef = useRef<HTMLDivElement>(null);
    
    return(
        <Form.Group key={name}>
          <Form.Label>{value.key}</Form.Label>
          <div className="d-flex">
            <Dropdown
            className="w-100 d-flex"
            onSelect={(value) => 
              handleChange({target:{name: name, value: value}})
            }>
              <DropdownToggle as={CustomToggle} isEdit={isEdit}>
                {(value.type === 'number' && (value.value[0] as number <= 0)) ? '' : value.value[0]}
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
            >
              {isOpen ? `-` : '+'}
            </CustomAccordionBut>}
          </div>
          <Accordion.Collapse eventKey={value.selectable as string}>
            <div className="accordionContainer" ref={portalRef}>
              {
              (portalRef.current !== undefined && portalRef.current !== null 
              && accordionRef.current !== undefined && accordionRef.current !== null) 
              ? createPortal2(portalRef, accordionRef, value.selectable) 
              : <div className="1"></div>
              }
            </div>
          </Accordion.Collapse>
        </Form.Group>   
    )
}

const createPortal2 = (portalRef: any, accordionRef: any, table: any) => {
  return(
    createPortal(
    <ModalForm isCreate={true} table={table} element={defaultElementOfTable.get(table)} accordionRef={accordionRef} />
    , portalRef.current)
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
    />
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