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
            <td span class="status" >${account.status}</td>
            <td>
        <button class="btn btn-warning btn-sm" onclick='openEditModal(${JSON.stringify(account._id)})'>Sửa</button>
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
    const email = document.getElementById('email'); // Added email field

    // Check if any of the fields are null or empty
    if (
        !username.value.trim() || 
        !password.value.trim() || 
        !role.value.trim() || 
        !phone.value.trim() || 
        !name.value.trim() || 
        !address.value.trim() || 
        !gender.value.trim() || 
        !email.value.trim() // Validate email
    ) {
        console.error('Một hoặc nhiều trường nhập liệu bị thiếu.');
        alert('Vui lòng điền đầy đủ các trường nhập liệu.');
        return; // Exit the function if any field is empty
    }

    const data = {
        username: username.value.trim(),
        password: password.value.trim(),
        role: 'User', // Assuming only 'user' role is allowed
        SDT: phone.value.trim(), // Assuming this should be a string
        Name: name.value.trim(),
        Address: address.value.trim(),
        Gender: gender.value.trim(),
        Image: image.value.trim(), // Include image field
        email: email.value.trim() // Ensure email is included
    };

    console.log(data); // Log the data object to check its values

    try {
        const response = await fetch('/api/addAccount', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message || 'Thêm tài khoản thành công!');
            location.reload(); // Reload the page if successful
        } else {
            alert(result.message || 'Đã có lỗi xảy ra, vui lòng thử lại.'); // Show error message
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
}async function openEditModal(accountId) {
    try {
        const response = await fetch(`/api/account/${accountId}`);
        const data = await response.json();

        if (data) {
            console.log('Fetched data:', data); // Debugging log for fetched data
            
            // Ensure the fields are populated with fetched data
            document.getElementById('username').value = data.username || '';
            document.getElementById('password').value = ''; // Keep password blank for security
            document.getElementById('email').value = data.email || '';
            document.getElementById('phone').value = data.SDT || '';
            document.getElementById('name').value = data.Name || '';
            document.getElementById('address').value = data.Address || '';
            document.getElementById('gender').value = data.Gender === 'Nam' ? 'Nam' : 'Nữ'; // Ensure proper gender assignment
            document.getElementById('role').value = 'User'; // Keep role as 'User'
            
            // Set hidden accountId field for updating the correct account
            document.getElementById('accountId').value = accountId;

            // Show the modal
            const modal = new bootstrap.Modal(document.getElementById('editAccountModal'));
            modal.show();
        } else {
            alert('Không tìm thấy tài khoản.');
        }
    } catch (error) {
        console.error('Lỗi khi tải thông tin tài khoản:', error);
        alert('Có lỗi xảy ra khi tải thông tin tài khoản.');
    }
}
