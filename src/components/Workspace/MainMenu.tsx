import { useState } from "react";
import { ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { useAppDispatch } from "../../hooks/redux";
import { urlList } from "../../models/models";
import { deleteElement, showProductsTable } from "../../store/actions/tableActions";


export function MainMenu() {
    const dispatch = useAppDispatch();
    const [selectBtn, setButton] = useState(urlList.main)

    const handleChooseTable = (link: urlList) => {
        if (link === 'storage_positions') {
           // dispatch(deleteElement(8, link))
        }
        setButton(link);
        dispatch(showProductsTable(link));
    }
    return(
        <ToggleButtonGroup name='tables-btn-choose' className='col-md-2 p-0 pt-2 h-100' type='radio' defaultValue={selectBtn} onChange={handleChooseTable} vertical>
            <ToggleButton id="main-btn-1" value={urlList.storage_positions} variant={selectBtn === 'storage_positions' ? "primary" : 'light'}>Складские позиции</ToggleButton>
            <ToggleButton id="main-btn-2" value={urlList.finished_product} variant={selectBtn === 'finished_product' ? "primary" : 'light'}>Готовые продукты</ToggleButton>
            <ToggleButton id="main-btn-3" value={urlList.write_down} variant={selectBtn === 'write_down' ? "primary" : 'light'}>Списания</ToggleButton>
            <ToggleButton id="main-btn-4" value={urlList.invoice_number} variant={selectBtn === 'invoice_number' ? "primary" : 'light'}>Накладные</ToggleButton>
            <ToggleButton id="main-btn-5" value={urlList.shelf} variant={selectBtn === 'shelf' ? "primary" : 'light'}>Полки</ToggleButton>
            <ToggleButton id="main-btn-6" value={urlList.rack} variant={selectBtn === 'rack' ? "primary" : 'light'}>Стеллажи</ToggleButton>
            <ToggleButton id="main-btn-7" value={urlList.assemblings} variant={selectBtn === 'assemblings' ? "primary" : 'light'}>Сборки</ToggleButton>
            <ToggleButton id="main-btn-8" value={urlList.FIO_emploeey} variant={selectBtn === 'FIO_emploeey' ? "primary" : 'light'}>Сотрудники</ToggleButton>
            <ToggleButton id="main-btn-9" value={urlList.provider} variant={selectBtn === 'provider' ? "primary" : 'light'}>Поставщики</ToggleButton>
        </ToggleButtonGroup>
    )
}