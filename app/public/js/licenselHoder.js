async function fetchLicenseHolders() {
    try {
      const response = await fetch('http://localhost:3000/api/licenseHolder'); // Đường dẫn đến API
      const licenseHolders = await response.json();
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
            <td>${holder.PhoneNumber}</td>
            <td>${holder.Email}</td>
            <td>${new Date(holder.Ngaycap).toLocaleDateString()}</td>
            <td>${new Date(holder.Ngayhethan).toLocaleDateString()}</td>
            <td>${holder.Status}</td>
            <td>
              <button class="btn btn-warning btn-sm" onclick="openEditHolderModal()">Sửa</button>
              <button class="btn btn-danger btn-sm" onclick="deleteHolder()">Xóa</button>
            </td>
          </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', row);
       
      document.querySelector('.system-name').textContent = `Hệ thống quản lý GPLX - Xin chào, ${holder.Name}`;
      });
    } catch (error) {
      console.error('Failed to fetch license holders:', error);
    }
  }
  
  
  // Gọi hàm fetchLicenseHolders khi trang được load
  window.onload = async () => {
    await fetchLicenseHolders(); // Lấy danh sách license holders
  };

  async function deleteHolder(id) {
    const confirmation = confirm('Bạn có chắc chắn muốn xóa tài khoản này?');
    if (!confirmation) return;

    try {
        const response = await fetch(`/api/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            alert('Tài khoản đã được xóa thành công!');
            location.reload(); // Tải lại trang sau khi xóa
        } else {
            const errorMessage = await response.text();
            alert(`Lỗi khi xóa tài khoản: ${errorMessage}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Lỗi khi gửi yêu cầu. Vui lòng thử lại.');
    }
}
