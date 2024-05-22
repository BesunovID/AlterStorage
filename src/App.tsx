import { Routes, Route, Navigate, useRoutes, useLocation } from 'react-router-dom';
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
import { AnimatePresence } from 'framer-motion';
import React from 'react';

function App() {
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector(state => state.auth.isAuth);
  const myProfile = useAppSelector(state => state.users.myProfile);
  
  const routs = useRoutes([
    {
      path: '/', 
      element: <Main /> 
    },
    {
      path: '/login', 
      element: <Login /> 
    },
    {
      path: '/registration', 
      element: <Register /> 
    },
    {
      path: '/profile', 
      element: <UserProfile /> 
    },
    {
      path: '/storage', 
      element: <Storage /> 
    },
    {
      path: '/admin', 
      element: <AdminPanel /> 
    },
  ]);

  const location = useLocation();

  useEffect(() => {
    isAuth && myProfile.id === -1 && dispatch(getProfile())
  }, [isAuth])

  if (!routs) return null;

  return (
    <div className="App">
      <Layout>
      <AnimatePresence mode="wait">
        {React.cloneElement(routs, { key: location.pathname })}
      </AnimatePresence>
        {/*<Routes>
          <Route path='/' element={<Main />} />
          <Route path='/login' element={<Login />} />
          <Route path='/registration' element={<Register />} />
          <Route path='/profile' element={<UserProfile />} />
          <Route path='/storage' element={<Storage />} />
          <Route path='/admin' element={<AdminPanel />} />
  </Routes>*/}
      </Layout>
    </div>
  );
}

export default App;
