import React, { useState, useEffect, useRef } from 'react';
import { Input, Select, Button, DatePicker, Upload, Form, Checkbox, Modal , Collapse } from 'antd';
import { UploadOutlined, CameraOutlined  } from '@ant-design/icons';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import imageCompression from 'browser-image-compression';
import './RenewallForm.scss';
import dayjs from 'dayjs';
const { Panel } = Collapse;
const { Option } = Select;

// List of issuing countries
const issuingPlaces = [
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
const provinces = [
    { value: 'Hà Nội', label: 'Hà Nội' },
    { value: 'Hồ Chí Minh', label: 'Hồ Chí Minh' },
    { value: 'Đà Nẵng', label: 'Đà Nẵng' },
    { value: 'Cần Thơ', label: 'Cần Thơ' },
    { value: 'Hải Phòng', label: 'Hải Phòng' },
    { value: 'Nghệ An', label: 'Nghệ An' },
    { value: 'Thanh Hóa', label: 'Thanh Hóa' },
    { value: 'Nam Định', label: 'Nam Định' },
    { value: 'Thái Bình', label: 'Thái Bình' },
    { value: 'Quảng Ninh', label: 'Quảng Ninh' },
    { value: 'Bắc Ninh', label: 'Bắc Ninh' },
    { value: 'Bắc Giang', label: 'Bắc Giang' },
    { value: 'Hà Giang', label: 'Hà Giang' },
    { value: 'Lạng Sơn', label: 'Lạng Sơn' },
    { value: 'Cao Bằng', label: 'Cao Bằng' },
    { value: 'Hà Tĩnh', label: 'Hà Tĩnh' },
    { value: 'Quảng Bình', label: 'Quảng Bình' },
    { value: 'Quảng Trị', label: 'Quảng Trị' },
    { value: 'Thừa Thiên Huế', label: 'Thừa Thiên Huế' },
    { value: 'Khánh Hòa', label: 'Khánh Hòa' },
    { value: 'Bình Định', label: 'Bình Định' },
    { value: 'Phú Yên', label: 'Phú Yên' },
    { value: 'Ninh Thuận', label: 'Ninh Thuận' },
    { value: 'Bình Thuận', label: 'Bình Thuận' },
    { value: 'Gia Lai', label: 'Gia Lai' },
    { value: 'Kon Tum', label: 'Kon Tum' },
    { value: 'Đắk Lắk', label: 'Đắk Lắk' },
    { value: 'Đắk Nông', label: 'Đắk Nông' },
    { value: 'Lâm Đồng', label: 'Lâm Đồng' },
    { value: 'Hồ Chí Minh', label: 'Hồ Chí Minh' },
    { value: 'Tiền Giang', label: 'Tiền Giang' },
    { value: 'Bến Tre', label: 'Bến Tre' },
    { value: 'Trà Vinh', label: 'Trà Vinh' },
    { value: 'Vĩnh Long', label: 'Vĩnh Long' },
    { value: 'Đồng Tháp', label: 'Đồng Tháp' },
    { value: 'An Giang', label: 'An Giang' },
    { value: 'Kiên Giang', label: 'Kiên Giang' },
    { value: 'Hậu Giang', label: 'Hậu Giang' },
    { value: 'Sóc Trăng', label: 'Sóc Trăng' },
    { value: 'Bạc Liêu', label: 'Bạc Liêu' },
    { value: 'Cà Mau', label: 'Cà Mau' },
    { value: 'Điện Biên', label: 'Điện Biên' },
    { value: 'Lai Châu', label: 'Lai Châu' },
    { value: 'Lào Cai', label: 'Lào Cai' },
    { value: 'Yên Bái', label: 'Yên Bái' },
    { value: 'Tuyên Quang', label: 'Tuyên Quang' },
    { value: 'Hòa Bình', label: 'Hòa Bình' },
    { value: 'Sơn La', label: 'Sơn La' },
    { value: 'Mộc Châu', label: 'Mộc Châu' },
    { value: 'Hà Nam', label: 'Hà Nam' },
    { value: 'Nam Định', label: 'Nam Định' },
    { value: 'Ninh Bình', label: 'Ninh Bình' },
    { value: 'Hưng Yên', label: 'Hưng Yên' },
    { value: 'Thái Nguyên', label: 'Thái Nguyên' },
    { value: 'Lạng Sơn', label: 'Lạng Sơn' },
    { value: 'Bắc Ninh', label: 'Bắc Ninh' },
    { value: 'Hà Tĩnh', label: 'Hà Tĩnh' },
    { value: 'Quảng Bình', label: 'Quảng Bình' },
    { value: 'Quảng Trị', label: 'Quảng Trị' },
    { value: 'Thừa Thiên Huế', label: 'Thừa Thiên Huế' },
    { value: 'Đà Nẵng', label: 'Đà Nẵng' },
  ];
  
function GplxRenewForm() {
    const [form] = Form.useForm();
    const selectedFile = useRef(null);
    const selectedFile2 = useRef(null);
    const [formData, setFormData] = useState({
        gplxCode: '',
        issuingPlaces: '',
        fullName: '',
        birthDate: null,
        expirationDate: null,
        nationality: '',
        Ngaycap: null,
        gender: '',
        idNumber: '',
        placeOfIssue: '',
        residence: '',
        portrait: null,
        signature: null,
    });

    // UDPATE
// Tạo instance form
    const [formHoSo, setFromHoso] = useState({
        passportNumber: "",
        placeOfBirth: "",
        issueDate: null,
        email: "",
        phone: "",
        frontImage: null,
        infoImage: null
      });

    // END UPDATE

    const [data, setData] = useState([]);   
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isCameraModalVisible, setIsCameraModalVisible] = useState(false);
    const [isChecked, setIsChecked] = useState(false);


    const fetchApi = async (signal) => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3000/api/renewal/getall', { signal });
    
            if (!response.ok) {
                throw new Error('Server returned an error.');
            }

            const result = await response.json();
            if (!result.GiahanGPLXList || !Array.isArray(result.GiahanGPLXList)) {
                setData([]);
                setError('API không trả về dữ liệu hợp lệ.');
                return;
            }
    
            setData(result.GiahanGPLXList);  // Cập nhật dữ liệu từ 'GiahanGPLXList'
        } catch (error) {
            if (error.name === 'AbortError') {
            } else {
                setError('Lỗi không thể lấy dữ liệu từ API. Vui lòng thử lại sau.');
            }
        } finally {
            setLoading(false);
        }
    };
    
    const handleSearch = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
    
        const licenseNumber = form.getFieldValue('gplxCode')?.trim();
        const issuingPlaces = form.getFieldValue('issuingPlaces')?.trim();    
        if (!licenseNumber || !issuingPlaces) {
            setLoading(false);
            return setError('Vui lòng điền đầy đủ thông tin giấy phép lái xe và nơi cấp.');
        }
    
        if (!data || data.length === 0) {
            setLoading(false);
            return setError('Không có dữ liệu giấy phép lái xe trong hệ thống.');
        }
    
        try {
            const filteredData = data.filter((item) => {
                const codeMatch = (item.MaGPLX || '').trim().toLowerCase() === licenseNumber.toLowerCase(); // Thay gplxCode bằng MaGPLX
                const placeMatch = (item.issuingPlaces || '').trim().toLowerCase() === issuingPlaces.toLowerCase(); // Đảm bảo so sánh đúng nơi cấp
                return codeMatch && placeMatch;
            });
    
            if (filteredData.length > 0) {
                form.resetFields();    
                // Update form with the filtered data
                updateFormData(filteredData[0]);
                } else {
                setError(`Không tìm thấy giấy phép lái xe với mã '${licenseNumber}' và nơi cấp '${issuingPlaces}'.`);
            }
        } catch (error) {
            setError('Đã xảy ra lỗi không xác định.');
        } finally {
            setLoading(false);
        }
    };
    
    // Update form data
    const updateFormData = (data) => {
        const updatedData = {
            fullName: data.Name || '',
            birthDate: data.DateOfBirth ? moment(data.DateOfBirth, 'YYYY-MM-DD') : null,
            Ngaycap: data.Ngaycap ? moment(data.Ngaycap, 'YYYY-MM-DD') : null,
            expirationDate: data.Ngayhethan ? moment(data.Ngayhethan, 'YYYY-MM-DD') : null,
            gender: data.Gender || '',
            nationality: data.Country || '',
            idNumber: data.CCCD || '',
            residence: data.Address || '',
            placeOfIssue: data.issuingPlaces || '',
        };    
        setFormData(updatedData);
        form.setFieldsValue(updatedData);
    };  

    // Fetch data on component mount
    useEffect(() => {
        const controller = new AbortController();
        fetchApi(controller.signal);

        // Cleanup on unmount
        return () => controller.abort();
    }, []);    


const clearFormData = () => {
    setFormData({
        gplxCode: '',
        issuingPlaces: null,
        fullName: '',
        birthDate: null,
        expirationDate: null,
        Ngaycap: null,
        nationality: '',
        idNumber: '',
        residence: '',
        placeOfIssue: '',
    });
    setError(''); // Clear the error message
    form.resetFields();  // Ensure this line is called to reset the form fields in the UI
};




    const handleCheckboxChange = (e) => {
                setIsChecked(e.target.checked); // Cập nhật state khi checkbox được chọn hoặc bỏ chọn
            };
    const handleFileChange = (info, field) => {
        if (info.file.status === 'done') {
            setFormData(prev => ({ ...prev, [field]: info.file.originFileObj }));
        }
    };

    const handleCameraCapture = () => {
        // Implement your camera capture logic here
        // For example, you might integrate a library like 'react-webcam'
        console.log('Camera captured image'); // Placeholder for actual capture logic
        setIsCameraModalVisible(false);
    };

    const handleSubmit = () => {
     

        form
          .validateFields()
          .then((values) => {
            // Transform and merge with additional data
            const combinedData = {
              ...values,
              ...formData,
              ...formHoSo
              // Include any additional fields from updateFormData
            };
      
            // Format dates if necessary
            if (combinedData.birthDate) {
              combinedData.birthDate = combinedData.birthDate.format('YYYY-MM-DD');
            }
            if (combinedData.Ngaycap) {
              combinedData.Ngaycap = combinedData.Ngaycap.format('YYYY-MM-DD');
            }
     
            if (combinedData.expirationDate) {
              combinedData.expirationDate = combinedData.expirationDate.format('YYYY-MM-DD');
            }
      
            // Send data to the server
            submitFormData(combinedData);
          })
          .catch((error) => {
            console.error('Validation failed:', error);
          });
      };

      const submitFormData = async (data) => {
        console.log(data)
        try {
            const response = await fetch('http://localhost:3000/api/renewal/addRenewals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const result = await response.json();
            console.log('Submission successful:', result);
    
            // Clear form and errors after successful submission
            clearFormData();
            setError('');
        } catch (error) {
            console.error('Error submitting form:', error);
            setError('Gửi dữ liệu thất bại. Vui lòng thử lại sau.');
        }
    };
      

    const chonFileAnhInput = () => {
        selectedFile.current.click();
    }
    const Themanhlensave = async (e, type = "frontImage") => {
        const image = e.target.files[0];
        setFromHoso(({
            ...formHoSo,
            [type]: image
        }))
    };
    

    return (
        <div>
        <Collapse>
            <Panel header={<span className="header-text">Thông tin chung</span>} key="1">
                
                <div className="info-container">
                {/* Left Column */}
                <div className="left-column">
                    <p>
                    <strong>Cơ quan giải quyết:</strong> Cục Đường bộ Việt Nam
                    </p>
                    <p>
                    <strong>Địa điểm tiếp nhận:</strong> Ô D20 Tôn Thất Thuyết, Khu đô thị Cầu Giấy, Hà Nội
                    </p>
                    <p>
                    <strong>Thủ tục hành chính:</strong> Dịch vụ công cấp Giấy phép lái xe quốc tế (Mức độ 4)
                    </p>
                </div>

                {/* Vertical Divider */}
                <div className="vertical-line"></div>

                {/* Right Column */}
                <div className="right-column">
                    <p style={{ color: 'red', fontSize: '13px', textAlign: 'center' }}>
                    <strong>Chú ý:</strong> Để thao tác đăng ký được nhanh chóng cần chuẩn bị trước file ảnh chân dung, ảnh chụp mặt trước GPLX và ảnh chụp hộ chiếu (trang có ảnh).
                    </p>
                    <p style={{ color: 'red', fontSize: '13px', textAlign: 'center' }}>
                    <strong>Các trường (*) là bắt buộc nhập.</strong>
                    </p>
                </div>
                </div>
            </Panel>
            </Collapse>

        <Collapse>
            <Panel header={<span className="header-text">Thông tin giấy phép lái xe</span>}  key="2" >
                <div className="gplx-form-container">
                    <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={formData}>
                        {/* Search Section */}
                        <p style={{ color: 'red', fontSize: '17px', textAlign: 'center', marginTop:'-10px',fontFamily: "Times New Roman, serif" }}>
                    <strong>Bạn hãy nhập Số GPLX Quốc gia (12 số) và nơi cấp, nhấn Tìm kiếm để lấy thông tin GPLX.
                    Lưu ý kiểm tra thông tin các hạng GPLX.</strong>
                    </p>
                        <div className="form-search">
                            <Form.Item
                                label="Số GPLX Quốc gia"
                                name="gplxCode"
                                labelCol={{ style: { fontFamily: "Times New Roman, serif"  } }}
                                rules={[{ required: true, message: 'Vui lòng nhập số GPLX!' }]}
                            >
                                <Input
                                    value={formData.gplxCode}
                                    onChange={(e) => setFormData({ ...formData, gplxCode: e.target.value })}
                                />
                            </Form.Item>
                            <Form.Item
                                label={<span style={{ marginLeft: '10px', fontFamily: "Times New Roman, serif" }}>Nơi cấp GPLX Quốc gia</span>}
                                name="issuingPlaces"
                                rules={[{ required: true, message: 'Vui lòng chọn nơi cấp!' }]}
                            >
                                <Select
                                    style={{ marginLeft: '10px' }}
                                    placeholder="Chọn nơi cấp"
                                    onChange={(value) => setFormData((prev) => ({ ...prev, issuingPlaces: value }))}
                                >
                                    {issuingPlaces.map((country) => (
                                        <Option key={country.value} value={country.value}>
                                            {country.label}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Button labelCol={{ style: { fontFamily: "Times New Roman, serif" } }} className="Timkiem" type="primary" onClick={handleSearch}>
                                Tìm kiếm
                            </Button>
                            <Button labelCol={{ style: { fontFamily: "Times New Roman, serif" } }} type="default" onClick={clearFormData} style={{ marginLeft: '10px', marginTop:'8px'}}>
                                Clear
                            </Button>
                        </div>
                        {error && <p className="error">{error}</p>}

                        {/* User Information and File Upload Sections */}
                        <div className="form-content" style={{ marginTop: '-2px' }}>
                            <div className="form-box info">
                                <h2>Thông tin người dùng</h2>
                                <div className="Xepdoc" >
                                    <Form.Item className="hovaten" label="Họ tên" name="fullName">
                                        <Input value={formData.fullName} disabled style={{ width: '100%' }} />
                                    </Form.Item>
                                    <Form.Item className="gioitinh" label="Giới tính" name="gender">
                                        <Checkbox.Group value={formData.gender} disabled>
                                            <Checkbox value="Male">Nam</Checkbox>
                                            <Checkbox value="Female">Nữ</Checkbox>
                                        </Checkbox.Group>
                                    </Form.Item>
                                </div>

                                <div className="Xepngang" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <Form.Item label="Ngày sinh" name="birthDate" style={{ flex: 1, margin: '0 5px' }}>
                                    <DatePicker format="DD/MM/YYYY" value={formData.birthDate} disabled style={{ width: '70%' }} />
                                </Form.Item>
                                <Form.Item label="Ngày cấp" name="Ngaycap" style={{ flex: 1, margin: '0 5px' }}>
                                    <DatePicker format="DD/MM/YYYY" value={formData.Ngaycap} disabled style={{ width: '70%' }} />
                                </Form.Item>
                          
                                <Form.Item label="Ngày hết hạn" name="expirationDate" style={{ flex: 1, margin: '0 5px' }}>
                                    <DatePicker format="DD/MM/YYYY" value={formData.expirationDate} disabled style={{ width: '70%' }} />
                                </Form.Item>
                            </div>
                                <div className="Xepngang">
                                    <Form.Item label="Quốc tịch" name="nationality">
                                        <Input value={formData.nationality} disabled />
                                    </Form.Item>
                                    <Form.Item label="Số CMND" name="idNumber">
                                        <Input value={formData.idNumber} disabled />
                                    </Form.Item>
                                </div>
                                <Form.Item label="Nơi thường trú" name="residence">
                                    <Input value={formData.residence} disabled />
                                </Form.Item>
                                <Form.Item label="Nơi cấp" name="placeOfIssue">
                                    <Input value={formData.placeOfIssue} disabled />
                                </Form.Item>
                            </div>

                            <div className="form-box upload">
                                <h2>Tải ảnh hoặc chụp ảnh</h2>
                                <div className="Xepngang">
                                    <Form.Item label="Chọn ảnh chân dung" name="portrait" style={{ flex: 1 }}>
                                        <Upload
                                            name="portrait"
                                            listType="picture"
                                            maxCount={1}
                                            onChange={(info) => handleFileChange(info, 'portrait')}
                                        >
                                            <Button icon={<UploadOutlined />}>Tải ảnh chân dung</Button>
                                        </Upload>
                                    </Form.Item>

                                    <Button
                                        icon={<CameraOutlined />}
                                        onClick={() => setIsCameraModalVisible(true)}
                                        style={{ marginLeft: '10px' }}
                                    >
                                        Chụp ảnh
                                    </Button>
                                </div>

                                <Modal
                                    title="Chụp ảnh chân dung"
                                    visible={isCameraModalVisible}
                                    onCancel={() => setIsCameraModalVisible(false)}
                                    footer={null}
                                >
                                    {/* Your camera component goes here */}
                                    <div>
                                        <p>Camera functionality here...</p>
                                        <Button onClick={handleCameraCapture}>Capture</Button>
                                    </div>
                                </Modal>

                                <Form.Item label="Chọn ảnh chữ ký" name="signature">
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

                    </Form>
                </div>
            </Panel>
        </Collapse>

        <Collapse>
            <Panel header={<span className="header-text">Thông tin bổ sung</span>}  key="3" >
    <div className="form-container2">
      {/* Additional Information Section */}
      <Form
      form={form}
      initialValues={formHoSo} // Giá trị mặc định
      onFinish={handleSubmit}
      layout="vertical"
    >
      <Form.Item
        label="Số hộ chiếu"
        name="passportNumber"
        rules={[{ required: true, message: "Vui lòng nhập số hộ chiếu!" }]}
      >
        <Input 
        value={formHoSo.passportNumber}
        onChange={(e) => setFromHoso({
            ...formHoSo,
            passportNumber: e.target.value
        })}
        />
      </Form.Item>

      <div style={{ display: "flex", gap: "20px" }}>
        <Form.Item
          label="Nơi sinh"
          name="placeOfBirth"
          rules={[{ required: true, message: "Vui lòng chọn nơi sinh!" }]}
          style={{ flex: 1 }}
        >
          <Select 
          value={formHoSo.placeOfBirth}
          onChange={(value) => setFromHoso({
            ...formHoSo,
            placeOfBirth: value // Giá trị được lấy trực tiếp từ Select
          })}
        
          placeholder="Chọn nơi sinh">
            {provinces.map((province) => (
              <Option key={province.value} value={province.value}>
                {province.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Ngày cấp">
        <DatePicker
          value={formHoSo.Ngaycap ? dayjs(formHoSo.Ngaycap) : null}
          onChange={(date, dateString) => setFromHoso({
            ...formHoSo,
            Ngaycap: date, // Store the Day.js object
            issueDate: dateString || null // Store the formatted string or null
          })}
          style={{ width: "100%" }}
        />
        </Form.Item>
      </div>

      <Form.Item
        label="Thư điện tử"
        name="email"
        rules={[
          { required: true, message: "Vui lòng nhập email!" },
          { type: "email", message: "Email không hợp lệ!" },
        ]}
      >
        <Input 
          value={formHoSo.email}
          onChange={(e) => setFromHoso({
              ...formHoSo,
              email: e.target.value
          })}
        />
      </Form.Item>

      <Form.Item
        label="Điện thoại"
        name="phone"
        rules={[
          { required: true, message: "Vui lòng nhập số điện thoại!" },
          {
            pattern: /^[0-9]{10,11}$/,
            message: "Số điện thoại không hợp lệ!",
          },
        ]}
      >
        <Input 
        value={formHoSo.phone}
        onChange={(e) => setFromHoso({
            ...formHoSo,
            phone: e.target.value
        })}
        />
      </Form.Item>
    </Form>
        </div>
     </Panel>
    </Collapse>        
        <Collapse>
        <Panel header={<span className="header-text">Hồ sơ đính kèm (bắt buộc)</span>}  key="4" >
      {/* File Attachments Section */}
      <div className="table-container">
  <table>
    <thead>
      <tr>
        <th>STT</th>
        <th>Loại văn bản</th>
        <th>Chọn tệp đính kèm</th>
        <th>Tệp đính kèm</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>Ảnh chụp mặt trước của GPLX bằng vật liệu PET</td>
        <td>
          <Button className="choose-file-btn" icon={<PlusOutlined />} onClick={chonFileAnhInput}>
            Chọn tệp
          </Button>
          <input
      
          type='file' accept='image/*' style={{display: 'none'}} onChange={e => Themanhlensave(e, "frontImage")} ref={selectedFile}></input>
        </td>
        <td>
            <p> 
            Cho phép định dạng .pdf, .jpg, .jpeg, .docx, .png và dung lượng tối đa 1MB
            </p>
        </td>
      </tr>
      <tr>
        <td>2</td>
        <td>Ảnh chụp trang thông tin hộ chiếu (có ảnh và nơi sinh)</td>
        <td>
          <Button className="choose-file-btn" icon={<PlusOutlined/>} onClick={() => selectedFile2.current.click()}>
            Chọn tệp
          </Button>

          <input type='file' accept='image/*' style={{display: 'none'}} onChange={e => Themanhlensave(e, "infoImage")} ref={selectedFile2}></input>
        </td>
        <td>
            <p>
            Cho phép định dạng .pdf, .jpg, .jpeg, .docx, .png và dung lượng tối đa 1MB
            </p>
        </td>
      </tr>
     
    </tbody>
  </table>
  
</div>
            </Panel>
        </Collapse>
            {/* Submit and Clear Buttons */}
            <div className="form-actions1" >
                <div>
                <Checkbox onChange={handleCheckboxChange}>
                <span style={{ color: 'red', fontWeight: 'bold', fontFamily:'Times New Roman', fontSize:'18px' }}>
                    Tôi xin đảm bảo các thông tin khai báo là chính xác và xin chịu trách nhiệm về thông tin đã khai báo.
                </span>
            </Checkbox>
                </div>
           
            {isChecked && ( // Hiển thị nút Submit chỉ khi checkbox được chọn
              <Button
              type="primary"
              htmlType="button"
              style={{ marginTop: '10px', fontWeight: 'bold', fontSize: '18px' }}
              onClick={handleSubmit}
            >
              Gửi yêu cầu
            </Button>
            )}
        </div>
    </div>
);
};

export default GplxRenewForm;