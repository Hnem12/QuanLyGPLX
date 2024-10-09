import React, { useState } from 'react';
import { Input, Select, Button, DatePicker, Upload, Form } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import "./Test.scss";

const { Option } = Select;

function Test() {
  const [form] = Form.useForm(); // Create Form instance for better control
  const [formData, setFormData] = useState({
    gplxCode: '',
    issuingCountry: '',
    fullName: '',
    birthDate: '',
    nationality: '',
    issueDate: '',
    gender: '',
    idNumber: '',
    placeOfIssue: '',
    residence: '',
    portrait: '',
    signature: ''
  });
  const issuingCountries = [
    { value: "CucDuongBoVietNam", label: "Cục Đường bộ Việt Nam" },
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
    { value: "SoGTVTThanhHoa", label: "Sở GTVT Thanh Hóa" },
    { value: "SoGTVTThuaThienHue", label: "Sở GTVT Thừa Thiên Huế" },
    { value: "SoGTVTTienGiang", label: "Sở GTVT Tiền Giang" },
    { value: "SoGTVTTraVinh", label: "Sở GTVT Trà Vinh" },
    { value: "SoGTVTTuyenQuang", label: "Sở GTVT Tuyên Quang" },
    { value: "SoGTVTVinhLong", label: "Sở GTVT Vĩnh Long" },
    { value: "SoGTVTVinhPhuc", label: "Sở GTVT Vĩnh Phúc" },
    { value: "SoGTVTYenBai", label: "Sở GTVT Yên Bái" },
  ];
  const [isEditable, setIsEditable] = useState(false);

  const handleSearch = async () => {
    const fakeData = {
      gplxCode: 'GPLX12349',
      fullName: 'Nguyen Van A',
      birthDate: '01/01/1990',
      nationality: 'Vietnam',
      issueDate: '01/01/2020',
      gender: 'Male',
      idNumber: '123456789',
      placeOfIssue: 'Hanoi',
      residence: 'Hanoi',
      issuingCountry: 'Vietnam'
    };
    
    // Populate form fields with fake data
    form.setFieldsValue({
      ...fakeData,
      birthDate: moment(fakeData.birthDate, 'DD/MM/YYYY'),
      issueDate: moment(fakeData.issueDate, 'DD/MM/YYYY'),
    });

    setFormData(prevData => ({
      ...prevData,
      ...fakeData
    }));

    setIsEditable(false);
  };

  const handleFileChange = (info, fieldName) => {
    if (info.file.status === 'done') {
      setFormData(prevData => ({
        ...prevData,
        [fieldName]: info.file
      }));
    }
  };

  const handleSubmit = (values) => {
    console.log('Form submitted', values);
  };

  return (
    <div className="gplx-form-container">
      <h1>Thông tin giấy phép lái xe</h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          ...formData,
          birthDate: formData.birthDate ? moment(formData.birthDate, 'DD/MM/YYYY') : null,
          issueDate: formData.issueDate ? moment(formData.issueDate, 'DD/MM/YYYY') : null
        }}
      >
        {/* Search Section */}
        <div className="form-search">
          <Form.Item
            label="Số GPLX Quốc gia"
            name="gplxCode"
            rules={[{ required: true, message: 'Vui lòng nhập số GPLX!' }]}
          >
            <Input
              placeholder="Nhập số GPLX"
              disabled={isEditable}
            />
          </Form.Item>

          <Form.Item
            label="Nơi cấp GPLX Quốc gia"
            name="issuingCountry"
            rules={[{ required: true, message: 'Vui lòng chọn nơi cấp!' }]}
          >
            <Select placeholder="Chọn nơi cấp">
              <Option value="CucDuongBoVietNam">Cục Đường bộ Việt Nam</Option>
              <Option value="SoGTVTHaNoi">Sở GTVT Hà Nội</Option>
              {/* Add other options */}
            </Select>
          </Form.Item>

          <Button type="primary" onClick={handleSearch}>
            Tìm kiếm
          </Button>
        </div>

        {/* User Information Section */}
        <div className="form-info">
          <div className="form-left">
            <h2>Thông tin người dùng</h2>

            <Form.Item label="Họ tên" name="fullName">
              <Input disabled />
            </Form.Item>

            <Form.Item label="Ngày sinh" name="birthDate">
              <DatePicker
                format="DD/MM/YYYY"
                disabled
              />
            </Form.Item>

            <Form.Item label="Quốc tịch" name="nationality">
              <Input disabled />
            </Form.Item>

            <Form.Item label="Ngày cấp" name="issueDate">
              <DatePicker
                format="DD/MM/YYYY"
                disabled
              />
            </Form.Item>

            <Form.Item label="Giới tính" name="gender">
              <Input disabled />
            </Form.Item>

            <Form.Item label="Số CMND" name="idNumber">
              <Input disabled />
            </Form.Item>

            <Form.Item label="Nơi cấp" name="placeOfIssue">
              <Input disabled />
            </Form.Item>

            <Form.Item label="Nơi thường trú" name="residence">
              <Input disabled />
            </Form.Item>
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

        {/* Submit Button */}
        <div className="button-container">
          <Button type="primary" htmlType="submit" className="submit-button">
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default Test;
