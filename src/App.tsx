import { Routes, Route, useLocation } from 'react-router-dom';
import './styles/App.css';
import { Main } from './pages/Main'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Storage } from './pages/Storage';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { MyProfile } from './pages/MyProfile';
import { Layout } from './layout';
import { Admin } from './pages/Admin';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { useEffect } from 'react';
import { getProfile } from './store/actions/usersActions';
import { AnimatePresence } from 'framer-motion';

function App() {
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector(state => state.auth.isAuth);
  const myProfile = useAppSelector(state => state.users.myProfile);

  const location = useLocation();

  useEffect(() => {
    isAuth && myProfile.id === -1 && dispatch(getProfile())
  }, [isAuth])

  return (
    <div className="App">
      <Layout>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.key}>
            <Route path='/' element={<Main />} />
            <Route path='/login' element={<Login />} />
            <Route path='/registration' element={<Register />} />
            <Route path='/profile' element={<MyProfile />} />
            <Route path='/storage' element={<Storage />} />
            <Route path='/admin' element={<Admin />} />
          </Routes>
        </AnimatePresence>
      </Layout>
    </div>
  );
}

export default App;
