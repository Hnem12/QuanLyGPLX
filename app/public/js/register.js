async function createAccount() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;
    const gender = document.getElementById('gender').value;
    const sdt = document.getElementById('sdt').value;
    const address = document.getElementById('address').value;
    const email = document.getElementById('email').value; // Capture email here
    const role = 'User'; // Assuming you only allow the 'user' role
    const status = document.getElementById('status').value; // Capture status if applicable

    const accountData = {
        username,
        password,
        Name: name,
        Gender: gender,
        SDT: sdt,
        email: email, // Ensure email is included
        Address: address,
        role,
        status // Include status
    };

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Set the content type to JSON
            },
            body: JSON.stringify(accountData) // Convert accountData to JSON string
        });

        if (response.ok) {
            alert('Tạo tài khoản thành công');
            window.location.href = '/api/account/login';
        } else {
            const errorData = await response.json();
            alert('Lỗi tạo tài khoản: ' + errorData.message);
        }
    } catch (error) {
        console.error('Error creating account:', error);
        alert('Lỗi kết nối khi tạo tài khoản: ' + error.message);
    }
}


// Hàm uploadImage để xử lý upload hình ảnh và trả về đường dẫn
async function uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('/api/upload', { // Giả sử bạn có API upload hình
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        throw new Error('Lỗi khi tải lên hình ảnh');
    }

    const data = await response.json();
    return data.imageUrl; // Giả sử server trả về đường dẫn hình ảnh
}

function updateImageName() {
    const fileInput = document.getElementById('image');
    const imageName = document.getElementById('image-name');
    imageName.textContent = fileInput.files.length > 0 ? fileInput.files[0].name : '';
}
