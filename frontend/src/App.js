import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Passwords from './pages/Passwords';
import AddPassword from './pages/AddPassword';
import Settings from './pages/Settings';
import './index.css';
import Recover2FA from './pages/Recover2FA'; // ⭐ ADD THIS
import Reset2FA from './pages/Reset2FA';
//import EditPassword from './pages/EditPassword';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pb-16 md:pb-0 md:pt-16">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1f2937',
                color: '#fff',
                border: '1px solid #374151'
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff'
                }
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff'
                }
              }
            }}
          />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/auth-success" element={<Login />} />
            {/* ⭐ ADD THIS ROUTE */}
            <Route path="/recover-2fa" element={<Recover2FA />} />
            <Route path="/reset-2fa/:token" element={<Reset2FA />} />
            <Route path="/" element={
              <PrivateRoute>
                <>
                  <Navbar />
                  <Dashboard />
                </>
              </PrivateRoute>
            } />
            <Route path="/passwords" element={
              <PrivateRoute>
                <>
                  <Navbar />
                  <Passwords />
                </>
              </PrivateRoute>
            } />
            <Route path="/add-password" element={
              <PrivateRoute>
                <>
                  <Navbar />
                  <AddPassword />
                </>
              </PrivateRoute>
            } />
            {/* ✅ ADD THIS 
            <Route path="/edit-password/:id" element={
              <PrivateRoute>
                <>
                  <Navbar />
                  <EditPassword />
                </>
              </PrivateRoute>
            } />*/}
            <Route path="/settings" element={
              <PrivateRoute>
                <>
                  <Navbar />
                  <Settings />
                </>
              </PrivateRoute>
            } />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;