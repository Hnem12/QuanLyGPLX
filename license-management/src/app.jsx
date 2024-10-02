import React, { useState } from 'react';

const LicenseLookup = () => {
  const [licenseType, setLicenseType] = useState('GPLX PET (Có thời hạn)');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add validation or API call here
    if (captcha === captchaInput) {
      alert("Form submitted successfully!");
    } else {
      alert("CAPTCHA is incorrect.");
    }
  };

  return (
    <div className="container">
      <h2>Tra cứu thông tin giấy phép lái xe</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Loại GPLX:</label>
          <select value={licenseType} onChange={(e) => setLicenseType(e.target.value)}>
            <option value="GPLX PET (Có thời hạn)">GPLX PET (Có thời hạn)</option>
            <option value="GPLX Cũ">GPLX Cũ</option>
          </select>
        </div>

        <div className="form-group">
          <label>Số GPLX:</label>
          <input
            type="text"
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
            placeholder="Nhập số GPLX đã cấp"
          />
        </div>

        <div className="form-group">
          <label>Ngày/Tháng/Năm sinh:</label>
          <input
            type="text"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            placeholder="dd/MM/yyyy hoặc Năm sinh"
          />
        </div>

        <div className="form-group">
          <label>Mã bảo vệ:</label>
          <div className="captcha-box">
            <span className="captcha">{captcha}</span> 
            <button type="button" onClick={() => setCaptcha('pXxYN8')}>Refresh</button>
          </div>
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

export default LicenseLookup;
