let currentPage = 1;
const pageSize = 5; // Set the number of items per page

async function fetchKiemDinhGPLX() {
  const spinner = document.getElementById('loadingSpinner');
  spinner.classList.remove('d-none');
  try {
    // Lấy dữ liệu từ API kiểm định GPLX
    const response = await fetch(`/api/kiemdinh/getall?page=${currentPage}&pageSize=${pageSize}`);
    if (!response.ok) {   
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const { kiemdinhGPLXList, totalPages } = data;

    const tableBody = document.getElementById('accountTableBody');
    tableBody.innerHTML = ''; // Clear previous rows

    kiemdinhGPLXList.forEach((holder, index) => {
      if (holder.Status === 'Đang kiểm định') {
        const row = `
          <tr>
            <td>${(currentPage - 1) * pageSize + index + 1}</td>
            <td>${holder.MaGPLX}</td>
            <td>${holder.Name}</td>
            <td> <img src="${holder.image}" alt="Account Image" style="width: 135px; height: 110px;" /> </td>
            <td>${new Date(holder.DateOfBirth).toLocaleDateString()}</td>
            <td>${holder.CCCD}</td>
            <td>${holder.BuocKiemDinh}</td>
            <td>${holder.NguoiKiemDinh}</td>
            <td>${new Date(holder.NgayKiemDinh).toLocaleDateString()}</td>

            <td><span class="status">${holder.Status}</span></td>
            <td>
             <button class="btn btn-sm" 
        style="background-color: #168e60; color: white; padding: 8px; border-radius: 5px;  border: none;" 
        onclick='openModal(${JSON.stringify(holder)})'>
                <i class="fas fa-eye" style="font-size: 14px; color: white;"></i> <!-- Eye icon -->
            </button>
                        <button class="btn btn-danger btn-sm" style="transform: scale(1.10); margin-left: 5px;font-weight:bold;" onclick="deleteKiemdinh('${holder._id}')">Xóa</button>

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


// Cập nhật hàm setupPushDataButton
function setupPushDataButton() {
  const pushDataButton = document.getElementById('pushDataButton1');
  if (pushDataButton) {
    console.log('Button exists, adding event listener.');

    // Lắng nghe sự kiện click và hiển thị modal
    pushDataButton.addEventListener('click', showModal); // Chỉ hiển thị modal
  } else {
    console.warn("Button with ID 'pushDataButton1' not found.");
  }
}
// Get Certificate Authority (CA) Key Info
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

      // Validate the essential fields
      if (!publicKey || !mspId || !type || !accountId) {
        alert("Thông tin chứng chỉ không hợp lệ.");
        return null;
      }

      console.log('CA Key Info:', data);  // Log CA key info for debugging
      // Return CA key data with accountId
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
  document.getElementById('gender').value = holder.Gender || '';
  document.getElementById('phone').value = holder.PhoneNumber || '';
  document.getElementById('email').value = holder.Email || '';
  document.getElementById('address').value = holder.Address || '';
  document.getElementById('issueDate').value = holder.Ngaycap ? holder.Ngaycap.split('T')[0] : '';
  document.getElementById('expiryDate').value = holder.Ngayhethan ? holder.Ngayhethan.split('T')[0] : '';
  document.getElementById('ngaytrungtuyen').value = holder.Ngaytrungtuyen ? holder.Ngaytrungtuyen.split('T')[0] : '';
  document.getElementById('hangGPLX').value = holder.HangGPLX || '';
  document.getElementById('country').value = holder.Country || '';
  document.getElementById('status').value = holder.Status || 'Đang kiểm định';
  document.getElementById('giamdoc').value = holder.Giamdoc || ''; 

  // Change modal title
  document.getElementById('licenseHolderModalLabel').innerText = 'Thông tin Chủ Sở Hữu';

  // Log holder._id to see the data
  console.log("Holder ID being passed:", holder._id);

  // Show the modal using Bootstrap's Modal API
  const licenseHolderModal = new bootstrap.Modal(document.getElementById('licenseHolderModal'));
  licenseHolderModal.show();

  // Setup the push data button with the holder's ID
  setupPushDataButton(holder._id);
}

// Function to show the secret key modal
function showModal() {
  const existingLicenseHolderModal = bootstrap.Modal.getInstance(document.getElementById('licenseHolderModal'));
  if (existingLicenseHolderModal) {
    existingLicenseHolderModal.hide();
  }

  const modal = document.getElementById('secretKeyModal');
  // Show the private key modal
  if (modal) {
    modal.style.display = 'flex';
  }
}

function hideModal() {
  const modal = document.getElementById('secretKeyModal');
  // Hide the private key modal
  if (modal) {
    modal.style.display = 'none';
  }
  resetModalForm();
}

function resetModalForm() {
  // Reset all input fields inside the modal
  const modalInputs = document.querySelectorAll('#secretKeyModal input');
  modalInputs.forEach(input => {
    input.value = ''; // Reset each input field
  });

  // Reset image input field
  const imageInput = document.querySelector('#secretKeyModal input[type="file"]');
  if (imageInput) {
    imageInput.value = ''; // Clear the file input (image)
  }

  // Reset date input fields
  const dateInputs = document.querySelectorAll('#secretKeyModal input[type="date"]');
  dateInputs.forEach(input => {
    input.value = ''; // Clear date input
  });

  // If you have other elements like textareas or select elements, reset them similarly:
  const modalSelects = document.querySelectorAll('#secretKeyModal select');
  modalSelects.forEach(select => {
    select.selectedIndex = 0; // Reset select to the first option
  });
}



// Setup push data button to show secret key modal
function setupPushDataButton(holderId) {
  const pushDataButton = document.getElementById('pushDataButton1');
  if (pushDataButton) {
    console.log('Button exists, adding event listener.');

    // Listen for click event and show modal
    pushDataButton.addEventListener('click', function() {
      showModal(); // Show modal when button is clicked
    });
  } else {
    console.warn("Button with ID 'pushDataButton1' not found.");
  }
}

async function pushDataToBlockchain(holder, idSignature, caKeyInfo, privateKey) {
  const dataToPush = {
    idSignature: caKeyInfo.accountId,
    MaGPLX: holder.MaGPLX,
    Tenchusohuu: holder.Name,
    image: holder.image,
    Ngaysinh: holder.DateOfBirth,
    CCCD: holder.CCCD,
    Gender: holder.Gender,
    Ngaytrungtuyen: holder.Ngaytrungtuyen,
    Ngaycap: holder.Ngaycap,
    Ngayhethan: holder.Ngayhethan,
    Address: holder.Address,
    PhoneNumber: holder.PhoneNumber,
    Email: holder.Email,
    Status: holder.Status,
    Giamdoc: holder.Giamdoc,
    Loivipham: holder.Loivipham,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    HangGPLX: holder.HangGPLX,
    Country: holder.Country,
    signature: {
      credentials: {
        certificate: caKeyInfo.publicKey,
        privateKey: privateKey,
      },
      mspId: caKeyInfo.mspId,
      type: caKeyInfo.type,
      version: 1,
    },
  };

  try {
    const blockchainResponse = await fetch("/api/createDataformKiemdinh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToPush),
    });

    if (!blockchainResponse.ok) {
      const errorResponse = await blockchainResponse.text();
      console.error(
        `Failed to push data to blockchain for MaGPLX: ${holder.MaGPLX}`,
        errorResponse
      );
      return `Có lỗi khi đẩy dữ liệu cho MaGPLX: ${holder.MaGPLX}`;
    } else {
      console.log(`Data pushed successfully for MaGPLX: ${holder.MaGPLX}`);
      return `Dữ liệu đã được đẩy lên blockchain thành công cho MaGPLX: ${holder.MaGPLX}`;
    }
  } catch (error) {
    console.error(`Error pushing data for MaGPLX: ${holder.MaGPLX}`, error);
    return `Có lỗi khi đẩy dữ liệu cho MaGPLX: ${holder.MaGPLX}`;
  }
}

const imageInput = document.getElementById('image');
const pushDataButton = document.getElementById('pushDataButton1');

// Kiểm tra xem người dùng đã chọn ảnh chưa
imageInput.addEventListener('change', function() {
    // Nếu có ảnh được chọn, kích hoạt nút
    if (imageInput.files.length > 0) {
        pushDataButton.disabled = false;
    } else {
        pushDataButton.disabled = true;
    }
});

// Handle the Submit Key button inside the modal
document.getElementById('submitKey').addEventListener('click', async function () {
  const holderId = document.getElementById('holderId').value.trim(); // Get holder ID
  const privateKey = document.getElementById('privateKeyInput').value.trim(); // Get private key

  if (!holderId ||  !privateKey ||
    !privateKey.startsWith("-----BEGIN PRIVATE KEY-----") ||
    !privateKey.endsWith("-----END PRIVATE KEY-----")
  ) {
    document.getElementById("privateKeyInput").value = "";
    Swal.fire({
      html: 
          `<div class="custom-alert">
          <img src="https://cdn-icons-png.flaticon.com/512/564/564619.png" class="custom-icon" />
          <span class="custom-title">Khóa bí mật không hợp lệ. Vui lòng nhập lại!</span>
          </div>`
      ,
      showConfirmButton: false,
      allowOutsideClick: true,
      width: "420px",
      position: "top",
      background: "#f6fff8",
      customClass: {
          popup: "custom-alert-popup"
      }
    });
    throw new Error("Private key is invalid");
  }      

  hideModal(); // Hide the modal after confirmation

  try {
    // Push all data to the blockchain
    const result = await pushAllDataToBlockchain(holderId, privateKey);
    
    // Only if blockchain push is successful, proceed with form submission
    if (result && result.success) {
      await submitFormData();
    }
  } catch (error) {
    console.error("Error in data processing:", error);
    alert("Có lỗi xảy ra trong quá trình xử lý dữ liệu.");
  }
});

// Push all data to the blockchain
async function pushAllDataToBlockchain(holderId, privateKey) {
  try {
    // Fetch license holders from the API using the passed 'holderId'
    const response = await fetch(`/api/kiemdinh/getdata/${holderId}`);
    console.log('API Response Status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the response as JSON
    const data = await response.json();
    console.log('Fetched license holders:', data);

    // Kiểm tra nếu dữ liệu trả về có trường kiemdinhGPLX
    const kiemdinhGPLX = data.kiemdinhGPLX;

    if (!kiemdinhGPLX) {
      alert("Không có dữ liệu người dùng.");
      return { success: false };
    }

    // Kiểm tra xem trường kiemdinhGPLX có phải là mảng hay không
    const activatedHolders = Array.isArray(kiemdinhGPLX) ? kiemdinhGPLX.filter(holder => holder.Status === 'Đang kiểm định') : [kiemdinhGPLX];

    // Kiểm tra nếu không có người dùng đang kiểm định
    if (activatedHolders.length === 0) {
      alert("Không có người dùng đã kích hoạt.");
      return { success: false };
    }

    console.log('Activated Holders:', activatedHolders);

    // Lấy thông tin khóa CA
    const caKeyInfo = await getCAKeyInfo();
    if (!caKeyInfo) {
      alert("Thông tin khóa CA không hợp lệ.");
      return { success: false };
    }

    // Lấy ID người dùng từ localStorage
    const idSignature = localStorage.getItem('accountId');
    if (!idSignature) {
      alert("ID người dùng không tồn tại.");
      return { success: false };
    }

    // Đẩy dữ liệu lên blockchain cho từng người dùng
    const promises = activatedHolders.map(holder => {
      return pushDataToBlockchain(holder, idSignature, caKeyInfo, privateKey);
    });
    const results = await Promise.all(promises);
    alert("Dữ liệu đã được đẩy vào BlockChain thành công!");
    return { success: true, results };
  } catch (error) {
    console.error("Error:", error);
    alert("Có lỗi xảy ra khi đẩy dữ liệu vào BlockChain.");
    return { success: false, error };
  }
}

// Form submission function that will only be called after blockchain push succeeds
// Define the resetForm function
function resetForm() {
  // Reset the form fields
  document.getElementById('licenseHolderForm').reset();
  
  // If you have any additional reset logic, add it here
  // For example, clearing any preview images or resetting custom fields
  const imageInput = document.getElementById('image');
  if (imageInput) {
    imageInput.value = ""; // Clear the file input
  }
  
  // Reset any validation states if needed
  const formElements = document.getElementById('licenseHolderForm').elements;
  for (let i = 0; i < formElements.length; i++) {
    // Remove any validation classes/highlights if you have them
    formElements[i].classList.remove('error'); // Example: remove error class
  }
  
  // Additional reset logic if needed
  console.log("Form has been reset");
}

// Updated Form submission function
async function submitFormData() {
  try {
    const messages = [];
    console.log("Starting form submission...");
    
    // Create FormData
    const formData = new FormData();
    formData.append('MaGPLX', document.getElementById('gplx').value.trim());
    formData.append('Name', document.getElementById('name').value.trim());
    formData.append('DateOfBirth', document.getElementById('dob').value);
    formData.append('CCCD', document.getElementById('cccd').value.trim());
    formData.append('Gender', document.getElementById('gender').value);
    formData.append('Address', document.getElementById('address').value.trim());
    formData.append('PhoneNumber', document.getElementById('phone').value.trim());
    formData.append('Email', document.getElementById('email').value.trim());
    formData.append('HangGPLX', document.getElementById('hangGPLX').value);
    formData.append('Country', document.getElementById('country').value);
    formData.append('Ngaycap', document.getElementById('issueDate').value);
    formData.append('Ngayhethan', document.getElementById('expiryDate').value);
    formData.append('Ngaytrungtuyen', document.getElementById('ngaytrungtuyen').value);
    formData.append('Status', 'Đã kích hoạt');
    formData.append('Giamdoc', document.getElementById('giamdoc').value.trim());
    formData.append('NgayKiemDinh', new Date().toISOString());
    formData.append('NguoiKiemDinh', 'Adminkd');
    formData.append('BuocKiemDinh', 'Hoàn tất kiểm định');
    
    // Handle image if present
    const image = document.getElementById('image').files[0];
    if (image) {
      formData.append('image', image);
    }

    // Send request
    const url = '/api/addLicenseHoldertoKiemdinh';
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    // Parse response
    const result = await response.json();

    if (response.ok) {
      messages.push(result.message || 'Thêm GPLX thành công!');
      
      // Get holder ID
      const newHolderId = document.getElementById('holderId').value || result.data._id;
      
      // Delete KD
      try {
        await deleteKD(newHolderId);
      } catch (deleteError) {
        console.error("Error in deleteKD:", deleteError);
        messages.push("Lỗi khi xóa dữ liệu kiểm định, nhưng dữ liệu đã được thêm thành công.");
      }
      
      // Reset and reload
      resetForm(); // Now this function is defined
      location.reload();
    } else {
      messages.push(result.message || 'Đã có lỗi xảy ra khi thêm GPLX.');
      alert(messages.join('\n'));
    }
  } catch (error) {
    console.error('Detailed error during form submission:', error);
    alert('Có lỗi xảy ra khi gửi dữ liệu: ' + error.message);
  }
}


// Function to delete account by holderId
async function deleteKD(holderId) {
  if (!holderId) {
    console.error('Invalid holder ID');
    return;
  }

  try {
    const response = await fetch(`/api/kiemdinh/${holderId}`, {
      method: 'DELETE'
    });

    const result = await response.json();
    if (response.ok) {
      location.reload(); // Tải lại trang sau khi xóa
    } else {
      alert(result.message || 'Lỗi khi xóa, vui lòng thử lại.');
    }
  } catch (error) {
    console.error('Lỗi:', error);
    alert('Lỗi khi gửi yêu cầu xóa. Vui lòng kiểm tra kết nối mạng.');
  }
}

async function deleteKiemdinh(holderId) {
  if (!holderId) {
    console.error('Invalid holder ID');
    return;
  }

  try {
    const response = await fetch(`/api/kiemdinh/${holderId}`, {
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


// Modify your DOMContentLoaded event to set up the form and modal but not handle submission
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('licenseHolderForm');
  const secretKeyModal = document.getElementById('secretKeyModal');
  const cancelButton = document.getElementById('cancelKey');

  form.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent default form submission behavior
    secretKeyModal.style.display = 'flex'; // Show the modal
  });

  cancelButton.addEventListener('click', function () {
    secretKeyModal.style.display = 'none';
  });
});