import './styles/fonts.css';
import 'antd/dist/reset.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminDashboard from "./pages/AdminDashboard";
import MainSearch from "./pages/MainSearch";
import Signup from "./pages/Signup";
import MyPage from "./pages/MyPage";
import Discussion from "./pages/Discussion";
import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute";
import Ranking from "./pages/Ranking";
import SearchResult from './pages/SearchResult';
import BillDetail from './pages/BillDetail';
import ProposerDetail from './pages/ProposerDetail';

const App = () => {
  return (
      <>
        <Router>
          <Routes>
            <Route path="/" element={<MainSearch />} />
              <Route path="/signup" element={<Signup />} />
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
              <Route path="/admin" element={
                  <AdminRoute>
                      <AdminDashboard />
                  </AdminRoute>}
              />

          </Routes>
        </Router>
      </>
  );
};

export default App;