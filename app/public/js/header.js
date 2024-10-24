document.addEventListener('DOMContentLoaded', () => {
    // Retrieve user information from localStorage
    const username = localStorage.getItem('username');
    const userImage = localStorage.getItem('image'); // Get the image path from localStorage
    const usernameDisplay = document.getElementById('usernameDisplay');
    const avatarImage = document.getElementById('avatarImage');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const avatarContainer = document.querySelector('.avatar-container');
    const logoutButton = document.getElementById('logoutButton');
    const modal = document.getElementById('personalInfoModal');
    const closeModalButton = document.getElementById('closeModalButton');
    const updateForm = document.getElementById('updateForm');
    const personalInfoButton = document.getElementById('personalInfoButton');
    const accountId = localStorage.getItem('accountId'); // Get ID from localStorage
    const imagePreview = document.getElementById('imagePreview'); // Image preview element

   const storedImage = localStorage.getItem('image'); // Retrieve the new avatar if available

if (username) {
    usernameDisplay.textContent = `Chào mừng ${username} đến với hệ thống quản lý GPLX`;
    avatarImage.src = storedImage || userImage || './uploads/h6.jpg'; // Use stored, user, or default image
} else {
    usernameDisplay.textContent = 'Khách';
    avatarImage.src = storedImage || './uploads/h6.jpg'; // Fallback to stored or default image
}

    // Toggle dropdown on avatar click
    avatarContainer.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent the event from bubbling up
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block'; // Toggle visibility
    });

    // Hide dropdown when clicking outside
    document.addEventListener('click', function(event) {
        if (!avatarContainer.contains(event.target)) {
            dropdownMenu.style.display = 'none'; // Hide dropdown
        }
    });

    // Handle logout button click
    logoutButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default behavior of the logout link
        const confirmLogout = confirm('Bạn có chắc là muốn thoát không?'); // Ask for confirmation

        if (confirmLogout) {
            localStorage.removeItem('username'); // Clear username from localStorage
            localStorage.removeItem('image');    // Clear image from localStorage if set
            localStorage.removeItem('token');    // Clear token from localStorage

            alert('Bạn đã đăng xuất thành công!'); // Notify user of successful logout
            window.location.href = "/login";      // Redirect to login page
        }
    });

    // Check if accountId is available
    if (!accountId) {
        alert('Không tìm thấy ID người dùng. Vui lòng đăng nhập lại.');
        window.location.href = '/login'; // Redirect to login page if no ID
        return;
    }

    // Handle click event to view personal info
    personalInfoButton.addEventListener('click', async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(`/api/account/${accountId}`);
            if (!response.ok) {
                const errorMessage = await response.json();
                alert(errorMessage.message || 'Có lỗi xảy ra');
                return;
            }

            const userData = await response.json();

            // Fill user information into the modal form
            document.getElementById('usernameInput').value = userData.username;
            document.getElementById('emailInput').value = userData.email;
            document.getElementById('phoneInput').value = userData.SDT;
            document.getElementById('nameInput').value = userData.Name;
            document.getElementById('addressInput').value = userData.Address;
            document.getElementById('genderInput').value = userData.Gender;
            document.getElementById('roleInput').value = userData.role;

            // Set current avatar image for preview
            imagePreview.src = userImage || './uploads/h6.jpg'; // Display current user image
            imagePreview.style.display = 'block'; // Show image if exists

            // Open modal
            modal.style.display = 'block';
        } catch (error) {
            console.error('Error fetching personal info:', error);
            alert('Không thể tải thông tin cá nhân. Vui lòng thử lại.');
        }
    });

    // Close modal
    closeModalButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    updateForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission
    
        const formData = new FormData(updateForm); // Create FormData object
        const file = document.getElementById('imageInput').files[0]; // Get selected file
    
        // If a new image file is selected, add it to FormData
        if (file) {
            formData.append('image', file); // Add image to FormData
    
            // Show the new image in the preview immediately upon selection
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result; // Update the preview image
                imagePreview.style.display = 'block'; // Show the preview image
            };
            reader.readAsDataURL(file); // Read the selected file for preview
        }
    
        try {
            const response = await fetch(`/api/updatethongtin/${accountId}`, {
                method: 'PUT',
                body: formData,
            });
    
            const result = await response.json();
    
            if (result.success) {
                alert('Thông tin tài khoản đã được cập nhật thành công!');
                modal.style.display = 'none'; // Close the modal
    
                // If the user is on the account page, reload to update the view
                if (window.location.pathname === '/account') {
                    location.reload();
                } else if (file) {
                    // If on a different page, update avatar dynamically in the header
                    const newImageUrl = URL.createObjectURL(file); // Create a local URL for the new image
                    const headerAvatar = document.getElementById('headerAvatar'); // Select header avatar element
    
                    if (headerAvatar) {
                        headerAvatar.src = newImageUrl; // Update header avatar
                        localStorage.setItem('image', newImageUrl); // Store new avatar in localStorage (optional)
                    }
                }
            } else {
                alert(result.message || 'Cập nhật không thành công. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Error updating account:', error);
            alert('Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.');
        }
    });
    

    document.getElementById('imageInput').addEventListener('change', function(event) {
        const file = event.target.files[0]; // Get the selected file
    
        if (file) {
            if (file.type.startsWith('image/')) { // Check if it's an image
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.src = e.target.result; // Show the preview image
                    imagePreview.style.display = 'block'; // Make it visible
                };
                reader.readAsDataURL(file); // Read the file for preview
            } else {
                alert('Please select a valid image file.');
                imagePreview.src = '#'; // Reset preview
                imagePreview.style.display = 'none'; // Hide preview
            }
        } else {
            imagePreview.src = '#'; // Reset if no file selected
            imagePreview.style.display = 'none'; // Hide preview
        }
    });

});

// Xử lý hiển thị/ẩn mật khẩu
document.getElementById('togglePasswordVisibility').addEventListener('change', function () {
    const passwordFields = document.querySelectorAll('#currentPassword, #newPassword, #confirmNewPassword');
    passwordFields.forEach(field => {
        field.type = this.checked ? 'text' : 'password';
    });
});

// Xử lý sự kiện đóng modal
document.getElementById('closePasswordModal').addEventListener('click', function () {
    document.getElementById('passwordChangeModal').style.display = 'none';
});


const openModalButton = document.getElementById('openPasswordModal');
const closeModalButton = document.getElementById('closePasswordModal');
const passwordChangeModal = document.getElementById('passwordChangeModal');

// Hàm mở modal
openModalButton.addEventListener('click', () => {
    passwordChangeModal.style.display = 'block';
});

// Hàm đóng modal
closeModalButton.addEventListener('click', () => {
    passwordChangeModal.style.display = 'none';
    passwordForm.reset(); // Reset form
});

// Đóng modal khi nhấn ra ngoài nội dung modal
window.addEventListener('click', (event) => {
    if (event.target === passwordChangeModal) {
        passwordChangeModal.style.display = 'none';
    }
});

// Lấy các phần tử input từ DOM
const currentPasswordInput = document.getElementById('currentPassword');
const newPasswordInput = document.getElementById('newPassword');
const confirmNewPasswordInput = document.getElementById('confirmNewPassword');
const passwordForm = document.getElementById('passwordForm');
const accountId = localStorage.getItem('accountId'); // Get ID from localStorage

passwordForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Ngăn không cho form reload trang

    // Lấy giá trị từ các trường nhập
    const currentPassword = currentPasswordInput.value.trim(); // Loại bỏ khoảng trắng
    const newPassword = newPasswordInput.value.trim(); // Loại bỏ khoảng trắng
    const confirmNewPassword = confirmNewPasswordInput.value.trim(); // Loại bỏ khoảng trắng

    // Kiểm tra xem các trường có được nhập đầy đủ không
    if (!currentPassword || !newPassword || !confirmNewPassword) {
        alert('Vui lòng nhập đầy đủ thông tin.');
        return;
    }

    // Kiểm tra mật khẩu mới có khớp nhau không
    if (newPassword !== confirmNewPassword) {
        alert('Mật khẩu mới không khớp!');
        return;
    }

    // Kiểm tra độ dài mật khẩu mới
    if (newPassword.length < 6) {
        alert('Mật khẩu mới phải có ít nhất 6 ký tự.');
        return;
    }

    try {
        // Sử dụng backticks để xây dựng URL
        const response = await fetch(`http://localhost:3001/api/change-password/${accountId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                oldPassword: currentPassword, 
                newPassword: newPassword 
            }),
        });

        const result = await response.json();

        if (response.ok) {
            passwordForm.reset();  // Reset form
            document.getElementById('passwordChangeModal').style.display = 'none'; // Đóng modal
        } else {
            alert(result.message || 'Có lỗi xảy ra khi đổi mật khẩu'); // Hiển thị lỗi từ server
        }
    } catch (error) {
        console.error('Lỗi:', error);
        alert('Đã xảy ra lỗi, vui lòng thử lại sau.');
    }
});
