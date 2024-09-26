function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim(); // trim spaces
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

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
        setCookie('token', data.token, 1); // Save token in cookie for 1 day
        window.location.href = "/trangchu"; // Redirect to homepage or dashboard after login
    })
    .fail(function(err) {
        console.error("Login error:", err);
        alert("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.");
    });
}