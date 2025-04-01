const jwt = require('jsonwebtoken');

// Khi đăng nhập thành công, tạo token với accountId
const generateToken = (user) => {
    const payload = {
        accountId: user.accountId,
        role: user.role
    };

    // Tạo token với accountId
    return jwt.sign(payload, 'Hnem', { expiresIn: '1h' });
};

// Hàm xử lý đăng nhập người dùng
const loginUser = (req, res) => {
    const { accountId, role } = req.body;  // Lấy thông tin từ request body

    // Kiểm tra thông tin đăng nhập (bạn có thể thay thế bằng mã kiểm tra thực tế)
    if (!accountId || !role) {
        return res.status(400).json({ message: 'Account ID và Role không được để trống' });
    }

    // Tạo token sau khi xác thực thông tin đăng nhập thành công
    const token = generateToken({ accountId, role });

    // Lưu token vào cookie (cookie chỉ có thể đọc bởi server)
    res.cookie('token', token, {
        httpOnly: true,  // Đảm bảo cookie không thể bị truy cập bởi JavaScript
        secure: process.env.NODE_ENV === 'production', // Chỉ sử dụng HTTPS khi môi trường là production
        maxAge: 3600000  // Đặt thời gian sống của cookie là 1 giờ (3600000ms)
    });

    // Lưu accountId vào cookie (nếu muốn truyền thông tin này qua cookies)
    res.cookie('accountId', accountId, {
        httpOnly: true, // Đảm bảo cookie không thể bị truy cập bởi JavaScript
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000  // Đặt thời gian sống của cookie là 1 giờ (3600000ms)
    });

    // Trả về token cho client và thông báo đăng nhập thành công
    res.json({
        message: 'Login successful',
        token: token // Trả về token cho client nếu cần
    });
};

module.exports = { loginUser };
