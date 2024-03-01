import { useAppSelector } from '../../../hooks/redux';
import { Filter } from './Filter'
import { ModalWindow } from './Modal';
import { TableData } from './TableData'

export function Workspace() {
    const isOpen = useAppSelector(state => state.tables.tableIsOpen);
    return(
        <div className='d-flex flex-column align-items-start col-md-10 p-0'>
            {isOpen &&
                <>
                    <Filter />
                    <TableData />
                    <ModalWindow />
                </>
            }
        </div>
    )
}