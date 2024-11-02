import { Link, NavLink, Outlet } from "react-router-dom";
import React from 'react';
import { Layout, Menu, Input } from 'antd';
import './LayoutDefault.scss';

const { Header, Footer, Content } = Layout;

function LayoutDefault() {
    return (
        <Layout className="layout-default">
            <Header className="custom-header">
                <div className="header-content">
                    <div className="logo">
                        <img src="./h9.png" alt="Logo" />
                    </div>
                </div>
            </Header>

            <Header className="navbar-header">
                <Menu theme="dark" mode="horizontal" selectable={false} className="navbar">
                    <Menu.Item key="home">
                        <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
                            Trang chủ
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key="about">
                        <NavLink to="/Gioithieu" className={({ isActive }) => (isActive ? 'active' : '')}>
                            Giới thiệu
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key="manage">
                        <NavLink to="/GiahanGPLX" className={({ isActive }) => (isActive ? 'active' : '')}>
                            Gia hạn GPLX
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key="exchange">
                        <NavLink to="/CaplaiGPLX" className={({ isActive }) => (isActive ? 'active' : '')}>
                            Cấp lại  GPLX
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key="login">
                        <NavLink to="http://localhost:3001/" className={({ isActive }) => (isActive ? 'active' : '')}>
                            Đăng nhập
                        </NavLink>
                    </Menu.Item>
                </Menu>
            </Header>

            <Content className="content">
                <Outlet />
            </Content>

            <Footer className="footer">
                <div className="footer-content">
                    <ul className="footer-menu">
                        <li><a href="#">Trang chủ</a></li>
                        <li><a href="/Test">Giới thiệu</a></li>
                        <li><a href="#">Quản lý vi phạm</a></li>
                        <li><a href="#">Đổi GPLX trực tuyến</a></li>
                    </ul>
                    <div className="footer-info">
                        <p>Trang Thông tin điện tử giấy phép lái xe</p>
                        <p>Địa chỉ: Ô D20 - Khu Đô Thị Cầu Giấy mới - Cầu Giấy - Hà Nội</p>
                        <p>Điện thoại: 1900.599.870</p>
                    </div>
                </div>
            </Footer>
        </Layout>
    );
}

export default LayoutDefault;
