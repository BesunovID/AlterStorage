import axios from "axios";
import { useState, useEffect } from "react";
import { Accordion, Button, Form } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { BaseElement, BaseField, urlList } from "../../../../models/models";
import { createElement, updateElement } from "../../../../store/actions/tableActions";
import { SelectableField } from "./SelectableField";
import { SubdataField } from "./SubdataField";
import * as formik from 'formik';


export function ModalForm(props: any) {
    const dispatch = useAppDispatch();

    const { Formik } = formik;

    const element: BaseElement = props.element;
    const table: string = props.table;
    const userRole = useAppSelector(state => state.users.myProfile.role);

    const [loading, setLoading] = useState(!props.isOpen ? false : true);
    const [firstLoad, setFirstLoad] = useState(true);
    const [isEdit, setIsEdit] = useState(props.isEdit ? true : ('id' in element && element['id'].value[0] === '-1'));
    const [createSub, setCreateSub] = useState(false);
    const [submitName, setSubmitName] = useState('');
    const [newElement, setNewElement] = useState<BaseElement>(JSON.parse(JSON.stringify(element)));

    const initialValues: {[key: string] : string[]} = Object
        .entries(newElement)
        .reduce((newObj, [elKey, elValue]) => {
            if (elValue.visable) {
                if (elValue.valueFrom && elValue.childrens){
                    const arr = [...new Array(elValue.count)].map((_,i) => i+1);
                    newObj[elKey] = [];
                    arr.map((_,index) => {
                        newElement[elValue.valueFrom as string].value[index] !== undefined ?
                        newObj[elKey][index] = newElement[elValue.valueFrom as string].value[index] as string :
                        newObj[elKey][index] = '';
                    })
                } else {
                    newObj[elKey] = [];
                    elValue.value.map((val, index) => {
                        if (val === '-1')
                            newObj[elKey][index] = ''
                        else newObj[elKey][index] = val as string
                    })
                }
            } 
            return(newObj)
        }, {} as {[key: string] : string[]});


    const validate = (values: {[key: string] : string[]}) => {
        const errors: {[key: string] : string[]}  = {};
        Object.entries(values).map(([key, value]) => {
            if (newElement[key].required){
                if (errors[key] === undefined) errors[key] = [];
                value.map((val, index) => {
                    const subFieldsValid = newElement[key].childrens?.map(child => {
                        if (newElement[child].required){
                            if(values[child][index])
                                return true;
                            else return false;
                        }
                    })
                    if (newElement[key].selectable && !val){
                        errors[key][index] = 'Выберите значение!'
                    } else if (newElement[key].childrens && subFieldsValid?.includes(false)){
                        errors[key][index] = 'Заполните все поля!'
                    } else if (!newElement[key].childrens && !val){
                        errors[key][index] = 'Заполните поле!'
                    } 
                })
            }
            if (newElement[key].type === 'email'){
                if (errors[key] === undefined) errors[key] = [];
                value.map((val, index) => { 
                    if (val && !val.match(/^[\w\.\+\-]+\@[\w]+\.[a-z]{2,3}$/))
                        errors[key][index] = 'Почта не соответствует формату!'
                })
            }
            
        })
        return errors
    }

    const getTableData = () => {
        const selectData: BaseElement = JSON.parse(JSON.stringify(newElement));
        const promises = Object.keys(newElement).map((e) => {
            if (newElement[e].selectable){
                return(
                    axios.get(`${process.env.REACT_APP_BASE_STORAGE_URL}/${newElement[e].selectable}/`, {
                        headers: {
                            'Authorization': `Token ${localStorage.getItem('TOKEN')}`,
                        }
                    }).then((res) => {
                        selectData[e].selectData = [...res.data]
                    })
                )
            }
        });
        Promise.all(promises).then(() => {
            setLoading(false);
            firstLoad && setFirstLoad(false);
            createSub && setCreateSub(false);
            setNewElement(JSON.parse(JSON.stringify(selectData)));
        })
    }

    const handleSubmit = (values: any) => {
        if (submitName === 'base'){
            handleSave(values);
        } else handleCreateSubData(values); 
    }

    const handleSave = (values: any) => {
        const newValues = JSON.parse(JSON.stringify(newElement));
        Object.entries(values).map(([key, value]) => {
            newValues[key].value = [...(value as Array<string>)]
        });

        setIsEdit(false);
        if (newValues['id'].value[0] === '-1'){ 
            dispatch(createElement(newValues, table))
        }else{
            dispatch(updateElement(newValues, table))
        } 
    }

    const handleCreateSubData = (values: any) => {
        const newValues = JSON.parse(JSON.stringify(newElement));
        Object.entries(values).map(([key, value]) => {
            newValues[key].value = [...(value as Array<string>)]
        });
        dispatch(createElement(newValues, table))
        .then(() => {
            props.setCreateSub && props.setCreateSub(true);
            if (props.accordionRef.current !== undefined && props.accordionRef.current !== null) {
                props.accordionRef.current.click();
                setNewElement(JSON.parse(JSON.stringify(element)));
            }
        });  
    }

    const handleAddField = (name: string, values: any) => {
        const formElement: BaseElement = Object.entries(newElement).reduce((newObj, [elKey, elValue]) => {
            const newValue = [...(elKey in values ? values[elKey] : newElement[elKey].value)]
            if ((newElement[name].childrens as Array<string>).includes(elKey)){
                newValue.push('');
                newObj[elKey] = {
                    ...elValue,
                    value: [...newValue as string[]],
                    visableValue: newElement[elKey].visableValue !== undefined ? [...newElement[elKey].visableValue as string[]] : undefined,
                    selectData: newElement[elKey].selectData !== undefined ? [...(newElement[elKey].selectData as Array<Object>)] : undefined
                }
            } else if (elKey === name && elValue.count !== undefined) {
                newValue.push('');
                const newCount = elValue.count + 1;
                newObj[elKey] = {
                    ...elValue,
                    value: [...newValue as string[]],
                    count: newCount
                }
            } else {
                newObj[elKey] = {
                    ...elValue,
                    value: [...newValue as string[]],
                    visableValue: newElement[elKey].visableValue !== undefined ? [...newElement[elKey].visableValue as string[]] : undefined,
                    selectData: newElement[elKey].selectData !== undefined ? [...(newElement[elKey].selectData as Array<Object>)] : undefined
                }
            }
            return(newObj)
        }, {} as BaseElement) 
        setNewElement(JSON.parse(JSON.stringify(formElement)));
    }

    useEffect(() => {
        if (createSub) {
            getTableData();
        }
        if (props.isOpen && firstLoad) {
            getTableData();
        } 
    }, [setNewElement, isEdit, props.element, props.isOpen, loading, createSub])


    return(
        <Formik 
        onSubmit={(values) => handleSubmit(values)} 
        initialValues={initialValues} 
        validate={(values) => {
            const errors = Object.entries(validate(values)).reduce((newObj, [key, value]): any => {
                if (value.length > 0) {
                    newObj[key] = [...value]
                } 
                return newObj
            }, {} as {[key: string]: string[]}); 
            return (errors)
        }}
        validateOnMount={false}
        enableReinitialize={true}
        >
        {({ handleSubmit, handleChange, setFieldValue, values, errors }) => (
        <Form noValidate onSubmit={handleSubmit} className={props.isCreate && "rounded p-2 my-2"} style={props.isCreate && {backgroundColor: '#458b7460'}}>
            <Accordion>
            {Object.entries(newElement).map(([key, value]: [string, BaseField], index) => {
                if (value.visable && value.childrens === undefined && value.subject === props.subject) {
                    if (value.selectable)
                        return(
                        <SelectableField 
                            key={index}
                            name={key}
                            value={value}
                            index={0}
                            formikValue={values[key][0]}
                            isEdit={isEdit} 
                            setFieldValue={setFieldValue}
                            setCreateSub={setCreateSub}
                            errors={errors}
                            loading={loading}
                        />)
                    else return(
                        <Form.Group key={index}>
                            <Form.Label className="mt-1">{value.key}</Form.Label>
                            <Form.Control 
                                name={`${key}[0]`} 
                                value={values[key][0].toString() !== '0' ? values[key][0] : ''}
                                type={value.type} 
                                onChange={handleChange} 
                                readOnly={!isEdit} 
                                maxLength={value.maxLength} 
                                minLength={value.minLength} 
                                isInvalid={!!errors[key] && !!(errors[key] as string[])[0]}
                            />
                            <Form.Control.Feedback type="invalid">
                                {!!errors[key] && !!(errors[key] as string[])[0] && (errors[key] as string[])[0]}
                            </Form.Control.Feedback>
                        </Form.Group>
                    )
                } else if (value.visable && value.childrens && !props.subject) {
                    if (value.count !== undefined){
                        const arr = [...new Array(value.count)].map((_,i) => i+1);

                        return(
                        <>
                            {arr.map((_, index) => 
                                <SubdataField 
                                    key={index}
                                    name={key}
                                    value={value}
                                    formikValue={values}
                                    errors={errors}
                                    element={newElement}
                                    index={index}
                                    isEdit={isEdit} 
                                    handleChange={handleChange}
                                    setFieldValue={setFieldValue}
                                    setCreateSub={setCreateSub}
                                    setNewElement={setNewElement}
                                />
                            )}
                            {isEdit && 
                            <Button 
                            key={index}
                            className='d-block mt-3 mx-auto' 
                            onClick={() => {handleAddField(key, values)}}
                            >
                                Добавить {key === 'positions' ? `позицию` : `сборку`} (+)
                            </Button>}
                        </>
                        )
                    }
                }
            })}
            {!isEdit && !props.isSubField && <Button disabled={userRole === 'user'} className="d-block mt-3 mx-auto" onClick={() => setIsEdit(true)}>Редактировать</Button>}
            {isEdit && !props.isCreate && <Button variant="success" className="d-block mt-3 mx-auto" type="submit" name='base' onClick={() => setSubmitName('base')}>Сохранить</Button>}
            {isEdit && props.isCreate && !props.isSubField && <Button variant="success" className='d-block mt-3 mx-auto' type="submit" name='sub' onClick={() => setSubmitName('sub')}>Создать</Button>}
            </Accordion>
        </Form>
        )}
        </Formik>
    )
}