import React, { useState, useEffect } from 'react';
import { Button, message, Spin, Input } from 'antd';
import Swal from 'sweetalert2';
import axios from 'axios';
import API from '../../utils/request';
import './createKey.scss';

const UserKeyForm = () => {
    const [accountId, setAccountId] = useState('');
    const [loading, setLoading] = useState(false);
    const [privateKey, setPrivateKey] = useState(null);
    const [initializing, setInitializing] = useState(true);
    const [password, setPassword] = useState(''); // Thêm state để lưu mật khẩu

    useEffect(() => {
        const fetchAccountId = async () => {
            try {
                setInitializing(true);
                const accountIdFromCookie = getAccountIdFromCookie();
                if (accountIdFromCookie) {
                    setAccountId(accountIdFromCookie);
                } else {
                    const accountIdFromToken = getAccountIdFromToken();
                    if (accountIdFromToken) {
                        setAccountId(accountIdFromToken);
                    } else {
                        Swal.fire('Lỗi!', 'Không thể lấy Account ID.', 'error');
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

    const getAccountIdFromCookie = () => {
        try {
            const cookies = document.cookie.split(';');
            for (let cookie of cookies) {
                cookie = cookie.trim();
                if (cookie.startsWith('accountId=')) {
                    return cookie.substring('accountId='.length);
                }
            }
            return null;
        } catch (error) {
            console.error('Lỗi khi đọc cookie:', error);
            return null;
        }
    };

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

    const handleGenerateKey = async () => {
        if (!accountId || !password) {
            Swal.fire('Cảnh báo!', 'Vui lòng nhập mật khẩu trước khi tạo khóa.', 'warning');
            return;
        }
    
        setLoading(true);
        try {
            const verifyResponse = await axios.post('http://localhost:3000/api/verifyPassword', { id: accountId, password });

            if (!verifyResponse.data.success) {
                message.error('Mật khẩu không đúng.');
                setLoading(false);
                return;
            }

            const result = await generateNewKey(accountId);
            if (result.privateKey) {
                const formattedKey = result.privateKey.replace(/(\r\n|\n|\r)/g, '');
                setPrivateKey(formattedKey);
                message.success('Khóa đã được tạo thành công!');
            } else {
                message.error('Tạo khóa không thành công.');
            }
        } catch (error) {
            console.error('Lỗi:', error);
            message.error('Đã xảy ra lỗi.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopyKey = () => {
        if (privateKey) {
            navigator.clipboard.writeText(privateKey)
                .then(() => message.success('Đã sao chép khóa bí mật!'))
                .catch(() => message.error('Không thể sao chép khóa bí mật.'));
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

                    {/* Thêm input nhập mật khẩu */}
                    <Input.Password 
                        placeholder="Nhập mật khẩu để xác thực" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ marginBottom: 10, width: '100%' }}
                    />

                    <Button 
                        type="primary" 
                        onClick={handleGenerateKey} 
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
