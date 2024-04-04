import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { Button, Form, InputGroup, Pagination, Spinner, Table } from 'react-bootstrap';
import { deleteElement, showModalElement, sortProductsTable } from '../../store/actions/tableActions';
import { BaseElement } from '../../models/models';
import { useEffect, useState } from 'react';


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

    const [searchData, setSearchData] = useState<BaseElement[]>(JSON.parse(JSON.stringify(data)))

    useEffect(() => {

    }, [searchData])

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
            <CustomSearch data={data} setSearchData={setSearchData} />
            {searchData.length > 0 ?
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
                                    (sortBy === key) && (sortDirect === 1) && `  ▲`
                                    }
                                    {
                                    (sortBy === key) && (sortDirect === -1) && `  ▼`
                                    }
                                </th> 
                                    
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {searchData.map((e: BaseElement) => (
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
            : <p className='my-3 mx-auto'>По данному запросу результатов не найдено</p>}
            {
                searchData.length > 15 && 
                <CustomPagination 
                    size={searchData.length} 
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

const CustomSearch = ({data, setSearchData}: {data: BaseElement[], setSearchData: any}) => {
    const [searchValue, setSearchValue] = useState('');
    const [searchField, setSearchField] = useState('');

    useEffect(() => {
        if (searchValue !== '')
            setSearchData(JSON.parse(JSON.stringify(data.filter((e) => {
                if (searchField === ''){
                    return(
                        Object.values(e).find((value) => {
                            return (value.value as string[]).find((str) => {
                                return str.toString().toLowerCase().includes(searchValue.toLowerCase())
                            })
                        })
                    )
                } else {
                    return(
                        (e[searchField].value as string[]).find((str) => {
                            return str.toString().toLowerCase().includes(searchValue.toLowerCase())
                        })
                    )
                }
            }))))
        else setSearchData(JSON.parse(JSON.stringify(data)))
    }, [searchValue, searchField])

    return(
        <InputGroup className='mb-2 mx-2 w-50'>
            <InputGroup.Text id='search'>Поиск</InputGroup.Text>
            <Form.Control
                aria-label="Поиск"
                value={searchValue}
                onChange={(event: any) => setSearchValue(event.target.value)}
            />
            <InputGroup.Text id='in'>в</InputGroup.Text>
            <Form.Select
                value={searchField}
                onChange={(event: any) => setSearchField(event.target.value)}
            >
                <option value={''}>любом</option>
                {Object.entries(data[0]).map(([key, value]) => 
                    <option key={key} value={key}>{value.key}</option>
                )
                }
            </Form.Select>
        </InputGroup>
    )
}