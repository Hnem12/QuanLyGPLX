import './tracuuGPLX.scss';
import React, { useState, useEffect } from 'react';

const LicenseSearch = () => {
    const [data, setData] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [holder, setHolder] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [captcha, setCaptcha] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [showModal, setShowModal] = useState(false);

    const generateCaptcha = () => {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let captchaCode = '';
        for (let i = 0; i < 6; i++) {
            captchaCode += chars[Math.floor(Math.random() * chars.length)];
        }
        return captchaCode;
    };

    useEffect(() => {
        const fetchDataAndGenerateCaptcha = async () => {
            setLoading(true);
            try {
                const response = await fetch("https://quanligplx-hdu-edu-vn.onrender.com/api/licenseHolder");
                if (!response.ok) throw new Error("Network response was not ok");

                const result = await response.json();
                console.log('Fetched data:', result);
                setData(Array.isArray(result.licenseHolders) ? result.licenseHolders : []);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError('Lỗi khi tải dữ liệu. Vui lòng thử lại sau.');
            } finally {
                setCaptcha(generateCaptcha()); // Generate CAPTCHA after fetching data
                setLoading(false);
            }
        };

        fetchDataAndGenerateCaptcha();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        const licenseNumber = searchValue.trim();
        const enteredBirthDate = new Date(birthDate).toLocaleDateString();

        if (!licenseNumber || !birthDate || !captchaInput) {
            setError('Vui lòng điền đầy đủ thông tin và CAPTCHA.');
            return;
        }

        if (captchaInput.toUpperCase() !== captcha) {
            setError('Mã CAPTCHA không chính xác.');
            return;
        }

        const foundHolder = data.find(
            item =>
                item.MaGPLX === licenseNumber &&
                new Date(item.DateOfBirth).toLocaleDateString() === enteredBirthDate
        );

        if (foundHolder) {
            setHolder(foundHolder);
            setError('');
            setShowModal(true);
        } else {
            setError('Không tìm thấy thông tin giấy phép.');
            setHolder(null);
        }
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className="container mx-auto mt-8">
            <div className="form-container mx-auto p-8 max-w-lg">
                <h2 className="text-2xl font-bold mb-4">TRA CỨU THÔNG TIN GIẤY PHÉP LÁI XE</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="block font-bold mb-2" htmlFor="so-gplx">Số GPLX:</label>
                        <input
                            id="so-gplx"
                            placeholder="Nhập số GPLX đã cấp"
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className="border border-gray-300 p-2 w-full"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block font-bold mb-2" htmlFor="birth-date">Ngày sinh:</label>
                        <input
                            id="birth-date"
                            type="date"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            className="border border-gray-300 p-2 w-full"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block font-bold mb-2">CAPTCHA:</label>
                        <div className="captcha-container flex items-center">
                            <span 
                                className="captcha-box bg-blue-200 p-4 rounded-md text-2xl font-bold text-center tracking-widest shadow-lg capcha" 
                                style={{ letterSpacing: '6px', userSelect: 'none', padding:10 }}
                            >
                                {captcha}
                            </span>
                            <button 
                                type="button"
                                onClick={generateCaptcha}
                                className="bg-blue-500 text-white p-2 rounded-md ml-4 hover:bg-blue-600 transition duration-200"
                            >
                                Tải lại
                            </button>
                        </div>
                        <input
                            placeholder="Nhập mã CAPTCHA"
                            type="text"
                            className="mt-2 border border-gray-300 p-2 w-full"
                            value={captchaInput}
                            onChange={(e) => setCaptchaInput(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                        TRA CỨU GIẤY PHÉP LÁI XE
                    </button>
                </form>

                {loading && <p>Loading...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}

                {showModal && (
                    <div className={`modal ${showModal ? 'show' : ''}`}>
                        <div className="modal-content">
                            <h2 className="modal-header">Thông tin GPLX</h2>
                            {holder && (
                            <div className="modal-body" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div className="modal-info-left" style={{ flex: 1, paddingRight: '10px' }}>
                                <p><strong>Họ và tên:</strong> {holder.Name || 'N/A'}</p>
                                <p><strong>Số giấy phép lái xe:</strong> {holder.MaGPLX || 'N/A'}</p>
                                <p><strong>Nơi cấp GPLX:</strong> {holder.Noicap || 'N/A'}</p>
                                <p><strong>Ngày sinh:</strong> {holder.DateOfBirth ? new Date(holder.DateOfBirth).toLocaleDateString() : 'N/A'}</p>
                                <p><strong>Ngày cấp GPLX:</strong> {holder.Ngaycap ? new Date(holder.Ngaycap).toLocaleDateString() : 'N/A'}</p>                           
                                <p><strong>Ngày hết hạn GPLX:</strong> {holder.Ngayhethan ? new Date(holder.Ngayhethan).toLocaleDateString() : 'N/A'}</p>
                                <p><strong>Ngày trúng tuyển:</strong> {holder.Ngaytrungtuyen || 'N/A'}</p>
                            </div>
                            
                            <div className="modal-info-right" style={{ flex: 1, paddingLeft: '10px' }}>
                                <p><strong>CCCD:</strong> {holder.CCCD || 'N/A'}</p>
                                <p><strong>Số điện thoại:</strong> {holder.PhoneNumber || 'N/A'}</p>
                                <p><strong>Email:</strong> {holder.Email || 'N/A'}</p>
                                <p><strong>Hạng GPLX:</strong> {holder.HangGPLX || 'N/A'}</p>
                                <p><strong>Trạng thái:</strong> <span className={`status ${holder.Status === 'Đã kích hoạt' ? 'active' : 'inactive'}`}>{holder.Status || 'N/A'}</span></p>
                                <p><strong>Giám đốc:</strong> {holder.Giamdoc || 'N/A'}</p>
                            </div>
                        </div>

                            )}
                            <button onClick={closeModal} className="modal-close">
                                Đóng
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


export default LicenseSearch;
