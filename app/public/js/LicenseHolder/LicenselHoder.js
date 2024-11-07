let currentPage = 1;
const pageSize = 5; // Set the number of items per page

async function fetchLicenseHolders() {
  try {
    const response = await fetch(`/api/licenseHolder?page=${currentPage}&pageSize=${pageSize}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const { licenseHolders, totalPages } = data;

    const tableBody = document.getElementById('accountTableBody');
    tableBody.innerHTML = ''; // Clear previous rows

    licenseHolders.forEach((holder, index) => {
      if (holder.Status === 'Đã kích hoạt') {
        const row = `
          <tr>
            <td>${(currentPage - 1) * pageSize + index + 1}</td>
            <td>${holder.MaGPLX}</td>
            <td>${holder.Name}</td>
            <td>${new Date(holder.DateOfBirth).toLocaleDateString()}</td>
            <td>${holder.CCCD}</td>
            <td>${holder.Address}</td>
            <td>
              SĐT: ${holder.PhoneNumber} <br>
              Email: <span class="email" title="${holder.Email}">${holder.Email}</span>
            </td>
            <td>${new Date(holder.Ngaycap).toLocaleDateString()}</td>
            <td>${new Date(holder.Ngayhethan).toLocaleDateString()}</td>
            <td>${holder.HangGPLX}</td>
            <td>${holder.Giamdoc}</td>
            <td><span class="status">${holder.Status}</span></td>
            <td>
              <button class="btn btn-warning btn-sm" onclick='openModal(${JSON.stringify(holder)})'>Sửa</button>
              <button class="btn btn-danger btn-sm" onclick="deleteAccount('${holder._id}')">Xóa</button>
            </td>
          </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', row);
      }
    });

    // Update the pagination information
    document.getElementById('pageInfo').textContent = `Page ${currentPage} of ${totalPages}`;

    // Disable pagination buttons appropriately
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages;
  } catch (error) {
    console.error('Failed to fetch license holders:', error);
  }
}

// Call fetchLicenseHolders when the page loads
window.onload = async () => {
  await fetchLicenseHolders(); // Fetch list of license holders
};

// Pagination buttons event listeners
document.getElementById('prevPage').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    fetchLicenseHolders();
  }
});

document.getElementById('nextPage').addEventListener('click', () => {
  currentPage++;
  fetchLicenseHolders();
});



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

//Day du lieu vao blockchain
// function getCAKeyInfo() {
//   const certificate = localStorage.getItem('certificate');
//   const mspId = localStorage.getItem('mspId');
//   const type = localStorage.getItem('type');

//   if (!certificate || !mspId || !type) {
//       alert("Thông tin chứng chỉ không hợp lệ.");
//       return null;
//   }

//   return { certificate, mspId, type };
// }

// Fetch CA key information for the user
async function getCAKeyInfo() {
  const accountId = localStorage.getItem('accountId');
  if (!accountId) {
    alert("Account ID không tồn tại. Vui lòng đăng nhập lại.");
    return null;
  }

  try {
    const response = await fetch(`/api/LayCA/${accountId}`);
    
    if (response.ok) {
      const data = await response.json();
      const { publicKey, mspId, type, accountId } = data;

      // Validate publicKey, mspId, and type
      if (!publicKey || !mspId || !type || !accountId) {
        alert("Thông tin chứng chỉ không hợp lệ.");
        return null;
      }

      // Log and return CA key data along with accountId
      return { publicKey, mspId, type, accountId };
    } else {
      const errorData = await response.json();
      alert(errorData.message || 'Có lỗi xảy ra khi lấy thông tin chứng chỉ.');
      return null;
    }
  } catch (error) {
    console.error('Error retrieving CA key info:', error);
    alert('Có lỗi xảy ra khi lấy thông tin chứng chỉ. Vui lòng thử lại.');
    return null;
  }
}

// Setup button click event to push data to blockchain
function setupPushDataButton() {
  const pushDataButton = document.getElementById('pushDataButton');

  if (pushDataButton) {
    pushDataButton.addEventListener('click', pushAllDataToBlockchain);
  } else {
    console.warn("Button with ID 'pushDataButton' not found.");
  }
}

// Push all data to blockchain
async function pushAllDataToBlockchain() {
  try {
    // Fetch license holders from the API
    const response = await fetch('/api/licenseHolder');
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const { licenseHolders } = await response.json();

    if (!licenseHolders?.length) {
      alert("Không có dữ liệu người dùng để đẩy vào blockchain.");
      return;
    }

    // Prompt user for their private key
    const privateKey = prompt("Nhập khóa bí mật:");
    if (!privateKey) {
      alert("Khóa bí mật không hợp lệ.");
      return;
    }

    // Fetch CA key info asynchronously and wait for the result
    const caKeyInfo = await getCAKeyInfo();
    if (!caKeyInfo) return; // Abort if CA key info is invalid

    // Retrieve accountId from localStorage
    const idSignature = localStorage.getItem('accountId');
    if (!idSignature) {
      alert("ID người dùng không tồn tại.");
      return;
    }

    // Loop through license holders and push activated ones to blockchain
    const promises = licenseHolders.map(holder => {
      if (holder.Status === 'Đã kích hoạt') {
        return pushDataToBlockchain(holder, idSignature, caKeyInfo, privateKey);
      }
    });

    // Wait for all data push operations to complete
    await Promise.all(promises);

    alert("Tất cả dữ liệu đã được đẩy vào BlockChain thành công!");
  } catch (error) {
    console.error("Error:", error);
    alert("Có lỗi xảy ra khi đẩy dữ liệu vào BlockChain.");
  }
}

// Push individual license holder data to blockchain
async function pushDataToBlockchain(holder, idSignature, caKeyInfo, privateKey) {
  const dataToPush = {
    idSignature: caKeyInfo.accountId,
    Name: holder.Name,
    DateOfBirth: holder.DateOfBirth,
    CCCD: holder.CCCD,
    Address: holder.Address,
    PhoneNumber: holder.PhoneNumber,
    Email: holder.Email,
    Ngaycap: holder.Ngaycap,
    Ngayhethan: holder.Ngayhethan,
    Status: holder.Status,
    Giamdoc: holder.Giamdoc,
    Loivipham: holder.Loivipham,
    MaGPLX: holder.MaGPLX,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    HangGPLX: holder.HangGPLX,
    Ngaytrungtuyen: holder.Ngaytrungtuyen,
    signature: {
      credentials: {
        certificate: caKeyInfo.publicKey,
        privateKey: privateKey
      },
      mspId: caKeyInfo.mspId,
      type: caKeyInfo.type,
      version: 1
    }
  };
  // Send data to the blockchain
  try {
    const blockchainResponse = await fetch("/api/createData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dataToPush)
    });

    if (!blockchainResponse.ok) {
      throw new Error(`Failed to push data to blockchain for MaGPLX: ${holder.MaGPLX}`);
    }

    const responseData = await blockchainResponse.json();
  } catch (error) {
    console.error(`Error pushing data for MaGPLX: ${holder.MaGPLX}`, error);
    alert(`Có lỗi khi đẩy dữ liệu cho MaGPLX: ${holder.MaGPLX}`);
  }
}

// Add event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', setupPushDataButton);
