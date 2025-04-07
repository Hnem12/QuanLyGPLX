import React from 'react';
import "./Gioithieu.scss";

const Gioithieu = () => {

    return (
        <div className="service-page">
        {/* Breadcrumb Navigation */}
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
                <li className="breadcrumb-item">
                    <a style={{ color: 'black', textDecoration: 'none', fontSize:'20px'}} href="http://localhost:5000">
                        <img src="../home.png" style={{ width: '20px', marginTop: '-4px' , marginRight:'10px' }} alt="home icon" />
                        Trang chủ
                    </a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">Giới thiệu</li>
            </ol>
        </nav>

        {/* Header */}
        <header>
            <h1>Giới thiệu</h1>
            <p>
                Cung cấp thông tin, hỗ trợ người dân nộp hồ sơ nhanh chóng, thuận tiện 
                Dịch vụ công Đổi giấy phép lái xe và Cấp mới giấy phép lái xe trực tuyến mức 4
            </p>
        </header>

        {/* Icon Section */}
        <section className="info-section">
          <div className="info-item">
            <img src="https://dvc-gplx.csgt.bocongan.gov.vn/p/home/theme/uploads/icon-htlt.svg" alt="icon" />
            <p>Hệ thống liên thông điện tử với các cơ quan ngành Y tế, ngành Công an trong xác nhận thông tin giúp người dân có thể thực hiện dịch vụ đơn giản, nhanh chóng tại nhà.</p>
          </div>
          <div className="info-item">
            <img src="https://dvc-gplx.csgt.bocongan.gov.vn/p/home/theme/uploads/icon-cc.svg" alt="icon" />
            <p>Cung cấp tính năng giúp người dân có thể thực hiện nộp hồ sơ trực tuyến, theo dõi việc xử lý hồ sơ, trả kết quả tại nhà</p>
          </div>
          <div className="info-item">
            <img src="https://dvc-gplx.csgt.bocongan.gov.vn/p/home/theme/uploads/icon-tttt.svg" alt="icon" />
            <p>Cung cấp nền tảng thanh toán trực tuyến qua nhiều ngân hàng, trung gian thanh toán để người dân dễ dàng thanh toán trực tuyến phí, lệ phí thực hiện dịch vụ công</p>
          </div>
        </section>
  
        {/* Table of Services */}
        <section>
          <h2>Thông tin các dịch vụ công cung cấp</h2>
          <table className="services-table">
            <thead>
              <tr>
                <th>Dịch vụ</th>
                <th>Điều kiện thực hiện</th>
                <th>Thành phần hồ sơ</th>
                <th>Lệ phí</th>
                <th>Cơ quan giải quyết</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Đổi giấy phép lái xe trực tuyến mức 4</td>
                <td>
                  - Đổi giấy phép lái xe do ngành giao thông vận tải cấp<br />
                  - Giấy phép lái xe phải có trong hệ thống thông tin...<br />
                  - Hiện không bị giữ giấy phép lái xe
                </td>
                <td>Giấy phép lái xe, ảnh chân dung, giấy chứng nhận sức khỏe</td>
                <td>135.000 VND</td>
                <td>Sở Giao thông vận tải các tỉnh/thành phố trực thuộc</td>
              </tr>
              <tr>
                <td>Cấp mới giấy phép lái xe trực tuyến mức 4</td>
                <td>Có kết quả sát hạch</td>
                <td>Thông tin sát hạch</td>
                <td>135.000 VND</td>
                <td>Tổng cục Đường bộ Việt Nam</td>
              </tr>
            </tbody>
          </table>
        </section>
  
        {/* Sidebar Links */}
        <aside className="sidebar">
          <h3>Chuyên mục</h3>
          <ul>
            <li>Cơ sở đào tạo lái xe</li>
            <li>Trung tâm sát hạch</li>
            <li>Thông kê số liệu công tác đào tạo</li>
          </ul>
          <h3>Liên kết</h3>
          <ul>
            <li>Cục đường thủy nội địa</li>
            <li>Cục Hàng hải Việt Nam</li>
            <li>Bộ giao thông vận tải</li>
          </ul>
        </aside>
      </div>
    );
  };

export default Gioithieu;
