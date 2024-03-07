import { Container, Row } from 'react-bootstrap';
import { useAppSelector } from '../../hooks/redux';
import { Filter } from './Filter'
import { MainMenu } from './MainMenu';
import { ModalWindow } from './Modal';
import { TableData } from './TableData'

export function Workspace() {
    const isOpen = useAppSelector(state => state.tables.tableIsOpen);
    return(
        <Container fluid className={'flex-md-grow-1'}>
            <Row className={''}>
                <MainMenu />
                <div className='d-flex flex-column align-items-start col-md-10 p-0'>
                    {isOpen &&
                        <>
                            <Filter />
                            <TableData />
                            <ModalWindow />
                        </>
                    }
                </div>
            </Row>
        </Container>
    )
}