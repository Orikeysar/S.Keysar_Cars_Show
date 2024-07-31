import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, setPersistence, browserSessionPersistence } from "firebase/auth";

const Login = ({ setIsAuthenticated }) => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await setPersistence(auth, browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      setIsAuthenticated(true);
      navigate('/AdminAddCars');
    } catch (error) {
      console.error(error);
      alert(' ההתחברות נכשלה: ' + error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl mb-4 text-center">התחברות מנהל</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-center">אימייל</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 border rounded w-full text-center"
              required
            />
          </div>
          <div>
            <label className="block text-center">סיסמה</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 border rounded w-full text-center"
              required
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
