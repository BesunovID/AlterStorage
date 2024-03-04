import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { Button, Table } from 'react-bootstrap';
import { deleteElement, showModalElement, sortProductsTable } from '../../../store/actions/productsAction';


export function TableData() {
    const tableSelector = useAppSelector(state => state.tables);
    const dispatch = useAppDispatch();

    const data = tableSelector.data; 
    const currentTable = tableSelector.currentUrl;

    return(
        <>
            <Button className="m-2" onClick={() => dispatch(showModalElement(true, tableSelector.modalElement))}>
                Добавить элемент
            </Button>
            {data.length > 0 ?
            <Table striped bordered hover className='w-100'>
                <thead>
                    <tr>
                        <th></th>
                        {Object.keys(data[0]).map(key2 => {
                            const obj: any = data[0][key2 as keyof typeof data[0]];
                            if (key2 === 'connectAssembling_Storage_Position')
                                return(
                                    Object.keys(obj[0]).map(e => 
                                       (e !== 'id') &&
                                        <th 
                                        key={e} 
                                        onClick={() => dispatch(sortProductsTable(
                                            e, 
                                            data, 
                                            tableSelector.sortedByField, 
                                            tableSelector.sortedDirection
                                        ))}>
                                            {e}
                                        </th>
                                    )
                                )
                             else  
                                return(
                                    <th 
                                    key={key2} 
                                    onClick={() => dispatch(sortProductsTable(
                                        key2, 
                                        data, 
                                        tableSelector.sortedByField, 
                                        tableSelector.sortedDirection
                                    ))}>
                                        {key2}
                                    </th> 
                                )
                        })}
                    </tr>
                </thead>
                <tbody>
                    {data.map((e) => (
                        <tr key={`${e.id} + ${tableSelector.currentUrl}`}>
                            <td>   
                                <Button onClick={() => dispatch(deleteElement(e.id as number, currentTable))}>X</Button>
                            </td>
                            {Object.entries(e).map(([keys, val]) => {
                                if (keys === 'connectAssembling_Storage_Position')
                                    return(
                                        Object.entries(val[0] as object).map(([keys2, val2]) => (
                                            keys2 !== 'id' && <td key={keys2} onClick={() => dispatch(showModalElement(true, e))}>
                                                {val2}
                                            </td>
                                        ))
                                    )
                                else
                                    return(
                                        <td key={keys} onClick={() => dispatch(showModalElement(true, e))}>
                                            {val}
                                        </td>
                                    )
                            })}
                        </tr>
                    ))}
                </tbody> 
            </Table> : <div className="1"></div>}
        </>
    )
}