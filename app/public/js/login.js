// Hàm thiết lập cookie
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = `${cname}=${cvalue};${expires};path=/`;
}

// Hàm lấy giá trị cookie theo tên
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
// Hàm xử lý đăng nhập
function login() {
    const username = $('#username').val();
    const password = $('#password').val();

    if (!username || !password) {
        alert("Vui lòng nhập đầy đủ thông tin đăng nhập.");
        return;
    }

    $.ajax({
        url: '/api/account/login',
        type: 'POST',
        data: {
            username: username,
            password: password,
        }
    })
    .done(function(data) {
        console.log('Login response:', data); // Debug log

        // Kiểm tra xem ID có tồn tại trong response hay không
        if (data.userData && data.userData._id) {
            // Lưu ID và các thông tin cần thiết vào localStorage
            localStorage.setItem('accountId', data.userData._id); 
            localStorage.setItem('username', username); 
            localStorage.setItem('image', data.userData.image);

            // Chuyển hướng sau khi đăng nhập thành công
            window.location.href = "/trangchu";
        } else {
            alert("Lỗi: Không nhận được ID người dùng từ server.");
        }
    })
    .fail(function(err) {
        console.error("Login error:", err);
        alert("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.");
    });
}

// Gán sự kiện cho nút đăng nhập
$(document).ready(function() {
    $('#loginButton').on('click', function(event) {
        event.preventDefault(); // Ngăn reload trang
        login();
    });
});

const modal = document.getElementById("forgotPasswordModal");
const link = document.getElementById("forgotPasswordLink");
const closeBtn = document.querySelector(".close");

// Show modal with animation
link.onclick = function (e) {
  e.preventDefault();
  modal.classList.add("show");
  modal.style.display = "block";
};

// Close modal with animation
closeBtn.onclick = function () {
  modal.classList.remove("show");
  setTimeout(() => {
    modal.style.display = "none";
  }, 300); // Wait for the animation to complete
};

// Close modal if the user clicks outside of it
window.onclick = function (event) {
  if (event.target === modal) {
    modal.classList.remove("show");
    setTimeout(() => {
      modal.style.display = "none";
    }, 300);
  }
};
