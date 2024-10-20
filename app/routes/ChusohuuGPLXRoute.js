const express = require('express');
const router = express.Router();
const LicenseHolder = require('../models/ChusohuuGPLXModel');
const { register } = require('../controllers/accountController');
const { upload } = require('../controllers/accountController'); // Multer middleware
const mongoose = require('mongoose');
const LicenseHolderController = require('../controllers/ChusohuuGPLXController');

// Lấy tất cả chủ sở hữu GPLX
router.get('/licenseHolder', async (req, res) => {
  try {
    const holders = await LicenseHolder.find();
    res.json(holders);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách chủ sở hữu GPLX', error: err.message });
  }
});
router.get('/ApprovelicenselHoder', async (req, res) => {
    try {
      const holders = await LicenseHolder.find();
      res.json(holders);
    } catch (err) {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách chủ sở hữu GPLX', error: err.message });
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

router.put('/updateLicenseHolder/:id', async (req, res) => {
    try {
      const { id } = req.params; // Lấy ID từ URL
      const updateData = req.body; // Dữ liệu cần cập nhật
  
      // Tìm và cập nhật GPLX theo ID
      const updatedHolder = await LicenseHolder.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true } // Trả về dữ liệu sau khi cập nhật & kiểm tra validators
      );
  
      // Nếu không tìm thấy chủ sở hữu GPLX
      if (!updatedHolder) {
        return res.status(404).json({ message: 'Không tìm thấy chủ sở hữu GPLX để cập nhật' });
      }
  
      res.json(updatedHolder); // Trả về kết quả cập nhật thành công
    } catch (err) {
      console.error('Lỗi khi cập nhật chủ sở hữu GPLX:', err);
      res.status(400).json({ message: 'Lỗi khi cập nhật chủ sở hữu GPLX', error: err.message });
    }
  });


router.delete('/:id', async (req, res) => {
  try {
      const { id } = req.params; // Extract ID from request parameters
      
      // Directly attempt to delete the license holder
      const deletedHolder = await LicenseHolder.findByIdAndDelete(id);
      
      // Check if the license holder was found and deleted
      if (!deletedHolder) {
          return res.status(404).json({
              success: false,
              message: 'Chủ sở hữu GPLX không tìm thấy.' // License holder not found
          });
      }

      // Return success message
      res.status(200).json({
          success: true,
          message: 'Xóa chủ sở hữu GPLX thành công!' // Successfully deleted message
      });
  } catch (err) {
      console.error('Error deleting license holder:', err);
      res.status(500).json({
          success: false,
          message: 'Lỗi khi xóa chủ sở hữu GPLX',
          error: err.message
      });
  }
});



router.post('/addlicenseHolder', async (req, res) => {
    try {
        // Validate input data
        const { 
            MaGPLX, 
            Name, 
            DateOfBirth, 
            CCCD, 
            Address, 
            PhoneNumber, 
            Email, 
            Ngaycap, 
            Ngayhethan, 
            Status, 
            Giamdoc,
            Ngaytrungtuyen, // Thêm trường Ngày trúng tuyển
            HangGPLX // Thêm trường Hạng GPLX
        } = req.body;
  
        // Required fields validation
        if (!MaGPLX || !Name || !DateOfBirth || !CCCD || !Address || !PhoneNumber || !Email || !Ngaycap || !Ngayhethan || !Giamdoc || !Ngaytrungtuyen || !HangGPLX) {
            return res.status(400).json({
                success: false,
                message: 'Mã GPLX, tên, ngày sinh, CCCD, địa chỉ, số điện thoại, email, ngày cấp, ngày hết hạn, giám đốc, ngày trúng tuyển, và hạng GPLX là bắt buộc.'
            });
        }
  
        // Check if Status is a valid enum value
        const validStatuses = ['Đã kích hoạt', 'Chưa kích hoạt'];
        if (!validStatuses.includes(Status)) {
            return res.status(400).json({
                success: false,
                message: 'Trạng thái không hợp lệ. Các giá trị hợp lệ là: Đã kích hoạt, Chưa kích hoạt'
            });
        }
  
        // Check for existing license holder
        const existingHolder = await LicenseHolder.findOne({ MaGPLX });
        if (existingHolder) {
            return res.status(400).json({
                success: false,
                message: 'Mã GPLX đã tồn tại.'
            });
        }
  
        // Optional: Additional validation for email format
        const emailPattern = /.+\@.+\..+/;
        if (!emailPattern.test(Email)) {
            return res.status(400).json({
                success: false,
                message: 'Email không hợp lệ.'
            });
        }
  
        // Optional: Validate date formats
        if (isNaN(Date.parse(DateOfBirth)) || isNaN(Date.parse(Ngaycap)) || isNaN(Date.parse(Ngayhethan)) || isNaN(Date.parse(Ngaytrungtuyen))) {
            return res.status(400).json({
                success: false,
                message: 'Ngày sinh, ngày cấp, ngày hết hạn và ngày trúng tuyển phải là định dạng ngày hợp lệ.'
            });
        }
  
        // Create a new LicenseHolder from request body
        const licenseHolder = new LicenseHolder({
            MaGPLX,
            Name,
            DateOfBirth,
            CCCD,
            Address,
            PhoneNumber,
            Email,
            Ngaycap,
            Ngayhethan,
            Status,
            Giamdoc,
            Ngaytrungtuyen, // Lưu trường Ngày trúng tuyển
            HangGPLX // Lưu trường Hạng GPLX
        });
  
        // Save the new license holder to the database
        const savedHolder = await licenseHolder.save();
  
        // Return status 201 for successful creation with the saved holder data
        res.status(201).json({
            success: true,
            message: 'Thêm chủ sở hữu GPLX thành công!',
            data: savedHolder
        });
    } catch (err) {
        console.error('Error creating license holder:', err); // Log the error
  
        // Return 500 status for server errors
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tạo chủ sở hữu GPLX',
            error: err.message // Provide the error message
        });
    }
  });
  


router.get('/search/:idOrGPLX', async (req, res) => {
    const { idOrGPLX } = req.params; // The parameter can be either ID or MaGPLX
  
    try {
        let holder = null;
  
        // First, check if the parameter is a valid ObjectId for ID search
        if (mongoose.isValidObjectId(idOrGPLX)) {
            holder = await LicenseHolder.findById(idOrGPLX);
            if (holder) {
                console.log('Found holder by ID:', holder);
                return res.json({
                    message: 'Found holder by ID',
                    MaGPLX: holder.MaGPLX, // Returning MaGPLX
                    holder // Returning the full holder object
                });
            }
        }

        holder = await LicenseHolder.findOne({ MaGPLX: idOrGPLX });

        // Check if the holder was found by MaGPLX
        if (holder) {
            console.log('Found holder by MaGPLX:', holder);
            return res.json({
                message: 'Found holder by MaGPLX',
                MaGPLX: holder.MaGPLX, // Returning MaGPLX
                holder // Returning the full holder object
            });
        }
        holder = await LicenseHolder.findOne({ CCCD: idOrGPLX });

        // Check if the holder was found by MaGPLX
        if (holder) {
            console.log('Found holder by CCCD:', holder);
            return res.json({
                message: 'Found holder by CCCD',
                CCCD: holder.CCCD, // Returning MaGPLX
                holder // Returning the full holder object
            });
        }

        // If not found by either ID or MaGPLX, return 404
        return res.status(404).json({ message: 'Không tìm thấy chủ sở hữu GPLX với ID hoặc Mã GPLX đã cho' });
  
    } catch (err) {
        console.error('Search error:', err);
        return res.status(500).json({ message: 'Lỗi khi tìm kiếm chủ sở hữu GPLX', error: err.message });
    }
});

router.get('/phantranglicenseHolders', LicenseHolderController.phantrangLicenseHolders);

module.exports = router;