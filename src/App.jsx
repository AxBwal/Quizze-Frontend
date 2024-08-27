import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Signup from './Pages/Signup/Signup';
import LoginPage from './Pages/Login/LoginPage';
import Dashboard from './Pages/DashBoard/Dashboard';
import { Toaster, toast } from 'react-hot-toast';
import SharedQuiz from './Components/SharedQuiz/SharedQuiz';
import QandA from './Components/QandA/QandA';
import SharedPoll from './Components/SharedPoll/SharedPoll';
import AnalyticsPage from './Pages/AnalyticsPage/AnalyticsPage';
import Poll from './Components/Poll/Poll';

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
        <Route path="/sharedquiz/:uniqueUrl" element={<SharedQuiz />} />
        <Route path="/poll/:uniqueUrl" element={<SharedPoll />} />
        <Route path="/createquiz" element={<QandA />} />
        <Route path="/analytics/:userId" element={<AnalyticsPage />} />
        {/* Adding routes for editing quizzes and polls */}
        <Route path="/quiz/edit/:quizId" element={<QandA />} />
        <Route path="/poll/edit/:pollId" element={<Poll />} />
      </Routes>
    </div>
  );
}

export default App;
