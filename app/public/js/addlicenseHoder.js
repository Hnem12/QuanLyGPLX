async function handleSubmit(event) {
    event.preventDefault(); // Prevent page reload
    
    // Gather input data from form fields
    const data = {
        maGPLX: document.getElementById('gplx').value, // Assuming 'maGPLX' field
        name: document.getElementById('name').value,
        DateOfBirth: document.getElementById('dob').value,
        CCCD: document.getElementById('cccd').value,
        Address: document.getElementById('address').value,
        PhoneNumber: document.getElementById('phone').value,
        Email: document.getElementById('email').value,
        Ngaycap: document.getElementById('issueDate').value,
        Ngayhethan: document.getElementById('expiryDate').value,
        Status: document.getElementById('status').value
    };

    // Send data to API to store in MongoDB
    try {
        const response = await fetch('/api/addLicenseHolder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    
        const result = await response.json();
        if (response.ok) {
            alert(result.message || 'Thêm tài khoản thành công!');
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
