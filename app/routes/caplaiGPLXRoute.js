const express = require('express');
const router = express.Router();
const CaplaiGPLX = require('../models/CaplaiGPLXModels'); // Mô hình cấp GPLX
const ChusohuuGPLXModel = require('../models/ChusohuuGPLXModel');
const mongoose = require('mongoose');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Lấy tất cả giấy phép lái xe đã được cấp lại
router.get('/getallRenew', async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // default to page 1 with 10 items per page

  try {
    const renewals = await CaplaiGPLX.find()
      .populate('chusohuuGPLX_id') // Ensure you're populating the license holder
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .exec();

    const total = await CaplaiGPLX.countDocuments();
    res.json({
      renewals,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi lấy dữ liệu: ' + err.message });
  }
});

// Dynamic route for getting a single renewal by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  // Validate the ObjectId
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'ID không hợp lệ.' });
  }

  try {
    // Find the renewal and populate the owner information
    const renewal = await CaplaiGPLX.findById(id).populate('chusohuuGPLX_id');

    // If not found, return a 404 error
    if (!renewal) {
      return res.status(404).json({ message: 'License renewal not found' });
    }

    // Send the renewal data with owner info
    res.json(renewal);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi tìm kiếm: ' + err.message });
  }
});

// Tạo mới giấy phép lái xe cấp lại
router.post('/renewLicense', async (req, res) => {
  const { DateOfRenewal, NewExpiryDate, Lidocaplai, chusohuuGPLX_id } = req.body;

  // Kiểm tra xem các trường có bắt buộc không
  if (!DateOfRenewal || !NewExpiryDate || !Lidocaplai || !chusohuuGPLX_id) {
    return res.status(400).json({ message: 'Tất cả các trường đều là bắt buộc.' });
  }

  // Kiểm tra tính hợp lệ của ID chủ sở hữu GPLX
  if (!isValidObjectId(chusohuuGPLX_id)) {
    return res.status(400).json({ message: 'ID chủ sở hữu GPLX không hợp lệ.' });
  }

  const renewal = new CaplaiGPLX({
    DateOfRenewal: new Date(DateOfRenewal),
    NewExpiryDate: new Date(NewExpiryDate),
    Lidocaplai,
    chusohuuGPLX_id, // Thêm ID chủ sở hữu GPLX
  });

  try {
    const savedRenewal = await renewal.save();
    res.status(201).json(savedRenewal);
  } catch (err) {
    res.status(400).json({ message: 'Lỗi khi lưu cấp GPLX: ' + err.message });
  }
});

// Lấy thông tin giấy phép lái xe cấp lại theo ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'ID không hợp lệ.' });
  }

  try {
    const renewal = await CaplaiGPLX.findById(id).populate('chusohuuGPLX_id');
    if (!renewal) {
      return res.status(404).json({ message: 'Không tìm thấy giấy phép lái xe cấp lại với ID này.' });
    }
    res.json(renewal);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi tìm kiếm: ' + err.message });
  }
});

// Cập nhật thông tin giấy phép lái xe cấp lại
router.put('/:id', async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'ID không hợp lệ.' });
  }

  try {
    const updatedRenewal = await CaplaiGPLX.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedRenewal) {
      return res.status(404).json({ message: 'Không tìm thấy giấy phép lái xe cấp lại với ID này.' });
    }
    res.json(updatedRenewal);
  } catch (err) {
    res.status(400).json({ message: 'Lỗi khi cập nhật: ' + err.message });
  }
});

// Xóa giấy phép lái xe cấp lại
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'ID không hợp lệ.' });
  }

  try {
    const removedRenewal = await CaplaiGPLX.findByIdAndDelete(id);
    if (!removedRenewal) {
      return res.status(404).json({ message: 'Không tìm thấy giấy phép lái xe cấp lại với ID này.' });
    }
    res.json({ message: 'Xóa giấy phép lái xe cấp lại thành công.', removedRenewal });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi xóa: ' + err.message });
  }
});

module.exports = router;
