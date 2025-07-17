import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('login');
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    const adminToken = localStorage.getItem('adminToken');
    const adminData = localStorage.getItem('admin');

    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }

    if (adminToken && adminData) {
      setAdmin(JSON.parse(adminData));
      setIsAdminAuthenticated(true);
    }
  }, []);

  const switchToSignup = () => setCurrentView('signup');
  const switchToLogin = () => setCurrentView('login');
  const switchToAdminLogin = () => setCurrentView('adminLogin');
  const switchToUserLogin = () => setCurrentView('login');

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setCurrentView('login');
  };

  const handleAdminLogin = (adminData) => {
    setAdmin(adminData);
    setIsAdminAuthenticated(true);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    setAdmin(null);
    setIsAdminAuthenticated(false);
    setCurrentView('login');
  };

  // Admin view
  if (isAdminAuthenticated && admin) {
    return <AdminDashboard admin={admin} onLogout={handleAdminLogout} />;
  }

  // User view
  if (isAuthenticated && user) {
    return <Home user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="App">
      {currentView === 'login' && (
        <>
          <Login switchToSignup={switchToSignup} onLogin={handleLogin} />
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button onClick={switchToAdminLogin} className="link-button">
              Admin Login
            </button>
          </div>
        </>
      )}
      {currentView === 'signup' && (
        <Signup switchToLogin={switchToLogin} />
      )}
      {currentView === 'adminLogin' && (
        <AdminLogin onAdminLogin={handleAdminLogin} switchToUserLogin={switchToUserLogin} />
      )}
    </div>
  );
}

export default App;
