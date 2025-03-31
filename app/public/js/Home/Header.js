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
        event.preventDefault(); // Ngăn chặn hành vi mặc định của nút
    
        Swal.fire({
            title: 'Xác nhận đăng xuất',
            text: 'Bạn có chắc chắn muốn thoát không?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Có, đăng xuất!',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                // Xóa dữ liệu người dùng khỏi localStorage
                localStorage.removeItem('username');
                localStorage.removeItem('image');
                localStorage.removeItem('token');
    
                // Hiển thị thông báo đăng xuất thành công
                Swal.fire({
                    html: `
                        <div class="custom-alert">
                            <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" class="custom-icon" />
                            <span class="custom-title">Bạn đã đăng xuất thành công!!!</span>
                        </div>
                    `,
                    showConfirmButton: false, // Ẩn nút OK
                    allowOutsideClick: true, // Không cho đóng khi click ra ngoài
                    width: "450px",
                    position: "top",
                    background: "#f6fff8",
                    customClass: {
                        popup: "custom-alert-popup"
                    },
                    timer: 2000 // Đóng sau 2 giây
                }).then(() => {
                    window.location.href = "/login"; // Chuyển hướng về trang đăng nhập
                });
            }
        });
    });
    
    // Kiểm tra accountId
    if (!accountId) {
        Swal.fire({
            title: 'Lỗi đăng nhập',
            text: 'Không tìm thấy ID người dùng. Vui lòng đăng nhập lại.',
            icon: 'error',
            confirmButtonText: 'OK'
        }).then(() => {
            window.location.href = '/login'; // Chuyển hướng nếu không tìm thấy ID
        });
    }
    
    // Handle click event to view personal info
    personalInfoButton.addEventListener('click', async (event) => {
        event.preventDefault();
        const isValidKey = await verifyKey();
        if (!isValidKey) {
            console.error("Khóa bí mật không hợp lệ, dừng thao tác kiểm định!");
            return;
        }
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
openModalButton.addEventListener('click', async () => {
    const isValidKey = await verifyKey();
    if (!isValidKey) {
        console.error("Khóa bí mật không hợp lệ, dừng thao tác kiểm định!");
        return;
    }
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
        const response = await fetch(`/api/change-password/${accountId}`, {
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

// Get DOM elements
const openKeyModalButton = document.getElementById('openKeyModal'); 
const closeKeyModalButton = document.querySelector('#keyModal .close'); 
const keyModal = document.getElementById('keyModal'); 
const privateKeyField = document.getElementById('privateKeyField'); 
const keyActions = document.getElementById('keyActions'); 
const privateKeyLabel = document.getElementById('privateKeyLabel'); 
const keyLabel = document.getElementById('KeyLabel'); 

// Hiển thị hoặc ẩn modal
function toggleKeyModal(display) {
    keyModal.style.display = display;
    keyLabel.style.display = display === 'block' ? 'block' : 'none';
}

// Đóng modal và reset trạng thái
function closeKeyModal() {
    toggleKeyModal('none');
    resetKeyModal();
}

// Reset các trường input trong modal
function resetKeyModal() {
    privateKeyField.value = '';
    privateKeyField.hidden = true;
    keyActions.style.display = 'none';
    privateKeyLabel.style.display = 'none';
    keyLabel.style.display = 'none';
    document.getElementById('generateKeyBtn').style.display = 'inline-block';
    document.querySelector('.Xepngang button:last-child').style.display = 'inline-block';
}

// Tạo khóa người dùng
window.generateUserKey = async function() {
    const accountId = localStorage.getItem('accountId');
    if (!accountId) {
        return Swal.fire('Lỗi!', 'Account ID không tồn tại. Vui lòng đăng nhập lại.', 'error');
    }

    try {
        const userData = await fetchUserData(accountId);
        if (userData?.privateKey) {
            Swal.fire('Thông báo', 'Bạn đã có khóa công khai.', 'info');
            displayExistingKey(userData.privateKey);
        } else {
            const newKeyResult = await generateNewKey(accountId);
            if (newKeyResult) {
                displayNewKey(newKeyResult.privateKey);
            }
        }
    } catch (error) {
        console.error('Error generating key:', error);
    }
};

// Lấy dữ liệu người dùng
async function fetchUserData(accountId) {
    const response = await fetch(`/api/account/${accountId}`);
    if (!response.ok) throw new Error('Failed to fetch user data.');
    return response.json();
}

// Gửi yêu cầu tạo khóa mới
async function generateNewKey(accountId) {
    const response = await fetch(`/api/Taokhoanguoidung/${accountId}`, { method: 'POST' });
    const result = await response.json();

    if (!response.ok) {
        Swal.fire('Lỗi!', result.message || 'Không thể tạo khóa.', 'error');
        throw new Error('Failed to generate new key.');
    }

    return result;
}

// Hiển thị khóa hiện có
function displayExistingKey(privateKey) {
    privateKeyField.value = privateKey;
    privateKeyField.hidden = false;
    privateKeyLabel.style.display = 'block';
    keyActions.style.display = 'flex';
    toggleKeyModal('block');
    keyLabel.style.display = 'none';
}

// Hiển thị khóa mới tạo
function displayNewKey(privateKey) {
    Swal.fire({
        title: 'Thành công!',
        text: 'Khóa đã được cấp thành công!',
        icon: 'success',
        confirmButtonText: 'OK'
    }).then(() => {
        displayExistingKey(privateKey);
        
        // Ẩn các nút sau khi tạo khóa thành công
        document.getElementById('generateKeyBtn').style.display = 'none';
        document.querySelector('.Xepngang button:last-child').style.display = 'none';

        // Giả định rằng server có trả về certificate, mspId, type
        const certificateData = fetchCertificateAndType();
        localStorage.setItem('certificate', certificateData.certificate);
        localStorage.setItem('mspId', certificateData.mspId);
        localStorage.setItem('type', certificateData.type);
    });
}


// Function to download the key as a .txt file
function downloadKey() {
    const key = privateKeyField.value; // Get the key from the input field
    const blob = new Blob([key], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'private_key.txt'; // Specify the file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Clean up the link element
}

// Function to copy the key to the clipboard
function copyToClipboard() {
    privateKeyField.select(); // Select the text in the input field
    document.execCommand('copy'); // Copy the text to the clipboard
    alert('Khóa đã được sao chép vào clipboard!'); // Alert the user
}
// Event listeners for opening and closing the modal
openKeyModalButton.addEventListener('click', () => toggleKeyModal('block'));
closeKeyModalButton.addEventListener('click', closeKeyModal);
// 🌟 Lưu trữ các phần tử DOM một lần để tránh truy vấn nhiều lần
const keyCAField = document.getElementById('KeyCA');
const publicKeyStatus = document.getElementById('publicKeyStatus');
const generateKeyBtn = document.getElementById('generateKeyBtn');
const notificationBell = document.getElementById('notificationBell');
const notificationContent = document.getElementById('notificationContent');

// 🌟 Hàm đóng modal khi nhấn ra ngoài
window.addEventListener('click', (event) => {
    if (event.target === keyModal) closeKeyModal();
});

// 🌟 Hàm hiển thị thông báo với SweetAlert2
function showSwal(icon, title, text, timer = null) {
    Swal.fire({
        icon,
        title,
        text,
        timer,
        showConfirmButton: !timer,
    });
}

async function checkPublicKey() {
    const accountId = localStorage.getItem('accountId');
    if (!accountId) {
        return showSwal('warning', 'Lỗi', 'Vui lòng đăng nhập lại!');
    }

    try {
        const response = await fetch(`/api/LayCA/${accountId}`);
        const userData = await response.json();

        if (!response.ok) {
            throw new Error(userData?.message ?? 'Lỗi khi kiểm tra khóa công khai.');
        }

        if (userData?.publicKey) {
            // ✅ Cập nhật trạng thái nếu có khóa công khai
            KeyCA.value = userData.publicKey;
            KeyCA.hidden = false;
            KeyLabel.textContent = 'Khóa công khai đã được tạo!';
            KeyLabel.style.color = 'green';
            KeyLabel.style.display = 'block';
            generateKeyBtn.style.display = 'none';

            if (userData?.privateKey) {
                privateKeyField.value = userData.privateKey;
                privateKeyField.hidden = false;
                privateKeyLabel.style.display = 'block';
                keyActions.style.display = 'flex';
            }
        } else {
            KeyCA.hidden = true;
            KeyLabel.textContent = 'Bạn muốn tạo chứng thực số?';
            KeyLabel.style.color = 'black';
            generateKeyBtn.style.display = 'inline-block';
            privateKeyField.hidden = true;
            privateKeyLabel.style.display = 'none';
            keyActions.style.display = 'none';
        }
    } catch (error) {
        console.error('Lỗi:', error);
        showSwal('error', 'Lỗi!', error.message || 'Vui lòng thử lại.');
    }
}

generateKeyBtn.addEventListener('click', checkPublicKey);

function showNotification(message) {
    showSwal('info', 'Thông báo', message, 3000);
    notificationBell.classList.add('new-notification');
}

// 🌟 Toggle thông báo khi nhấn vào chuông
notificationBell.addEventListener('click', () => {
    notificationContent.style.display = notificationContent.style.display === 'block' ? 'none' : 'block';
    notificationBell.classList.remove('new-notification'); // Ẩn chấm đỏ khi đã xem
});
