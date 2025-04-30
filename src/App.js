import './styles/fonts.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserLogin from './pages/UserLogin';
import AdminLogin from "./pages/AdminLogin";
import MainSearch from "./pages/MainSearch";
import Signup from "./pages/Signup";
import MyPage from "./pages/MyPage";
import PrivateRoute from "./routes/PrivateRoute";

const App = () => {
  return (
      <>
        <Router>
          <Routes>
            <Route path="/" element={<UserLogin />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/search" element={<MainSearch />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/mypage" element={
                <PrivateRoute>
                    <MyPage />
                </PrivateRoute>}
            />
          </Routes>
        </Router>
      </>
  );
};

export default App;