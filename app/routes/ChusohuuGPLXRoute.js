const express = require('express');
const router = express.Router();
const LicenseHolder = require('../models/ChusohuuGPLXModel');
const { register } = require('../controllers/accountController');
const { upload } = require('../controllers/accountController'); // Multer middleware

// Lấy tất cả chủ sở hữu GPLX
router.get('/', async (req, res) => {
  try {
    const holders = await LicenseHolder.find();
    res.json(holders);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách chủ sở hữu GPLX', error: err.message });
  }
});

// Tạo một chủ sở hữu GPLX mới
router.post('/', async (req, res) => {
  const licenseHolder = new LicenseHolder(req.body);
  try {
    const savedHolder = await licenseHolder.save();
    res.status(201).json(savedHolder); // Trả về mã trạng thái 201 khi tạo thành công
  } catch (err) {
    res.status(400).json({ message: 'Lỗi khi tạo chủ sở hữu GPLX', error: err.message });
  }
});

// Lấy một chủ sở hữu GPLX cụ thể theo ID
router.get('/:id', async (req, res) => {
  try {
    const holder = await LicenseHolder.findById(req.params.id);
    if (!holder) {
      return res.status(404).json({ message: 'Không tìm thấy chủ sở hữu GPLX với ID đã cho' });
    }
    res.json(holder);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi tìm kiếm chủ sở hữu GPLX', error: err.message });
  }
});

// Cập nhật thông tin một chủ sở hữu GPLX
router.put('/:id', async (req, res) => {
  try {
    const updatedHolder = await LicenseHolder.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedHolder) {
      return res.status(404).json({ message: 'Không tìm thấy chủ sở hữu GPLX để cập nhật' });
    }
    res.json(updatedHolder);
  } catch (err) {
    res.status(400).json({ message: 'Lỗi khi cập nhật chủ sở hữu GPLX', error: err.message });
  }
});

// Xóa một chủ sở hữu GPLX
router.delete('/:id', async (req, res) => {
  try {
    const removedHolder = await LicenseHolder.findByIdAndDelete(req.params.id);
    if (!removedHolder) {
      return res.status(404).json({ message: 'Không tìm thấy chủ sở hữu GPLX để xóa' });
    }
    res.json({ message: 'Đã xóa chủ sở hữu GPLX', holder: removedHolder });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi xóa chủ sở hữu GPLX', error: err.message });
  }
});

// Lấy một chủ sở hữu GPLX theo ID hoặc Mã GPLX
const mongoose = require('mongoose');

router.get('/search/:idOrGPLX', async (req, res) => {
  try {
    const { idOrGPLX } = req.params;

    // Tìm kiếm theo ID trước
    let holder = await LicenseHolder.findById(idOrGPLX);

    // Nếu không tìm thấy theo ID, kiểm tra xem idOrGPLX có phải là ObjectId hợp lệ không
    if (!holder) {
      if (mongoose.isValidObjectId(idOrGPLX)) {
        const convertedId = mongoose.Types.ObjectId(idOrGPLX);
        holder = await LicenseHolder.findById(convertedId);
      } else {
        // Nếu không phải ObjectId, tìm kiếm theo MaGPLX
        holder = await LicenseHolder.findById({ MaGPLX: idOrGPLX });
      }
    }

    // Nếu vẫn không tìm thấy
    if (!holder) {
      return res.status(404).json({ message: 'Không tìm thấy chủ sở hữu GPLX với ID hoặc Mã GPLX đã cho' });
    }

    res.json(holder);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi tìm kiếm chủ sở hữu GPLX', error: err.message });
  }
});


module.exports = router;
