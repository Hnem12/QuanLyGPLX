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
            <td> <img src="${holder.image}" alt="Account Image" style="width: 120px; height: 100px;" /> </td>
            <td>${new Date(holder.DateOfBirth).toLocaleDateString()}</td>
            <td>${holder.CCCD}</td>
            <td>${holder.BuocKiemDinh}</td>
            <td>${holder.NguoiKiemDinh}</td>
            <td>${new Date(holder.NgayKiemDinh).toLocaleDateString()}</td>

            <td><span class="status">${holder.Status}</span></td>
            <td>
                <button class="button-tacvu" onclick='openModal(${JSON.stringify(holder)})'>Xem</button>
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

// Function to open modal for editing


// Function to show the secret key modal (with existing modal close logic)
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

  // If you have other elements like textareas or select elements, reset them similarly:
  const modalSelects = document.querySelectorAll('#secretKeyModal select');
  modalSelects.forEach(select => {
    select.selectedIndex = 0; // Reset select to the first option
  });
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

// Xử lý khi nhấn nút xác nhận trong modal
document.getElementById('submitKey').addEventListener('click', async function () {
  const holderId = document.getElementById('holderId').value.trim(); // Lấy giá trị holderId
  const privateKey = document.getElementById('privateKeyInput').value.trim(); // Lấy giá trị khóa bí mật

  // Kiểm tra các trường nhập
  if (!holderId || !privateKey) {
    alert('ID người dùng hoặc khóa bí mật không hợp lệ.');
    return;
  }

  hideModal(); // Ẩn modal sau khi xác nhận
  await pushAllDataToBlockchain(holderId, privateKey); // Truyền holderId và privateKey vào hàm
});

// Xử lý khi nhấn nút hủy trong modal
document.getElementById('cancelKey').addEventListener('click', hideModal);



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

  // Close any previously open modals (if any)
  const existingLicenseHolderModal = bootstrap.Modal.getInstance(document.getElementById('licenseHolderModal'));
  if (existingLicenseHolderModal) {
    existingLicenseHolderModal.hide();
  }

  const existingSecretKeyModal = document.getElementById('secretKeyModal');
  if (existingSecretKeyModal && existingSecretKeyModal.style.display === 'flex') {
    existingSecretKeyModal.style.display = 'none';
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

// Function to show the secret key modal (with existing modal close logic)
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
    pushDataButton.addEventListener('click', showModal); // Just show modal
  } else {
    console.warn("Button with ID 'pushDataButton1' not found.");
  }
}

// Handle submit key button
document.getElementById('submitKey').addEventListener('click', async function () {
  const holderId = document.getElementById('holderId').value.trim(); // Get holder ID
  const privateKey = document.getElementById('privateKeyInput').value.trim(); // Get private key

  // Validate input fields

  hideModal(); // Hide modal after confirmation
  await pushAllDataToBlockchain(holderId, privateKey); // Push data to blockchain
});

// Handle cancel button in modal
document.getElementById('cancelKey').addEventListener('click', hideModal);

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
      return;
    }

    // Kiểm tra xem trường kiemdinhGPLX có phải là mảng hay không
    const activatedHolders = Array.isArray(kiemdinhGPLX) ? kiemdinhGPLX.filter(holder => holder.Status === 'Đang kiểm định') : [kiemdinhGPLX];

    // Kiểm tra nếu không có người dùng đang kiểm định
    if (activatedHolders.length === 0) {
      alert("Không có người dùng đã kích hoạt.");
      return;
    }

    console.log('Activated Holders:', activatedHolders);

    // Lấy thông tin khóa CA
    const caKeyInfo = await getCAKeyInfo();
    if (!caKeyInfo) {
      alert("Thông tin khóa CA không hợp lệ.");
      return;
    }

    // Lấy ID người dùng từ localStorage
    const idSignature = localStorage.getItem('accountId');
    if (!idSignature) {
      alert("ID người dùng không tồn tại.");
      return;
    }

    // Đẩy dữ liệu lên blockchain cho từng người dùng
    const promises = activatedHolders.map(holder => {
      return pushDataToBlockchain(holder, idSignature, caKeyInfo, privateKey);
    });
    await Promise.all(promises);
    alert("Dữ liệu đã được đẩy vào BlockChain thành công!");
  } catch (error) {
    console.error("Error:", error);
    alert("Có lỗi xảy ra khi đẩy dữ liệu vào BlockChain.");
  }
}

// Push individual license holder data to blockchain
async function pushDataToBlockchain(holder, idSignature, caKeyInfo, privateKey) {
  const dataToPush = {
    idSignature: caKeyInfo.accountId,
    MaGPLX: holder.MaGPLX,
    Tenchusohuu: holder.Name, // Assuming 'Name' refers to 'Tenchusohuu'
    image: holder.image, // Directly pass the image path (this could be URL or file path)
    Ngaysinh: holder.DateOfBirth, // Assuming 'DateOfBirth' is the actual date
    CCCD: holder.CCCD, // Assuming 'CCCD' is the actual ID number
    address: holder.Address, // Assuming 'Address' holds the actual address
    status: holder.Status, // Assuming 'Status' holds the current status of the license
    publicKey: caKeyInfo.publicKey, // Assuming we use the retrieved public key
    mspId: caKeyInfo.mspId, // Assuming we use the mspId from CA key info
    privateKey: privateKey, // Using the provided private key
  };

  // Logic for pushing this data to your blockchain
  // Code for interacting with Hyperledger Fabric or another blockchain system would go here
  console.log("Data to push:", dataToPush);

  // For this example, we assume that this will just log the data and resolve the promise
  return Promise.resolve();
}
