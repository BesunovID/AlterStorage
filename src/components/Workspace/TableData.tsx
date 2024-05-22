import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { Button, Form, InputGroup, Pagination, Spinner, Table } from 'react-bootstrap';
import { deleteElement, showModalElement, showProductsTable } from '../../store/actions/tableActions';
import { BaseElement, defaultElementOfTable } from '../../models/models';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function TableData() {
    const tableSelector = useAppSelector(state => state.tables);
    const userRole = useAppSelector(state => state.users.myProfile.role)
    const dispatch = useAppDispatch();

    const data = tableSelector.data; 
    const currentTable = tableSelector.currentUrl;
    const baseElement = tableSelector.emptyElement;
    const loading = tableSelector.loading;

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [sortField, setSortField] = useState('id');
    const [sortedDirection, setSortedDirection] = useState(1);
    const [searchData, setSearchData] = useState<BaseElement[]>(JSON.parse(JSON.stringify(data)))

    const handleSortTable = (field: string, data: BaseElement[]) => {
        const arrayOfSort = [...data];
    
        arrayOfSort.sort((a, b) => {
            let newA = a[field];
            let newB = b[field];
            return newA.value[0].toString().localeCompare(newB.value[0].toString(), undefined, {numeric: true, sensitivity: "base"})
        }); 

        if (sortField === field) {
            if (sortedDirection === 1) {
                setSortedDirection(-1);
                setSearchData(arrayOfSort.reverse());
            } else {
                setSortedDirection(1);
                setSearchData(arrayOfSort);
            }
        } else {
            setSortedDirection(1);
            setSortField(field);
            setSearchData(arrayOfSort);
        }
    }

    const handleDeleteElement = (element: BaseElement) => {
        const accept = window.confirm('Вы уверены что хотите удалить этот элемент?');
        accept && dispatch(deleteElement(element, currentTable));
    }

    useEffect(() => {
        setSearchData(JSON.parse(JSON.stringify(data)));
        setCurrentPage(1);
    }, [data])

    return(
        loading ? 
        <div className="bg-grey d-flex align-self-center align-items-center justify-content-center"  style={{minHeight: '60vh'}}>
            <Spinner animation="border" />
        </div> :
        <>
            <div className='d-flex w-100'>
            {userRole !== 'user' && 
            <motion.button 
                className="btn btn-success mx-2 mt-2" 
                onClick={() => dispatch(showModalElement(true, baseElement))}  
                disabled={userRole === 'user'}
                whileTap={{ scale: 0.95 }}
            >
                Добавить элемент
            </motion.button>}
            {<motion.button
                className="btn btn-primary ms-auto me-2 mt-2" 
                onClick={() => dispatch(showProductsTable(currentTable))} 
                whileTap={{ scale: 0.95 }}
            >
                Обновить
            </motion.button>}
            </div>
            {data.length > 0 ?
            <>
            <CustomSearch data={data} setSearchData={setSearchData} />
            {searchData.length > 0 ?
            <div 
                className='overflow-auto border mt-2' 
                style={{
                    width: 'calc(100% - 1rem)', 
                    maxWidth: 'calc(100% - 1rem)', 
                    maxHeight: '90vh',
                    minWidth: '250px', 
                    minHeight: '100px', 
                    marginLeft: '0.5rem', 
                    resize: 'both',
                    borderRadius: '10px',
                }}
            >
                {/*<Table striped bordered hover className='overflow-hidden'>*/}
                <table 
                    className='overflow-hidden' 
                    style={{
                        width: '100%', 
                        backgroundColor: 'white',
                        borderCollapse: 'separate',
                        borderSpacing: '0px 5px',
                    }}
                >
                    <thead>
                        <tr style={{ backgroundColor: 'DarkSlateGray', color: 'white', height: '3rem'}}>
                            {userRole !== 'user' && <th style={{width: '60px'}}></th>}
                            {Object.entries(baseElement).map(([key, value]) => (
                                value.inTable &&
                                <th 
                                key={key} 
                                onClick={() => handleSortTable(key, searchData)}
                                >
                                    {value.key}
                                    {(sortField === key) && (sortedDirection === -1) && `  ▲`}
                                    {(sortField === key) && (sortedDirection === 1) && `  ▼`}
                                </th>  
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {searchData.slice(15 * (currentPage - 1), 15 * currentPage).map((e: BaseElement, index) => (
                            <motion.tr 
                                key={`${e['id'].value[0]}`}
                                style={{
                                    height: '4.5vh',
                                    backgroundColor: 'AntiqueWhite',
                                   // border: '10px solid white',
                                }}
                                whileHover='hover'
                                initial={{
                                    opacity: 0,
                                    scale: 0.96,
                                    y: '10px',
                                }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    y: 0,
                                    transition: { duration: 0.5, delay: index * 0.03, type: "tween", stiffness: 400, damping: 40 }
                                }}
                                variants={{
                                    hover: {
                                        scale: 1.03,
                                        border: '2px solid grey',
                                        transition: { duration: 0.3 }
                                    }
                                }}
                            >
                                {userRole !== 'user' && 
                                <td style={{maxWidth: '40px'}}>   
                                    <Button variant='danger' key={e['id'].value[0]} onClick={() => handleDeleteElement(e)} style={{width: '30px', height: '30px', padding: '0'}}>X</Button>
                                </td>}
                                {Object.entries(e).map(([keys, val]) => (
                                    (val.inTable) &&
                                    <td key={keys} onClick={() => dispatch(showModalElement(true, e))} style={{cursor:'pointer'}}>
                                    {
                                        val.visableValue ? val.visableValue[0] : 
                                        (val.value.length > 1 ? `${val.value[0]} ...` : val.value[0])
                                    }
                                    </td>  
                                ))}
                            </motion.tr>
                        ))}
                    </tbody> 
                </table> 
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
            {(currentPage-3 >= 1) && <Pagination.First onClick={() => setCurrentPage(1)} />}
            {(currentPage-1 >= 1) && <Pagination.Prev onClick={() => setCurrentPage(currentPage-1)} />}
            {(currentPage-3 >= 1) && <Pagination.Ellipsis disabled />}

            {(currentPage-2 >= 1) && <Pagination.Item onClick={() => setCurrentPage(currentPage-2)}>{currentPage-2}</Pagination.Item>}
            {(currentPage-1 >= 1) && <Pagination.Item onClick={() => setCurrentPage(currentPage-1)}>{currentPage-1}</Pagination.Item>}
            <Pagination.Item active>{currentPage}</Pagination.Item>
            {(currentPage+1 <= lastPage) && <Pagination.Item onClick={() => setCurrentPage(currentPage+1)}>{currentPage+1}</Pagination.Item>}
            {(currentPage+2 <= lastPage) && <Pagination.Item onClick={() => setCurrentPage(currentPage+2)}>{currentPage+2}</Pagination.Item>}

            {(currentPage+3 <= lastPage) && <Pagination.Ellipsis disabled />}
            {(currentPage+1 <= lastPage) && <Pagination.Next onClick={() => setCurrentPage(currentPage+1)} />}
            {(currentPage+3 <= lastPage) && <Pagination.Last onClick={() => setCurrentPage(lastPage)} />}
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
                            return value.visableValue.find((str) => {
                                return str.toLowerCase().includes(searchValue.toLowerCase())
                            })
                        })
                    )
                } else {
                    return(
                        e[searchField].visableValue.find((str) => {
                            return str.toLowerCase().includes(searchValue.toLowerCase())
                        })
                    )
                }
            }))))
        else setSearchData(JSON.parse(JSON.stringify(data)))
    }, [searchValue, searchField])

    return(
        <InputGroup className='mx-2 mt-2' style={{width: 'calc(100% - 2rem)'}}>
            <InputGroup.Text id='search'>Поиск</InputGroup.Text>
            <Form.Control
                aria-label="Поиск"
                value={searchValue}
                onChange={(event: any) => setSearchValue(event.target.value)}
                style={{width: '50%'}}
            />
            <InputGroup.Text id='in'>в</InputGroup.Text>
            <Form.Select
                value={searchField}
                onChange={(event: any) => setSearchField(event.target.value)}
                style={{minWidth: '150px'}}
            >
                <option value={''}>любом</option>
                {Object.entries(data[0]).map(([key, value]) => 
                    value.inForm &&
                    key !== 'connectAssembling_Storage_Position' &&
                    key !== 'positions' &&
                    <option key={key} value={key}>{value.key}</option>
                )
                }
            </Form.Select>
        </InputGroup>
    )
}