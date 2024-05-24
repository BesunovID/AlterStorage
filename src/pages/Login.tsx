import React from "react"
import { Link, useNavigate } from "react-router-dom";
import { Particles } from "../components/Particles/particles";
import { useAppDispatch } from "../hooks/redux";
import { login } from "../store/actions/authActions";
import style from '../styles/Auth.module.scss'

export function Login() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const loginSubmitHandler = (event: React.FormEvent) => {
        event.preventDefault()
        
        const form = new FormData(event.target as HTMLFormElement);
        dispatch(login(form.get('username') as string, form.get('password') as string))
        .then((res) => {
            switch(res){
                case 'success': 
                    navigate('/');
                    break
                case 'non_field_errors':
                    alert('Не верные данные')
                    break
                case 'server_errors':
                    alert('Ошибка сервера. Попробуйте позже')
                    break
            }
        })
    }

    return(
        <div className={style.loginContainer}>
            <div className={style.login}>
                <div className={style.loginHeader}>
                    <p>Авторизация</p> 
                </div>
                <form
                    className={style.mainForm}
                    onSubmit={loginSubmitHandler}
                    autoComplete={'off'}
                >
                    <div className={style.formField}>
                        <label htmlFor="username">Логин</label>
                        <input type="text" name='username'/>
                    </div>
                    <div className={style.formField}>
                        <label htmlFor="password">Пароль</label>
                        <input type="password" name='password'/>
                    </div>
                    <button type="submit">
                        Войти
                    </button>
                </form>
                <div className={style.noAccount}>
                    <p>Нет аккаунта?</p>
                    <button className={style['reg-btn']}>
                        <Link to='/registration'>
                            Зарегистрироваться
                        </Link>
                    </button>
                </div>
                
            </div>
            <Particles /> 
        </div>
    )
}
