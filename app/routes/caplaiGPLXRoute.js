const express = require('express');
const router = express.Router();
const CaplaiGPLX = require('../models/CaplaiGPLXModel'); // Đảm bảo bạn đã tạo mô hình này
const LicenseHolder = require('../models/ChusohuuGPLXModel'); // Để liên kết với chủ sở hữu GPLX

// Lấy tất cả giấy phép lái xe đã được cấp lại
router.get('/', async (req, res) => {
  try {
    const renewals = await CaplaiGPLX.find().populate('chusohuuGPLX_id'); // Kết hợp dữ liệu từ chủ sở hữu
    res.json(renewals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Tạo mới giấy phép lái xe cấp lại
router.post('/', async (req, res) => {
  const renewal = new CaplaiGPLX(req.body);
  try {
    const savedRenewal = await renewal.save();
    res.status(201).json(savedRenewal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Lấy thông tin giấy phép lái xe cấp lại theo ID
router.get('/:id', async (req, res) => {
  try {
    const renewal = await CaplaiGPLX.findById(req.params.id).populate('chusohuuGPLX_id');
    if (!renewal) {
      return res.status(404).json({ message: 'Renewal not found' });
    }
    res.json(renewal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cập nhật thông tin giấy phép lái xe cấp lại
router.put('/:id', async (req, res) => {
  try {
    const updatedRenewal = await CaplaiGPLX.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedRenewal) {
      return res.status(404).json({ message: 'Renewal not found' });
    }
    res.json(updatedRenewal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Xóa giấy phép lái xe cấp lại
router.delete('/:id', async (req, res) => {
  try {
    const removedRenewal = await CaplaiGPLX.findByIdAndDelete(req.params.id);
    if (!removedRenewal) {
      return res.status(404).json({ message: 'Renewal not found' });
    }
    res.json(removedRenewal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
