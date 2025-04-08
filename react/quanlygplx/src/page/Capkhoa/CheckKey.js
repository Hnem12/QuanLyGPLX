import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import API from '../../utils/request';
import './createKey.scss'

const useVerifyKey = () => {
    const [isVerifying, setIsVerifying] = useState(false);
    const [accountId, setAccountId] = useState('');

    useEffect(() => {
        const fetchAccountId = () => {
            const accountIdFromCookie = getAccountIdFromCookie();
            if (accountIdFromCookie) {
                console.log("AccountId từ cookie:", accountIdFromCookie);
                setAccountId(accountIdFromCookie);
                return;
            }
            
            const accountIdFromToken = getAccountIdFromToken();
            if (accountIdFromToken) {
                console.log("AccountId từ token:", accountIdFromToken);
                setAccountId(accountIdFromToken);
            } else {
                console.error('Không thể lấy Account ID từ cookie hoặc token.');
            }
        };
        
        fetchAccountId();
    }, []);

    const getAccountIdFromCookie = () => {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith('accountId=')) {
                return cookie.substring('accountId='.length);
            }
        }
        return null;
    };

    const getAccountIdFromToken = () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return null;
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.accountId || payload.sub;
        } catch (error) {
            console.error('Lỗi khi giải mã token:', error);
            return null;
        }
    };

    const verifyKey = async () => {        
        if (!accountId) {
            Swal.fire("Lỗi", "Không tìm thấy tài khoản!", "error");
            return null;
        }
    
        const { value: privateKey } = await Swal.fire({
            title: "Nhập khóa bí mật",
            input: "password",
            inputPlaceholder: "Dán khóa bí mật vào đây...",
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
                    return null;
                }
                return privateKey;
            }
        });
    
        if (!privateKey) {
            console.error("Người dùng không nhập khóa bí mật hoặc đã hủy!");
            return null;
        }
    
        console.log("Đang kiểm tra khóa bí mật...");
        setIsVerifying(true);
    
        try {
            const response = await fetch(`${API.BASEURL}/verify-key`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ privateKey, accountId })
            });
    
            const result = await response.json();
    
            if (!response.ok || !result.success) {
                console.error("Lỗi xác minh khóa:", result.message);
                Swal.fire("Lỗi", result.message || "Khóa bí mật không đúng!", "error");
                return result;  // Trả về dữ liệu từ API, ngay cả khi thất bại
            }
    
            Swal.fire("Thành công", "Khóa bí mật hợp lệ!", "success");
            return result;  // Trả về toàn bộ dữ liệu phản hồi từ API khi thành công
        } catch (error) {
            console.error("Lỗi khi gọi API verify-key:", error);
            Swal.fire("Lỗi", "Có lỗi xảy ra khi kiểm tra khóa bí mật.", "error");
            return { error: "Lỗi khi kiểm tra khóa bí mật", details: error };
        } finally {
            setIsVerifying(false);
        }
    };    

    return { verifyKey, isVerifying };
};

export default useVerifyKey;
