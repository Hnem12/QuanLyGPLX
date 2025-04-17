let currentPage = 1;
const itemsPerPage = 5;
let totalPages = 0;
let allAccounts = [];

// Fetch accounts and initialize pagination
async function fetchAccounts() {
    const spinner = document.getElementById('loadingSpinner');
    spinner.classList.remove('d-none');
    try {
        const response = await fetch('/api/account');
        allAccounts = await response.json();
        totalPages = Math.ceil(allAccounts.length / itemsPerPage);
        displayAccounts(currentPage);
        updatePageControls();
    } catch (error) {
        console.error('Failed to fetch accounts:', error);
    }finally {
        // Hide the loading spinner
        spinner.classList.add('d-none');
      }
}

// Display accounts for the current page
function displayAccounts(page) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedAccounts = allAccounts.slice(start, end);
    const tableBody = document.getElementById('accountTableBody');
    
    tableBody.innerHTML = ''; // Clear the table

    paginatedAccounts.forEach((account, index) => {
        const row = `
            <tr>
                <td>${start + index + 1}</td>
                <td>${account.username}</td>
                <td>${account.Name}</td>
                <td>Điện thoại: ${account.SDT} <br> Email: ${account.email}</td>
                <td>${account.Address}</td>
                <td>${account.Gender}</td>
                <td>${account.role}</td>
                <td>
                    <img src="${account.image}" alt="Account Image" style="width: 135px; height: 110px;" />
                </td>
                <td>
                    <span class="status">${account.status}</span>
                </td>
                <td>
        <button class="btn btn-sm" 
            style="background-color: #168e60; color: white; padding: 8px; border-radius: 5px;  border: none;" 
            onclick='openModal(${JSON.stringify(account)})'>
                <i class="fas fa-eye" style="font-size: 14px; color: white; margin-left:10px"></i> <!-- Eye icon -->
        </button>
                <button class="btn btn-danger btn-sm" style="transform: scale(1.15);font-weight:bold; margin-left:5px" 
                onclick="confirmDelete('${account._id}')">Xóa</button>
                </td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', row);
    });
}



async function confirmDelete(holderId) {
    console.log("Kiểm tra khóa trước khi xóa:", holderId);
  
    const isValidKey = await verifyKey();
    if (!isValidKey) {
        console.error("Khóa bí mật không hợp lệ, dừng thao tác xóa!");
        return;
    }
  
    Swal.fire({
        title: "Bạn có chắc chắn muốn xóa?",
        text: "Hành động này không thể hoàn tác!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
        customClass: {
            popup: "pink-popup",
            confirmButton: "pink-confirm",
            cancelButton: "pink-cancel"
        }
    }).then((result) => {
        if (result.isConfirmed) {
            console.log("Xác nhận xóa GPLX:", holderId);
            deleteAccount(holderId);
        } else {
            console.log("Hủy xóa GPLX.");
        }
    });
  }

// Update pagination controls (disable buttons if needed)
function updatePageControls() {
    const pageInfo = document.getElementById('pageInfo');
    const prevButton = document.querySelector('#paginationControls button:first-child');
    const nextButton = document.querySelector('#paginationControls button:last-child');
    
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

    // Disable the "Previous" button if on the first page
    prevButton.disabled = currentPage === 1;

    // Disable the "Next" button if on the last page
    nextButton.disabled = currentPage === totalPages;
}

// Handle next page button click
function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        displayAccounts(currentPage);
        updatePageControls();
    }
}

// Handle previous page button click
function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        displayAccounts(currentPage);
        updatePageControls();
    }
}

window.onload = fetchAccounts;

document.addEventListener('DOMContentLoaded', function () {
  
    const form = document.getElementById('accountForm');
    const accountModalElement = document.getElementById('accountModal');
    const passwordContainer = document.getElementById('passwordContainer');
    const confirmPasswordContainer = document.getElementById('confirmPasswordContainer');

    // Show or hide password fields based on whether accountId is present
    accountModalElement.addEventListener('show.bs.modal', function () {
        const accountId = document.getElementById('accountId').value.trim();
        if (accountId) {
            // Hide password fields if editing an account
            passwordContainer.style.display = 'none';
            confirmPasswordContainer.style.display = 'none';
        } else {
            // Show password fields if adding a new account
            passwordContainer.style.display = 'block';
            confirmPasswordContainer.style.display = 'block';
        }
    });

    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault(); // Prevent default form submission

            // Check if there is an accountId to determine action (add or update)
            const accountId = document.getElementById('accountId').value;
            const url = accountId ? `/api/updateTK/${accountId}` : '/api/addAccount'; // Dynamic URL
            const method = accountId ? 'PUT' : 'POST'; // Use PUT for update, POST for add

            // Create FormData object to hold data
            const formData = new FormData();
            formData.append('username', document.getElementById('username').value.trim());

            // Only append password and confirmPassword if adding a new account
            if (!accountId) {
                formData.append('password', document.getElementById('password').value.trim());
                formData.append('confirmPassword', document.getElementById('confirmPassword').value.trim());
            }

            // Append other fields
            formData.append('Name', document.getElementById('name').value.trim());
            formData.append('email', document.getElementById('email').value.trim());
            formData.append('SDT', document.getElementById('phone').value.trim());
            formData.append('Address', document.getElementById('address').value.trim());
            formData.append('Gender', document.getElementById('gender').value);
            formData.append('role', document.getElementById('role').value);
            formData.append('status', document.getElementById('status').value);

            // Get selected image and append to FormData
            const imageInput = document.getElementById('image');
            const image = imageInput.files[0];
            if (image) {
                formData.append('image', image); // Append image file
            }

            // Log FormData entries
            console.log('Account Data:');
            for (const [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }

            // Validate required fields
            const validationError = validateAccountForm({
                username: formData.get('username'),
                password: !accountId ? formData.get('password') : undefined, // Validate password when adding
                confirmPassword: !accountId ? formData.get('confirmPassword') : undefined, // Validate confirmPassword when adding
                Name: formData.get('Name'),
                email: formData.get('email'),
                SDT: formData.get('SDT'),
                Address: formData.get('Address'),
                Gender: formData.get('Gender'),
                role: formData.get('role')
            });
            if (validationError) {
                alert(validationError);
                return;
            }

            try {
                // Send FormData to backend
                const response = await fetch(url, {
                    method: method,
                    body: formData, // Send FormData instead of JSON
                });

                // Handle response
                if (!response.ok) {
                    const result = await response.json();
                    alert(result.message || 'Đã có lỗi xảy ra, vui lòng thử lại.');
                    return;
                }

                // If successful, notify the user and reload the page
                Swal.fire({
                    html: `
                        <div class="custom-alert">
                            <img src="https://cdn-icons-png.flaticon.com/512/845/845646.png" class="custom-icon" />
                            <span class="custom-title">
                                ${accountId ? 'Cập nhật tài khoản thành công!' : 'Thêm tài khoản thành công!'}
                            </span>
                        </div>
                    `,
                    showConfirmButton: false,
                    allowOutsideClick: true,
                    width: "450px",
                    position: "top",
                    background: "#f6fff8",
                    customClass: {
                        popup: "custom-alert-popup"
                    },
                    timer: 5000 // Tự động đóng sau 2 giây
                });
                resetForm();
                location.reload();
            } catch (error) {
                alert('Lỗi khi gửi dữ liệu. Vui lòng kiểm tra kết nối mạng.');
                console.error('Error:', error);
            }
        });

        accountModalElement.addEventListener('hidden.bs.modal', resetForm); // Reset form when modal is hidden
    }
});



// Hàm để xác thực biểu mẫu tài khoản
function validateAccountForm(accountData) {
    if (!accountData.username || !accountData.Name || !accountData.email || !accountData.SDT || !accountData.Address || !accountData.Gender || !accountData.role) {
        return 'Vui lòng điền đầy đủ các trường bắt buộc.';
    }
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(accountData.email)) {
        return 'Vui lòng nhập địa chỉ email hợp lệ.';
    }
    // Kiểm tra xác nhận mật khẩu
 
    return null; 
}

// Open modal for both adding and editing accounts
async function openModal(accountData) {
    const isValidKey = await verifyKey();
    if (!isValidKey) {
        console.error("Khóa bí mật không hợp lệ, dừng thao tác kiểm định!");
        return;
    }
    const modalTitle = document.getElementById('accountModalLabel');
    const submitBtn = document.getElementById('submitBtn');
    const accountIdField = document.getElementById('accountId');
    const usernameField = document.getElementById('username');
    const passwordField = document.getElementById('password');
    const confirmPasswordField = document.getElementById('confirmPassword'); // New field for confirm password
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const phoneField = document.getElementById('phone');
    const addressField = document.getElementById('address');
    const genderField = document.getElementById('gender');
    const roleField = document.getElementById('role'); // Role field
    const status = document.getElementById('status');

    if (accountData) {
        // Populate modal for editing
        modalTitle.textContent = 'Sửa Tài Khoản';
        submitBtn.textContent = 'Cập Nhật';

        // Populate fields with existing data
        accountIdField.value = accountData._id;
        usernameField.value = accountData.username;
        passwordField.value = accountData.password; // Leave password blank for editing
        confirmPasswordField.value = accountData.password; // Leave confirm password blank for editing
        nameField.value = accountData.Name;
        emailField.value = accountData.email;
        phoneField.value = accountData.SDT;
        addressField.value = accountData.Address;
        genderField.value = accountData.Gender;
        roleField.value = accountData.role; // Set role based on existing data
        status.value = accountData.status;
    } else {
        // Reset modal for adding
        modalTitle.textContent = 'Thêm Tài Khoản';
        submitBtn.textContent = 'Lưu';

        accountIdField.value = '';
        usernameField.value = '';
        passwordField.value = '';
        confirmPasswordField.value = '';
        nameField.value = '';
        emailField.value = '';
        phoneField.value = '';
        addressField.value = '';
        genderField.value = '';
        roleField.value = 'User'; // Default role
        status.value = 'Inactive';
    }

    // Show the modal
    const accountModal = new bootstrap.Modal(document.getElementById('accountModal'));
    accountModal.show();
}
// Open modal for editing an existing account

function displayError(message) {
    // Implement your error display logic here (e.g., show in a div)
    alert(message); // For now, we just use alert
}

// Function to reset the form
function resetForm() {
    document.getElementById('accountForm').reset(); // Reset form fields
    // If you want to clear specific fields or reset to specific values, you can do so here
    document.getElementById('accountId').value = ''; // Clear holderId
    // Add more fields here if needed
  }

  async function openAddInspectionModal() {
    const isValidKey = await verifyKey(); // Kiểm tra khóa
  
    if (!isValidKey) { 
      console.error("Khóa bí mật không hợp lệ, dừng thao tác thêm!");
      Swal.fire({
        title: "❌ Lỗi xác thực!",
        text: "Khóa bí mật không hợp lệ. Vui lòng kiểm tra lại.",
        icon: "error",
        confirmButtonText: "OK"
      });
      return; // Không mở modal
    }
  
    // Nếu khóa hợp lệ, mở modal
    const modal = new bootstrap.Modal(document.getElementById('accountModal'));
    modal.show();
  }


// Delete account function
async function deleteAccount(id) {
   

    try {
        const response = await fetch(`/api/account/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            Swal.fire({
                html: `
                    <div class="custom-alert">
                        <img src="https://cdn-icons-png.flaticon.com/512/845/845646.png" class="custom-icon" />
                        <span class="custom-title">Xóa thành công!!!</span>
                    </div>
                `,
                showConfirmButton: false, // Ẩn nút mặc định
                allowOutsideClick: true, // Không cho đóng khi click ra ngoài
                width: "450px", // Giảm kích thước popup
                position: "top", // Hiển thị trên cao
                background: "#f6fff8", // Màu nền nhẹ nhàng
                customClass: {
                popup: "custom-alert-popup"
                }
            }); 
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
