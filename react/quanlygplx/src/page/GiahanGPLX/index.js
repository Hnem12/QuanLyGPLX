import React, { useState, useEffect } from 'react';
import { Input, Select, Button, DatePicker, Upload, Form, Checkbox } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import "./RenewallForm.scss";

const { Option } = Select;

// List of issuing countries
const issuingCountries = [
    { value: "CucDuongBoVietNam", label: "Cục Đường bộ Việt Nam" },
    { value: "SoGTVTHaNoi", label: "Sở GTVT Hà Nội" },
    // ... (other countries remain unchanged)
    { value: "SoGTVTYenBai", label: "Sở GTVT Yên Bái" },
];

function GplxRenewForm() {
    const [form] = Form.useForm(); // Create Form instance for better control
    const [formData, setFormData] = useState({
        gplxCode: '',
        issuingCountry: '',
        fullName: '',
        birthDate: null,
        nationality: '',
        issueDate: null,
        gender: '',
        idNumber: '',
        placeOfIssue: '',
        residence: '',
        portrait: null,
        signature: null,
    });

    const [data, setData] = useState([]); // State for fetched data
    const [loading, setLoading] = useState(false); // State for loading status
    const [error, setError] = useState(''); // State for error messages

    // Fetch all license renewals when the component mounts
    useEffect(() => {
        const fetchApi = async () => {
            setLoading(true);
            try {
                const response = await fetch("http://localhost:3000/api/renewals/getall");
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const result = await response.json();
                setData(result.data || []); // Assume your API response has a data field
            } catch (error) {
                console.error("Error fetching data:", error);
                setError('Error fetching data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchApi();
    }, []);

    const handleSearch = async (e) => {
        console.log("Search button clicked");
        e.preventDefault(); // Prevent default form submission

        const licenseNumber = formData.gplxCode.trim(); // Get the GPLX code from the form data
        console.log("License Number: ", licenseNumber);

        if (!licenseNumber) {
            setError('Vui lòng điền đầy đủ thông tin.');
            return;
        }

        // First, check the local data
        const foundHolder = data.find(item => item.gplxCode === licenseNumber);
        console.log("Found Holder in local data: ", foundHolder);

        if (foundHolder) {
            // Update form data state with found holder information
            const { birthDate, issueDate, ...rest } = foundHolder;
            const updatedData = {
                ...rest,
                birthDate: moment(birthDate, 'DD/MM/YYYY'),
                issueDate: moment(issueDate, 'DD/MM/YYYY'),
            };
            setFormData(updatedData);
            form.setFieldsValue(updatedData);
            setError(''); // Clear error
        } else {
            // If not found locally, fetch from the backend
            try {
                const response = await fetch(`http://localhost:3000/api/renewals/getall?gplxCode=${licenseNumber}`);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const result = await response.json();

                if (result && result.data) {
                    const { birthDate, issueDate, ...rest } = result.data;
                    const updatedData = {
                        ...rest,
                        birthDate: moment(birthDate, 'DD/MM/YYYY'),
                        issueDate: moment(issueDate, 'DD/MM/YYYY'),
                    };
                    setFormData(updatedData);
                    form.setFieldsValue(updatedData);
                    setError(''); // Clear error
                } else {
                    setError('Không tìm thấy thông tin giấy phép từ backend.');
                    setFormData(prevState => ({ ...prevState, fullName: '', nationality: '' })); // Clear relevant fields
                }
            } catch (error) {
                console.error("Error fetching data from backend:", error);
                setError('Error fetching data from backend. Please try again later.');
            }
        }
    };

    const handleFileChange = (info, field) => {
        if (info.file.status === 'done') {
            setFormData(prev => ({ ...prev, [field]: info.file.originFileObj }));
        }
    };

    const handleSubmit = (values) => {
        console.log('Form submitted:', values);
        // Handle form submission
    };

    return (
        <div className="gplx-form-container">
            <h1>THÔNG TIN GPLX</h1>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={formData}
            >
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
                        <Form.Item label="Họ tên" name="fullName">
                            <Input value={formData.fullName} disabled />
                        </Form.Item>
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
                                <Form.Item label="Giới tính" name="gender" style={{ marginBottom: 0 }}>
                                    <Checkbox.Group value={formData.gender ? [formData.gender] : []}>
                                        <Checkbox value="male">Nam</Checkbox>
                                        <Checkbox value="female">Nữ</Checkbox>
                                    </Checkbox.Group>
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

                {/* Error Message Display */}
                {error && <div className="error-message">{error}</div>}

                {/* Submit Button */}
                <div className="button-container">
                    <Button type="primary" className="submit-button" htmlType="submit">
                        Submit
                    </Button>
                </div>
            </Form>
        </div>
    );
}

export default GplxRenewForm;
