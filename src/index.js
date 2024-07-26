// src/index.js
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import AdminAddCars from './components/AdminAddCars';
import Login from './components/Login';
import './index.css';

const getIsAuthenticated = () => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

const PrivateRoute = ({ element }) => {
  return getIsAuthenticated() ? element : <Navigate to="/login" replace />;
};

const RootComponent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(getIsAuthenticated());

  const handleSetIsAuthenticated = (value) => {
    setIsAuthenticated(value);
    if (value) {
      localStorage.setItem('isAuthenticated', 'true');
    } else {
      localStorage.removeItem('isAuthenticated');
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/AdminAddCars" element={<PrivateRoute element={<AdminAddCars />} />} />
        <Route path="/login" element={<Login setIsAuthenticated={handleSetIsAuthenticated} />} />
        <Route path="/" element={<App />} />
      </Routes>
    </Router>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<RootComponent />);
