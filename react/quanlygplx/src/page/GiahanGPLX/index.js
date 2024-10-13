import React, { useState, useEffect } from 'react';
import { Input, Select, Button, DatePicker, Upload, Form, Checkbox } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import './RenewallForm.scss';

const { Option } = Select;

// List of issuing countries
const issuingCountries = [
    { value: "CucDuongBoVietNam", label: "Cục Đường bộ Việt Nam" },
    { value: "SoGTVTThanhHoa", label: "Sở GTVT Thanh Hóa" },
    { value: "SoGTVTHaNoi", label: "Sở GTVT Hà Nội" },
    { value: "SoGTVTHoChiMinh", label: "Sở GTVT TP. Hồ Chí Minh" },
    { value: "SoGTVTDaNang", label: "Sở GTVT Đà Nẵng" },
    { value: "SoGTVTHaiPhong", label: "Sở GTVT Hải Phòng" },
    { value: "SoGTVTCanTho", label: "Sở GTVT Cần Thơ" },
    { value: "SoGTVTAnGiang", label: "Sở GTVT An Giang" },
    { value: "SoGTVTBaRiaVungTau", label: "Sở GTVT Bà Rịa - Vũng Tàu" },
    { value: "SoGTVTBacGiang", label: "Sở GTVT Bắc Giang" },
    { value: "SoGTVTBacKan", label: "Sở GTVT Bắc Kạn" },
    { value: "SoGTVTBacLieu", label: "Sở GTVT Bạc Liêu" },
    { value: "SoGTVTBacNinh", label: "Sở GTVT Bắc Ninh" },
    { value: "SoGTVTBenTre", label: "Sở GTVT Bến Tre" },
    { value: "SoGTVTBinhDinh", label: "Sở GTVT Bình Định" },
    { value: "SoGTVTBinhDuong", label: "Sở GTVT Bình Dương" },
    { value: "SoGTVTBinhPhuoc", label: "Sở GTVT Bình Phước" },
    { value: "SoGTVTBinhThuan", label: "Sở GTVT Bình Thuận" },
    { value: "SoGTVTCaMau", label: "Sở GTVT Cà Mau" },
    { value: "SoGTVTCaoBang", label: "Sở GTVT Cao Bằng" },
    { value: "SoGTVTDakLak", label: "Sở GTVT Đắk Lắk" },
    { value: "SoGTVTDakNong", label: "Sở GTVT Đắk Nông" },
    { value: "SoGTVTDienBien", label: "Sở GTVT Điện Biên" },
    { value: "SoGTVTDongNai", label: "Sở GTVT Đồng Nai" },
    { value: "SoGTVTDongThap", label: "Sở GTVT Đồng Tháp" },
    { value: "SoGTVTGiaLai", label: "Sở GTVT Gia Lai" },
    { value: "SoGTVTHaGiang", label: "Sở GTVT Hà Giang" },
    { value: "SoGTVTHaNam", label: "Sở GTVT Hà Nam" },
    { value: "SoGTVTHaTinh", label: "Sở GTVT Hà Tĩnh" },
    { value: "SoGTVTHaiDuong", label: "Sở GTVT Hải Dương" },
    { value: "SoGTVTHauGiang", label: "Sở GTVT Hậu Giang" },
    { value: "SoGTVTHoaBinh", label: "Sở GTVT Hòa Bình" },
    { value: "SoGTVTHungYen", label: "Sở GTVT Hưng Yên" },
    { value: "SoGTVTKhanhHoa", label: "Sở GTVT Khánh Hòa" },
    { value: "SoGTVTKienGiang", label: "Sở GTVT Kiên Giang" },
    { value: "SoGTVTKonTum", label: "Sở GTVT Kon Tum" },
    { value: "SoGTVTLaiChau", label: "Sở GTVT Lai Châu" },
    { value: "SoGTVTLamDong", label: "Sở GTVT Lâm Đồng" },
    { value: "SoGTVTLangSon", label: "Sở GTVT Lạng Sơn" },
    { value: "SoGTVTLaoCai", label: "Sở GTVT Lào Cai" },
    { value: "SoGTVTLongAn", label: "Sở GTVT Long An" },
    { value: "SoGTVTNamDinh", label: "Sở GTVT Nam Định" },
    { value: "SoGTVTNgheAn", label: "Sở GTVT Nghệ An" },
    { value: "SoGTVTNinhBinh", label: "Sở GTVT Ninh Bình" },
    { value: "SoGTVTNinhThuan", label: "Sở GTVT Ninh Thuận" },
    { value: "SoGTVTPhuTho", label: "Sở GTVT Phú Thọ" },
    { value: "SoGTVTPhuYen", label: "Sở GTVT Phú Yên" },
    { value: "SoGTVTQuangBinh", label: "Sở GTVT Quảng Bình" },
    { value: "SoGTVTQuangNam", label: "Sở GTVT Quảng Nam" },
    { value: "SoGTVTQuangNgai", label: "Sở GTVT Quảng Ngãi" },
    { value: "SoGTVTQuangNinh", label: "Sở GTVT Quảng Ninh" },
    { value: "SoGTVTQuangTri", label: "Sở GTVT Quảng Trị" },
    { value: "SoGTVTSocTrang", label: "Sở GTVT Sóc Trăng" },
    { value: "SoGTVTSonLa", label: "Sở GTVT Sơn La" },
    { value: "SoGTVTTayNinh", label: "Sở GTVT Tây Ninh" },
    { value: "SoGTVTThaiBinh", label: "Sở GTVT Thái Bình" },
    { value: "SoGTVTThaiNguyen", label: "Sở GTVT Thái Nguyên" },
    { value: "SoGTVTThuaThienHue", label: "Sở GTVT Thừa Thiên Huế" },
    { value: "SoGTVTTienGiang", label: "Sở GTVT Tiền Giang" },
    { value: "SoGTVTTraVinh", label: "Sở GTVT Trà Vinh" },
    { value: "SoGTVTTuyenQuang", label: "Sở GTVT Tuyên Quang" },
    { value: "SoGTVTVinhLong", label: "Sở GTVT Vĩnh Long" },
    { value: "SoGTVTVinhPhuc", label: "Sở GTVT Vĩnh Phúc" },
    { value: "SoGTVTYenBai", label: "Sở GTVT Yên Bái" },
];


function GplxRenewForm() {
    const [form] = Form.useForm();
    const [formData, setFormData] = useState({
        gplxCode: '',
        issuingCountry: '',
        fullName: '',
        birthDate: null,
        expirationDate: null,
        nationality: '',
        issueDate: null,
        gender: '',
        idNumber: '',
        placeOfIssue: '',
        residence: '',
        portrait: null,
        signature: null,
    });

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchApi = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:3000/api/renewals/getall');
                if (!response.ok) throw new Error('Network response was not ok');
                const result = await response.json();
                setData(result.data || []);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Error fetching data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchApi();
    }, []);
               
    const handleSearch = async (e) => {
        e.preventDefault();
        const licenseNumber = formData?.gplxCode?.trim();
        
        if (!licenseNumber) {
            return setError('Vui lòng điền đầy đủ thông tin.');
        }
    
        const foundHolder = data.find(item => 
            item.LicenseNumber === licenseNumber && 
            item.issuingCountries === formData.issuingCountry
        );
    
        if (foundHolder) {
            // If found, update the form with local data
            updateFormData(foundHolder);
            
        } else {
            // If not found locally, fetch from backend
            try {
                const response = await fetch(`http://localhost:3000/api/renewals/getall?gplxCode=${licenseNumber}`);
                if (!response.ok) throw new Error('Network response was not ok');
                const result = await response.json();
    
                if (result?.data) {
                    updateFormData(result.data);
                    
                } else {
                    setError('Không tìm thấy thông tin giấy phép từ backend.');
                }
            } catch (error) {
                console.error('Error fetching data from backend:', error);
                setError('Error fetching data from backend. Please try again later.');
            }
        }
    };
    

    
    
    const updateFormData = (data) => {
        const updatedData = {
            gplxCode: data.LicenseNumber,
            fullName: data.Name || '',
            birthDate: data.DateOfBirth ? moment(data.DateOfBirth, 'YYYY-MM-DD') : null,
            expirationDate: data.ExpirationDate ? moment(data.DateOfBirth, 'YYYY-MM-DD') : null,
            issueDate: data.IssueDate ? moment(data.IssueDate, 'YYYY-MM-DD') : null,
            gender: data.Gender ? [data.Gender] : [],
            nationality: data.Nationality || '',
            idNumber: data.CCCD || '',
            residence: data.Address || '',
            placeOfIssue: data.IssuingPlace || '',
        };

        setFormData(updatedData);
        form.setFieldsValue(updatedData); // Sync form with updated data
        setError(''); // Clear any previous error messages
    };

    const clearFormData = () => {
        setFormData({
            gplxCode: '',
            issuingCountry: '',
            fullName: '',
            birthDate: null,
            nationality: '',
            issueDate: null,
            essueDate: null,
            gender: '',
            idNumber: '',
            residence: '',
            placeOfIssue: '',
            portrait: null,
            signature: null,
        });
        form.resetFields();
    };

    const handleFileChange = (info, field) => {
        if (info.file.status === 'done') {
            setFormData(prev => ({ ...prev, [field]: info.file.originFileObj }));
        }
    };

    const handleSubmit = (values) => {
        console.log('Form submitted:', values);
        // Handle form submission logic
    };
    

    return (
        <div className="gplx-form-container">
            <h1>THÔNG TIN GPLX</h1>
            <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={formData}>
                {/* Search Section */}
                <div className="form-search">
                    <Form.Item
                        label="Số GPLX Quốc gia"
                        name="gplxCode"
                        rules={[{ required: true, message: 'Vui lòng nhập số GPLX!' }]}
                    >
                        <Input
                            value={formData.gplxCode}
                            onChange={(e) => setFormData({ ...formData, gplxCode: e.target.value })}
                        />
                    </Form.Item>
                    <div className="Cachngang">
                        <Form.Item
                            label="Nơi cấp GPLX Quốc gia"
                            name="issuingCountry"
                            rules={[{ required: true, message: 'Vui lòng chọn nơi cấp!' }]}
                        >
                            <Select
                                placeholder="Chọn nơi cấp"
                                onChange={(value) => setFormData({ ...formData, issuingCountry: value })}
                            >
                                {issuingCountries.map(country => (
                                    <Option key={country.value} value={country.value}>
                                        {country.label}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>
                    <div className="Cachngang">
                        <Button type="primary" onClick={handleSearch}>
                            Tìm kiếm
                        </Button>
                    </div>
                </div>

                {/* User Information Section */}
                <div className="form-info">
                    <div className="form-left">
                        <h2>Thông tin người dùng</h2>
                        <div className="Xepngang">
                        <Form.Item className="hovaten" label="Họ tên" name="fullName">
                            <Input value={formData.fullName} disabled />
                        </Form.Item>
                        <Form.Item label="Giới tính" name="gender" style={{ marginBottom: 0 }}>
                                    <Checkbox.Group className="gioitinh" value={formData.IssuingPlace} disabled>
                                        <Checkbox value="Nam">Nam</Checkbox>
                                        <Checkbox value="Nữ">Nữ</Checkbox>
                                    </Checkbox.Group>
                                </Form.Item>
                        </div>
                        <div className="Xepngang">
                            <div className="form-item">
                                <Form.Item label="Ngày sinh" name="birthDate" style={{ marginBottom: 0 }}>
                                    <DatePicker format="DD/MM/YYYY" value={formData.birthDate} disabled />
                                </Form.Item>
                            </div>
                            <div className="form-item">
                                <Form.Item label="Ngày cấp" name="issueDate" style={{ marginBottom: 0 }}>
                                    <DatePicker format="DD/MM/YYYY" value={formData.issueDate} disabled />
                                </Form.Item>
                            </div>
                            <div className="form-item">
                                 <Form.Item label="Ngày hết hạn" name="expirationDate" style={{ marginBottom: 0 }}>
                                    <DatePicker format="DD/MM/YYYY" value={formData.ExpirationDate} disabled />
                                </Form.Item>
                            </div>
                        </div>
                     
                        <div className="Xepngang">
                            <div className="form-item">
                                <Form.Item label="Quốc tịch" name="nationality" style={{ marginBottom: 0 }}>
                                    <Input value={formData.nationality} disabled />
                                </Form.Item>
                            </div>
                            <div className="form-item">
                                <Form.Item label="Số CMND" name="idNumber" style={{ marginBottom: 0 }}>
                                    <Input value={formData.idNumber} disabled />
                                </Form.Item>
                            </div>
                        </div>
                        <div className="Xepngang">
                            <div className="form-item">
                                <Form.Item label="Nơi thường trú" name="residence">
                                    <Input value={formData.residence} disabled />
                                </Form.Item>
                            </div>
                            <div className="form-item">
                                <Form.Item label="Nơi cấp" name="placeOfIssue" style={{ marginBottom: 0 }}>
                                    <Input value={formData.placeOfIssue} disabled />
                                </Form.Item>
                            </div>
                        </div>
                    </div>

                    {/* File Upload Section */}
                    <div className="form-right">
                        <h2>Tải ảnh</h2>
                        <Form.Item label="Chọn ảnh chân dung" name="portrait">
                            <Upload
                                name="portrait"
                                listType="picture"
                                maxCount={1}
                                onChange={(info) => handleFileChange(info, 'portrait')}
                            >
                                <Button icon={<UploadOutlined />}>Tải ảnh chân dung</Button>
                            </Upload>
                        </Form.Item>
                        <Form.Item label="Tải ảnh chữ ký" name="signature">
                            <Upload
                                name="signature"
                                listType="picture"
                                maxCount={1}
                                onChange={(info) => handleFileChange(info, 'signature')}
                            >
                                <Button icon={<UploadOutlined />}>Tải ảnh chữ ký</Button>
                            </Upload>
                        </Form.Item>
                    </div>
                </div>

                <div className="button-container">
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="submit-button"
                        loading={loading}
                    >
                        Submit
                    </Button>
                </div>
            </Form>
        </div>
    );
}

export default GplxRenewForm;