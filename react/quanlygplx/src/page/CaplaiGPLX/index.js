import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, Select, Upload, Checkbox } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from 'axios';  // Import axios to make the API call
import './GplxReissueForm.scss';
import dayjs from 'dayjs';



const GplxReissueForm = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked); // Update the state when checkbox is selected or deselected
  };
  const onFinish = (values) => {
    const fileList = values.image && values.image.fileList;  // Access fileList from the object
    console.log("File List:", fileList);
  
    // Ensure fileList is an array and contains a file
    if (Array.isArray(fileList) && fileList.length > 0) {
      const imageFile = fileList[0].originFileObj;  // Get the file object from the first file
      console.log("Uploaded Image:", imageFile);
  
      const formData = new FormData();
      formData.append('image', imageFile);  // Append the image to the FormData
  
      // Append other form values (except image)
      Object.keys(values).forEach((key) => {
        if (key !== 'image' && values[key]) {
          formData.append(key, values[key]);
        }
      });
  
      // Send the form data via Axios
      axios
        .post("http://localhost:3000/api/Caplai/addRenew", formData, {
          // Don't manually set Content-Type as axios will handle it
          headers: {
            // 'Content-Type': 'multipart/form-data',  // Let Axios handle this automatically
          },
        })
        .then((response) => {
          console.log("Response from backend:", response.data);
          alert("Thông tin GPLX đã được gửi thành công!");
        })
        .catch((error) => {
          if (error.response) {
            console.error("Backend error:", error.response.data);
            alert(`Error: ${error.response.data.message || "Unknown error"}`);
          } else {
            console.error("Connection error:", error.message);
            alert("Unable to connect to the server.");
          }
        });
    } else {
      console.error("No image file uploaded or invalid file list:", fileList);
      alert("Please upload an image.");
    }
  };
  
  
  return (
    <div className="form-container1">
      <h2 className="form-title1">ĐƠN YÊU CẦU CẤP LẠI GPLX</h2>
      <Form layout="vertical" onFinish={onFinish}>
        {/* Mã GPLX */}
        <Form.Item
          name="MaGPLX"
          label={<span style={{ fontFamily: 'Times New Roman', fontSize: '17px' }}>Mã GPLX:</span>}        
          rules={[{ required: true, message: "Vui lòng nhập Mã GPLX!" }]}>
          <Input className="form-item-input" placeholder="Nhập mã GPLX" />
        </Form.Item>

        {/* Tên */}
        <Form.Item
          name="Name"
          label={<span style={{ fontFamily: 'Times New Roman', fontSize: '17px' }}>Họ và tên:</span>}      
          rules={[{ required: true, message: "Vui lòng nhập tên!" }]}>
          <Input className="form-item-input" placeholder="Nhập họ và tên" />
        </Form.Item>
        <Form.Item
          name="Lidocaplai"
          label={<span style={{ fontFamily: 'Times New Roman', fontSize: '17px' }}>Lí do cấp lại:</span>}      
           rules={[{ required: true, message: "Vui lòng nhập lí do cấp lại!" }]}>
          <Input className="form-item-input" placeholder="Nhập lí do cấp lại" />
        </Form.Item>
          {/* Ngày sinh */}
          <Form.Item
            name="DateOfBirth"
            label={<span style={{ fontFamily: 'Times New Roman', fontSize: '17px' }}>Ngày sinh:</span>}      
            rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

        {/* CCCD */}
        <Form.Item
          name="CCCD"
          label={<span style={{ fontFamily: 'Times New Roman', fontSize: '17px' }}>CCCD:</span>}   
          rules={[{ required: true, message: "Vui lòng nhập CCCD!" }]}>
          <Input className="form-item-input" placeholder="Nhập CCCD" />
        </Form.Item>


        {/* Số điện thoại */}
        <Form.Item
          name="PhoneNumber"
          label={<span style={{ fontFamily: 'Times New Roman', fontSize: '17px' }}>Số điện thoại:</span>}   
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại!" },
            { pattern: /^[0-9]{10}$/, message: "Số điện thoại không hợp lệ!" },
          ]}>
          <Input className="form-item-input" placeholder="Nhập số điện thoại" />
        </Form.Item>

        {/* Email */}
        <Form.Item
          name="Email"
          label={<span style={{ fontFamily: 'Times New Roman', fontSize: '17px' }}>Email:</span>}   
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}>
          <Input className="form-item-input" placeholder="Nhập email" />
        </Form.Item>

        
        {/* Địa chỉ */}
        <Form.Item
          name="Address"
          label={<span style={{ fontFamily: 'Times New Roman', fontSize: '17px' }}>Địa chỉ:</span>}   
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}>
          <Input className="form-item-input" placeholder="Nhập địa chỉ" />
        </Form.Item>

        {/* Ngày cấp */}
        <Form.Item
          name="Ngaycap"
          label={<span style={{ fontFamily: 'Times New Roman', fontSize: '17px' }}>Ngày cấp:</span>}   
          rules={[{ required: true, message: "Vui lòng chọn ngày cấp!" }]}>
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="Ngayhethan"
          label={<span style={{ fontFamily: 'Times New Roman', fontSize: '17px' }}>Ngày hết hạn:</span>}   
          rules={[{ required: true, message: "Vui lòng chọn ngày hết hạn!" }]}>
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="Ngaytrungtuyen"
          label={<span style={{ fontFamily: 'Times New Roman', fontSize: '17px' }}>Ngày trúng tuyển:</span>}   
          rules={[{ required: true, message: "Vui lòng chọn ngày trúng tuyển!" }]}>
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        {/* Hạng GPLX */}
        <Form.Item
          name="HangGPLX"
          label={<span style={{ fontFamily: 'Times New Roman', fontSize: '17px' }}>Hạng GPLX:</span>}   
          rules={[{ required: true, message: "Vui lòng chọn hạng GPLX!" }]}>
          <Select className="form-item-input" placeholder="Chọn hạng GPLX">
            <Select.Option value="B1">B1</Select.Option>
            <Select.Option value="B2">B2</Select.Option>
            <Select.Option value="C">C</Select.Option>
            <Select.Option value="D">D</Select.Option>
            <Select.Option value="E">E</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="status"
          label={<span style={{ fontFamily: 'Times New Roman', fontSize: '17px' }}>Trạng thái:</span>}   
          rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}>
          <Select placeholder="Chọn trạng thái">
            <Select.Option value="Chờ kiểm định">Chờ kiểm định</Select.Option>
          </Select>
        </Form.Item>

        {/* Giám đốc */}
        <Form.Item
          name="Giamdoc"
          label={<span style={{ fontFamily: 'Times New Roman', fontSize: '17px' }}>Giám đốc:</span>}      
           rules={[{ required: true, message: "Vui lòng nhập giám đốc!" }]}>
          <Input className="form-item-input" placeholder="Nhập tên giám đốc" />
        </Form.Item>  

       
   {/* Image upload */}
   <Form.Item
        name="image"
        label={<span style={{ fontFamily: 'Times New Roman', fontSize: '17px' }}>Hình ảnh:</span>}
      >
        <Upload
          id="image"
          name="image"
          listType="picture"
          maxCount={1}
          beforeUpload={() => false} // Prevent auto-upload
        >
          <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
        </Upload>
      </Form.Item>



        <Form.Item>
          <div className="form-actions1">
            {/* Checkbox */}
            <Checkbox onChange={handleCheckboxChange}>
              <span style={{ color: 'red', fontWeight: 'bold', fontFamily: 'Times New Roman', fontSize: '18px' }}>
                Tôi xin đảm bảo các thông tin khai báo là chính xác và xin chịu trách nhiệm về thông tin đã khai báo.
              </span>
            </Checkbox>

            {/* Nút Gửi yêu cầu - chỉ hiển thị khi checkbox được chọn */}
            {isChecked && (
              <Button
                type="primary"
                htmlType="submit"
                className="form-submit-button"
                style={{ marginTop: '10px', fontWeight: 'bold', fontSize: '18px' }}
              >
                Gửi yêu cầu
              </Button>
            )}
          </div>
        </Form.Item>
        
      </Form>
    </div>
  );
};

export default GplxReissueForm;
