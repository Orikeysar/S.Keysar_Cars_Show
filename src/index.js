import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import AdminAddCars from './components/AdminAddCars';
import Login from './components/Login';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const getIsAuthenticated = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  console.log('getIsAuthenticated:', isAuthenticated);
  return isAuthenticated;
};

const PrivateRoute = ({ element }) => {
  const isAuthenticated = getIsAuthenticated();
  console.log('PrivateRoute isAuthenticated:', isAuthenticated);
  return isAuthenticated ? element : <Navigate to="/login" replace />;
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
    console.log('handleSetIsAuthenticated:', value);
  };

  return (
    <Router>
      <Routes>
        <Route path="/AdminAddCars" element={<AdminAddCars />} />
        <Route path="/login" element={<Login setIsAuthenticated={handleSetIsAuthenticated} />} />
        <Route path="/" element={<App />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<RootComponent />);
