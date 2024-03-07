import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { Button, Table } from 'react-bootstrap';
import { deleteElement, showModalElement, sortProductsTable } from '../../../store/actions/tableAction';
import { BaseElement, BaseElementFields } from '../../../models/models';


export function TableData() {
    const tableSelector = useAppSelector(state => state.tables);
    const dispatch = useAppDispatch();

    const data = tableSelector.data; 
    const currentTable = tableSelector.currentUrl;
    const baseElement = tableSelector.element

    return(
        <>
            <Button className="m-2" onClick={() => dispatch(showModalElement(true, baseElement))}>
                Добавить элемент
            </Button>
            {data.length > 0 ?
            <div className='w-100 overflow-auto'>
            <Table striped bordered hover className='w-100 overflow-hidden'>
                <thead>
                    <tr>
                        <th></th>
                        {Object.entries(baseElement).map(([key2, value2]) => {
                            if (key2 === 'connectAssembling_Storage_Position' || key2 === 'positions') {
                                const sub: BaseElement = (baseElement[key2] as [{ [field: string]: BaseElementFields; }])[0];
                                return(
                                    Object.entries(sub).map(([key3, value3]) => 
                                       (key3 !== 'id') && (key3 !== 'storage_position') &&
                                        <th 
                                        key={key3} 
                                        onClick={() => dispatch(sortProductsTable(
                                            key3, 
                                            data, 
                                            tableSelector.sortedByField, 
                                            tableSelector.sortedDirection
                                        ))}>
                                            {(value3 as BaseElementFields).key}
                                        </th>
                                    )
                                )
                            } else  
                                return(
                                    <th 
                                    key={key2} 
                                    onClick={() => dispatch(sortProductsTable(
                                        key2, 
                                        data, 
                                        tableSelector.sortedByField, 
                                        tableSelector.sortedDirection
                                    ))}>
                                        {(value2 as BaseElementFields).key}
                                    </th> 
                                )
                        })}
                    </tr>
                </thead>
                <tbody>
                    {data.map((e: BaseElement) => (
                        <tr key={`${(e['id'] as BaseElementFields).value} + ${tableSelector.currentUrl}`}>
                            <td>   
                                <Button onClick={() => dispatch(deleteElement((e['id'] as BaseElementFields).value as number, currentTable))}>X</Button>
                            </td>
                            {Object.entries(e).map(([keys, val]) => {
                                if (keys === 'connectAssembling_Storage_Position' || keys === 'positions')
                                    return(
                                        Object.entries((val as [{ [field: string]: BaseElementFields }])[0]).map(([keys2, val2]) => (
                                            (keys2 !== 'id') && (keys2 !== 'storage_position') &&
                                             <td key={keys2} onClick={() => dispatch(showModalElement(true, e))}>
                                                {val2.value}
                                            </td>
                                        ))
                                    )
                                else
                                    return(
                                        <td key={keys} onClick={() => dispatch(showModalElement(true, e))}>
                                            {(val as BaseElementFields).value}
                                        </td>
                                    )
                            })}
                        </tr>
                    ))}
                </tbody> 
            </Table>
           </div> 
           : <div className="1"></div>
        }
        </>
    )
}