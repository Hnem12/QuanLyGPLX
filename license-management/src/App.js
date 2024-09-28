import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Make sure to link your CSS files
import LicenseHolderSearch from './LicenseHolderSearch';

function App() {
  return (
    <div className="App">
      <Header />
      <div className="main-content-wrapper">
        <Sidebar />
        <div className="container mt-4">
          <Breadcrumb />
          <LicenseHolderSearch />
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="header">
      <div className="logo">
        <img src="/uploads/h7.png" alt="Logo" />
        <div className="title">Trang Chủ</div>
        <button id="toggleButton" className="btn btn-outline-light">
          <i className="fas fa-chevron-left"></i>
        </button>
      </div>
      <div className="user-info">
        <div className="notification">🔔</div>
        <div className="system-name"></div>
        <img src="/uploads/h6.jpg" alt="Avatar" />
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <nav className="sidebar">
      <ul className="nav flex-column">
        <li className="nav-item">
          <a className="nav-link text-white" href="/truyxuatbanglaixeoto">
            <i className="icon fas fa-search"></i>
            <span>Truy xuất sản phẩm</span>
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link text-white" href="#">
            <i className="icon fas fa-cog"></i>
            <span>Quản lý</span>
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link text-white" href="/account">
            <i className="icon fas fa-users"></i>
            <span>Tài khoản tổ chức</span>
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link text-white" href="/licenseHolder">
            <i className="icon fas fa-building"></i>
            <span>Danh sách tổ chức</span>
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link text-white" href="#">
            <i className="icon fas fa-chart-bar"></i>
            <span>Thống kê doanh nghiệp</span>
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link text-white" href="#">
            <i className="icon fas fa-user-shield"></i>
            <span>Phân quyền vai trò</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}

function Breadcrumb() {
  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <a href="http://localhost:3000/trangchu" style={{ color: 'black', textDecoration: 'none' }}>
            <img src="/uploads/home.png" style={{ width: '15px', marginTop: '-4px' }} alt="Home" /> Trang chủ
          </a>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          Truy xuất sản phẩm
        </li>
      </ol>
    </nav>
  );
}

export default App;
