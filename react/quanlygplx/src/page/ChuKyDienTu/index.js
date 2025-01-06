import { Button, Card, Form, Input, Modal, notification } from "antd";
import { useEffect, useState } from "react";
import CreateChuKyDienTu from "./CreateChuKyDienTu";
import { useSelector } from "react-redux";
import { getUserById } from "../../services/userService";
import TextArea from "antd/es/input/TextArea";

function ChuKyDienTu() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [notifiapi, contextHolder] = notification.useNotification();
  const [dataUser, setDataUser] = useState([]);
  const currentData = useSelector((state) => state.currentDataReducer);
 
  const fetchApi = async () => {
    const response = await getUserById(currentData.currentData.data._id);
    if (response) {
      setDataUser(response);
    }
  };
  const handleReload = () => {
    fetchApi();
  };
  useEffect(() => {
    fetchApi();
  }, []);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {contextHolder}
      <Card
        title="Cài đặt chữ ký số"
        extra={
          <Button
            className="button-create"
            onClick={showModal}
            disabled={dataUser.certificate && dataUser.certificate.length !== 0 ? true:false}
          >
            Tạo chữ ký số
          </Button>
        }
      >
        {dataUser.certificate && dataUser.certificate.length !== 0 ? (
          <Form
            form={form}
            layout="vertical"
            name="create-supplier"
            initialValues={dataUser}
          >
            <Form.Item label="Khóa công khai" name="certificate">
              <Input.TextArea readOnly />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="button-create"
              >
                Xóa chữ ký số
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <>Bạn chưa tạo khóa vui lòng tạo khóa</>
        )}
      </Card>
      <Modal
        title="Tạo Chữ Ký số"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <CreateChuKyDienTu
          onReload={handleReload}
          handleCancel={handleCancel}
        />
      </Modal>
    </>
  );
}
export default ChuKyDienTu;
