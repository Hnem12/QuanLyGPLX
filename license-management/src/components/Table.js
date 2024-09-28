// src/components/Table.js

import React from 'react';

const Table = () => {
    return (
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
                <tr>
                    <td>2</td>
                    <td>tuan</td>
                    <td>Viện kiểm nghiệm</td>
                    <td>Điện thoại: 0859274920<br />Email: admin@toj.edu.vn</td>
                    <td>Kiểm định</td>
                    <td>Đã kích hoạt</td>
                    <td>
                        <button className="btn btn-edit">Sửa</button>
                        <button className="btn btn-delete">Xóa</button>
                    </td>
                </tr>
                {/* Repeat rows as needed */}
            </tbody>
        </table>
    );
};

export default Table;
