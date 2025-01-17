const express = require('express');
const router = express.Router();
const { themKiemDinhGPLX,getAllKiemDinhGPLX, getKiemDinhGPLXById,capNhatKiemDinhGPLX,xoaKiemDinhGPLX
} = require('../controllers/KiemdinhGPLXController');
const { imageUpload } = require('../middleware/upload');

// Route để thêm mới kiểm định GPLX
router.post('/them', imageUpload.single('image'), themKiemDinhGPLX);
// Route để lấy tất cả kiểm định GPLX
router.get('/getall', getAllKiemDinhGPLX);

// Route để lấy kiểm định GPLX theo ID
router.get('/getdata/:id', getKiemDinhGPLXById);

// Route để cập nhật kiểm định GPLX
router.put('/:id', capNhatKiemDinhGPLX);

// Route để xóa kiểm định GPLX
router.delete('/:id', xoaKiemDinhGPLX);

module.exports = router;
