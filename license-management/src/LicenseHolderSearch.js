import React, { useState } from 'react';

function LicenseHolderSearch() {
  const [input, setInput] = useState('');
  const [holder, setHolder] = useState(null);
  const [error, setError] = useState('');

  const fetchLicenseHolder = async () => {
    if (!input) {
      setError('Vui lòng nhập ID hoặc Mã GPLX để tìm kiếm.');
      setHolder(null);
      return;
    }

    try {
      const response = await fetch(`/api/license-holders/${input}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      if (data) {
        setHolder(data);
        setError('');
      } else {
        setError('Không tìm thấy chủ sở hữu GPLX với thông tin đã nhập.');
        setHolder(null);
      }
    } catch (error) {
      setError('Lỗi khi truy xuất dữ liệu. Vui lòng thử lại sau.');
      setHolder(null);
    }
  };

  return (
    <div>
      <div className="search-container">
        <input
          type="text"
          className="form-control"
          placeholder="Nhập ID hoặc Mã GPLX"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="btn" type="button" onClick={fetchLicenseHolder}>
          Tìm kiếm <i className="bi bi-search"></i>
        </button>
      </div>

      {error && <p className="text-danger">{error}</p>}
      {holder && <LicenseHolderDetails holder={holder} />}
    </div>
  );
}

function LicenseHolderDetails({ holder }) {
  return (
    <div>
      <h3>Chi tiết chủ sở hữu GPLX</h3>
      <p><strong>Tên:</strong> {holder.Name}</p>
      <p><strong>Ngày sinh:</strong> {new Date(holder.DateOfBirth).toLocaleDateString()}</p>
      <p><strong>CCCD:</strong> {holder.CCCD}</p>
      <p><strong>Địa chỉ:</strong> {holder.Address}</p>
      <p><strong>Số điện thoại:</strong> {holder.PhoneNumber}</p>
      <p><strong>Email:</strong> {holder.Email}</p>
      <p><strong>Ngày cấp:</strong> {new Date(holder.Ngaycap).toLocaleDateString()}</p>
      <p><strong>Ngày hết hạn:</strong> {new Date(holder.Ngayhethan).toLocaleDateString()}</p>
      <p><strong>Trạng thái:</strong> {holder.Status}</p>
      <p><strong>Giám đốc:</strong> {holder.Giamdoc}</p>
      <p><strong>Lỗi vi phạm:</strong> {holder.Loivipham}</p>
      <p><strong>Mã GPLX:</strong> {holder.MaGPLX}</p>
    </div>
  );
}

export default LicenseHolderSearch;
