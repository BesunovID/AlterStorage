import { useState } from "react";
import { ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { useAppDispatch } from "../../hooks/redux";
import { urlList } from "../../models/models";
import { showProductsTable } from "../../store/actions/tableActions";
import style from "../../styles/Workspace/MainMenu.module.scss"

export function MainMenu() {
    const dispatch = useAppDispatch();
    const [selectBtn, setButton] = useState(urlList.main)

    const handleChooseTable = (link: urlList) => {
        setButton(link);
        dispatch(showProductsTable(link));
    }
    return(
        <div className='main-manu col-md-2 p-0 pt-2 bg-light' style={{height: 'calc(100vh - 48px)'}}>
            <ToggleButtonGroup name='tables-btn-choose' className='w-100 border-none' type='radio' defaultValue={selectBtn} onChange={handleChooseTable} vertical>
                <ToggleButton id="main-btn-1" value={urlList.storage_positions} variant={selectBtn === 'storage_positions' ? "primary" : 'outline-dark'} className={style.button}>Складские позиции</ToggleButton>
                <ToggleButton id="main-btn-2" value={urlList.finished_product} variant={selectBtn === 'finished_product' ? "primary" : 'outline-dark'} className={style.button}>Готовые продукты</ToggleButton>
                <ToggleButton id="main-btn-3" value={urlList.write_down} variant={selectBtn === 'write_down' ? "primary" : 'outline-dark'} className={style.button}>Списания</ToggleButton>
                <ToggleButton id="main-btn-4" value={urlList.invoice_number} variant={selectBtn === 'invoice_number' ? "primary" : 'outline-dark'} className={style.button}>Накладные</ToggleButton>
                <ToggleButton id="main-btn-5" value={urlList.shelf} variant={selectBtn === 'shelf' ? "primary" : 'outline-dark'} className={style.button}>Полки</ToggleButton>
                <ToggleButton id="main-btn-6" value={urlList.rack} variant={selectBtn === 'rack' ? "primary" : 'outline-dark'} className={style.button}>Стеллажи</ToggleButton>
                <ToggleButton id="main-btn-7" value={urlList.assemblings} variant={selectBtn === 'assemblings' ? "primary" : 'outline-dark'} className={style.button}>Сборки</ToggleButton>
                <ToggleButton id="main-btn-8" value={urlList.FIO_emploeey} variant={selectBtn === 'FIO_emploeey' ? "primary" : 'outline-dark'} className={style.button}>Сотрудники</ToggleButton>
                <ToggleButton id="main-btn-9" value={urlList.provider} variant={selectBtn === 'provider' ? "primary" : 'outline-dark'} className={style.button}>Поставщики</ToggleButton>
            </ToggleButtonGroup>
        </div>
    )
}