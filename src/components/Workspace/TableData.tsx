import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { Button, Pagination, Spinner, Table } from 'react-bootstrap';
import { deleteElement, showModalElement, sortProductsTable } from '../../store/actions/tableActions';
import { BaseElement } from '../../models/models';
import { useState } from 'react';


export function TableData() {
    const tableSelector = useAppSelector(state => state.tables);
    const userRole = useAppSelector(state => state.users.myProfile.role)
    const dispatch = useAppDispatch();

    const [currentPage, setCurrentPage] = useState<number>(1);

    const data = tableSelector.data; 
    const currentTable = tableSelector.currentUrl;
    const baseElement = tableSelector.element;
    const loading = tableSelector.loading;
    const sortBy = tableSelector.sortedByField;
    const sortDirect = tableSelector.sortedDirection;

    return(
        loading ? 
        <div className="bg-grey d-flex align-self-center align-items-md-center justify-content-center"  style={{minHeight: '60vh'}}>
            <Spinner animation="border" />
        </div> :
        <>
            <Button className="m-2" onClick={() => dispatch(showModalElement(true, baseElement))}  disabled={userRole === 'user'}>
                Добавить элемент
            </Button>
            {data.length > 0 ?
            <>
            <div className='overflow-auto border ' style={{width: 'calc(100% - 1rem)', maxWidth: 'calc(100% - 1rem)', marginLeft: '0.5rem', resize: 'both'}}>
                <Table striped bordered hover className='overflow-hidden'>
                    <thead>
                        <tr>
                            <th style={{width: '60px'}}></th>
                            {Object.entries(baseElement).map(([key, value]) => (
                                (baseElement[key].childrens === undefined) && (key !== 'id_2') && (key !== 'number_invoice_2') &&
                                <th 
                                key={key} 
                                onClick={() => dispatch(sortProductsTable(
                                    key, 
                                    data, 
                                    tableSelector.sortedByField, 
                                    tableSelector.sortedDirection
                                ))}>
                                    {value.key}
                                    {
                                    (sortBy === key) && (sortDirect === 1) && `▲`
                                    }
                                    {
                                    (sortBy === key) && (sortDirect === -1) && `▼`
                                    }
                                </th> 
                                    
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((e: BaseElement) => (
                            <tr key={`${e['id'].value[0]} + ${tableSelector.currentUrl}`}>
                                <td style={{maxWidth: '40px'}}>   
                                    <Button onClick={() => dispatch(deleteElement(e['id'].value[0] as number, currentTable))} style={{width: '30px', height: '30px', padding: '0'}}>X</Button>
                                </td>
                                {Object.entries(e).map(([keys, val]) => (
                                    (e[keys].childrens === undefined) && (keys !== 'id_2') && (keys !== 'number_invoice_2') &&
                                    <td key={keys} onClick={() => dispatch(showModalElement(true, e))} style={{cursor:'pointer'}}>
                                    {
                                        (val.type === 'number' && val.value[0] as number <= 0) 
                                        ? '' 
                                        : val.value.length > 1 ? `${val.value[0]}, ...` : val.value[0]
                                    }
                                    </td>  
                                ))}
                            </tr>
                        )).slice(15 * (currentPage - 1), 15 * currentPage)}
                    </tbody> 
                </Table>
            </div> 
            {
                data.length > 15 && 
                <CustomPagination 
                    size={data.length} 
                    currentPage={currentPage} 
                    setCurrentPage={setCurrentPage} 
                />
            }
           </>
           : <div className="m-auto">Данные отсутствуют</div>
            }
        </>
    )
}

const CustomPagination = (
    {size, currentPage, setCurrentPage}: 
    {size: number, currentPage: number, setCurrentPage: any}
    ) => {

    const lastPage = Math.ceil(size / 15);

    return(
        <Pagination className='mx-auto mt-2'>
            {(currentPage-3 >= 1) && <Pagination.First onClick={() => setCurrentPage(currentPage-2)} />}
            {(currentPage-1 >= 1) && <Pagination.Prev onClick={() => setCurrentPage(currentPage-1)} />}
            {(currentPage-3 >= 1) && <Pagination.Ellipsis  />}

            {(currentPage-2 >= 1) && <Pagination.Item onClick={() => setCurrentPage(currentPage-2)}>{currentPage-2}</Pagination.Item>}
            {(currentPage-1 >= 1) && <Pagination.Item onClick={() => setCurrentPage(currentPage-1)}>{currentPage-1}</Pagination.Item>}
            <Pagination.Item active>{currentPage}</Pagination.Item>
            {(currentPage+1 <= lastPage) && <Pagination.Item onClick={() => setCurrentPage(currentPage+1)}>{currentPage+1}</Pagination.Item>}
            {(currentPage+2 <= lastPage) && <Pagination.Item onClick={() => setCurrentPage(currentPage+2)}>{currentPage+2}</Pagination.Item>}

            {(currentPage+3 <= lastPage) && <Pagination.Ellipsis  />}
            {(currentPage+1 <= lastPage) && <Pagination.Next onClick={() => setCurrentPage(currentPage+1)} />}
            {(currentPage+3 <= lastPage) && <Pagination.Last onClick={() => setCurrentPage(currentPage+2)} />}
        </Pagination>
    )
}