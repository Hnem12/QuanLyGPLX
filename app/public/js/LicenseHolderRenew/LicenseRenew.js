let currentPage = 1;
const pageSize = 5; // Set the number of items per page

async function fetchKiemDinhGPLX() {
  const spinner = document.getElementById('loadingSpinner');
  spinner.classList.remove('d-none');
  try {
    // Lấy dữ liệu từ API kiểm định GPLX
    const response = await fetch(`/api/Caplai/getallRenew?page=${currentPage}&pageSize=${pageSize}`);
    if (!response.ok) {   
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const { CaplaiGPLXList, totalPages } = data;

    const tableBody = document.getElementById('accountTableBody');
    tableBody.innerHTML = ''; // Clear previous rows

    CaplaiGPLXList.forEach((holder, index) => {
        const row = `
          <tr>
            <td>${(currentPage - 1) * pageSize + index + 1}</td>
            <td>${holder.MaGPLX}</td>
            <td>${holder.Name}</td>
            <td>${holder.Lidocaplai}</td>

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
            <td><span class="status1">${holder.Status}</span></td>
            <td>
              <button class="btn btn-danger btn-sm" onclick='openModal(${JSON.stringify(holder)})'>Kiểm định</button>
            </td>
          </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', row);
      
    });

    // Update the pagination information
    document.getElementById('pageInfo').textContent = `Page ${currentPage} of ${totalPages}`;

    // Disable pagination buttons appropriately
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages;
  } catch (error) {
    console.error('Failed to fetch license holders:', error);
  }finally {
    // Hide the loading spinner
    spinner.classList.add('d-none');
  }
}

// Call fetchKiemDinhGPLX when the page loads
window.onload = async () => {
  await fetchKiemDinhGPLX(); // Fetch list of GPLX inspections
};

// Pagination button functions
function previousPage() {
  if (currentPage > 1) {
    currentPage--;
    fetchKiemDinhGPLX();
  }
}

function nextPage() {
  currentPage++;
  fetchKiemDinhGPLX();
}


// Function to open the main modal for adding/editing the license holder
function openModal(holder) {
  if (!holder) {
    console.error('Holder data is not provided.');
    return;
  }

  // Populate the modal fields with holder data
  document.getElementById('holderId').value = holder._id || ''; // Set the ID for updating (if available)
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
  document.getElementById('status').value = holder.Status || 'Chưa kiểm định';  // Set initial status to 'Đang kiểm định'
  document.getElementById('giamdoc').value = holder.Giamdoc || '';

  // Set the modal title
  document.getElementById('licenseHolderModalLabel').innerText = 'Thông tin Chủ Sở Hữu';

  // Show the main modal
  const licenseHolderModal = new bootstrap.Modal(document.getElementById('licenseHolderModal'));
  licenseHolderModal.show();
}

document.getElementById('licenseHolderForm').addEventListener('submit', async function (e) {
  e.preventDefault();


  const holderId = document.getElementById('holderId').value;

  // Set the appropriate API URL based on whether it's a new or existing holder
  const url = holderId ? '/api/kiemdinh/them' : '/api';
  // Gather form data
  const formData = new FormData();

  // Append form data fields
  formData.append('MaGPLX', document.getElementById('gplx').value.trim());
  formData.append('Name', document.getElementById('name').value.trim());
  formData.append('DateOfBirth', document.getElementById('dob').value);
  formData.append('CCCD', document.getElementById('cccd').value.trim());
  formData.append('Address', document.getElementById('address').value.trim());
  formData.append('PhoneNumber', document.getElementById('phone').value.trim());
  formData.append('Email', document.getElementById('email').value.trim());
  formData.append('HangGPLX', document.getElementById('hangGPLX').value);
  formData.append('Ngaycap', document.getElementById('issueDate').value);
  formData.append('Ngayhethan', document.getElementById('expiryDate').value);
  formData.append('Ngaytrungtuyen', document.getElementById('ngaytrungtuyen').value);
  formData.append('Status', 'Chưa kiểm định'); // Set to 'Đang kiểm định'
   formData.append('Giamdoc', document.getElementById('giamdoc').value.trim());

  // Append inspection-related fields
  formData.append('NgayKiemDinh', new Date().toISOString()); // Current date as NgayKiemDinh
  formData.append('NguoiKiemDinh', 'Adminkd'); // Fixed inspector name
  formData.append('BuocKiemDinh', 'Bước 2'); // Step of inspection

  // Append image if available
  const image = document.getElementById('image').files[0];
  if (image) {
    formData.append('image', image);
  }

  // Send data to the server to add data to MongoDB
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData // Send formData (including the image)
    });

    const result = await response.json();
    if (response.ok) {
      alert(result.message || 'Thao tác thành công!');
      
      // After successful creation/update, check if the holder already exists for deletion
      const holderId = document.getElementById('holderId').value || result.data._id; // Use form's holderId or result ID
      await deleteAccount(holderId); // Automatically delete the holder
        
      resetForm(); // Reset form after success
      location.reload(); // Reload the page after success
    } else {
      alert(result.message || 'Đã có lỗi xảy ra.');
    }
  } catch (error) {
    console.error('Error occurred during fetch:', error);
    alert('Lỗi khi gửi dữ liệu. Vui lòng kiểm tra kết nối mạng.');
  }
});

function resetForm() {
  document.getElementById('licenseHolderForm').reset(); // Reset form fields
  // If you want to clear specific fields or reset to specific values, you can do so here
  document.getElementById('holderId').value = ''; // Clear holderId
  // Add more fields here if needed
}


// Function to delete account by holderId
async function deleteAccount(holderId) {
  if (!holderId) {
    console.error('Invalid holder ID');
    return;
  }

  try {
    const response = await fetch(`/api/Caplai/${holderId}`, {
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


// Open the Add Inspection Modal
function openAddInspectionModal() {
  const modal = new bootstrap.Modal(document.getElementById('addInspectionModal'));
  modal.show();
}

document.getElementById('addInspectionForm').addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent the form from submitting normally

  // Initialize FormData to send form data, including the image
  const formData = new FormData();

  // Append form data fields with trimmed values
  formData.append('MaGPLX', document.getElementById('gplx1').value.trim());
  formData.append('Name', document.getElementById('name1').value.trim());
  formData.append('Lidocaplai', document.getElementById('renewalReason1').value.trim()); // Reason for renewal
  formData.append('DateOfBirth', document.getElementById('dob1').value);  // Uncomment if Date of Birth is required
  formData.append('CCCD', document.getElementById('cccd1').value.trim());
  formData.append('Address', document.getElementById('address1').value.trim());
  formData.append('PhoneNumber', document.getElementById('phone1').value.trim());
  formData.append('Email', document.getElementById('email1').value.trim());
  formData.append('HangGPLX', document.getElementById('hangGPLX1').value);
  formData.append('Ngaycap', document.getElementById('issueDate1').value);
  formData.append('Ngayhethan', document.getElementById('expiryDate1').value);
  formData.append('Ngaytrungtuyen', document.getElementById('ngaytrungtuyen1').value);
  formData.append('Status', 'Đang kiểm định'); // Set to 'Đang kiểm định'
  formData.append('Giamdoc', document.getElementById('giamdoc1').value.trim());

  // Log the formData to check the values being sent
  console.log('Form Data:', formData);

  // Append image if there is one
  const image = document.getElementById('image1').files[0];
  if (image) {
    formData.append('image', image); // Append image if present
  }

  const submitButton = document.querySelector('button[type="submit"]');
  submitButton.disabled = true; // Disable submit button to prevent multiple submissions

  try {
    // Send data to the server to add data to MongoDB
    const response = await fetch('/api/Caplai/addRenew', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json(); // Parse the response

    console.log('Response:', result);  // Log the response

    if (response.ok) {
      // Success handling
      alert(result.message || 'Thao tác thành công!');
      resetForm(); // Reset form after success
      // Optionally, update the UI dynamically or reload the page
      location.reload(); // This reloads the page to reflect the changes
    } else {
      // Error handling
      alert(result.message || 'Đã có lỗi xảy ra.');
    }
  } catch (error) {
    console.error('Error occurred during fetch:', error);
    alert('Lỗi khi gửi dữ liệu. Vui lòng kiểm tra kết nối mạng.');
  } finally {
    submitButton.disabled = false; // Re-enable the submit button after the request is completed
  }
});
