import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Signup from './Pages/Signup/Signup';
import LoginPage from './Pages/Login/LoginPage';
import Dashboard from './Pages/DashBoard/Dashboard';  
import { Toaster, toast } from 'react-hot-toast';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('User logged out successfully');
  };

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/signin" element={<LoginPage handleLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard/:userId" element={<Dashboard handleLogout={handleLogout} />} />
      </Routes>
    </div>
  );
}

export default App;
