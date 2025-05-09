async function fetchLicenseHolder() {
  const input = document.getElementById('idOrGPLX').value.trim();
  const searchField = document.getElementById('searchField').value; 
  const detailDiv = document.getElementById('details');

  // Check if input is empty
  if (!input) {
      detailDiv.innerHTML = '<p class="text-danger">Vui lòng nhập thông tin để tìm kiếm.</p>';
      return;
  }

  // Optional: Validate input format here if needed (e.g., specific ID format)
  const isValidInput = /^[a-zA-Z0-9]+$/.test(input); // Example: alphanumeric only
  if (!isValidInput) {
      detailDiv.innerHTML = '<p class="text-danger">Vui lòng nhập thông tin hợp lệ.</p>';
      return;
  }

  detailDiv.innerHTML = '<p>Đang tải...</p>'; // Show loading message

  try {
      let url = '';

      // Construct URL based on selected search field
      // In this case, just use input as part of the URL regardless of the searchField value
      // because we're assuming that the API will work for all fields (ID, MaGPLX, CCCD)
      url = `/api/truyvanGPLX/${encodeURIComponent(input)}`; // MaGPLX lookup directly in the URL

      // Fetch the data
      const response = await fetch(url);

      // Check if the response is okay
      if (!response.ok) {
          throw new Error('Invalid response from server');
      }

      const data = await response.json();
      const holder = data.data || data; // Handle holder object

      // Check if holder data is returned
      if (holder && Object.keys(holder).length > 0) {
          displayLicenseHolder(holder);
      } else {
          detailDiv.innerHTML = '<p class="text-warning">Không tìm thấy chủ sở hữu với thông tin đã nhập.</p>';
      }
  } catch (error) {
      detailDiv.innerHTML = '<p class="text-danger">Lỗi khi truy xuất dữ liệu. Vui lòng thử lại sau.</p>';
      console.error('Fetch error:', error);
  }
}

// Hàm chuyển đổi giá trị giới tính
function getGenderLabel(Gender) {
  if (Gender === 'Female') return 'Nữ';
  if (Gender === 'Male') return 'Nam';
  return ''; // Trả về chuỗi rỗng nếu không xác định
}

// Gán vào đoạn mã HTML
const holder = { Gender: 'Female' }; // Ví dụ về dữ liệu

function displayLicenseHolder(holder) {
  const detailDiv = document.getElementById('details');

  // If holder data is empty, display a single "Không tìm thấy thông tin GPLX" message and exit
  if (!holder || Object.keys(holder).length === 0) {
      detailDiv.innerHTML = '<p class="text-warning">Không tìm thấy thông tin GPLX.</p>';
      return;
  }

  // Display the form only if there is valid data in the holder object
  detailDiv.innerHTML = `
  <div style="display: flex; align-items: flex-start; gap: 20px;">
    <div class="holder-details">
      <h4 class="holder-title">Thông tin GPLX</h4>
      <div class="holder-info-container">
        <div class="holder-info-left">
          <p><strong>Tên:</strong> ${holder.Tenchusohuu || ''}</p>
          <p><strong>Ngày sinh:</strong> ${holder.Ngaysinh ? new Date(holder.Ngaysinh).toLocaleDateString() : ''}</p>
          <p><strong>CCCD:</strong> ${holder.CCCD || ''}</p>
           <p><strong>Giới tính:</strong> ${getGenderLabel(holder.Gender) || ''}</p>
          <p><strong>Số điện thoại:</strong> ${holder.PhoneNumber || ''}</p>
          <p><strong>Email:</strong> ${holder.Email || ''}</p>
        </div>
        <div class="holder-info-right">
          <p><strong>Ngày cấp:</strong> ${holder.Ngaycap ? new Date(holder.Ngaycap).toLocaleDateString() : ''}</p>
          <p><strong>Ngày hết hạn:</strong> ${holder.Ngayhethan ? new Date(holder.Ngayhethan).toLocaleDateString() : ''}</p>
          <p><strong>Trạng thái:</strong> <span class="status ${holder.Status === 'Đã kích hoạt' ? 'active' : 'inactive'}">${holder.Status || ''}</span></p>
          <p><strong>Mã GPLX:</strong> ${holder.MaGPLX || ''}</p>
          <p><strong>Giám đốc:</strong> ${holder.Giamdoc || ''}</p>
        </div>
      </div>
    </div>
    <div style="width:350px; margin-left:10px;">
    <img src="${holder.image}" alt="Account Image" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;" />
</div>

  </div>
`;
}