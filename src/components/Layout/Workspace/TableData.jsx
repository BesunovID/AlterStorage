import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { showModalElement } from '../../../store/actions/productsAction';
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory, { PaginationProvider, PaginationListStandalone, SizePerPageDropdownStandalone } from 'react-bootstrap-table2-paginator';
import style from '../../../styles/Layout/Workspace/TableData.module.scss'
import { Button, ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';


export function TableData() {
    const data = useAppSelector(state => state.tables.data);
    const dispatch = useAppDispatch();

    const selectRowProps = {
        mode: 'checkbox',
    }
    const rowEvents = {
        onClick: (e, row, rowIndex) => {
            dispatch(showModalElement(true, row))
        }
    }

    const paginationOptions = {
        custom: true,
        totalSize: data.length,
        pageListRenderer,
        sizePerPageRenderer,
        sizePerPage: 15,
        sizePerPageList: [
            {
                text: '15', value: 15
            }, 
            {
                text: '30', value: 30
            }, 
            {
                text: '50', value: 50
            }
        ],
    }
    const columns = [
        {
            dataField: 'id',
            text: 'Product ID',
            sort: true
        }, {
            dataField: 'name',
            text: 'Product Name',
            sort: true
        }, {
            dataField: 'price',
            text: 'Product Price',
            sort: true
        }, {
            dataField: 'date',
            text: 'Дата',
            sort: true
        }
    ]

    return(
        <>
            {
               /* <BootstrapTable 
                    keyField='id' 
                    data={ data } 
                    columns = { columns } 
                    selectRow = { selectRowProps } 
                    rowEvents={ rowEvents }
                    rowClasses={ style.tableRow }
                    hover = { true }
                    pagination={ paginationFactory(paginationOptions) }
                />  */
                <PaginationProvider pagination={paginationFactory(paginationOptions)}>
                {({paginationProps, paginationTableProps}) => (
                    <>
                        <BootstrapTable 
                            {...paginationTableProps}
                            keyField='id' 
                            data={ data } 
                            columns = { columns } 
                            selectRow = { selectRowProps } 
                            rowEvents={ rowEvents }
                            rowClasses={ style.tableRow }
                            hover = { true }
                        />
                        <div className='col-md-10'>
                            <div className="col-md-2">
                                <SizePerPageDropdownStandalone
                                    { ...paginationProps }
                                />
                            </div>
                            <div className="col-md-6">
                            </div>
                        </div>
                       
                    </>
                )}
            </PaginationProvider> 
                /*<PaginationProvider pagination={paginationFactory(paginationOptions)}>
                {({paginationProps, paginationTableProps}) => (
                    <>
                        <BootstrapTable 
                            {...paginationTableProps}
                            keyField='id' 
                            data={ data } 
                            columns = { columns } 
                            selectRow = { selectRowProps } 
                            rowEvents={ rowEvents }
                            rowClasses={ style.tableRow }
                            hover = { true }
                        />
                        <Pagination params = {paginationProps} />
                    </>
                )}
            </PaginationProvider> */}
        </>
    )
}

const pageListRenderer = ({pages, onPageChange}) => {
    const pagesList = pages.filter(p => typeof p.page !== 'string')
    console.log(pages)
    return(
        <ButtonGroup className='col-md-6'>
            {pages.find(p => p.page === '<<') && 
            <Button onClick={() => onPageChange('<<')}>
                {'Первая'}
            </Button>}

            {pagesList.map((p) => (
                <Button disabled={p.active} onClick={() => onPageChange(p.page)}>
                    {p.page === '>>' ? pages.length - 1 : p.title}
                </Button>
            ))}

            {pages.find(p => p.page === '>>')  &&
            <Button onClick={() => onPageChange('>>')}>
                {'Последняя'}
            </Button>}
        </ButtonGroup>
    )
};

const sizePerPageRenderer = ({options, currSizePerPage, onSizePerPageChange}) => {
    return(
        <DropdownButton className='col-md-1' variant="primary" title={currSizePerPage}>
            {options.map(option => (
                <Dropdown.Item 
                    as="button"
                    onClick={() => onSizePerPageChange(option.page)}
                    variant='primary'
                    disabled={currSizePerPage === `${option.page}` ? true : false}
                >
                    {option.text}
                </Dropdown.Item>
            ))}
        </DropdownButton>
    )
};

/*
export function Pagination(params) {
    const props = params.params;
    const pageList = props.totalSize / props.sizePerPage
    console.log(props)
    return(
        <div className="col-md-10">
            <DropdownButton id="dropdown-sizePerPage" className='col-md-1' variant="primary" title={props.sizePerPage}>
                {props.sizePerPageList.map(e => 
                    <Dropdown.Item 
                        as="button"
                        onClick={() =>{
                            props.onPageChange(props.page, e.value)
                            props.onSizePerPageChange(e.value, props.page)
                        }}
                    >
                        {e.text}
                    </Dropdown.Item>
                )}
            </DropdownButton>

            {<ButtonGroup className='col-md-9'>
                {(props.page > props.pageStartIndex) && 
                    <Button onClick={() => props.onPageChange(1)}>
                    {props.pageStartIndex}
                </Button>}
                {(props.page - 3 > props.pageStartIndex) && 
                    <Button disabled>
                        ...
                    </Button>
                }
                {(props.page - 2 > props.pageStartIndex) && 
                <Button onClick={() => props.onPageChange(props.page - 2)}>
                    {props.page - 2}
                </Button>}
               {(props.page - 1 > props.pageStartIndex) && 
                <Button onClick={() => props.onPageChange(props.page - 1)}>
                    {props.page - 1}
                </Button>}
                <Button disabled>
                    {props.page}
                </Button>
                {(props.page + 1 < props.paginationSize) && 
                <Button onClick={() => props.onPageChange(props.page + 1)}>
                    {props.page + 1}
                </Button>}
                {(props.page + 2 < props.paginationSize) && 
                <Button onClick={() => props.onPageChange(props.page + 2)}>
                    {props.page + 2}
                </Button>}
                {(props.page + 3 < props.paginationSize) && 
                    <Button disabled>
                        ...
                    </Button>
                }
                {(props.page < props.paginationSize) && 
                <Button onClick={() => props.onPageChange(props.paginationSize)}>
                    {props.paginationSize}
                </Button>}
            </ButtonGroup> }
            {
            //<PaginationListStandalone {...props} className='col-md-9'/>
            }
        </div>
    )
} */




/*
export function TableDataCastom() {
    const tableSelector = useAppSelector(state => state.tables);
    const dispatch = useAppDispatch();

    const data = tableSelector.data;

    return(
        <Table striped bordered hover>
            <thead>
                <tr>
                    {(Object.keys(data[0]) as Array<keyof typeof data[0]>).map((e) => (
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
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((e) => (
                    <tr key={e.id}>
                        {Object.values(e).map((val) => (
                            <td key={val}>{val}</td>
                        ))}
                    </tr>
                ))}
            </tbody> 
        </Table>
    )
}

*/