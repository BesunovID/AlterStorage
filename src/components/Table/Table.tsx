import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { Button, Form, InputGroup, Pagination, Spinner } from 'react-bootstrap';
import { deleteElement, showModalElement, showProductsTable } from '../../store/actions/tableActions';
import { BaseElement } from '../../models/models';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import style from './Table.module.scss'
import searchImg from '../../public/search-icon.png'
import addImg from '../../public/add-button.png'
import refreshImg from '../../public/refrash-table.png'

export function Table() {
    const tableSelector = useAppSelector(state => state.tables);
    const userRole = useAppSelector(state => state.users.myProfile.role)
    const dispatch = useAppDispatch();

    const data = tableSelector.data; 
    const currentTable = tableSelector.currentUrl;
    const baseElement = tableSelector.emptyElement;
    const loading = tableSelector.loading;

    const countOnPage = 13;

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [sortField, setSortField] = useState('id');
    const [sortedDirection, setSortedDirection] = useState(1);
    const [searchData, setSearchData] = useState<BaseElement[]>(JSON.parse(JSON.stringify(data)));

    const animateButton = {
        tap: {
            scale: 0.95
        },
        hover: {
            rotate: 360,
            scale: 1.1,
        },
        exit: {
            scale: 1
        }
    }

    const animateVariants = {
        initial: {
            opacity: 0,
            y: '20px',
        },
        animate: (i: number) => ({
            opacity: 1,
            y: '0',
            transition: { duration: 0.5, delay: (i + 1) * 0.02 }
        }),
        hover: {
            backgroundColor: '#ffffff',
            transition: { duration: 0.5 },
        },
       /* exit: (i: number) => ({
            y: '-10px',
            opacity: 0,
            transition: { duration: 0.3, delay: i * 0.02, type: "tween", stiffness: 400, damping: 40 },
        }) */
    }

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
        <div className={style['table-main']}>
            {
                userRole !== 'user' && 
                <motion.button 
                    className={style['add-button']}
                    onClick={() => dispatch(showModalElement(true, baseElement))}  
                    whileTap='tap' 
                    whileHover='hover'
                    exit='exit'
                >
                    <motion.img 
                        src={addImg} 
                        variants={animateButton}
                    />
                </motion.button>
            }
            {
                data.length > 0 ?
                <>
                <div className={style['table-control']}>
                    <CustomSearch data={data} setSearchData={setSearchData} />
                    <motion.button
                        className={style['refresh-button']} 
                        onClick={() => dispatch(showProductsTable(currentTable))}
                        whileTap='tap' 
                        whileHover='hover' 
                        exit='exit'
                    >
                        <motion.img 
                            src={refreshImg} 
                            variants={animateButton}
                        />
                    </motion.button>
                </div>
                {
                    searchData.length > 0 ?
                    <div className={style['table-container']}>
                        <table className={style.table}>
                            <thead>
                                <tr>
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
                                    {userRole !== 'user' && <th style={{width: '60px'}}></th>}
                                </tr>
                            </thead>
                            <tbody>
                                {searchData.slice(countOnPage * (currentPage - 1), countOnPage * currentPage).map((e: BaseElement, index) => (
                                    <motion.tr 
                                        key={`${e['id'].value[0]}`}
                                        initial='initial'
                                        custom={index}
                                        animate='animate'
                                        whileHover='hover'
                                        exit='exit'
                                        variants={animateVariants}
                                    >
                                        {Object.entries(e).map(([keys, val]) => (
                                            (val.inTable) &&
                                            <td key={keys} onClick={() => dispatch(showModalElement(true, e))} style={{cursor:'pointer'}}>
                                            {
                                                val.visableValue ? val.visableValue[0] : 
                                                (val.value.length > 1 ? `${val.value[0]} ...` : val.value[0])
                                            }
                                            </td>  
                                        ))}
                                        {userRole !== 'user' && 
                                        <td style={{maxWidth: '40px'}}>   
                                            <Button variant='danger' key={e['id'].value[0]} onClick={() => handleDeleteElement(e)} style={{width: '30px', height: '30px', padding: '0'}}>X</Button>
                                        </td>}
                                    </motion.tr>
                                ))}
                                
                            </tbody> 
                        </table> 
                    </div> 
                    : <p className='my-3 mx-auto'>
                        По данному запросу результатов не найдено
                    </p>
                }
                {
                    searchData.length > countOnPage && 
                    <CustomPagination 
                        size={searchData.length} 
                        currentPage={currentPage} 
                        setCurrentPage={setCurrentPage} 
                        countOnPage={countOnPage}
                    />
                }
                </>
            : <div className="m-auto">Данные отсутствуют</div>
            }
        </div>
    )
}

const CustomPagination = (
    {size, currentPage, setCurrentPage, countOnPage}: 
    {size: number, currentPage: number, setCurrentPage: any, countOnPage: number}
    ) => {

    const lastPage = Math.ceil(size / countOnPage);

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
        <InputGroup className='mx-2 mt-2' style={{width: 'calc(100% - 1rem)'}}>
            <InputGroup.Text id='search'>
                <img src={searchImg} />
            </InputGroup.Text>
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