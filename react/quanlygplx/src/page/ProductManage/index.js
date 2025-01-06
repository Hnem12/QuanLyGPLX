import { useEffect, useState } from "react";
import { getProductList } from "../../services/productService";
import { Button, Image, Modal, Row, Table, Tag, Tooltip } from "antd";
import { Link } from "react-router-dom";
import {
  EyeOutlined,
  DownOutlined,
  SyncOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { getSupplierById } from "../../services/supplierService";
import { getProductionStagesFindByID } from "../../services/productionStagesService"; // Import service
import CreateProduct from "./CreateProduct";
import EditProduct from "./EditProduct";
import DeleteProduct from "./DeleteProduct";

function ProductManage() {
  const [dataProduct, setDataProduct] = useState([]);
  const [supplierNames, setSupplierNames] = useState({});
  const [productionStageNames, setProductionStageNames] = useState({}); // New state for stage names
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchApi = async () => {
    const response = await getProductList();
    if (response) {
      setDataProduct(response);

      const supplierNameMap = {};
      const stageNameMap = {}; // For storing production stage names

      for (const product of response) {
        // Fetch supplier name
        if (product.supplierID) {
          const supplier = await getSupplierById(product.supplierID);
          if (supplier) {
            supplierNameMap[product.supplierID] = supplier.name;
          }
        }

        // Fetch production stage names
        if (product.productionStagesID) {
          for (const stageID of product.productionStagesID) {
            if (!stageNameMap[stageID]) {
              // Avoid duplicate API calls
              const stage = await getProductionStagesFindByID(stageID);
              if (stage) {
                stageNameMap[stageID] = stage.stageName;
              }
            }
          }
        }
      }

      setSupplierNames(supplierNameMap);
      setProductionStageNames(stageNameMap); // Set the stage names
    }
  };

  useEffect(() => {
    fetchApi();
  }, []);

  const handleReload = () => {
    fetchApi();
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
  });

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const columns = [
    {
      title: "STT",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Hình Ảnh",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (imageUrl) => (
        <Image
          src={imageUrl}
          alt="product"
          style={{ width: "100px", height: "100px", objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Tên nhà cung cấp",
      dataIndex: "supplierID",
      key: "supplierID",
      render: (supplierID) => supplierNames[supplierID] || "Đang tải...",
    },
    {
      title: "Tên giai đoạn sản xuất", // Updated column title
      dataIndex: "productionStagesID",
      key: "productionStagesID",
      render: (productionStagesID) =>
        productionStagesID.map((stageID) => (
          <Tag color="success" key={stageID}>
            {productionStageNames[stageID] || "Đang tải..."}
          </Tag>
        )),
    },
  {
    title: "Trạng thái kiểm định",
    dataIndex: "checkStatus",
    key: "checkStatus",
    render: (checkStatus) => {
      if (checkStatus === "Chưa kiểm định") {
        return <Tag color="#f50">Chưa kiểm định</Tag>;
      } else if (checkStatus === "Kiểm định 1") {
        return <Tag color="#87d068">Kiểm định 1</Tag>;
      } else if (checkStatus === "Kiểm định 2") {
        return <Tag color="#87d068">Kiểm định 2</Tag>;
      } else {
        return <Tag color="#2db7f5">Hoàn tất kiểm định</Tag>;
      }
    }
  },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => {
        return (
          <>
            <Row style={{ display: "flex", justifyContent: "center" }}>
              <Link to={`/product-detail-manage/${record._id}`}>
                <Tooltip title="Xem chi tiết">
                  <Button size="small" icon={<EyeOutlined />}></Button>
                </Tooltip>
              </Link>
            </Row>
            <Row style={{ display: "flex", justifyContent: "center" }}>
              <EditProduct
                key={`edit-${record._id}`}
                record={record}
                onReload={handleReload}
              />
              <DeleteProduct
                key={`delete-${record._id}`}
                record={record}
                onReload={handleReload}
              />
            </Row>
          </>
        );
      },
    },
  ];

  return (
    <>
      <div style={{ color: "#00a139", fontSize: "22px", fontWeight: "500" }}>
        Danh sách sản phẩm
      </div>
      <br />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "30px",
        }}
      >
        <Button className="button-filter" icon={<DownOutlined />}>
          Bộ lọc
        </Button>
        <Button onClick={showModal} className="button-create">
          + Tạo sản phẩm
        </Button>
      </div>
      <div style={{ marginBottom: "30px" }}>
        <Tag color="success" icon={<CheckCircleOutlined />}></Tag>Hoàn thành
        &nbsp;
        <Tag color="error" icon={<SyncOutlined spin />}></Tag>Chưa hoàn thành
      </div>
      <Table
        rowKey="id"
        dataSource={dataProduct}
        columns={columns}
        pagination={pagination}
        onChange={handleTableChange}
      ></Table>
      <Modal
        title="Tạo sản phẩm"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <CreateProduct onReload={handleReload} handleCancel={handleCancel} />
      </Modal>
    </>
  );
}

export default ProductManage;
