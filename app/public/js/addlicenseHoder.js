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

    console.log(data); // Log the data object to check its values

    // Send data to API to store in MongoDB
    try {
        const response = await fetch('/api/addlicenseHolder/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        // Check if the response is successful (200–299)
        if (response.ok) {
            const result = await response.json();
            // Check if the result contains success
            if (result.success) {
                alert('Thêm chủ sở hữu thành công!');
                location.reload(); // Reload to display new data
            } else {
                alert('Đã có lỗi xảy ra, vui lòng thử lại.');
            }
        } else {
            // Handle non-200 responses
            const errorMessage = await response.text(); // Fetch error message from server
            alert(`Lỗi từ máy chủ: ${response.status} - ${errorMessage}`);
        }
    } catch (error) {
        // Handle network errors
        console.error('Error:', error);
        alert('Lỗi khi gửi dữ liệu. Vui lòng kiểm tra kết nối mạng.');
    }
}

// Add event listener for the form
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('addAccountForm');
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }
});
