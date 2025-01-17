function showErrorToast(error) {
    console.error('Error:', error);

    // Tìm container hoặc tạo container nếu chưa tồn tại
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'position-fixed bottom-0 end-0 p-3';
        toastContainer.style.zIndex = '1055';
        document.body.appendChild(toastContainer);
    }

    // Thêm nội dung Toast
    toastContainer.innerHTML = `
        <div class="toast align-items-center text-bg-danger border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    Có lỗi xảy ra khi lấy thông tin chứng chỉ. Vui lòng thử lại.
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;

    // Hiển thị Toast
    const toast = new bootstrap.Toast(toastContainer.firstElementChild);
    toast.show();
}
