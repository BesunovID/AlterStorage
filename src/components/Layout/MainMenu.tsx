import { Stack, Button, ButtonGroup } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import { useAppDispatch } from "../../hooks/redux";
import { showProductsTable } from "../../store/actions/productsAction";


export function MainMenu() {
    const dispatch = useAppDispatch();

    const OnClickHandler = (link: string) => {
        <Link to={'/'+link}></Link>
        if (link == 'products') dispatch(showProductsTable());
    }
    return(
        <>
        {/*}  <Stack gap={3} className='col-md-2 p-2'>
                <Button variant="primary" active>Something 1</Button>
                <Button variant="light">Something 2</Button>
                <Button variant="light">Something 3</Button>
            </Stack> {*/}
            <ButtonGroup className='col-md-2 p-0 pt-2' vertical>
                <Button variant="primary" onClick={() => OnClickHandler('products')} active>Something 1</Button>
                <Button variant="light" onClick={() => OnClickHandler('requests')}>Something 2</Button>
                <Button variant="light" onClick={() => OnClickHandler('data3')}>Something 3</Button>
            </ButtonGroup>
        </>
    )
}