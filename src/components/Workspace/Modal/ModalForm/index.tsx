import axios from "axios";
import { useState, useEffect } from "react";
import { Accordion, Button, Form, Spinner } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { BaseElement, defaultElementOfTable, urlList } from "../../../../models/models";
import { createElement, showModalElement, updateElement } from "../../../../store/actions/tableActions";
import { SelectableField } from "./SelectableField";
import { SubdataField } from "./SubdataField";
import * as formik from 'formik';


export function ModalForm(props: any) {
    const dispatch = useAppDispatch();

    const { Formik } = formik;

    const element: BaseElement = props.element;
    const table: urlList = props.table;
    const userRole = useAppSelector(state => state.users.myProfile.role)

    const [loading, setLoading] = useState(!props.isSubField ? true : false);
    const [isEdit, setIsEdit] = useState(props.isEdit ? true : ('id' in element && element['id'].value[0] === -1));
    const [createSub, setCreateSub] = useState(false);
    const [submitName, setSubmitName] = useState('');
    const [newElement, setNewElement] = useState<BaseElement>(JSON.parse(JSON.stringify(element)));

    const initialValues: {[key: string] : string[]} = Object
        .entries(newElement)
        .reduce((newObj, [elKey, elValue]) => {
            if (elValue.visable) {
                if (elValue.valueFrom){
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
                        if (val === -1)
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
        if (newValues['id'].value[0] === -1){ 
            dispatch(createElement(newValues, table)).then(() =>
                dispatch(showModalElement(false, defaultElementOfTable.get(table), table))
            );
        }else{
            dispatch(updateElement(newValues, table)).then(() =>
                dispatch(showModalElement(false, defaultElementOfTable.get(table), table))
            );
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
                    value: [...newValue as string[]]
                }
            }
            return(newObj)
        }, {} as BaseElement) 
        setNewElement(JSON.parse(JSON.stringify(formElement)));
    }

    useEffect(() => {
        if (loading){
            if (Object.keys(newElement).find((e) => newElement[e].selectable)) 
                getTableData();
            else setLoading(false);
        }
        if (createSub) {
            getTableData();
            setCreateSub(false);
        }
        if (props.isCreate && props.isEdit !== isEdit) {
            setIsEdit(props.isEdit);
        } 
    }, [setNewElement, isEdit, props.element, props.isEdit, loading, createSub])


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
        validateOnMount={true}
        enableReinitialize={true}
        >
        {({ handleSubmit, handleChange, setFieldValue, values, errors }) => (
        <Form noValidate onSubmit={handleSubmit} className={props.isCreate && "rounded p-2 my-2"} style={props.isCreate && {backgroundColor: '#458b7460'}}>
            <Accordion>
            {loading ? 
            <div className="bg-grey d-flex align-items-center justify-content-center">
                <Spinner animation="border" />
            </div> :
            Object.entries(newElement).map(([key, value]) => {
                if (value.visable && value.childrens === undefined && value.subject === props.subject) {
                    if (value.selectable)
                        return(
                        <SelectableField 
                            key={`${key} ${props.isCreate}`}
                            name={key}
                            value={value}
                            index={0}
                            formikValue={values[key][0]}
                            isEdit={isEdit} 
                            setFieldValue={setFieldValue}
                            setCreateSub={props.setCreateSub ? props.setCreateSub : setCreateSub}
                            errors={errors}
                        />)
                    else return(
                        <Form.Group key={`${key}`}>
                            <Form.Label className="mt-1">{value.key}</Form.Label>
                            <Form.Control 
                                name={`${key}[0]`} 
                                value={values[key][0]} 
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
                                    key={`${key} ${index}`}
                                    name={key}
                                    value={value}
                                    formikValue={values}
                                    errors={errors}
                                    element={newElement}
                                    index={index}
                                    isEdit={isEdit} 
                                    handleChange={handleChange}
                                    setFieldValue={setFieldValue}
                                    setCreateSub={props.setCreateSub ? props.setCreateSub : setCreateSub}
                                />
                            )}
                            {isEdit && <Button className='d-block mt-3 mx-auto' onClick={() => {handleAddField(key, values)}}>Добавить позицию (+)</Button>}
                        </>
                        )
                    }
                }
            })}
            {!isEdit && !props.isSubField && <Button disabled={userRole === 'user'} className="d-block mt-3 mx-auto" onClick={() => setIsEdit(true)}>Редактировать</Button>}
            {isEdit && !props.isCreate && <Button className="d-block mt-3 mx-auto" type="submit" name='base' onClick={() => setSubmitName('base')}>Сохранить</Button>}
            {isEdit && props.isCreate && !props.isSubField && <Button className='d-block mt-3 mx-auto' type="submit" name='sub' onClick={() => setSubmitName('sub')}>Создать</Button>}
            </Accordion>
        </Form>
        )}
        </Formik>
    )
}