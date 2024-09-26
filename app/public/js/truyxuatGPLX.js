// Hàm để lấy tất cả license holders
async function fetchLicenseHolders() {
    try {
        const response = await fetch('/api/license-holders');
        const holders = await response.json();
        console.log(holders); // Hiển thị kết quả trong console
        displayLicenseHolders(holders);
    } catch (error) {
        console.error('Error fetching license holders:', error);
    }
}

// Hàm để hiển thị danh sách license holders
function displayLicenseHolders(holders) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';
    holders.forEach(holder => {
        resultDiv.innerHTML += `
            <div>
                <h4>${holder.Name}</h4>
                <p>CCCD: ${holder.CCCD}</p>
                <p>Địa chỉ: ${holder.Address}</p>
                <p>Ngày cấp: ${new Date(holder.Ngaycap).toLocaleDateString()}</p>
                <p>Ngày hết hạn: ${new Date(holder.Ngayhethan).toLocaleDateString()}</p>
                <button onclick="fetchLicenseHolder('${holder._id}')">Xem chi tiết</button>
            </div>
        `;
    });
}

// Hàm để lấy license holder theo ID
async function fetchLicenseHolder(id) {
    try {
        const response = await fetch(`/api/license-holders/${id}`);
        const holder = await response.json();
        displayLicenseHolder(holder);
    } catch (error) {
        console.error('Error fetching license holder:', error);
    }
}

// Hàm để hiển thị chi tiết license holder
function displayLicenseHolder(holder) {
    const detailDiv = document.getElementById('details');
    detailDiv.innerHTML = `
        <h3>Chi tiết chủ sở hữu GPLX</h3>
        <p>Tên: ${holder.Name}</p>
        <p>Ngày sinh: ${new Date(holder.DateOfBirth).toLocaleDateString()}</p>
        <p>CCCD: ${holder.CCCD}</p>
        <p>Địa chỉ: ${holder.Address}</p>
        <p>Số điện thoại: ${holder.PhoneNumber}</p>
        <p>Email: ${holder.Email}</p>
        <p>Ngày cấp: ${new Date(holder.Ngaycap).toLocaleDateString()}</p>
        <p>Ngày hết hạn: ${new Date(holder.Ngayhethan).toLocaleDateString()}</p>
        <p>Trạng thái: ${holder.Status}</p>
        <p>Giám đốc: ${holder.Giamdoc}</p>
        <p>Lỗi vi phạm: ${holder.Loivipham}</p>
        <p>Mã GPLX: ${holder.MaGPLX}</p> <!-- Thêm trường MaGPLX -->
    `;
}
