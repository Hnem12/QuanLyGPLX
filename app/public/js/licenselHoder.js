async function fetchLicenseHolders() {
  try {
    const response = await fetch('http://localhost:3000/api/licenseHolder'); // Đường dẫn đến API
    const licenseHolders = await response.json(); // Thêm await để đảm bảo dữ liệu được nhận
    const tableBody = document.getElementById('accountTableBody');

    licenseHolders.forEach((holder, index) => {
      const row = `
        <tr>
          <td>${index + 1}</td>    
          <td>${holder.MaGPLX}</td>
          <td>${holder.Name}</td>
          <td>${new Date(holder.DateOfBirth).toLocaleDateString()}</td>
          <td>${holder.CCCD}</td>
          <td>${holder.Address}</td>
          <td>
            SĐT: ${holder.PhoneNumber} <br> 
            Email: ${holder.Email}
          </td>
          <td>${new Date(holder.Ngaycap).toLocaleDateString()}</td>
          <td>${new Date(holder.Ngayhethan).toLocaleDateString()}</td>
          <td>${holder.Giamdoc}</td>
          <td>
        
              <span class="status">${holder.Status}</span>
         
          </td>
          <td>${holder.Loivipham}</td>        
          </tr>
      `;
      tableBody.insertAdjacentHTML('beforeend', row);
    });

    // Chỉ cập nhật tên người dùng cho mục hệ thống chào mừng sau khi nhận dữ liệu của người đầu tiên
    if (licenseHolders.length > 0) {
      document.querySelector('.system-name').textContent = `Hệ thống quản lý GPLX - Xin chào, ${licenseHolders[0].Name}`;
    }

  } catch (error) {
    console.error('Failed to fetch license holders:', error);
  }
}

// Gọi hàm fetchLicenseHolders khi trang được load
window.onload = async () => {
  await fetchLicenseHolders(); // Lấy danh sách license holders
};
