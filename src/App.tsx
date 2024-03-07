import { Routes, Route } from 'react-router-dom';
import './styles/App.css';
import { Main } from './pages/Main'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Storage } from './pages/Storage';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { UserProfile } from './pages/UserProfile';
import { Layout } from './components/Layout';

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
        </Routes>
      </Layout>
    </div>
  );
}

export default App;
