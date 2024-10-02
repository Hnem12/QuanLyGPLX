function updatePlaceholder() {
    const searchField = document.getElementById('searchField').value;
    const inputField = document.getElementById('idOrGPLX');

    // Update placeholder based on search field selection
    if (searchField === 'ID') {
        inputField.placeholder = 'Nhập ID';
    } else if (searchField === 'MaGPLX') {
        inputField.placeholder = 'Nhập Mã GPLX';
    }
}

async function fetchLicenseHolder() {
    const input = document.getElementById('idOrGPLX').value.trim();
    const searchField = document.getElementById('searchField').value; 
    const detailDiv = document.getElementById('details');

    if (!input) {
        detailDiv.innerHTML = '<p class="text-danger">Vui lòng nhập thông tin để tìm kiếm.</p>';
        return;
    }

    detailDiv.innerHTML = '<p>Đang tải...</p>';

    try {
        let url = '';
        if (searchField === 'ID') {
            url = `/api/licenseHolder/${encodeURIComponent(input)}`;
        } else if (searchField === 'MaGPLX') {
            url = `/api/licenseHolder/search/${encodeURIComponent(input)}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        const holder = data.holder || data; // Handle holder object

        if (holder) {
            console.log('Holder Data:', holder); // Debugging line
            displayLicenseHolder(holder);
        } else {
            detailDiv.innerHTML = '<p class="text-warning">Không tìm thấy chủ sở hữu với thông tin đã nhập.</p>';
        }
    } catch (error) {
        detailDiv.innerHTML = '<p class="text-danger">Lỗi khi truy xuất dữ liệu. Vui lòng thử lại sau.</p>';
        console.error('Fetch error:', error);
    }
}


function displayLicenseHolder(holder) {
    const detailDiv = document.getElementById('details');
   
    // Setting up the details inside the 'details' div
    detailDiv.innerHTML = `
      <div class="holder-details">
        <h4 class="holder-title">Chi tiết chủ sở hữu GPLX</h4>
        <div class="holder-info-container">
          <div class="holder-info-left">
            <p><strong>Tên:</strong> ${holder.Name || 'N/A'}</p>
            <p><strong>Ngày sinh:</strong> ${holder.DateOfBirth ? new Date(holder.DateOfBirth).toLocaleDateString() : 'N/A'}</p>
            <p><strong>CCCD:</strong> ${holder.CCCD || 'N/A'}</p>
            <p><strong>Số điện thoại:</strong> ${holder.PhoneNumber || 'N/A'}</p>
            <p><strong>Email:</strong> ${holder.Email || 'N/A'}</p>
          </div>
          <div class="holder-info-right">
            <p><strong>Ngày cấp:</strong> ${holder.Ngaycap ? new Date(holder.Ngaycap).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Ngày hết hạn:</strong> ${holder.Ngayhethan ? new Date(holder.Ngayhethan).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Trạng thái:</strong> <span class="status ${holder.Status === 'Đã kích hoạt' ? 'active' : 'inactive'}">${holder.Status || 'N/A'}</span></p>
            <p><strong>Mã GPLX:</strong> ${holder.MaGPLX || 'N/A'}</p>
            <p><strong>Giám đốc:</strong> ${holder.Giamdoc || 'N/A'}</p> <!-- Changed to display "Giám đốc" instead of "ID" -->
          </div>
        </div>
      </div>
    `;
}

updatePlaceholder();

// Event listener for search button
// document.getElementById('idOrGPLX').addEventListener('click', function() {
//     // Clear the input field
//     document.getElementById('idOrGPLX').value = '';
//     // Call the fetchByMaGPLX function
//     fetchByMaGPLX();
// });  