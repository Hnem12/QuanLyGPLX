let currentPage = 1;
const pageSize = 5; // Set the number of items per page

async function fetchKiemDinhGPLX() {
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
  document.getElementById('status').value = holder.Status || 'Đang kiểm định';
  document.getElementById('giamdoc').value = holder.Giamdoc || ''; 

  // Change modal title
  document.getElementById('licenseHolderModalLabel').innerText = 'Thông tin Chủ Sở Hữu';

  // Log holder._id to see the data
  console.log("Holder ID being passed:", holder._id);

  // Call the API directly with the holder._id (id)
  // Show the modal using Bootstrap's Modal API
  const licenseHolderModal = new bootstrap.Modal(document.getElementById('licenseHolderModal'));
  licenseHolderModal.show();

  // Setup the push data button with the holder's ID
  setupPushDataButton(holder._id);
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
function setupPushDataButton() {
  const pushDataButton = document.getElementById('pushDataButton1');
  if (pushDataButton) {
    console.log('Button exists, adding event listener.');

    // Lấy ID từ modal và truyền vào hàm pushAllDataToBlockchain
    pushDataButton.addEventListener('click', () => {
      const holderId = document.getElementById('holderId').value;  // Lấy ID từ modal
      console.log('holderId:', holderId);  // Kiểm tra giá trị holderId
      pushAllDataToBlockchain(holderId);  // Truyền ID vào đây
    });
  } else {
    console.warn("Button with ID 'pushDataButton1' not found.");
  }
}
// Fetch license holders from the API using the passed 'holderId'
async function pushAllDataToBlockchain(holderId) {
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

    // Nhập khóa bí mật của người dùng
    const privateKey = prompt("Nhập khóa bí mật:");
    if (!privateKey) {
      alert("Khóa bí mật không hợp lệ.");
      return;
    }

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
    MaGPLX: holder.MaGPLX,
    Tenchusohuu: holder.Name, // Assuming 'Name' refers to 'Tenchusohuu'
    image: holder.image, // Directly pass the image path (this could be URL or file path)
    Ngaysinh: holder.DateOfBirth, // Assuming 'DateOfBirth' refers to 'Ngaysinh'
    CCCD: holder.CCCD,
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
    
    // Include the signature information
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
    console.log(`Data pushed successfully for MaGPLX: ${holder.MaGPLX}`, responseData);  // Log blockchain response
  } catch (error) {
    console.error(`Error pushing data for MaGPLX: ${holder.MaGPLX}`, error);
    alert(`Có lỗi khi đẩy dữ liệu cho MaGPLX: ${holder.MaGPLX}`);
  }
}
