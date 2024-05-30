import { motion } from "framer-motion";
import { useState } from "react";
import { Form } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { urlList } from "../../models/models";
import { showProductsTable } from "../../store/actions/tableActions";
import style from './Menu.module.scss'
import arrow from '../../public/button-arrow.png'

export function Menu() {
    const dispatch = useAppDispatch();
    const loading = useAppSelector(state => state.tables.loading);
    const [selectBtn, setButton] = useState('');

    const MenuItemImgAnimation = {
        'initial': {
            opacity: 0,
            x: -40,
        },
        'hover': {
            opacity: 1,
            x: 0,
            transition: { delay: 0.1, duration: 0.3, type: 'spring', damping: 8, mass: 0.5 },
        },
        'exit': {
            opacity: 0,
            x: -40,
            transition: { duration: 0.1 },
        }
    }

    const MenuItemTextAnimation = {
        'initial': {
            x: -40,
        },
        'hover': {
            x: 0,
            transition: { duration: 0.3, type: 'spring', damping: 8, mass: 0.5 },
        },
        'exit': {
            x: -40,
            transition: { duration: 0.1 },
        }
    }

    const handleChooseTable = (link: string) => {
        setButton(link);
        dispatch(showProductsTable(link));
    }

    return(
        <>
            <motion.div layout className={`${style.menu} && d-sm-block d-none col-sm-3 col-md-2`}>
                {Object.entries(urlList).map(([url, table], index) => 
                    url !== 'main' && 
                    <motion.button 
                        key={index}
                        onClick={() => handleChooseTable(url)}
                        disabled={loading}
                        className={selectBtn === url 
                            ? style['menu-item-active']
                            : style['menu-item']}
                        initial='initial'
                        exit='exit'
                        whileHover={selectBtn !== url ? 'hover' : 'initial'}
                    >
                        <motion.img 
                            className={style['menu-item-img']} 
                            src={arrow} 
                            variants={MenuItemImgAnimation}
                        />
                        <motion.span 
                            className={style['menu-item-text']}
                            variants={MenuItemTextAnimation}
                        >
                            {table}
                        </motion.span>
                    </motion.button>
                )}

            </motion.div>
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