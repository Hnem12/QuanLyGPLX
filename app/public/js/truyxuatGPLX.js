async function fetchLicenseHolder() {
    const input = document.getElementById('idOrGPLX').value.trim();
    const searchField = document.getElementById('searchField').value; 
    const detailDiv = document.getElementById('details');

    // Check if input is empty
    if (!input) {
        detailDiv.innerHTML = '<p class="text-danger">Vui lòng nhập thông tin để tìm kiếm.</p>';
        return;
    }

    detailDiv.innerHTML = '<p>Đang tải...</p>'; // Show loading message

    try {
        let url = '';
        
        // Construct URL based on selected search field
        if (searchField === 'ID') {
            url = `/api/licenseHolder/${encodeURIComponent(input)}`; // ID lookup
        } else if (searchField === 'MaGPLX') {
            url = `/api/licenseHolder/search/${encodeURIComponent(input)}`; // MaGPLX lookup
        } else if (searchField === 'CCCD') {
            url = `/api/licenseHolder/search/${encodeURIComponent(input)}`; // CCCD lookup
        }

        // Fetch the data
        const response = await fetch(url);

        const data = await response.json();
        const holder = data.holder || data; // Handle holder object

        // Check if holder data is returned
        if (holder) {
            
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
        <h4 class="holder-title">Thông tin GPLX</h4>
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