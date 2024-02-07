import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './styles/App.css';
import { Main } from './pages/Main'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Products } from './pages/Products';
import { Requests } from './pages/Requests';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/products' element={<Products />} />
        <Route path='/requests' element={<Requests />} />
      </Routes>
    </div>
  );
}

export default App;
