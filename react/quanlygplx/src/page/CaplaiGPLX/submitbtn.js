import React from "react";
import { Form, Input, Button, DatePicker, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const SubmitRequestPage = () => {
  const onFinish = (values) => {
    console.log("Form submitted with values:", values);
    // Add your form submission logic here
  };

  return (
    <div style={{ maxWidth: "800px", margin: "50px auto", padding: "20px", boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>GỬI YÊU CẦU CẤP LẠI GPLX</h2>
      <Form layout="vertical" onFinish={onFinish}>
        {/* Mã GPLX */}
        <Form.Item
          name="gplx"
          label="Mã GPLX"
          rules={[{ required: true, message: "Vui lòng nhập Mã GPLX!" }]}
        >
          <Input placeholder="Nhập Mã GPLX" />
        </Form.Item>

        {/* Tên */}
        <Form.Item
          name="name"
          label="Họ và tên"
          rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
        >
          <Input placeholder="Nhập họ và tên" />
        </Form.Item>

        {/* Ngày sinh */}
        <Form.Item
          name="dob"
          label="Ngày sinh"
          rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        {/* CCCD */}
        <Form.Item
          name="cccd"
          label="CCCD"
          rules={[{ required: true, message: "Vui lòng nhập CCCD!" }]}
        >
          <Input placeholder="Nhập CCCD" />
        </Form.Item>

        {/* Số điện thoại */}
        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại!" },
            { pattern: /^[0-9]{10}$/, message: "Số điện thoại không hợp lệ!" },
          ]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        {/* Email */}
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        {/* Địa chỉ */}
        <Form.Item
          name="address"
          label="Địa chỉ"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
        >
          <Input placeholder="Nhập địa chỉ" />
        </Form.Item>

        {/* Ngày cấp */}
        <Form.Item
          name="issueDate"
          label="Ngày cấp"
          rules={[{ required: true, message: "Vui lòng chọn ngày cấp!" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="expiryDate"
          label="Ngày hết hạn"
          rules={[{ required: true, message: "Vui lòng chọn ngày hết hạn!" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="ngaytrungtuyen"
          label="Ngày trúng tuyển"
          rules={[{ required: true, message: "Vui lòng chọn ngày trúng tuyển!" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        {/* Hạng GPLX */}
        <Form.Item
          name="hangGPLX"
          label="Hạng GPLX (Ô tô)"
          rules={[{ required: true, message: "Vui lòng chọn hạng GPLX!" }]}
        >
          <Select placeholder="Chọn hạng GPLX">
            <Select.Option value="B1">B1</Select.Option>
            <Select.Option value="B2">B2</Select.Option>
            <Select.Option value="C">C</Select.Option>
            <Select.Option value="D">D</Select.Option>
            <Select.Option value="E">E</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
        >
          <Select placeholder="Chọn trạng thái">
            <Select.Option value="Chờ kiểm định">Chờ kiểm định</Select.Option>
          </Select>
        </Form.Item>

        {/* Giám đốc */}
        <Form.Item
          name="giamdoc"
          label="Giám đốc"
          rules={[{ required: true, message: "Vui lòng nhập giám đốc!" }]}
        >
          <Input placeholder="Nhập tên giám đốc" />
        </Form.Item>

        {/* Hình ảnh */}
        <Form.Item
          name="image"
          label="Hình ảnh (Tùy chọn)"
        >
          <Upload
            name="image"
            listType="picture"
            maxCount={1}
            beforeUpload={() => false}
          >
            <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
          </Upload>
        </Form.Item>

        {/* Nút Lưu */}
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Lưu
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SubmitRequestPage;
