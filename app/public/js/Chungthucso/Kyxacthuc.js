async function verifyKey() {
    const accountId = localStorage.getItem('accountId');
    
    if (!accountId) {
        Swal.fire("Lỗi", "Không tìm thấy tài khoản!", "error");
        return null;
    }

    // Nhập khóa bí mật từ người dùng
    const { value: privateKey } = await Swal.fire({
        title: "Nhập khóa bí mật",
        input: "password",
        inputPlaceholder: "Dán khóa bí mật vào đây...",
        inputAttributes: { autocapitalize: "off" },
        showCancelButton: true,
        confirmButtonText: "Xác nhận",
        cancelButtonText: "Hủy",
        customClass: {
            confirmButton: "pink-confirm",
            cancelButton: "pink-cancel"
        },
        preConfirm: (privateKey) => {
            if (!privateKey ||
                !privateKey.startsWith("-----BEGIN PRIVATE KEY-----") ||
                !privateKey.endsWith("-----END PRIVATE KEY-----")) {
                Swal.showValidationMessage("🔒 Khóa bí mật không hợp lệ!");
                return null;  // Trả về null thay vì false
            }
            return privateKey; // Trả về khóa bí mật hợp lệ
        }
    });

    if (!privateKey) {
        console.error("Lỗi: Người dùng không nhập khóa bí mật hoặc đã hủy!");
        return null;
    }

    console.log("Đang kiểm tra khóa bí mật...");

    try {
        const response = await fetch("/verify-key", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ privateKey, accountId })
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            console.error("Lỗi xác minh khóa:", result.message);
            Swal.fire("Lỗi", result.message || "Khóa bí mật không đúng!", "error");
            return null;
        }

        console.log("✅ Khóa bí mật hợp lệ!");
        return true; // Trả về true nếu khóa hợp lệ
    } catch (error) {
        console.error("Lỗi khi gọi API verify-key:", error);
        Swal.fire("Lỗi", "Có lỗi xảy ra khi kiểm tra khóa bí mật.", "error");
        return null;
    }
}

module.exports = { verifyKey };
