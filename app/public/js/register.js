async function createAccount() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;
    const gender = document.getElementById('gender').value;
    const sdt = document.getElementById('sdt').value;
    const address = document.getElementById('address').value;
    const image = document.getElementById('image').files[0];

    if (!username || !password || !name || !gender || !sdt || !address) {
        alert('Vui lòng điền đầy đủ thông tin');
        return;
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('name', name);
    formData.append('gender', gender);
    formData.append('sdt', sdt);
    formData.append('address', address);
    if (image) {
        formData.append('image', image);
    }

    try {
        const response = await fetch('/register', {
            method: 'POST',
            body: formData
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
        alert('Lỗi kết nối khi tạo tài khoản');
    }
}
function updateImageName() {
    const fileInput = document.getElementById('image');
    const imageName = document.getElementById('image-name');
    imageName.textContent = fileInput.files.length > 0 ? fileInput.files[0].name : '';
}
