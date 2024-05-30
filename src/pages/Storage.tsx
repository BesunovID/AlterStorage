import { Navigate } from "react-router-dom"
import { Form } from "../components/Modal"
import { Table } from "../components/Table/Table"
import { Menu } from "../components/Menu/Menu"
import { useAppSelector } from "../hooks/redux"
import style from '../styles/Storage.module.scss'

export function Storage() {
    const isAuth = useAppSelector(state => state.auth.isAuth)

    if (!isAuth) {
        return <Navigate to='/login' />
    }

    return(
        <div className={`${style['storage-container']} flex-column flex-sm-row`}>
            <Menu />
            <div className={`${style['table-workspace']} col-sm-9 col-md-10`}>
                <Table />
                <Form />
            </div>
        </div>
    )
}