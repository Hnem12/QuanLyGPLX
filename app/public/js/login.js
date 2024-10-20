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
            password: password
        }
    })
    .done(function(data) {
        // Lưu token vào cookie với thời hạn 1 ngày
        setCookie('token', data.token, 1);

        // Lưu tên người dùng vào localStorage
        localStorage.setItem('username', username);
        localStorage.setItem('image', data.userData.image); // Store image URL

        // Chuyển hướng sang trang chủ sau khi đăng nhập thành công
        window.location.href = "/trangchu";
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
