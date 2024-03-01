import React from "react"
import { Link } from "react-router-dom";
import { Particles } from "../components/Particles";
import { useAppDispatch } from "../hooks/redux"
import { IUser } from "../models/models";
import { register } from "../store/actions/authActions"
import style from '../styles/Register.module.scss'

export function Register() {
    const dispatch = useAppDispatch();

    const regEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    
    const loginSubmitHandler = (event: React.FormEvent) => {
        event.preventDefault();
        const form = new FormData(event.target as HTMLFormElement);
        if (form.get('password') !== form.get('passwordAccept')) {
            alert('Пароли не совпадают. Повторите')
        } else if (Object.keys(form.values()).map(e => e === null || ''))
            alert('Заполните все поля!')
        else if (!(form.get('email') as string).match(regEmail)) 
            alert('Неправильная почта!')
        else {
            const newUser: IUser = {
                username: form.get('username') as string,
                email: form.get('email') as string,
                first_name: form.get('first_name') as string,
                last_name: form.get('last_name') as string,
                password: form.get('password') as string,
                role: 'user'
            }
            dispatch(register(newUser));
            alert('Вы успешно зарегистрировались!')
            window.location.href = '/login'
        }
    }

    const event = (e: React.FormEvent) => {
        e.preventDefault()
    }

    return(
        <div className={style.registerContainer}>
            <div className={style.register}>
                <div className={style.createAccount}>
                    <p>Создание нового аккаунта</p> 
                </div>
                <form
                    className={style.mainForm}
                    onSubmit={loginSubmitHandler}
                    autoComplete={'off'}
                >
                    <div className={style.formField}>
                        <label htmlFor="username">Логин</label>
                        <input type="text" id='username' name='username' minLength={1} 
                            maxLength={150} placeholder='Введите имя пользователя...' 
                            pattern="^[\w.@+-]+$" onChange={event}/>
                    </div>
                    
                    <div className={style.formField}>
                        <label htmlFor="email">Почта</label>
                        <input type="text" id='email' name='email' minLength={1} 
                            maxLength={254} placeholder='Введите ваш email...' onChange={event}/>
                    </div>

                    <div className={style.formField}>
                        <label htmlFor="first_name">Имя</label>
                        <input type="text" id='first_name' name='first_name'
                            maxLength={150} onChange={event}/>
                    </div>

                    <div className={style.formField}>
                        <label htmlFor="last_name">Фамилия</label>
                        <input type="text" id='last_name' name='last_name'
                            maxLength={150} onChange={event}/>
                    </div>

                    <div className={style.formField}>
                        <label htmlFor="password">Пароль</label>
                        <input type="text" id='password' name='password'
                            minLength={1} maxLength={150} onChange={event}/>
                    </div>

                    <div className={style.formField}>
                        <label htmlFor="passwordAccept">Подтвердите пароль</label>
                        <input type="text" id='passwordAccept' name='passwordAccept'
                            minLength={1} maxLength={150} onChange={event}/>
                    </div>

                    <button type="submit">Зарегистрироваться</button>
                </form>
                <div className={style.haveAccount}>
                    <p>Уже есть аккаунт?</p>
                    <button>
                        <Link to='/login'>
                            Войти
                        </Link>
                    </button>
                </div>
                <Particles /> 
            </div>
        </div>
    )
}