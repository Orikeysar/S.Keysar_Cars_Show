import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsAuthenticated }) => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    // הסרת הבדיקה של הסיסמה
    navigate('/AdminAddCars');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl mb-4 text-center">התחברות מנהל</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-center">סיסמה</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 border rounded w-full text-center"
            />
          </div>
          <button type="submit" className="p-2 bg-blue-500 text-white rounded w-full">
            התחבר
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
