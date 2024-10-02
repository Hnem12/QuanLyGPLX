async function handleSubmit(event) {
    event.preventDefault(); // Prevent page reload

    // Gather input data from form fields
    const data = {
        MaGPLX: document.getElementById('gplx').value, // Ensure correct casing
        Name: document.getElementById('name').value,   // Ensure correct casing
        DateOfBirth: document.getElementById('dob').value,
        CCCD: document.getElementById('cccd').value,
        Address: document.getElementById('address').value,
        PhoneNumber: document.getElementById('phone').value,
        Email: document.getElementById('email').value,
        Ngaycap: document.getElementById('issueDate').value,
        Ngayhethan: document.getElementById('expiryDate').value,
        Status: document.getElementById('status').value, // Ensure you have this field in your form
        Giamdoc: document.getElementById('giamdoc').value // Ensure you have this field in your form
    };

    // Validate required fields
    if (!data.MaGPLX || !data.Name || !data.DateOfBirth || !data.CCCD || !data.Address || !data.PhoneNumber || !data.Email || !data.Ngaycap || !data.Ngayhethan || !data.Giamdoc) {
        alert('Mã GPLX, tên, ngày sinh, CCCD, địa chỉ, số điện thoại, email, ngày cấp, ngày hết hạn, giám đốc, và trạng thái là bắt buộc.');
        return; // Exit if validation fails
    }

    // Send data to API to store in MongoDB
    try {
        console.log('Data being sent:', data); // Debug log
        const response = await fetch('/api/addlicenseHolder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message || 'Thêm tài khoản thành công!');
            // Reload the page after successful addition
            location.reload();
        } else {
            alert(result.message || 'Đã có lỗi xảy ra, vui lòng thử lại.');
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
async function deleteLicenseHolder(id) {
    try {
        const response = await fetch(`/api/deleteLicenseHolder/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message || 'Xóa tài khoản thành công!');
            // Optionally reload or update the UI
            location.reload();
        } else {
            alert(result.message || 'Đã có lỗi xảy ra, vui lòng thử lại.');
        }
    } catch (error) {
        alert('Lỗi khi gửi dữ liệu. Vui lòng kiểm tra kết nối mạng.');
        console.error('Error:', error);
    }
}

// Example of how to call the delete function

