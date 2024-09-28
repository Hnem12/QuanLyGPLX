// components/AccountManagement.js
import React from 'react';

function AccountManagement() {
  return (
    <div>
      <div className="breadcrumb">
        <a href="/">Trang chủ</a> / <a href="#">Quản lý</a> / <a href="#">Tài khoản tổ chức</a>
      </div>

      <h1>Danh sách tài khoản tổ chức</h1>

      <a href="#" className="add-account-btn">Thêm tài khoản</a>

      <table>
        <thead>
          <tr>
            <th>STT</th>
            <th>Tài khoản</th>
            <th>Tên tổ chức</th>
            <th>Thông tin</th>
            <th>Loại tổ chức</th>
            <th>Trạng thái</th>
            <th>Tác vụ</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>phamtinh</td>
            <td>Viện kiểm nghiệm</td>
            <td>Điện thoại: 0981234567<br />Email: khoai@gmail.com</td>
            <td>Người dùng</td>
            <td>Đã kích hoạt</td>
            <td>
              <button className="btn btn-edit">Sửa</button>
              <button className="btn btn-delete">Xóa</button>
            </td>
          </tr>
          {/* Thêm các hàng khác tương tự */}
        </tbody>
      </table>
    </div>
  );
}

export default AccountManagement;
