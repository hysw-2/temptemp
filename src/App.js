import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserLogin from './Pages/UserLogin';
import AdminLogin from "./Pages/AdminLogin";

const App = () => {
  return (
      <>
        <Router>
          <Routes>
            <Route path="/" element={<UserLogin />} />
            <Route path="/admin" element={<AdminLogin />} />
          </Routes>
        </Router>
      </>
  );
};

export default App;