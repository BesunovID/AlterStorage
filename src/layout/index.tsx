import style from './Layout.module.scss'
import { Header } from './Header'
import { Toasts } from '../components/Toasts/toasts'

interface LayoutProps {
    children: React.ReactNode
}

export function Layout(props: LayoutProps) {
    return(
        <div className={style.container}>
            <Header />
            {props.children}
            <Toasts />
        </div>
    )
}