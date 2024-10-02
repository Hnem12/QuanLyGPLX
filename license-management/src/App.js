import React, { useState } from 'react';

const App = () => {
  const [licenseType, setLicenseType] = useState('GPLX PET (Có thời hạn)');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { licenseType, licenseNumber, birthDate, captchaInput };

    try {
      const response = await fetch('http://localhost:5000/api/license-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert('Có lỗi xảy ra khi tra cứu thông tin.');
    }
  };

  return (
    <div className="container">
      <h2>Tra cứu thông tin giấy phép lái xe</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Loại GPLX:</label>
          <select value={licenseType} onChange={(e) => setLicenseType(e.target.value)}>
            <option value="GPLX PET (Có thời hạn)">GPLX PET (Có thời hạn)</option>
            <option value="GPLX Cũ">GPLX Cũ</option>
          </select>
        </div>

        <div>
          <label>Số GPLX:</label>
          <input
            type="text"
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
            placeholder="Nhập số GPLX đã cấp"
          />
        </div>

        <div>
          <label>Ngày/Tháng/Năm sinh:</label>
          <input
            type="text"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            placeholder="dd/MM/yyyy"
          />
        </div>

        <div>
          <label>Mã bảo vệ:</label>
          <input
            type="text"
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value)}
            placeholder="Nhập mã bảo vệ"
          />
        </div>

        <button type="submit">Tra cứu giấy phép lái xe</button>
      </form>
    </div>
  );
};

export default App;
