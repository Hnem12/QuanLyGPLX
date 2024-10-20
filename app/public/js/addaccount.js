// Fetch accounts and populate the table
async function fetchAccounts() {
    try {
        const response = await fetch('/api/account');
        const accounts = await response.json();
        const tableBody = document.getElementById('accountTableBody');

        tableBody.innerHTML = ''; // Clear table before populating

        accounts.forEach((account, index) => {
            const row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${account.username}</td>
                    <td>${account.Name}</td>
                    <td>Điện thoại: ${account.SDT} <br>Email: ${account.email}</td>
                    <td>${account.Address}</td>
                    <td>${account.Gender}</td>
                    <td>${account.role}</td>
                   <td>
                        <img src="${account.image}" alt="Account Image" style="width: 100px; height: auto;" />
                    </td>
                     <td>
                        <span class="status">${account.status}</span>
                    </td>     
                    <td>              
                        <button class="btn btn-warning btn-sm" onclick='openModal(${JSON.stringify(account)})'>Sửa</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteAccount('${account._id}')">Xóa</button>
                    </td>
                </tr>
            `;
            tableBody.insertAdjacentHTML('beforeend', row);
        });
    } catch (error) {
        console.error('Failed to fetch accounts:', error);
    }
}
window.onload = fetchAccounts;


document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('accountForm');
    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault(); // Ngăn chặn việc gửi biểu mẫu mặc định

            // Kiểm tra xem có accountId không để xác định hành động (thêm hoặc sửa)
            const accountId = document.getElementById('accountId')?.value;
            const url = accountId ? `/api/updateTK/${accountId}` : '/api/addAccount'; // URL động
            const method = accountId ? 'PUT' : 'POST'; // Sử dụng PUT cho cập nhật, POST cho thêm mới

            // Tạo đối tượng FormData để chứa dữ liệu
            const formData = new FormData();
            formData.append('username', document.getElementById('username')?.value.trim());
            formData.append('password', document.getElementById('password')?.value.trim());
            formData.append('confirmPassword', document.getElementById('confirmPassword')?.value.trim());
            formData.append('Name', document.getElementById('name')?.value.trim());
            formData.append('email', document.getElementById('email')?.value.trim());
            formData.append('SDT', document.getElementById('phone')?.value.trim());
            formData.append('Address', document.getElementById('address')?.value.trim());
            formData.append('Gender', document.getElementById('gender')?.value);
            formData.append('role', document.getElementById('role')?.value);
            formData.append('status', document.getElementById('status')?.value);

            // Lấy hình ảnh đã chọn và thêm vào FormData
            const imageInput = document.getElementById('image'); // Giả sử có trường input cho hình ảnh
            const image = imageInput.files[0];
            if (image) {
                formData.append('image', image); // Thêm tệp hình ảnh
            }

            console.log('Account Data:', formData);

            // Validate required fields
            const validationError = validateAccountForm({
                username: formData.get('username'),
                password: formData.get('password'),
                confirmPassword: formData.get('confirmPassword'),
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
                // Gửi FormData đến backend
                const response = await fetch(url, {
                    method: method,
                    body: formData, // Gửi FormData thay vì JSON
                });

                // Xử lý phản hồi
                if (!response.ok) {
                    const result = await response.json();
                    alert(result.message || 'Đã có lỗi xảy ra, vui lòng thử lại.');
                    return;
                }

                // Nếu thành công, thông báo cho người dùng và tải lại trang
                alert(accountId ? 'Cập nhật tài khoản thành công!' : 'Thêm tài khoản thành công!');
                resetForm();
                location.reload();
            } catch (error) {
                alert('Lỗi khi gửi dữ liệu. Vui lòng kiểm tra kết nối mạng.');
                console.error('Error:', error);
            }
        });

        const accountModalElement = document.getElementById('accountModal');
        accountModalElement.addEventListener('hidden.bs.modal', resetForm); // Đặt lại form khi modal đóng
    }
});

// Hàm để xác thực biểu mẫu tài khoản
function validateAccountForm(accountData) {
    if (!accountData.username || !accountData.password || !accountData.Name || !accountData.email || !accountData.SDT || !accountData.Address || !accountData.Gender || !accountData.role) {
        return 'Vui lòng điền đầy đủ các trường bắt buộc.';
    }
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(accountData.email)) {
        return 'Vui lòng nhập địa chỉ email hợp lệ.';
    }
    // Kiểm tra xác nhận mật khẩu
    if (accountData.password !== accountData.confirmPassword) {
        return 'Mật khẩu và xác nhận mật khẩu không khớp.';
    }

    return null; // Không có lỗi
}

// Hàm để đặt lại biểu mẫu


// Open modal for both adding and editing accounts
function openModal(accountData) {
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
        passwordField.value = ''; // Leave password blank for editing
        confirmPasswordField.value = ''; // Leave confirm password blank for editing
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
        status.value = 'Chưa kích hoạt';
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


// Delete account function
async function deleteAccount(id) {
    const confirmation = confirm('Bạn có chắc chắn muốn xóa tài khoản này?');
    if (!confirmation) return;

    try {
        const response = await fetch(`/api/account/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            alert('Tài khoản đã được xóa thành công!');
            location.reload();
        } else {
            const errorMessage = await response.text();
            alert(`Lỗi khi xóa tài khoản: ${errorMessage}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Lỗi khi gửi yêu cầu. Vui lòng thử lại.');
    }
}
