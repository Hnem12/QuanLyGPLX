// Hàm xử lý việc gửi dữ liệu từ form
async function handleSubmit(event) {
    event.preventDefault(); // Ngăn chặn tải lại trang

    // Tập hợp dữ liệu từ các trường trong form
    const data = {
        MaGPLX: document.getElementById('gplx').value.trim(),
        Name: document.getElementById('name').value.trim(),
        DateOfBirth: document.getElementById('dob').value,
        CCCD: document.getElementById('cccd').value.trim(),
        Address: document.getElementById('address').value.trim(),
        PhoneNumber: document.getElementById('phone').value.trim(),
        Email: document.getElementById('email').value.trim(),
        HangGPLX: document.getElementById('hangGPLX').value,
        Ngaycap: document.getElementById('issueDate').value,
        Ngayhethan: document.getElementById('expiryDate').value,
        Ngaytrungtuyen: document.getElementById('ngaytrungtuyen').value,
        Status: document.getElementById('status').value,
        Giamdoc: document.getElementById('giamdoc').value.trim()
    };
    
    // Kiểm tra các trường bắt buộc
    const requiredFields = ['MaGPLX', 'Name', 'DateOfBirth', 'CCCD', 'Address', 'PhoneNumber', 'Email', 'HangGPLX', 'Ngaycap', 'Ngaytrungtuyen', 'Ngayhethan', 'Giamdoc'];
    for (const field of requiredFields) {
        if (!data[field]) {
            alert(`${field.replace(/([A-Z])/g, ' $1')}: không được để trống.`);
            return; // Thoát nếu xác thực không thành công
        }
    }

    // Gửi dữ liệu đến API để lưu vào MongoDB
    try {
        console.log('Dữ liệu đang được gửi:', data); // Ghi log để debug
        const response = await fetch('/api/addlicenseHolder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message || 'Thêm tài khoản thành công!');
            // Tải lại trang sau khi thêm thành công
            location.reload();
        } else {
            alert(result.message || 'Đã có lỗi xảy ra, vui lòng thử lại.');
        }
    } catch (error) {
        alert('Lỗi khi gửi dữ liệu. Vui lòng kiểm tra kết nối mạng.');
        console.error('Lỗi:', error);
    }
}

// Thêm listener sự kiện cho form
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
            // Có thể tải lại hoặc cập nhật UI
            location.reload();
        } else {
            alert(result.message || 'Đã có lỗi xảy ra, vui lòng thử lại.');
        }
    } catch (error) {
        alert('Lỗi khi gửi dữ liệu. Vui lòng kiểm tra kết nối mạng.');
        console.error('Lỗi:', error);
    }
}

// Ví dụ cách gọi hàm xóa
