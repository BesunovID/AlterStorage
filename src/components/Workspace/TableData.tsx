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
            <div className='overflow-auto' style={{width: 'calc(100% - 1rem)', marginLeft: '0.5rem'}}>
            <Table bordered hover className='w-100 overflow-hidden '>
                <thead>
                    <tr>
                        <th style={{width: '60px'}}></th>
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
                            <td style={{maxWidth: '40px'}}>   
                                <Button onClick={() => dispatch(deleteElement(e['id'].value as number, currentTable))} style={{width: '30px', height: '30px', padding: '0'}}>X</Button>
                            </td>
                            {Object.entries(e).map(([keys, val]) => (
                                (e[keys].childrens === undefined) && (keys !== 'id_2') &&
                                <td key={keys} onClick={() => dispatch(showModalElement(true, e))} style={{cursor:'pointer'}}>
                                    {(val.type === 'number' && val.value as number <= 0) ? '' : val.value}
                                </td>  
                            ))}
                        </tr>
                    ))}
                </tbody> 
            </Table>
           </div> 
           : <div className="m-auto">Данные отсутствуют</div>
        }
        </>
    )
}