
async function fetchAccounts() {
    try {
      const response = await fetch('http://localhost:3000/api/account');
      const accounts = await response.json();
      const tableBody = document.getElementById('accountTableBody');

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
            <td>Đã kích hoạt</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick='openEditModal(${JSON.stringify(account._id)})'>Sửa</button>
              <button class="btn btn-danger btn-sm" onclick="deleteAccount('${account._id}')">Xóa</button>
            </td>
          </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', row);
        document.querySelector('.system-name').textContent = `Hệ thống quản lý GPLX - Xin chào, ${account.username}`;
      });
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    }
  }

  // Gọi hàm fetchAccounts khi trang được load
  window.onload = fetchAccounts;

async function handleSubmit(event) {
    event.preventDefault(); // Prevent page reload

    // Gather input data from form fields
    
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const role = document.getElementById('role');
    const phone = document.getElementById('phone');
    const name = document.getElementById('name');
    const address = document.getElementById('address');
    const image = document.getElementById('image');
    const gender = document.getElementById('gender');

    // Check if any of the fields are null or empty
    if ( !username.value.trim() || !password.value.trim() || 
        !role.value.trim() || !phone.value.trim() || !name.value.trim() || 
        !address.value.trim()  || !gender.value.trim()) {
        console.error('Một hoặc nhiều trường nhập liệu bị thiếu.');
        alert('Vui lòng điền đầy đủ các trường nhập liệu.');
        return; // Exit the function if any field is empty
    }

    const data = {
        username: username.value.trim(),
        password: password.value.trim(),
        role: Number(role.value.trim()), // Ensure it's a number
        SDT: Number(phone.value.trim()),
        Name: name.value.trim(),
        Address: address.value.trim(),  
        Gender: gender.value.trim(),
        // Image: image.value.trim()
    };

    console.log(data); // Log the data object to check its values

    try {
        const response = await fetch('/api/addAccount', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok && result.success) {
            alert(result.message || 'Đã có lỗi xảy ra, vui lòng thử lại.');
        } else {
            alert('Thêm tài khoản thành công!');
            location.reload();
        }
    } catch (error) {
        alert('Lỗi khi gửi dữ liệu. Vui lòng kiểm tra kết nối mạng.');
        console.error('Error:', error);
    }
}

// Add event listener for the form
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('addAccountForm');
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }
});



// Hàm để xóa tài khoản dựa trên ID
async function deleteAccount(id) {
    const confirmation = confirm('Bạn có chắc chắn muốn xóa tài khoản này?');
    if (!confirmation) return;

    try {
        const response = await fetch(`/api/account/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            alert('Tài khoản đã được xóa thành công!');
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


async function updateAccount(event) {
    event.preventDefault(); // Ngăn chặn việc gửi form mặc định

    const id = document.getElementById('accountId').value; // Lấy ID tài khoản từ input hidden
    const data = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
        role: document.getElementById('role').value,
        phone: document.getElementById('phone').value,
        name: document.getElementById('name').value,
        address: document.getElementById('address').value,
        gender: document.getElementById('gender').value
    };

    try {
        const response = await fetch(`/api/updatedAccount/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                alert('Tài khoản đã được sửa thành công!');
                location.reload(); // Tải lại trang sau khi sửa
            } else {
                alert('Đã có lỗi xảy ra, vui lòng thử lại.');
            }
        } else {
            const errorMessage = await response.text();
            alert(`Lỗi khi sửa tài khoản: ${errorMessage}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Lỗi khi gửi yêu cầu. Vui lòng thử lại.');
    }
}

// Gán hàm xử lý sự kiện submit cho form
document.getElementById('editAccountForm').addEventListener('submit', updateAccount);

// Hàm mở modal và gán dữ liệu vào form
function openEditModal(account) {
    // Lấy thông tin tài khoản từ đối tượng account và gán vào các trường
    document.getElementById('username').value = account.username;
    document.getElementById('password').value = account.password; // Có thể cần mã hóa lại
    document.getElementById('role').value = account.role;
    document.getElementById('phone').value = account.SDT; // Cập nhật trường số điện thoại
    document.getElementById('name').value = account.Name; // Cập nhật trường tên
    document.getElementById('address').value = account.Address; // Cập nhật trường địa chỉ
    document.getElementById('gender').value = account.Gender; // Cập nhật trường giới tính

    // Mở modal
    const editModal = new bootstrap.Modal(document.getElementById('editAccountModal'));
    editModal.show();
}
