import './styles/fonts.css';
import 'antd/dist/reset.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminDashboard from "./pages/admin/AdminDashboard";
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
import Bills from './pages/Bills';
import Proposers from './pages/Proposers';
import AdminReportPage from "./pages/admin/AdminReportPage";
import AdminReportDetailPage from "./pages/admin/AdminReportDetailPage";
import Recommend from "./pages/RecommendedBills"

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
              <Route path="/bills" element={<Bills />}/>
              <Route path="/proposers" element={<Proposers />}/>
              <Route path="/mypage" element={
                  <PrivateRoute>
                      <MyPage />
                  </PrivateRoute>}
              />
              <Route path="/recommend" element={
                  <PrivateRoute>
                      <Recommend />
                  </PrivateRoute>}
              />
              <Route path="/admin" element={
                  <AdminRoute>
                      <AdminDashboard />
                  </AdminRoute>}
              />
              <Route path="/admin/reports" element={
                  <AdminRoute>
                      <AdminReportPage />
                  </AdminRoute>
              } />
              <Route path="/admin/report/:reportId" element={
                  <AdminRoute>
                      <AdminReportDetailPage />
                  </AdminRoute>
              } />
          </Routes>
        </Router>
      </>
  );
};

export default App;