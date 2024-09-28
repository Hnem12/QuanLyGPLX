document.getElementById('toggleButton').addEventListener('click', function() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('collapsed');

    // Cập nhật biểu tượng nút
    const icon = sidebar.classList.contains('collapsed') ? 'fa-chevron-right' : 'fa-chevron-left';
    this.innerHTML = `<i class="fas ${icon}"></i>`;
  });