import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  notification,
} from "antd";
import { getTimeCurrent } from "../../components/GetTimeCurrent";
import { createProduct } from "../../services/productService";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getSupplierList } from "../../services/supplierService";
import { getProductionStagesList } from "../../services/productionStagesService";

function CreateProduct(props) {
  const { onReload, handleCancel } = props;
  const [notifiapi, contextHolder] = notification.useNotification();
  const [dataSupplier, setDataSupplier] = useState([]);
  const [dataProductionStages, setDataProductionStages] = useState([]);
  const [file, setFile] = useState(); // file state to store the selected image

  useEffect(() => {
    const fetchApi = async () => {
      const supplierResponse = await getSupplierList();
      if (supplierResponse) {
        setDataSupplier(supplierResponse);
      }
      const productionStagesResponse = await getProductionStagesList();
      if (productionStagesResponse) {
        setDataProductionStages(productionStagesResponse);
      }
    };
    fetchApi();
  }, []);
 
  const handleSubmit = async (values) => {
    values.createAt = getTimeCurrent();
    const newFormData = new FormData();

    newFormData.append("imageUrl", file); // Đúng key 'imageUrl'
    newFormData.append("name", values.name);
    newFormData.append("description", values.description);
    newFormData.append("manufactureDate", values.manufactureDate.toISOString()); // vì là ngày giờ
    newFormData.append("expiryDate", values.expiryDate.toISOString());
    newFormData.append("supplierID",values.supplierID);
      newFormData.append("productionStagesID", JSON.stringify(values.productionStagesID)); // vì là mảng
    newFormData.append("productCode", values.productCode);
     for (let [key, value] of newFormData.entries()) {
       console.log(`${key}: ${value}`);
     }
    const response = await createProduct(newFormData);
    console.log("response"+response);
    if (response) {
      handleCancel();
      onReload();
      notifiapi.success({
        message: "Success",
        description: "Bạn đã tạo mới sản phẩm thành công",
        duration: 1,
      });
      form.resetFields();
      
    } else {
      notifiapi.error({
        message: "Error",
        description: "Xin lỗi, vui lòng thử lại sau",
      });
    }
  };
  const [form] = Form.useForm();
  const rules = [
    {
      required: true,
      message: "Không được bỏ trống",
    },
  ];

  return (
    <>
      {contextHolder}
      <Form
        form={form}
        layout="vertical"
        name="create-supplier"
        onFinish={handleSubmit}
      >
        <Row style={{ display: "flex", justifyContent: "space-between" }}>
          <Col span={11}>
            <Form.Item label="Tên sản phẩm" name="name" rules={rules}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item
              label="Mã code sản phẩm"
              name="productCode"
              rules={rules}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Mô tả" name="description" rules={rules}>
          <Input.TextArea />
        </Form.Item>

        <Row>
          <Col span={12}>
            <Form.Item label="Hình ảnh" name="imageUrl" rules={rules}>
              <input
                type="file"
                onChange={(e) => {
                   if (e.target.files && e.target.files.length > 0) {
                     setFile(e.target.files[0]); // Lấy đúng file từ input
                   }
                }}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Ngày sản xuất" name="manufactureDate">
              <DatePicker />
            </Form.Item>
            <Form.Item label="Ngày hết hạn" name="expiryDate">
              <DatePicker />
            </Form.Item>
          </Col>
        </Row>

        {dataSupplier && (
          <Form.Item label="Nhà cung cấp" name="supplierID" rules={rules}>
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              placeholder="Chọn nhà cung cấp"
              options={dataSupplier.map((item) => ({
                key: item._id,
                value: item._id,
                label: item.name,
              }))}
            />
          </Form.Item>
        )}

        {dataProductionStages && (
          <Form.Item
            label="Giai đoạn sản xuất"
            name="productionStagesID"
            rules={rules}
          >
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              placeholder="Chọn giai đoạn sản xuất"
              options={dataProductionStages.map((item) => ({
                key: item._id,
                value: item._id,
                label: item.stageName,
              }))}
            />
          </Form.Item>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit" className="button-create">
            Tạo mới
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default CreateProduct;
