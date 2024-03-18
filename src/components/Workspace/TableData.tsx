import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { Button, Table } from 'react-bootstrap';
import { deleteElement, showModalElement, sortProductsTable } from '../../store/actions/tableActions';
import { BaseElement } from '../../models/models';


export function TableData() {
    const tableSelector = useAppSelector(state => state.tables);
    const userRole = useAppSelector(state => state.users.myProfile.role)
    const dispatch = useAppDispatch();

    const data = tableSelector.data; 
    const currentTable = tableSelector.currentUrl;
    const baseElement = tableSelector.element;
    
    return(
        <>
            <Button className="m-2" onClick={() => dispatch(showModalElement(true, baseElement))}  disabled={userRole === 'user'}>
                Добавить элемент
            </Button>
            {data.length > 0 ?
            <div className='w-100 overflow-auto'>
            <Table striped bordered hover className='w-100 overflow-hidden'>
                <thead>
                    <tr>
                        <th></th>
                        {Object.entries(baseElement).map(([key, value]) => (
                            (baseElement[key].childrens === undefined) && (key !== 'id_2') &&
                            <th 
                            key={key} 
                            onClick={() => dispatch(sortProductsTable(
                                key, 
                                data, 
                                tableSelector.sortedByField, 
                                tableSelector.sortedDirection
                            ))}>
                                {value.key}
                            </th> 
                                
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((e: BaseElement) => (
                        <tr key={`${e['id'].value} + ${tableSelector.currentUrl}`}>
                            <td>   
                                <Button onClick={() => dispatch(deleteElement(e['id'].value as number, currentTable))}>X</Button>
                            </td>
                            {Object.entries(e).map(([keys, val]) => (
                                (e[keys].childrens === undefined) && (keys !== 'id_2') &&
                                <td key={keys} onClick={() => dispatch(showModalElement(true, e))}>
                                    {(val.type === 'number' && val.value as number <= 0) ? '' : val.value}
                                </td>  
                            ))}
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