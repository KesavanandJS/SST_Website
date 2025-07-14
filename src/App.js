import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('login');
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }
  }, []);

  const switchToSignup = () => {
    setCurrentView('signup');
  };

  const switchToLogin = () => {
    setCurrentView('login');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setCurrentView('login');
  };

  if (isAuthenticated && user) {
    return <Home user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="App">
      {currentView === 'login' ? (
        <Login switchToSignup={switchToSignup} />
      ) : (
        <Signup switchToLogin={switchToLogin} />
      )}
    </div>
  );
}

export default App;
