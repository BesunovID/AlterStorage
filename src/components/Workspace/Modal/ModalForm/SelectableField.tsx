import React, { useContext, useEffect, useRef, useState } from "react"
import { Form, Dropdown, DropdownToggle, Accordion, useAccordionButton, Button, AccordionContext, Spinner } from "react-bootstrap"
import { createPortal } from "react-dom";
import { AllSelectData, BaseElement, BaseField, defaultElementOfTable } from "../../../../models/models";
import { ModalForm } from "./index";


export function SelectableField(props: any) {
  const {name, value, index, formikValue, allSelectData, isEdit, setFieldValue, setCreateSub, errors, loading}: 
  {name: string, value: BaseField, index: number, formikValue: any, allSelectData: AllSelectData, isEdit: boolean, setFieldValue: any, setCreateSub: any, errors: any, loading: any } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [visableValue, setVisableValue] = useState('');
  const portalRef = useRef<HTMLDivElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);

  const setSelectableValue = (elementField: BaseField, value: string[]) => {
    const valueFrom: BaseElement = defaultElementOfTable.get(elementField.selectable);

    const result = value.map((val) => {
        const findValue = elementField.selectData?.find((el: any) => 
            el.id.toString() === val.toString());
        const visableValue = elementField.valueFrom.map((field) => { 
            if (valueFrom[field].selectable && findValue !== undefined && !loading){
                valueFrom[field].selectData = [...allSelectData[field]];
                valueFrom[field].value = [(findValue as {[key: string]: string})[field]];
                const res: string[] = setSelectableValue(valueFrom[field], valueFrom[field].value);
                return res.join(' ')
            } else {
                return (findValue !== undefined ? 
                (findValue as {[key: string]: string})[field] : '')
            }
        }).join(' ');

        return visableValue
    });
    return result
  }

  const handleCreate = () => {
    setIsOpen(!isOpen);
  }

  useEffect(() => {
    (formikValue[index] !== '' && formikValue[index] !== undefined) ?
    setVisableValue(setSelectableValue(value, [formikValue[index]])[0]) :
    setVisableValue(value.visableValue[index])
  },[formikValue[index], loading])

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
            {visableValue}
          </DropdownToggle>
          <Dropdown.Menu as={CustomMenu} style={{maxWidth: '420px'}} loading={loading}>
            {value.selectData?.map((el: Object) => (
              ((value.subject === 'connectAssembling_Storage_Position') &&
              (name === 'assembling') && (formikValue.includes((el as any).id.toString()))) ? 
              (
                undefined
              ) :
              (
                <Dropdown.Item key={(el as any).id} eventKey={(el as any).id} style={{overflowX: 'hidden'}}>
                  {setSelectableValue(value, [(el as any)['id']])[0]}
                </Dropdown.Item>
              )
            )
            )}
          </Dropdown.Menu>
        </Dropdown>
        {isEdit &&
        <CustomAccordionBut 
          eventKey={value.selectable}
          onClick={() => handleCreate()} 
          ref={accordionRef}
        />}
      </div>
      <Accordion.Collapse eventKey={value.selectable as string}>
        <div className="accordionContainer" ref={portalRef}>
          {
            (portalRef.current !== undefined && portalRef.current !== null) 
            ? createPortal2(portalRef, value.selectable, accordionRef, setCreateSub, isOpen, index) 
            : <div className="placeholder"></div>
          }
        </div>
      </Accordion.Collapse>
    </Form.Group>   
  )
}

const createPortal2 = (portalRef: any, table: any, accordionRef: any, setCreateSub: any, isOpen: any, index: number) => {
  return(
    createPortal(
    <ModalForm isCreate={true} isEdit={true} isOpen={isOpen} element={defaultElementOfTable.get(table)} index={index} table={table} accordionRef={accordionRef} setCreateSub={setCreateSub} />
    , portalRef.current)
  )
}

const CustomAccordionBut = React.forwardRef(({ eventKey, onClick}: any, ref) => {
  const { activeEventKey } = useContext(AccordionContext);
  const isCurrentEventKey = activeEventKey === eventKey;
  const decoratedOnClick = useAccordionButton(eventKey, () => onClick());
  
  return (
      <Button
      variant="success"
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
      value={children !== '0' ? children : ''}
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
    ({ children, style, className, 'aria-labelledby': labeledBy, loading }:any, ref) => {
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
            {loading ? 
            <div className="bg-grey d-flex align-items-center justify-content-center">
              <Spinner animation="border" />
            </div> : 
            (React.Children.toArray(children).length > 0 
            ?
            React.Children.toArray(children).filter((child) =>
              !value || (child as any).props.children.toString().toLowerCase().indexOf(value.toLowerCase()) != -1
            ).slice(0, 5) 
            :
            <p className='ms-3'>Данные отсутствуют</p>)
            }
          </ul>
        </div>
      );
    },
  );