async function fetchLicenseHolders() {
  try {
    const response = await fetch('http://localhost:3001/api/licenseHolder'); // Đường dẫn đến API
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
          <td >
            SĐT: ${holder.PhoneNumber} <br> 
        Email: <span class="email" title="${holder.Email}">${holder.Email}</span>
          </td>
          <td>${new Date(holder.Ngaycap).toLocaleDateString()}</td>
          <td>${new Date(holder.Ngayhethan).toLocaleDateString()}</td>
           <td>${holder.HangGPLX}</td>
          <td>${holder.Giamdoc}</td>
          <td>
              <span class="status">${holder.Status}</span>
          </td>
        <td>
    <button class="btn btn-warning btn-sm" onclick='openModal(${JSON.stringify(holder)})'>Sửa</button>
    <button class="btn btn-danger btn-sm" onclick="deleteAccount('${holder._id}')">Xóa</button>
    </td>
    </tr>
          
      `;
      tableBody.insertAdjacentHTML('beforeend', row);
    });

  } catch (error) {
    console.error('Failed to fetch license holders:', error);
  }
}

// Gọi hàm fetchLicenseHolders khi trang được load
window.onload = async () => {
  await fetchLicenseHolders(); // Lấy danh sách license holders
};


async function deleteAccount(id) {
  if (confirm('Bạn có chắc chắn muốn xóa chủ sở hữu GPLX này không?')) {
      try {
          const response = await fetch(`/api/deleteLicenseHolder/${id}`, {
              method: 'DELETE'
          });

          const result = await response.json();
          if (response.ok) {
              alert('Xóa thành công!');
              location.reload(); // Tải lại trang sau khi xóa
          } else {
              alert(result.message || 'Lỗi khi xóa, vui lòng thử lại.');
          }
      } catch (error) {
          console.error('Lỗi:', error);
          alert('Lỗi khi gửi yêu cầu xóa. Vui lòng kiểm tra kết nối mạng.');
      }
  }
}

// Function to open modal for editing
function openModal(holder) {
  // Check if holder is provided
  if (!holder) {
      console.error('Holder data is not provided.');
      return;
  }

  // Populate the modal fields with holder data
  document.getElementById('holderId').value = holder._id; // Set the ID for updating
  document.getElementById('gplx').value = holder.MaGPLX || '';
  document.getElementById('name').value = holder.Name || '';
  document.getElementById('dob').value = holder.DateOfBirth ? holder.DateOfBirth.split('T')[0] : '';
  document.getElementById('cccd').value = holder.CCCD || '';
  document.getElementById('phone').value = holder.PhoneNumber || '';
  document.getElementById('email').value = holder.Email || '';
  document.getElementById('address').value = holder.Address || '';
  document.getElementById('issueDate').value = holder.Ngaycap ? holder.Ngaycap.split('T')[0] : '';
  document.getElementById('expiryDate').value = holder.Ngayhethan ? holder.Ngayhethan.split('T')[0] : '';
  document.getElementById('ngaytrungtuyen').value = holder.Ngaytrungtuyen ? holder.Ngaytrungtuyen.split('T')[0] : '';
  document.getElementById('hangGPLX').value = holder.HangGPLX || '';
  document.getElementById('status').value = holder.Status || '';
  document.getElementById('giamdoc').value = holder.Giamdoc || '';

  // Change modal title
  document.getElementById('licenseHolderModalLabel').innerText = 'Sửa Chủ Sở Hữu';

  // Show the modal using Bootstrap's Modal API
  const licenseHolderModal = new bootstrap.Modal(document.getElementById('licenseHolderModal'));
  licenseHolderModal.show();
}

// Function to handle form submission for adding and editing
document.getElementById('licenseHolderForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const id = document.getElementById('holderId').value; // Get ID for updating
  const method = id ? 'PUT' : 'POST'; // Determine if it's an update or add
  const url = id ? `/api/updateLicenseHolder/${id}` : '/api/addlicenseHolder'; // API endpoint

  // Gather form data
  const formData = {
      MaGPLX: document.getElementById('gplx').value.trim(),
      Name: document.getElementById('name').value.trim(),
      DateOfBirth: document.getElementById('dob').value,
      CCCD: document.getElementById('cccd').value.trim(),
      Address: document.getElementById('address').value.trim(),
      PhoneNumber: document.getElementById('phone').value.trim(),
      Email: document.getElementById('email').value.trim(),
      HangGPLX: document.getElementById('hangGPLX').value,
      Ngaycap: document.getElementById('issueDate').value,
      Ngayhethan: document.getElementById('expiryDate').value,
      Ngaytrungtuyen: document.getElementById('ngaytrungtuyen').value,
      Status: document.getElementById('status').value,
      Giamdoc: document.getElementById('giamdoc').value.trim()
  };

  // Send data to the server
  try {
      const response = await fetch(url, {
          method: method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
      });

      const result = await response.json();
      if (response.ok) {
          alert(result.message || 'Thao tác thành công!');
          resetForm();
          location.reload(); // Reload the page after success
      } else {
          alert(result.message || 'Đã có lỗi xảy ra.');
      }
  } catch (error) {
      alert('Lỗi khi gửi dữ liệu. Vui lòng kiểm tra kết nối mạng.');
      console.error('Error:', error);
  }
});

const licenseHolderModal = document.getElementById('licenseHolderModal'); // Make sure this is the correct modal ID
licenseHolderModal.addEventListener('hidden.bs.modal', resetForm);

function displayError(message) {
  // Implement your error display logic here (e.g., show in a div)
  alert(message); // For now, we just use alert
}

// Function to reset the form
function resetForm() {
  document.getElementById('licenseHolderForm').reset(); // Reset form fields
  // If you want to clear specific fields or reset to specific values, you can do so here
  document.getElementById('holderId').value = ''; // Clear holderId
  // Add more fields here if needed
}