// src/components/Sidebar.js

import React from 'react';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <h2>Trang Chủ</h2>
            <ul>
                <li><a href="#">Trang chủ</a></li>
                <li><a href="#">Truy xuất sản phẩm</a></li>
                <li>
                    <a href="#">Quản lý</a>
                    <ul>
                        <li><a href="#">Tài khoản tổ chức</a></li>
                        <li><a href="#">Danh sách tổ chức</a></li>
                        <li><a href="#">Thống kê doanh nghiệp</a></li>
                        <li><a href="#">Phân quyền vai trò</a></li>
                    </ul>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
