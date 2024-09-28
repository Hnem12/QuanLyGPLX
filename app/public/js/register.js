async function createAccount() {
    // Lấy giá trị từ các trường input
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;
    const gender = document.getElementById('gender').value;
    const sdt = document.getElementById('sdt').value;
    const address = document.getElementById('address').value;
    const image = document.getElementById('image').files[0];

    // Kiểm tra xem các trường thông tin có được điền đầy đủ không
    if (!username || !password || !name || !gender || !sdt || !address) {
        alert('Vui lòng điền đầy đủ thông tin');
        return;
    }

    // Tạo đối tượng FormData để gửi dữ liệu
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('name', name);
    formData.append('gender', gender);
    formData.append('sdt', sdt);
    formData.append('address', address);
    
    // Kiểm tra xem có hình ảnh được chọn hay không
    if (image) {
        formData.append('image', image);
    }

    try {
        // Gửi yêu cầu POST đến server
        const response = await fetch('/register', {
            method: 'POST',
            body: formData
        });

        // Kiểm tra xem phản hồi có thành công không
        if (response.ok) {
            alert('Tạo tài khoản thành công');
            window.location.href = '/api/account/login';
        } else {
            console.error('Response status:', response.status);
            
            // Kiểm tra loại nội dung của phản hồi
            const contentType = response.headers.get('content-type');
            let errorData;

            if (contentType && contentType.includes('application/json')) {
                // Nếu phản hồi là JSON, phân tích cú pháp
                errorData = await response.json();
            } else {
                // Nếu không phải là JSON, đọc nội dung dưới dạng văn bản
                const errorText = await response.text();
                console.error('Error response text:', errorText);
                errorData = { message: 'Đã xảy ra lỗi không xác định.' };
            }

            // Hiển thị thông báo lỗi
            alert('Lỗi tạo tài khoản: ' + (errorData.message || errorData));
        }
    } catch (error) {
        // Bắt lỗi khi thực hiện yêu cầu
        console.error('Error creating account:', error);
        alert('Lỗi kết nối khi tạo tài khoản: ' + error.message);
    }
}

function updateImageName() {
    const fileInput = document.getElementById('image');
    const imageName = document.getElementById('image-name');
    imageName.textContent = fileInput.files.length > 0 ? fileInput.files[0].name : '';
}
