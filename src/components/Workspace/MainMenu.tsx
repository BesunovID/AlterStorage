import { useState } from "react";
import { Form, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { urlList } from "../../models/models";
import { showProductsTable } from "../../store/actions/tableActions";
import style from "../../styles/Workspace/MainMenu.module.scss"

export function MainMenu() {
    const dispatch = useAppDispatch();
    const loading = useAppSelector(state => state.tables.loading);
    const [selectBtn, setButton] = useState(urlList.main);

    const handleChooseTable = (link: urlList) => {
        setButton(link);
        dispatch(showProductsTable(link));
    }
    return(
        <>
            <div className='main-manu d-sm-block d-none col-sm-3 col-md-2 p-0 bg-light' style={{height: 'calc(100vh - 58px)'}}>
                <ToggleButtonGroup name='tables-btn-choose' className='w-100 pt-2 border-none' type='radio' defaultValue={selectBtn} onChange={handleChooseTable} vertical>
                    <ToggleButton id="main-btn-1" value={urlList.storage_positions} disabled={loading} variant={selectBtn === 'storage_positions' ? "primary" : 'outline-dark'} className={style.button}>Складские позиции</ToggleButton>
                    <ToggleButton id="main-btn-2" value={urlList.finished_product} disabled={loading} variant={selectBtn === 'finished_product' ? "primary" : 'outline-dark'} className={style.button}>Готовые продукты</ToggleButton>
                    <ToggleButton id="main-btn-3" value={urlList.write_down} disabled={loading} variant={selectBtn === 'write_down' ? "primary" : 'outline-dark'} className={style.button}>Списания</ToggleButton>
                    <ToggleButton id="main-btn-4" value={urlList.invoice_number} disabled={loading} variant={selectBtn === 'invoice_number' ? "primary" : 'outline-dark'} className={style.button}>Накладные</ToggleButton>
                    <ToggleButton id="main-btn-5" value={urlList.shelf} disabled={loading} variant={selectBtn === 'shelf' ? "primary" : 'outline-dark'} className={style.button}>Полки</ToggleButton>
                    <ToggleButton id="main-btn-6" value={urlList.rack} disabled={loading} variant={selectBtn === 'rack' ? "primary" : 'outline-dark'} className={style.button}>Стеллажи</ToggleButton>
                    <ToggleButton id="main-btn-7" value={urlList.assemblings} disabled={loading} variant={selectBtn === 'assemblings' ? "primary" : 'outline-dark'} className={style.button}>Сборки</ToggleButton>
                    <ToggleButton id="main-btn-8" value={urlList.FIO_emploeey} disabled={loading} variant={selectBtn === 'FIO_emploeey' ? "primary" : 'outline-dark'} className={style.button}>Сотрудники</ToggleButton>
                    <ToggleButton id="main-btn-9" value={urlList.provider} disabled={loading} variant={selectBtn === 'provider' ? "primary" : 'outline-dark'} className={style.button}>Поставщики</ToggleButton>
                </ToggleButtonGroup>
            </div>
            <div className="d-sm-none d-block p-2">
                <Form.Select onChange={(value) => handleChooseTable(value.target.value as urlList)} aria-label="Default select example">
                    <option value={urlList.main}>Выберите таблицу...</option>
                    <option value={urlList.storage_positions}>Складские позиции</option>
                    <option value={urlList.finished_product}>Готовые продукты</option>
                    <option value={urlList.write_down}>Списания</option>
                    <option value={urlList.invoice_number}>Накладные</option>
                    <option value={urlList.shelf}>Полки</option>
                    <option value={urlList.rack}>Стеллажи</option>
                    <option value={urlList.assemblings}>Сборки</option>
                    <option value={urlList.FIO_emploeey}>Сотрудники</option>
                    <option value={urlList.provider}>Поставщики</option>
                </Form.Select>
            </div>
        </>
    )
}