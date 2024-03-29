import React, { useContext, useRef, useState } from "react"
import { Form, Dropdown, DropdownToggle, Accordion, useAccordionButton, Button, AccordionContext } from "react-bootstrap"
import { createPortal } from "react-dom";
import { BaseField, defaultElementOfTable } from "../../../../models/models";
import { ModalForm } from "./index";


export function SelectableField(props: any) {
    const {name, value, isEdit, handleChange, index}: 
    {name: string, value: BaseField, isEdit: boolean, handleChange: (event: any) => void, index: number} = props;
    const [isOpen, setIsOpen] = useState(false);
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
              <DropdownToggle as={CustomToggle} isEdit={isEdit} inputType={value.type}>
                {(value.type === 'number' && (value.value[index] as number <= 0)) ? null : value.value[index]}
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
            />}
          </div>
          <Accordion.Collapse eventKey={value.selectable as string}>
            <div className="accordionContainer" ref={portalRef}>
              {
              (portalRef.current !== undefined && portalRef.current !== null) 
              ? createPortal2(portalRef, value.selectable) 
              : <div className="1"></div>
              }
            </div>
          </Accordion.Collapse>
        </Form.Group>   
    )
}

const createPortal2 = (portalRef: any, table: any) => {
  return(
    createPortal(
    <ModalForm isCreate={true} table={table} element={defaultElementOfTable.get(table)} />
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
      onClick={decoratedOnClick}
      ref={ref as any}
      >
      {isCurrentEventKey ? `-` : '+'}
      </Button>
  );
})

const CustomToggle = React.forwardRef(({ children, onClick, isEdit, inputType }: any, ref) => (
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