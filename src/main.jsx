import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import App from './App.jsx';
import ProfileDetail from './components/ProfileDetail.jsx';
import NotFound from './components/NotFound.jsx';
import './dashboard.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/" element={<Layout />}>
        <Route path="dashboard" element={<App />} />
        <Route path="profile/:id" element={<ProfileDetail />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
