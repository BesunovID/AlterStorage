import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { Button, Table } from 'react-bootstrap';
import { showModalElement, sortProductsTable } from '../../../store/actions/productsAction';


export function TableData() {
    const tableSelector = useAppSelector(state => state.tables);
    const dispatch = useAppDispatch();

    const data = tableSelector.data; 
    return(
        <>
            <Button className="m-2" onClick={() => dispatch(showModalElement(true, {}))}>
                Добавить элемент
            </Button>
            {data.length > 0 ?
            <Table striped bordered hover>
                <thead>
                    <tr>
                        {Object.keys(data[0]).map((key2) => {
                            const arr: any = data[0][key2 as keyof typeof data[0]]
                            if (key2 === 'connectAssembling_Storage_Position') {
                                Object.keys(arr).map(e => (
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
                                ))
                            } else {  
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
                            }
                        })}
                    </tr>
                </thead>
                <tbody>
                    {data.map((e) => (
                        <tr key={`${e.id} + ${tableSelector.currentUrl}`} onClick={() => dispatch(showModalElement(true, e))}>
                            {Object.entries(e).map(([keys, val]) => (
                                <td key={keys}>{val}</td>
                            ))}
                        </tr>
                    ))}
                </tbody> 
            </Table> : <div className="1"></div>}
        </>
    )
}