const express = require('express');
const router = express.Router();
const LicenseHolder = require('../models/ChusohuuGPLXModel');
const { register } = require('../controllers/accountController');
const { upload } = require('../controllers/accountController'); // Multer middleware
const mongoose = require('mongoose');

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
router.post('/addlicenseHolder', async (req, res) => {
  try {
    // Validate and create a new LicenseHolder from request body
    const licenseHolder = new LicenseHolder(req.body);

    // Save the new license holder to the database
    const savedHolder = await licenseHolder.save();

    // Return status 201 for successful creation
    res.status(201).json(savedHolder);
  } catch (err) {
    // Return 500 status for server errors and the error message
    res.status(499).json({
      message: 'Lỗi khi tạo chủ sở hữu GPLX',
      error: err.message
    });
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

router.get('/search/:idOrGPLX', async (req, res) => {
  try {
    const { idOrGPLX } = req.params; // idOrGPLX có thể là ID hoặc Mã GPLX
    let holder;

    // Kiểm tra xem idOrGPLX có phải ObjectId hợp lệ không
    if (mongoose.isValidObjectId(idOrGPLX)) {
      // Nếu hợp lệ, tìm theo ID trước
      holder = await LicenseHolder.findById(idOrGPLX);
    }

    // Nếu không tìm thấy theo ID hoặc idOrGPLX không phải là ObjectId,
    // tìm kiếm theo MaGPLX (nhớ rằng MaGPLX là chuỗi)
    if (!holder) {
      holder = await LicenseHolder.findOne({ MaGPLX: idOrGPLX }); // Tìm theo Mã GPLX
    }

    // Nếu không tìm thấy cả theo ID và MaGPLX
    if (!holder) {
      return res.status(404).json({ message: 'Không tìm thấy chủ sở hữu GPLX với ID hoặc Mã GPLX đã cho' });
    }

    res.json(holder);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi tìm kiếm chủ sở hữu GPLX', error: err.message });
  }
});

// Router
router.post('/addlicenseHolder', async (req, res) => {
  try {
    const licenseHolder = new LicenseHolder(req.body);
    const savedHolder = await licenseHolder.save();

    // Gửi mã GPLX đã lưu qua response
    res.status(201).json({
      message: 'Chủ sở hữu GPLX đã được tạo thành công',
      MaGPLX: savedHolder.MaGPLX, // Gửi mã GPLX đã lưu
      holder: savedHolder // Gửi toàn bộ thông tin chủ sở hữu GPLX
    });
  } catch (err) {
    res.status(500).json({
      message: 'Lỗi khi tạo chủ sở hữu GPLX',
      error: err.message
    });
  }
});



module.exports = router;
