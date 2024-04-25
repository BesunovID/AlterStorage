import { useState } from "react";
import { Form, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { urlList } from "../../models/models";
import { showProductsTable } from "../../store/actions/tableActions";
import style from "../../styles/Workspace/MainMenu.module.scss"

export function MainMenu() {
    const dispatch = useAppDispatch();
    const loading = useAppSelector(state => state.tables.loading);
    const [selectBtn, setButton] = useState('');

    const handleChooseTable = (link: string) => {
        setButton(link);
        dispatch(showProductsTable(link));
    }
    return(
        <>
            <div className='main-manu d-sm-block d-none col-sm-3 col-md-2 p-0 bg-light' style={{height: 'calc(100vh - 58px)'}}>
                <ToggleButtonGroup name='tables-btn-choose' className='w-100 pt-2 border-none' type='radio' defaultValue={selectBtn} onChange={handleChooseTable} vertical>
                    {Object.entries(urlList).map(([url, table], index) => 
                        url !== 'main' && 
                        <ToggleButton 
                            key={index}
                            id={`main-table-${index}`}
                            value={url}
                            disabled={loading}
                            variant={selectBtn === url ? "primary" : 'outline-dark'}
                            className={style.button}
                        >
                            {table}
                        </ToggleButton>
                    )}
                  
                </ToggleButtonGroup>
            </div>
            <div className="d-sm-none d-block p-2">
                <Form.Select onChange={(value) => handleChooseTable(value.target.value as urlList)} aria-label="Default select example">
                    <option value={urlList.main}>Выберите таблицу...</option>
                    {Object.entries(urlList).map(([url, table], index) => 
                        url !== 'main' && 
                        <option key={index} value={url}>{table}</option>
                    )}
                </Form.Select>
            </div>
        </>
    )
}