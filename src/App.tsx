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
import { useAppSelector } from './hooks/redux';
import { useEffect } from 'react';

function App() {
  
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
