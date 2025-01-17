import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Modal,
  notification,
  Row,
  Steps,
  Upload,
} from "antd";
import { useEffect, useState } from "react";
import { PlusOutlined, SendOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { getProductItem } from "../../services/productService";
import { useParams } from "react-router-dom";
import { getSupplierById } from "../../services/supplierService";
import { getProductionStagesFindByID } from "../../services/productionStagesService";
import GoBack from '../../components/GoBack'
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import DayLenBlockChain from "./DayLenBlockChain";


function DetailProduct() {
  const params = useParams();
  const [dataProduct, setDataProduct] = useState("");
   const [dataProductionStages, setDataProductionStages] = useState([]);
   const [dataSupplier, setDataSupplier] = useState("");
  const [notifiapi, contextHolder] = notification.useNotification();
    const currentData = useSelector((state) => state.currentDataReducer);
    const [isModalOpen, setIsModalOpen] = useState(false);

  //Làm reset form
  const [form] = Form.useForm();
  const rules = [
    {
      required: true, // yêu cầu người dùng phải nhập vào
      message: "Không được bỏ trống", // ko nhập show ra message
    },
  ];
    const handleReload = () => {
      fetchAPI();
    };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
const fetchAPI = async () => {
  const result = await getProductItem(params.id);
  if (result) {
    setDataProduct(result);

    // Kiểm tra và lấy nhà cung cấp
    if (result.supplierID) {
      const response = await getSupplierById(result.supplierID);
      if (response) {
        setDataSupplier(response);
      }
    }

    const productionStagesPromises = result.productionStagesID.map(
      async (id) => {
        return await getProductionStagesFindByID(id);
      }
    );
    // Chờ tất cả các lời gọi API hoàn thành
    const productionStages = await Promise.all(productionStagesPromises);
    // Cập nhật state với dữ liệu từ tất cả các stages
    setDataProductionStages(productionStages);
  }
};
    useEffect(() => {
      
      fetchAPI();
    }, [params.id]);

  const handleSubmit = async (e) => {};

  const handleGuiKiemDinh=(e)=>{

  }
  return (
    <>
      <Divider
        style={{
          borderColor: "#088B3C",
          fontSize: "24px",
        }}
      >
        Thông tin sản phẩm
      </Divider>

      {dataProduct && (
        <Card
          title={
            <>
              <GoBack /> Thông tin sản phẩm
            </>
          }
          extra={
         currentData?.currentData?.data?.role === "ADMIN" &&  dataProduct.checkStatus === "Chưa kiểm định" ? (
              <>
                <Button className="button-create" onClick={showModal}>
                  Gửi kiểm định
                  <SendOutlined style={{ marginLeft: 8 }} />
                </Button>
              </>
            ) : (
              <>
                <Button className="button-create" disabled="true">
                  {dataProduct.checkStatus}
                  <SendOutlined style={{ marginLeft: 8 }} />
                </Button>
              </>
            )
          }
        >
          <Form
            form={form}
            layout="vertical"
            name="info-user"
            initialValues={dataProduct} // khởi tạo giá trị
            onFinish={handleSubmit}
            disabled="true"
          >
            <Row>
              <Col span={8}>
                <Form.Item label="Tên sản phẩm" name="name" rules={rules}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Ngày sản xuất"
                  name="manufactureDate"
                  rules={rules}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Ngày hết hạn" name="expiryDate" rules={rules}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="Mô tả" name="description" rules={rules}>
              <Input.TextArea />
            </Form.Item>
            <Form.Item label="Hình ảnh" name="imageUrl" rules={rules}>
              <Upload action="/upload.do" listType="picture-card">
                <button style={{ border: 0, background: "none" }} type="button">
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </button>
              </Upload>
            </Form.Item>
            <Tabs
              defaultActiveKey="profile"
              id="uncontrolled-tab-example"
              className="mb-3"
              fill
            >
              <Tab eventKey="profile" title="Quy trình sản xuất">
                <Divider />
                <Steps
                  style={{ padding: "0px 30px" }}
                  progressDot
                  current={3}
                  // direction="vertical"
                  items={dataProductionStages.map((stage, index) => ({
                    title: (
                      <>
                        <strong>Bước: {index + 1}</strong> {stage.stageName}
                      </>
                    ),
                    description: (
                      <>
                        <strong>Địa chỉ: </strong> {stage.stageAddress} <br />
                        <strong>Trạng thái: </strong> {stage.stageStatus}
                      </>
                    ),
                  }))}
                />
              </Tab>
              <Tab eventKey="contact" title="Thông tin nhà cung cấp">
                <div style={{ margin: "0px 30px" }}>
                  <div>
                    <strong>*Name: </strong>
                    {dataSupplier.name}
                  </div>
                  <div>
                    <strong>*Địa chỉ: </strong>
                    {dataSupplier.address}
                  </div>
                  <div>
                    <strong>*ContacInfo: </strong>
                    {dataSupplier.contactInfo}
                  </div>
                </div>
              </Tab>
            </Tabs>
          </Form>
        </Card>
      )}

      <Modal
        title="Gửi kiểm định"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <DayLenBlockChain
          onReload={handleReload}
          dataProduct={dataProduct}
          handleCancel={handleCancel}
        />
      </Modal>
    </>
  );
}
export default DetailProduct;
