import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { showModalElement } from '../../../store/actions/productsAction';
import BootstrapTable, { PageListRendererOptions, SelectRowProps } from 'react-bootstrap-table-next'
import paginationFactory, { PaginationListStandalone, PaginationProvider } from 'react-bootstrap-table2-paginator';
import { IProduct } from '../../../models/models';
import style from '../../../styles/Layout/Workspace/TableData.module.scss'
import { Button, ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';


export function TableData2() {
    const data = useAppSelector(state => state.tables.data);
    const dispatch = useAppDispatch();

    const selectRowProps: SelectRowProps<any> = {
        mode: 'checkbox',
    }
    const rowEvents = {
        onClick: (e: Object, row: IProduct, rowIndex: Number) => {
            dispatch(showModalElement(true, row))
        }
    }

    const paginationOptions = {
        custom: true,
        totalSize: data.length,
        pageListRenderer: pageListRenderer as unknown as (options: PageListRendererOptions) => Element,
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
        ]
    }
    const columns = [{
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
                        <Pagination params = {paginationProps} />
                    </>
                )}
            </PaginationProvider>
        </>
    )
}

export function Pagination(params: any) {

    const selectSizeTable = (page: number, onSizePerPageChange: Function, newSize: number) => {
        onSizePerPageChange(newSize, page)
    }
    const selectPage = (page: number, onPageChange: Function) => {
        onPageChange(page)
    }
    const props = params.params;
    console.log(props)
    return(
        <div className="col-md-10">
            <DropdownButton id="dropdown-sizePerPage" className='col-md-1' variant="primary" title={props.sizePerPage}>
                <Dropdown.Item 
                    as="button"
                    onClick={() => selectSizeTable(props.page as number, props.onSizePerPageChange as Function, 15 as number)}
                >
                    15
                </Dropdown.Item>
                <Dropdown.Item 
                    as="button"
                    onClick={() => selectSizeTable(props.page as number, props.onSizePerPageChange as Function, 30 as number)}
                >
                    30
                </Dropdown.Item>
                <Dropdown.Item 
                    as="button"
                    onClick={() => selectSizeTable(props.page as number, props.onSizePerPageChange as Function, 50 as number)}
                >
                    50
                </Dropdown.Item>
            </DropdownButton>

            <ButtonGroup className='col-md-9'>
                {(props.page > props.pageStartIndex) && 
                <Button onClick={() => selectPage(props.pageStartIndex as number, props.onPageChange as Function)}>
                    {props.pageStartIndex}
                </Button>}
                {(props.page - 3 > props.pageStartIndex) && 
                    <Button disabled>
                        ...
                    </Button>
                }
                {(props.page - 2 > props.pageStartIndex) && 
                <Button onClick={() => selectPage((props.page - 2) as number, props.onPageChange as Function)}>
                    {props.page - 2}
                </Button>}
               {(props.page - 1 > props.pageStartIndex) && 
                <Button onClick={() => selectPage((props.page - 1) as number, props.onPageChange as Function)}>
                    {props.page - 1}
                </Button>}
                <Button disabled>
                    {props.page}
                </Button>
                {(props.page + 1 < props.paginationSize) && 
                <Button onClick={() => selectPage((props.page + 1) as number, props.onPageChange as Function)}>
                    {props.page + 1}
                </Button>}
                {(props.page + 2 < props.paginationSize) && 
                <Button onClick={() => selectPage((props.page + 2) as number, props.onPageChange as Function)}>
                    {props.page + 2}
                </Button>}
                {(props.page + 3 < props.paginationSize) && 
                    <Button disabled>
                        ...
                    </Button>
                }
                {(props.page < props.paginationSize) && 
                <Button onClick={() => selectPage(props.paginationSize as number, props.onPageChange as Function)}>
                    {props.paginationSize}
                </Button>}
            </ButtonGroup>
            {
            //<PaginationListStandalone {...props} className='col-md-9'/>
            }
        </div>
    )
}

const pageListRenderer = (pages: any, onPageChange: any): (options: PageListRendererOptions) => Element => {
    console.log(pages)
    return(
        <div className="1">
        </div>
    );
  };


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