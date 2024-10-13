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
                    <td class="status">${account.status}</td>
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

// document.addEventListener('DOMContentLoaded', function () {
//     const form = document.getElementById('accountForm');
//     if (form) {
//         form.addEventListener('submit', async function (e) {
//             e.preventDefault(); // Prevent default form submission

//             // Always use the add account URL and method
//             const url = '/api/addAccount';
//             const method = 'POST';

//             // Retrieve form values
//             const accountData = {
//                 username: document.getElementById('username')?.value.trim(),
//                 password: document.getElementById('password')?.value.trim(),
//                 confirmPassword: document.getElementById('confirmPassword')?.value.trim(),
//                 Name: document.getElementById('name')?.value.trim(),
//                 email: document.getElementById('email')?.value.trim(),
//                 SDT: document.getElementById('phone')?.value.trim(),
//                 Address: document.getElementById('address')?.value.trim(),
//                 Gender: document.getElementById('gender')?.value,
//                 Role: document.getElementById('role')?.value,
//                 // For image uploads, we can handle this separately if necessary
//                 Image: document.getElementById('image')?.files[0]
//             };

//             // Validate required fields
//             const validationError = validateAccountForm(accountData);
//             if (validationError) {
//                 alert(validationError);
//                 return;
//             }

//             // Log accountData for debugging
//             console.log('Dữ liệu đang được gửi:', accountData);

//             try {
//                 // Send JSON data to backend
//                 const response = await fetch(url, {
//                     method: method,
//                     headers: {
//                         'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify(accountData) // Convert to JSON string
//                 });

//                 // Handle response
//                 if (!response.ok) {
//                     const result = await response.json();
//                     alert(result.message || 'Đã có lỗi xảy ra, vui lòng thử lại.');
//                     return;
//                 }

//                 // If successful, notify the user and reload the page
//                 alert('Thêm tài khoản thành công!');
//                 location.reload();
//             } catch (error) {
//                 alert('Lỗi khi gửi dữ liệu. Vui lòng kiểm tra kết nối mạng.');
//                 console.error('Error:', error);
//             }
//         });
//     }
// });

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('accountForm');
    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault(); // Prevent default form submission

            // Check if we're adding or updating based on the presence of an accountId
            const accountId = document.getElementById('accountId')?.value;
            const url = accountId ? `/api/updateTK/${accountId}` : '/api/addAccount'; // Dynamic URL
            const method = accountId ? 'PUT' : 'POST'; // Use PUT for updates, POST for adding

            // Retrieve form values
            const accountData = {
                username: document.getElementById('username')?.value.trim(),
                password: document.getElementById('password')?.value.trim(),
                confirmPassword: document.getElementById('confirmPassword')?.value.trim(),
                Name: document.getElementById('name')?.value.trim(),
                email: document.getElementById('email')?.value.trim(),
                SDT: document.getElementById('phone')?.value.trim(),
                Address: document.getElementById('address')?.value.trim(),
                Gender: document.getElementById('gender')?.value,
                role: document.getElementById('role')?.value,
                status: document.getElementById('status')?.value,
                // For image uploads, handle it separately if necessary
                Image: document.getElementById('image')?.files[0]
            };

            // Validate required fields
            const validationError = validateAccountForm(accountData);
            if (validationError) {
                alert(validationError);
                return;
            }

            try {
                // Send JSON data to backend
                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(accountData) // Convert to JSON string
                });

                // Handle response
                if (!response.ok) {
                    const result = await response.json();
                    alert(result.message || 'Đã có lỗi xảy ra, vui lòng thử lại.');
                    return;
                }

                // If successful, notify the user and reload the page
                alert(accountId ? 'Cập nhật tài khoản thành công!' : 'Thêm tài khoản thành công!');
                location.reload();
            } catch (error) {
                alert('Lỗi khi gửi dữ liệu. Vui lòng kiểm tra kết nối mạng.');
                console.error('Error:', error);
            }
        });
    }
});

// Function to validate the account form
function validateAccountForm(accountData) {
    if (!accountData.username || !accountData.password || !accountData.Name || !accountData.email || !accountData.SDT || !accountData.Address || !accountData.Gender|| !accountData.role) {
        return 'Vui lòng điền đầy đủ các trường bắt buộc.';
    }
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(accountData.email)) {
        return 'Vui lòng nhập địa chỉ email hợp lệ.';
    }
    // Check for password confirmation
    if (accountData.password !== accountData.confirmPassword) {
        return 'Mật khẩu và xác nhận mật khẩu không khớp.';
    }

    return null; // No errors
}


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
