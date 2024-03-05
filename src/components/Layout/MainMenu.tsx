import { useState } from "react";
import { ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { useAppDispatch } from "../../hooks/redux";
import { urlList } from "../../models/models";
import { showProductsTable } from "../../store/actions/tableAction";


export function MainMenu() {
    const dispatch = useAppDispatch();
    const [selectBtn, setButton] = useState(urlList.main)

    const handleChooseTable = (link: urlList) => {
        setButton(link);
        dispatch(showProductsTable(link));
    }
    return(
        <>
            <ToggleButtonGroup name='tables-btn-choose' className='col-md-2 p-0 pt-2 h-100' type='radio' defaultValue={selectBtn} onChange={handleChooseTable} vertical>
                <ToggleButton id="main-btn-1" value={urlList.storage_positions} variant={selectBtn === 'storage_positions' ? "primary" : 'light'}>Storage Positions</ToggleButton>
                <ToggleButton id="main-btn-2" value={urlList.finished_product} variant={selectBtn === 'finished_product' ? "primary" : 'light'}>Готовые продукты</ToggleButton>
                <ToggleButton id="main-btn-3" value={urlList.shelf} variant={selectBtn === 'shelf' ? "primary" : 'light'}>Shels</ToggleButton>
                <ToggleButton id="main-btn-4" value={urlList.assemblings} variant={selectBtn === 'assemblings' ? "primary" : 'light'}>Сборки (assemblings)</ToggleButton>
            </ToggleButtonGroup>
        </>
    )
}