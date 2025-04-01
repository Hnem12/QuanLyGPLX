import React, { useState, useEffect } from 'react';
import { Button, message, Spin } from 'antd';
import Swal from 'sweetalert2';
import API from '../../utils/request';
import './createKey.scss';

const UserKeyForm = () => {
    const [accountId, setAccountId] = useState('');
    const [loading, setLoading] = useState(false);
    const [privateKey, setPrivateKey] = useState(null);
    const [initializing, setInitializing] = useState(true);
    
    // Lấy accountId từ cookie khi component được mount
    useEffect(() => {
        const fetchAccountId = async () => {
            try {
                setInitializing(true);
                // Thử lấy accountId từ cookie trước
                const accountIdFromCookie = getAccountIdFromCookie();
                
                if (accountIdFromCookie) {
                    console.log("AccountId từ cookie:", accountIdFromCookie);
                    setAccountId(accountIdFromCookie);
                } else {
                    // Nếu không có cookie, thử lấy từ token như trước
                    const accountIdFromToken = getAccountIdFromToken();
                    if (accountIdFromToken) {
                        console.log("AccountId từ token:", accountIdFromToken);
                        setAccountId(accountIdFromToken);
                    } else {
                        Swal.fire('Lỗi!', 'Không thể lấy Account ID từ cookie hoặc token. Vui lòng đăng nhập lại.', 'error');
                    }
                }
            } catch (error) {
                console.error("Lỗi khi khởi tạo:", error);
                Swal.fire('Lỗi!', 'Không thể khởi tạo. Vui lòng làm mới trang.', 'error');
            } finally {
                setInitializing(false);
            }
        };
        
        fetchAccountId();
    }, []);
    
    // Function để lấy accountId từ cookie
    const getAccountIdFromCookie = () => {
        try {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.startsWith('accountId=')) {
                    return cookie.substring('accountId='.length, cookie.length);
                }
            }
            return null;
        } catch (error) {
            console.error('Lỗi khi đọc cookie:', error);
            return null;
        }
    };
    
    // Function để lấy accountId từ JWT token (giữ lại như backup)
    const getAccountIdFromToken = () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return null;
            
            const payload = token.split('.')[1];
            const decodedPayload = JSON.parse(atob(payload));
            
            return decodedPayload.accountId || decodedPayload.sub;
        } catch (error) {
            console.error('Lỗi khi giải mã token:', error);
            return null;
        }
    };
    
    // Hàm tạo khóa sử dụng accountId
    const handleGenerateKey = async (id = accountId) => {
        if (!id) {
            Swal.fire('Cảnh báo!', 'Không có Account ID để tạo khóa.', 'warning');
            return;
        }
    
        setLoading(true);
        try {
            const result = await generateNewKey(id);
            if (result.privateKey) {
                // Giữ nguyên phần đầu và cuối, chỉ xóa xuống dòng trong phần nội dung
                const formattedKey = result.privateKey.replace(/(\r\n|\n|\r)/g, ''); // Remove newlines
                setPrivateKey(formattedKey);
                message.success('Khóa đã được tạo thành công!');
            } else {
                message.error('Tạo khóa không thành công.');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    
    
    const handleCopyKey = () => {
      if (privateKey) {
        if (navigator.clipboard) {
          // If the private key already exists, alert the user
          navigator.clipboard.writeText(privateKey)
            .then(() => {
              message.success('Đã sao chép khóa bí mật!');
            })
            .catch((err) => {
              console.error(err);
              message.error('Không thể sao chép khóa bí mật.');
            });
        } else {
          message.error('Clipboard API không được hỗ trợ trên trình duyệt này.');
        }
      } else {
        message.warning('Khóa bí mật chưa được tạo hoặc đã bị xóa.');
      }
    };
      
    const handleDownloadKey = () => {
        if (privateKey) {
            const blob = new Blob([privateKey], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `private_key_${accountId}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };
    
    // API call để tạo khóa mới
    const generateNewKey = async (id) => {        
        try {
            const response = await fetch(API.BASEURL + `/api/Taokhoanguoidung/${id}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ accountId: id })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const result = await response.json();
            console.log("Kết quả từ API:", result);
            return result;
        } catch (error) {
            console.error('Lỗi khi tạo khóa:', error);
            Swal.fire('Lỗi!', 'Khóa đã được cấp !!!', 'error');
            throw error;
        }
    };
    
    if (initializing) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <Spin tip="Đang tải thông tin người dùng..." />
            </div>
        );
    }
    
    return (
        <div style={{ maxWidth: 500, margin: 'auto', padding: 20, textAlign: 'center' }}>
            <h2>Tạo Khóa Người Dùng</h2>
            
            {accountId ? (
                <div style={{ marginBottom: 20, textAlign: 'center' }}>
                    <p style={{ fontSize: '16px' }}>
                        <strong>Account ID:</strong> {accountId}
                    </p>
                    <Button 
                        type="primary" 
                        onClick={() => handleGenerateKey()} 
                        loading={loading}
                        style={{ width: '180px' }}
                    >
                        Tạo Khóa
                    </Button>
                </div>
            ) : (
                <div style={{ marginBottom: 20 }}>
                    <p style={{ color: 'red' }}>Không tìm thấy thông tin tài khoản. Vui lòng đăng nhập lại.</p>
                </div>
            )}
            
            {privateKey && (
                <div style={{ marginTop: 30, textAlign: 'left' }}>
                    <h3>Khóa Bí Mật:</h3>
                    <pre style={{ 
                        background: '#f5f5f5', 
                        padding: 15, 
                        borderRadius: 5, 
                        wordWrap: 'break-word', 
                        whiteSpace: 'pre-wrap',
                        maxHeight: '200px',
                        overflow: 'auto',
                        border: '1px solid #e8e8e8'
                    }}>
                        {privateKey}
                    </pre>
                    <div style={{ marginTop: 15, display: 'flex', justifyContent: 'flex-start', gap: '10px' }}>
                        <Button type="primary" onClick={handleCopyKey}>
                            Sao Chép
                        </Button>
                        <Button onClick={handleDownloadKey}>
                            Tải Xuống
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserKeyForm;