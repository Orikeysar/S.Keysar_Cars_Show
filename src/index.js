import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import AdminAddCars from './components/AdminAddCars';
import Login from './components/Login';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const RootComponent = () => {
  return (
    <Router>
      <Routes>
        <Route path="/AdminAddCars" element={<AdminAddCars />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<App/>} />
        <Route path="*" element={<App/>} />
      </Routes>
    </Router>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<RootComponent />);
