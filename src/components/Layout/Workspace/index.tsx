import { Stack } from 'react-bootstrap'
import { useAppSelector } from '../../../hooks/redux';
import { Filter } from './Filter'
import { ModalWindow } from './ModalWindow';
import { TableData } from './TableData'

export function Workspace() {
    const isOpen = useAppSelector(state => state.tables.tableIsOpen);
    return(
        <Stack className='col-md-10 p-0'>
            {isOpen &&
                <>
                    <Filter />
                    <TableData />
                    <ModalWindow />
                </>
            }
        </Stack>
    )
}