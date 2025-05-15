import './styles/fonts.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserLogin from './pages/UserLogin';
import AdminLogin from "./pages/AdminLogin";
import MainSearch from "./pages/MainSearch";
import KakaoLogin from "./pages/KakaoLogin";
import Discussion from "./pages/Discussion";
import Signup from "./pages/Signup";
import MyPage from "./pages/MyPage";
import PrivateRoute from "./routes/PrivateRoute";
import Ranking from "./pages/Ranking";
import SearchResult from './pages/SearchResult';
import BillDetail from './pages/BillDetail';
import ProposerDetail from './pages/ProposerDetail';

const App = () => {
  return (
      <>
        <Router>
          <Routes>
            <Route path="/" element={<UserLogin />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/search" element={<MainSearch />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/kakao" element={<KakaoLogin />} />
            <Route path="/discussion" element={<Discussion />}/>
            <Route path="/ranking" element={<Ranking  />}/>
            <Route path="/searchresult" element={<SearchResult />}/>
            <Route path="/bills/:billId" element={<BillDetail />}/>
            <Route path="/proposers/:proposerId" element={<ProposerDetail />} />
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