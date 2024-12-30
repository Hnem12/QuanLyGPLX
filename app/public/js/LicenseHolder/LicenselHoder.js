let currentPage = 1;
const pageSize = 5; // Set the number of items per page

async function fetchLicenseHolders() {
  // Show the loading spinner
  const spinner = document.getElementById('loadingSpinner');
  spinner.classList.remove('d-none');

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
            <td> <img src="${holder.image}" alt="Account Image" style="width: 135px; height: 105px;" /> </td>
            <td>${new Date(holder.DateOfBirth).toLocaleDateString()}</td>
            <td>${holder.CCCD}</td>
            <td>${holder.Address}</td>
            <td>
              SĐT: ${holder.PhoneNumber} <br>
              Email: <span class="email" title="${holder.Email}">${holder.Email}</span>
            </td>
            <td>${new Date(holder.Ngaycap).toLocaleDateString()}</td>
            <td>${new Date(holder.Ngayhethan).toLocaleDateString()}</td>
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
  } finally {
    // Hide the loading spinner
    spinner.classList.add('d-none');
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
  document.getElementById('licenseHolderModalLabel').innerText = 'Thông tin Chủ Sở Hữu';

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

  console.log('Form submission started');
  console.log('Method:', method);
  console.log('URL:', url);

  // Gather form data
  const formData = new FormData(); // Use FormData to send the image file

  // Append form data
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
  formData.append('Status', document.getElementById('status').value);
  formData.append('Giamdoc', document.getElementById('giamdoc').value.trim());

  // Append image if available
  const image = document.getElementById('image').files[0];
  if (image) {
    formData.append('image', image); // Add the image file to formData
    console.log('Image selected:', image);
  } else {
    console.log('No image selected');
  }

  // Send data to the server
  try {
      console.log('Sending request to server...');
      const response = await fetch(url, {
          method: method,
          body: formData // Send formData (including the image)
      });

      console.log('Server response received');
      const result = await response.json();
      console.log('Response data:', result);

      if (response.ok) {
          alert(result.message || 'Thao tác thành công!');
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
}async function getCAKeyInfo() {
  const accountId = localStorage.getItem('accountId');
  if (!accountId) {
    alert("Account ID không tồn tại. Vui lòng đăng nhập lại.");
    return null;
  }

  try {
    const response = await fetch(`/api/LayCA/${accountId}`);
    if (response.ok) {
      try {
        const data = await response.json();
        const { publicKey, mspId, type, accountId: fetchedAccountId } = data;

        if (!publicKey || !mspId || !type || !fetchedAccountId) {
          alert("Thông tin chứng chỉ không hợp lệ.");
          return null;
        }

        return { publicKey, mspId, type, accountId: fetchedAccountId };
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError);
        alert("Định dạng phản hồi từ máy chủ không hợp lệ.");
        return null;
      }
    } else {
      const errorData = await response.json();
      alert(errorData.message || "Có lỗi xảy ra khi lấy thông tin chứng chỉ.");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving CA key info:", error);
    alert("Có lỗi xảy ra khi lấy thông tin chứng chỉ. Vui lòng thử lại.");
    return null;
  }
}

function showSecretKeyModal() {
  const modal = document.getElementById("secretKeyModal");
  modal.style.display = "flex";
}

function hideSecretKeyModal() {
  const modal = document.getElementById("secretKeyModal");
  
  // Reset the form inside the modal
  const privateKeyInput = document.getElementById("privateKeyInput");
  if (privateKeyInput) {
    privateKeyInput.value = ""; // Clear the input value
  }

  modal.style.display = "none";
}

function setupPushDataButton() {
  const pushDataButton = document.getElementById("pushDataButton");

  if (pushDataButton) {
    pushDataButton.addEventListener("click", async () => {
      console.log("Push Data Button clicked");
      await pushAllDataToBlockchain();
    });
  } else {
    console.warn("Button with ID 'pushDataButton' not found.");
  }
}

async function waitForPrivateKeyInput() {
  return new Promise((resolve, reject) => {
    const submitButton = document.getElementById("submitKey");
    const cancelButton = document.getElementById("cancelKey");
    const privateKeyInput = document.getElementById("privateKeyInput");

    submitButton.replaceWith(submitButton.cloneNode(true));
    cancelButton.replaceWith(cancelButton.cloneNode(true));

    const newSubmitButton = document.getElementById("submitKey");
    const newCancelButton = document.getElementById("cancelKey");

    newSubmitButton.addEventListener("click", () => {
      const privateKey = privateKeyInput.value;
      if (!privateKey) {
        alert("Khóa bí mật không hợp lệ.");
        reject("Private key is invalid");
        return;
      }
      hideSecretKeyModal();
      resolve(privateKey);
    });

    newCancelButton.addEventListener("click", () => {
      console.log("Private key input canceled.");
      hideSecretKeyModal();
      reject("Private key input was canceled");
    });
  });
}

async function pushAllDataToBlockchain() {
  try {
    const response = await fetch(`/api/licenseHolder?page=${currentPage}&pageSize=${pageSize}`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const { licenseHolders } = await response.json();
    if (!licenseHolders?.length) {
      alert("Không có dữ liệu người dùng để đẩy vào blockchain.");
      return;
    }

    const caKeyInfo = await getCAKeyInfo();
    if (!caKeyInfo) {
      alert("Thông tin khóa CA không hợp lệ.");
      return;
    }

    const idSignature = localStorage.getItem("accountId");
    if (!idSignature) {
      alert("ID người dùng không tồn tại.");
      return;
    }

    const activatedHolders = licenseHolders.filter(
      (holder) => holder.Status === "Đã kích hoạt"
    );

    if (activatedHolders.length === 0) {
      alert("Không có người dùng đã kích hoạt.");
      return;
    }

    showSecretKeyModal();
    const privateKey = await waitForPrivateKeyInput();

    const promises = activatedHolders.map((holder) =>
      pushDataToBlockchain(holder, idSignature, caKeyInfo, privateKey)
    );

    await Promise.all(promises);
    alert("Tất cả dữ liệu đã được đẩy vào BlockChain thành công!");
  } catch (error) {
    console.error("Error:", error);
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
    const blockchainResponse = await fetch("/api/createData", {
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
    } else {
      console.log(`Data pushed successfully for MaGPLX: ${holder.MaGPLX}`);
    }
  } catch (error) {
    console.error(`Error pushing data for MaGPLX: ${holder.MaGPLX}`, error);
    alert(`Có lỗi khi đẩy dữ liệu cho MaGPLX: ${holder.MaGPLX}`);
  }
}

document.addEventListener("DOMContentLoaded", setupPushDataButton);