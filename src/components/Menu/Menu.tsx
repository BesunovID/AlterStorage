import { motion } from "framer-motion";
import { useState } from "react";
import { Form } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { urlList } from "../../models/models";
import { showProductsTable } from "../../store/actions/tableActions";

export function Menu() {
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
                {Object.entries(urlList).map(([url, table], index) => 
                    url !== 'main' && 
                    <motion.button 
                        key={index}
                        id={`main-table-${index}`}
                        value={url}
                        onClick={() => handleChooseTable(url)}
                        disabled={loading}
                        className={selectBtn === url ? 
                            "btn btn-primary w-100 mx-2 my-1 border-none rounded-0 text-start py-0" : 
                            'btn btn-light w-100 mx-2 my-1 border-none rounded-0 text-start py-0'}
                        style={{height: '50px', position: 'relative',}}
                        whileHover='hover'
                    >
                        {table}
                    </motion.button>
                )}

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