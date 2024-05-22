import { motion } from "framer-motion";
import { Navigate } from "react-router-dom"
import { useAppSelector } from "../hooks/redux"


export function Main() {
    const isAuth = useAppSelector(state => state.auth.isAuth);
    
    const visible = { opacity: 1, y: 0, transition: { duration: 0.5 }};

    if (!isAuth) {
        return <Navigate to='/login' />
    }
    
    return(
        <motion.div 
            className="main"
            initial='hidden'
            animate='visable'
            exit={{ opacity: 0, transition: { duration: 1 } }}
            variants={{ visible: { transition: { staggerChildren: 0.3 } } }}
        >

        </motion.div>
    )
}