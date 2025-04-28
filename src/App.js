import './styles/fonts.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserLogin from './pages/UserLogin';
import AdminLogin from "./pages/AdminLogin";
import MainSearch from "./pages/MainSearch";
import KakaoLogin from "./pages/KakaoLogin";
import Discussion from "./pages/Discussion";

const App = () => {
  return (
      <>
        <Router>
          <Routes>
            <Route path="/" element={<UserLogin />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/search" element={<MainSearch />} />
            <Route path="/kakao" element={<KakaoLogin />} />
            <Route path="/discussion" element={<Discussion />}/>
          </Routes>
        </Router>
      </>
  );
};

export default App;