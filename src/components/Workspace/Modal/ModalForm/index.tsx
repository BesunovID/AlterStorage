import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Accordion, Button, Form, Spinner } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { AllSelectData, BaseElement, BaseField } from "../../../../models/models";
import { createElement, setAllSelectData, setElementVisableValues, setSubData, showModalElement, updateElement } from "../../../../store/actions/tableActions";
import { SelectableField } from "./SelectableField";
import { SubdataField } from "./SubdataField";
import * as formik from 'formik';


export function ModalForm(props: any) {
    const dispatch = useAppDispatch();

    const { Formik } = formik;

    const element: BaseElement = props.element;
    const table: string = props.table;
    const userRole = useAppSelector(state => state.users.myProfile.role);
    const allSelectData: AllSelectData = useAppSelector(state => state.tables.allSelectData);

    const formID = props.index !== undefined ? `${table}${props.index}` : `${table}0`;

    const [firstLoad, setFirstLoad] = useState(true);
    const [loading, setLoading] = useState(props.isCreate ? true : false);
    const [allSelectDataCopy, setAllSelectDataCopy] = useState(JSON.parse(JSON.stringify(allSelectData)))
    const [isEdit, setIsEdit] = useState(props.isEdit ? true : ('id' in element && element['id'].value[0] === '-1'));
    const [createSub, setCreateSub] = useState('');
    const [updateSubdata, setUpdateSubdata] = useState(false);
    const [newElement, setNewElement] = useState<BaseElement>(JSON.parse(JSON.stringify(element)));
    
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
        const data: AllSelectData = JSON.parse(JSON.stringify(allSelectDataCopy));
        const promises: Promise<any>[] = [];
        Object.keys(selectData).map((e) => {
            if (selectData[e].selectable){
                if (e in data) {
                    selectData[e].selectData = [...data[e]]
                } else {
                setSubData(selectData, data, promises)
                }
            }
        });
        Promise.all(promises).then(() => {
            firstLoad && setFirstLoad(false);
            (createSub !== '') && setCreateSub('');
            setNewElement(JSON.parse(JSON.stringify(selectData)));
            setAllSelectDataCopy(JSON.parse(JSON.stringify(data)));
            const isUpdate = ((Object.keys(data).map((key) => {
                if (!(key in allSelectData)) {
                    return true
                }
            })).includes(true)) 
            if (isUpdate) {
            setUpdateSubdata(true);
            }
        })
    }

    const updateData = () => {
        const selectData: BaseElement = JSON.parse(JSON.stringify(newElement));
        const promises: Promise<any>[] = [];
        Object.keys(selectData).map(async (e) => {
            if (selectData[e].selectable === createSub){
                promises.push(axios.get(`${process.env.REACT_APP_BASE_STORAGE_URL}/${createSub}/`, {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('TOKEN')}`,
                    }
                }).then((res) => {
                    selectData[e].selectData = [...res.data].sort((a, b) => {
                        return Number(b.id) - Number(a.id)
                    });
                }))
            }
        });
        Promise.all(promises).then(() => {
            setNewElement(JSON.parse(JSON.stringify(selectData)));
            setCreateSub('');
            setLoading(false);
        })

    }

    const createInitial = (element: BaseElement) => {
        return Object
            .entries(element)
            .reduce((newObj, [elKey, elValue]) => {
                if (elValue.inForm) {
                    if (elValue.childrens){
                        const arr = [...new Array(elValue.count)].map((_,i) => i+1);
                        newObj[elKey] = [];
                        arr.map((_,index) => {
                            newObj[elKey][index] = elValue.visableValue[index];
                        })
                    } else {
                        newObj[elKey] = [];
                        elValue.value.map((val, index) => {
                            if (val === '-1')
                                newObj[elKey][index] = ''
                            else newObj[elKey][index] = val
                        })
                    }
                } 
                return(newObj)
            }, {} as {[key: string] : string[]});
    }

    const [initialValues, setInitialValues] = useState<{[key: string]: string[]}>(createInitial(newElement));

    const handleSave = async (values: any) => {
        const newValues = JSON.parse(JSON.stringify(newElement));
        Object.entries(values).map(([key, value]) => {
            newValues[key].value = [...(value as Array<string>)]
        });
        await setElementVisableValues(newValues, allSelectData);

        setIsEdit(false);
        if (newValues['id'].value[0] === '-1'){ 
            dispatch(createElement(newValues, table))
            .then((res) => res === 'success' && dispatch(showModalElement(false, undefined, table)))
        }else{
            dispatch(updateElement(newValues, table))
            .then((res) => res === 'success' && dispatch(showModalElement(false, undefined, table)))
        }
    }

    const handleCreateSubData = async (values: any) => {
        const newValues = JSON.parse(JSON.stringify(newElement));
        Object.entries(values).map(([key, value]) => {
            newValues[key].value = [...(value as Array<string>)]
        });
        await setElementVisableValues(newValues, allSelectData);
        dispatch(createElement(newValues, table))
        .then(() => {
            props.setCreateSub && props.setCreateSub(table);
            if (props.accordionRef.current !== undefined && props.accordionRef.current !== null) {
                props.accordionRef.current.click();
                setNewElement(JSON.parse(JSON.stringify(element)));
            }
        });  
    }

    const handleAddField = (name: string, values: any) => {
        const formElement: BaseElement = Object.entries(newElement).reduce((newObj, [elKey, elValue]) => {
            const newValue = [...(elKey in values ? values[elKey] : newElement[elKey].value)]
            const visableValue = [...newElement[elKey].visableValue];
            if ((newElement[name].childrens as Array<string>).includes(elKey)){
                newValue.push('');
                visableValue.push('');
                newObj[elKey] = {
                    ...elValue,
                    value: [...newValue as string[]],
                    visableValue: [...visableValue],
                    selectData: newElement[elKey].selectData !== undefined ? [...(newElement[elKey].selectData as Array<Object>)] : undefined
                }
            } else if (elKey === name && elValue.count !== undefined) {
                newValue.push('');
                visableValue.push('');
                const newCount = elValue.count + 1;
                newObj[elKey] = {
                    ...elValue,
                    value: [...newValue as string[]],
                    visableValue: [...visableValue],
                    count: newCount
                }
            } else {
                newObj[elKey] = {
                    ...elValue,
                    value: [...newValue as string[]],
                    visableValue: [...visableValue],
                    selectData: newElement[elKey].selectData !== undefined ? [...(newElement[elKey].selectData as Array<Object>)] : undefined
                }
            }
            return(newObj)
        }, {} as BaseElement) 
        setNewElement(JSON.parse(JSON.stringify(formElement)));
        setInitialValues(createInitial(formElement));
    }

    useEffect(() => {
        if (createSub !== '') {
            updateData();
            setLoading(true);
        }
        if (props.isOpen && firstLoad) {
            getTableData();
        }
        if (updateSubdata) {
            dispatch(setAllSelectData(allSelectDataCopy));
            setLoading(false);
            setUpdateSubdata(false);
        }
        if (!updateSubdata && !firstLoad && loading) {
            setLoading(false);
        }
    }, [setNewElement, isEdit, props.element, props.isOpen, loading, createSub, firstLoad, allSelectDataCopy])


    return(
        <Formik 
        onSubmit={(values) => props.isCreate ? handleCreateSubData(values) : handleSave(values)} 
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
        {({ handleSubmit, handleChange, setFieldValue, submitForm, values, errors }) => (
        <Form key={formID} noValidate onSubmit={handleSubmit} className={props.isCreate && "rounded p-2 my-2"} style={props.isCreate && {backgroundColor: '#458b7460'}}>
            <Accordion>
            {Object.entries(newElement).map(([key, value]: [string, BaseField], index) => {
                if (value.inForm && value.childrens === undefined && value.subject === props.subject) {
                    if (value.selectable)
                        return(
                        <SelectableField 
                            key={index}
                            name={key}
                            value={value}
                            index={0}
                            formikValue={values[key]}
                            allSelectData={allSelectData}
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
                } else if (value.inForm && value.childrens && !props.subject) {
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
                                    allSelectData={allSelectData}
                                    errors={errors}
                                    element={newElement}
                                    index={index}
                                    isEdit={isEdit} 
                                    loading={loading}
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
            {isEdit && !props.isCreate && <Button variant="success" className="d-block mt-3 mx-auto" onClick={() => {submitForm()}}>Сохранить</Button>}
            {isEdit && props.isCreate && !props.isSubField && <Button variant="success" className='d-block mt-3 mx-auto' onClick={() => {submitForm()}}>Создать</Button>}
            </Accordion>
        </Form>
        )}
        </Formik>
    )
}