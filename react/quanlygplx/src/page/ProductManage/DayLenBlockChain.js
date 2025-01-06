import { Button, Form, Upload, Input, notification, Spin } from "antd";
import { createProductToBlockChain, editProduct } from "../../services/productService";
import { useSelector } from "react-redux";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react"; // Import useState to track file upload status
import { createAuditlog } from "../../services/auditlogService";
import { getTimeCurrent } from "../../components/GetTimeCurrent";

function DayLenBlockChain(props) {
  const { onReload, handleCancel, dataProduct } = props;
  const [notifiapi, contextHolder] = notification.useNotification();
  const currentData = useSelector((state) => state.currentDataReducer);
  const [form] = Form.useForm();
  const [loadingApi, setLoadingApi] = useState(false);
  const [fileUploaded, setFileUploaded] = useState({
    certificate: false,
    privateKey: false,
  }); // State to track file upload status

  const rules = [
    {
      required: true,
      message: "Không được bỏ trống",
    },
  ];


  const handleSubmit = async (e) => {
      setLoadingApi(true);
      const newData = {
        idSignature: currentData.currentData.data._id,
        signature: {
          credentials: {
            certificate: e.certificate.replace(/\\n/g, "\n"),
            privateKey: e.privateKey.replace(/\\r\\n/g, "\r\n"),
          },
          mspId: "Org1MSP",
          type: "X.509",
        },
        name: dataProduct.name,
        description: dataProduct.description,
        imageUrl: dataProduct.imageUrl,
        manufactureDate: dataProduct.manufactureDate,
        expiryDate: dataProduct.expiryDate,
        supplierID: dataProduct.supplierID,
        productionStagesID: dataProduct.productionStagesID,
        productCode: dataProduct.productCode,
        checkStatus: dataProduct.checkStatus,
      };
      const response = await createProductToBlockChain(newData);
      if (response.message==="OKE") {
       onReload();
       handleCancel();
       
       form.resetFields();

        // tạo mới nhật ký kiểm tra
        const newFormData = new FormData();
        newFormData.append("productID", dataProduct._id);
        newFormData.append("productionStageID", dataProduct.productionStagesID);
        newFormData.append("inspector", "Chưa kiểm định");
        newFormData.append("inspectionDate", getTimeCurrent());
        newFormData.append("status", "Không đạt");
        newFormData.append("notes", "Chưa kiểm định");
        
          const response = await createAuditlog(newFormData);
          console.log("response",response)
          if (response.status === "OKE") {
            notifiapi.success({ 
              message: "Success",
              description: "Dữ liệu đã được gửi đến quản lý chất lượng",
              duration: 5,
            });
            const newDataProduct = {
              checkStatus: "Kiểm định 1",
            };
            await editProduct(dataProduct._id, newDataProduct);
          } else {
            notifiapi.error({
              message: "Error",
              description: "Xin lỗi, dữ liệu chưa được gửi đến quản lý chất lượng",
            });
          }
        

      } else {
        notifiapi.error({
          message: "Error",
          description: "Xin lỗi, khóa công khai hoặc bí mật chưa chính xác",
        });
      }
   
  };

  return (
    <>
      {contextHolder}
      <Form
        form={form}
        layout="vertical"
        name="create-supplier"
        onFinish={handleSubmit}
      >
        <Form.Item label="Khóa Công khai" name="certificate" rules={rules}>
          <Input.TextArea
            rows={4}
            placeholder="Nhập khóa công khai tại đây"
            style={{ marginTop: 8 }}
          />
        </Form.Item>

        <Form.Item label="Khóa bí mật" name="privateKey" rules={rules}>
          <Input.TextArea
            rows={4}
            placeholder="Nhập khóa bí mật tại đây"
            style={{ marginTop: 8 }}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="button-create">
            {loadingApi === true ? (
              <>
                <Spin />
              </>
            ) : (
              <>Gửi kiểm định</>
            )}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default DayLenBlockChain;
