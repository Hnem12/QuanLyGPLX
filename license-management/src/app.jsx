// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Home from './components/Home';
import LicenseManagement from './components/LicenseManagement';
import AccountManagement from './components/AccountManagement';

function App() {
  return (
    <Router>
      <div className="container">
        {/* Sidebar */}
        <div className="sidebar">
          <h2>Trang Chủ</h2>
          <ul>
            <li><Link to="/">Trang chủ</Link></li>
            <li><Link to="/truyxuatbanglaixeoto">Truy xuất sản phẩm</Link></li>
            <li>
              <Link to="#">Quản lý</Link>
              <ul>
                <li><Link to="/account">Tài khoản tổ chức</Link></li>
                <li><Link to="/organizations">Danh sách tổ chức</Link></li>
                <li><Link to="/statistics">Thống kê doanh nghiệp</Link></li>
                <li><Link to="/roles">Phân quyền vai trò</Link></li>
              </ul>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div className="user-actions">
            <a href="#" className="document-btn">HNem</a>
            <a href="http://localhost:3000/api/account/login" className="logout-btn">Logout</a>
          </div>

          <Switch>
            {/* Định nghĩa các route */}
            <Route exact path="/" component={Home} />
            <Route path="/truyxuatbanglaixeoto" component={LicenseManagement} />
            <Route path="/account" component={AccountManagement} />
            {/* Bạn có thể thêm các route khác */}
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
