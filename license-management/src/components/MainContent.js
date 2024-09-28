// src/components/MainContent.js

import React from 'react';
import Table from './Table'; // Import Table component

const MainContent = () => {
    return (
        <div className="main-content">
            {/* User Actions */}
            <div className="user-actions">
                <a href="#" className="document-btn">My Documents</a>
                <a href="http://localhost:3000/api/account/login" className="logout-btn">Logout</a>
            </div>

            <div className="breadcrumb">
                <a href="#">Trang chủ</a> / <a href="#">Quản lý</a> / <a href="#">Tài khoản tổ chức</a>
            </div>

            <h1>Danh sách tài khoản tổ chức</h1>

            {/* Add Account Button */}
            <a href="#" className="add-account-btn">Thêm tài khoản</a>

            {/* Table */}
            <Table />
        </div>
    );
};

export default MainContent;
