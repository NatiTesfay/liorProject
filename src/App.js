import RegisterPage from './components/screens/RegisterPage/RegisterPage';
import LoginPage from './components/screens/LoginPage/LoginPage';
import Dashboard from './components/screens/Dashboard/Dashboard';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />{' '}
          {/* Catch-all route */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
