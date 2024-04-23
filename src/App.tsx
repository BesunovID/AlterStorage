import { Routes, Route, Navigate } from 'react-router-dom';
import './styles/App.css';
import { Main } from './pages/Main'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Storage } from './pages/Storage';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { UserProfile } from './pages/UserProfile';
import { Layout } from './components/Layout';
import { AdminPanel } from './pages/AdminPanel';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { useEffect, useState } from 'react';
import { getProfile } from './store/actions/usersActions';

function App() {
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector(state => state.auth.isAuth);
  const myProfile = useAppSelector(state => state.users.myProfile);

  useEffect(() => {
    isAuth && myProfile.id === -1 && dispatch(getProfile())
  }, [isAuth])

  return (
    <div className="App">
      <Layout>
        <Routes>
          <Route path='/' element={<Main />} />
          <Route path='/login' element={<Login />} />
          <Route path='/registration' element={<Register />} />
          <Route path='/profile' element={<UserProfile />} />
          <Route path='/storage' element={<Storage />} />
          <Route path='/admin' element={<AdminPanel />} />
        </Routes>
      </Layout>
    </div>
  );
}

export default App;
