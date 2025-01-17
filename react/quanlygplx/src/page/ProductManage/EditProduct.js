import { Button, Modal,notification, Form, Spin, Input, Row, Col, Select, Switch, Image } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { editProduct } from "../../services/productService";
import { getSupplierList } from "../../services/supplierService";
import { getProductionStagesList } from "../../services/productionStagesService";
const { Option } = Select;
function EditProduct(props) {
    const { record, onReload } = props;
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [notifiapi, contextHolder] = notification.useNotification();
      const [dataSupplier, setDataSuppiler] = useState("");
      const [dataProductionStages, setDataProductionStages] = useState("");


    const showModal = () => {
      setIsModalOpen(true);
    };

    const handleCancel = () => {
      setIsModalOpen(false);
      form.resetFields();
    };
    const rules = [
      {
        required: true, // yêu cầu người dùng phải nhập vào
        message: "Không được bỏ trống", // ko nhập show ra message
      },
    ];

    useEffect(() => {
      // show tt nhà cung cấp
      const fetchApi = async () => {
        const response = await getSupplierList();
        if (response) {
          setDataSuppiler(response);
        }
        // show thông tin giai đoạn sản xuất
        const ProductionStages = await getProductionStagesList();
        if (ProductionStages) {
          setDataProductionStages(ProductionStages);
        }
      };
      fetchApi();
    }, []);

    const handleSubmit = async (e) => {
      const response = await editProduct(record._id, e);
      if (response) {
        notifiapi.success({
          message: "success",
          description: `Bạn đã Chỉnh sửa thành công ${record.name}`,
          duration: 0.5, // hiển thị trong bao lâu thời gian
        });
        form.resetFields();
        onReload();
        handleCancel();
      } else {
        notifiapi.error({
          message: "error",
          description: "Xin lỗi, vui lòng đặt lại sau",
        });
      }
    };
    
  return (
    <>
      {contextHolder}
      &nbsp;
      <Button
        type="primary"
        size="small"
        icon={<EditOutlined />}
        onClick={showModal}
      ></Button>
      <Modal
        title="Chỉnh sửa sản phẩm"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          name="create-supplier"
          onFinish={handleSubmit}
          initialValues={record}
        >
          <Form.Item label="Tên sản phẩm" name="name" rules={rules}>
            <Input />
          </Form.Item>
          <Form.Item label="Mô tả" name="description" rules={rules}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="Ảnh sản phẩm" name="imageUrl" rules={rules}>
            <Image
              width={200} // Điều chỉnh kích thước ảnh theo ý muốn
              src={record.imageUrl}
              alt="Ảnh sản phẩm"
              preview={true} // Cho phép xem trước ảnh khi nhấn vào
            />
          </Form.Item>
          <Row>
            <Col span={12}>
              <Form.Item
                label="Ngày sản xuất"
                name="manufactureDate"
                rules={rules}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Ngày hết hạn" name="expiryDate" rules={rules}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          {dataSupplier && (
            <Form.Item label="Nhà cung cấp" name="supplierID" rules={rules}>
              <Select
                defaultValue={record.supplierID}
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
                defaultValue={record.productionStagesID}
                style={{ width: "100%" }}
                placeholder="Giai đoạn sản xuất"
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
              Cập nhập
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
export default  EditProduct;