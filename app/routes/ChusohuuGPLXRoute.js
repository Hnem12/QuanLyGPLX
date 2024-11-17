const express = require('express');
const router = express.Router();
const LicenseHolder = require('../models/ChusohuuGPLXModel');
const mongoose = require('mongoose');
const { addNewGPLXtoBlockchain, updateGPLXData, TruyvanData, addLicenseHolder, getLicenseHolders ,Getall} = require('../controllers/ChusohuuGPLXController'); // Multer middleware
const { queryGPLXData } = require('../blockchain/Truyvandulieu'); 
const { imageUpload } = require('../middleware/upload');


// Route to get license holders with 'Chưa kích hoạt' first
router.get('/ApprovelicenselHoder', (req, res) => {
  getLicenseHolders(req, res, 'Chờ kiểm định');
});

// Route to get license holders with 'Đã kích hoạt' first
router.get('/licenseHolder', (req, res) => {
  const status = req.query.status || 'Đã kích hoạt';  // Get status from query params or default to 'Đã kích hoạt'
  getLicenseHolders(req, res, status);
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

router.put('/updateLicenseHolder/:id', imageUpload.single('image'), async (req, res) => {
  try {
    const { id } = req.params; // Get ID from URL
    let updateData = req.body; // The data to update

    // If an image file is uploaded, add the file path to updateData
    if (req.file) {
      updateData.image = req.file.path; // Store the image file path in the update data
    }

    // Find and update the license holder by ID
    const updatedHolder = await LicenseHolder.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true } // Return the updated data and validate fields
    );

    // If no license holder is found, return an error
    if (!updatedHolder) {
      return res.status(404).json({ message: 'Không tìm thấy chủ sở hữu GPLX để cập nhật' });
    }

    // Return the updated license holder data
    res.json(updatedHolder); // Successfully updated
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



router.post('/addlicenseHolder', imageUpload.single('image'), addLicenseHolder);

router.get('/search/:idOrGPLX', async (req, res) => {
    const { idOrGPLX } = req.params; // The parameter can be either ID or MaGPLX
  
    try {
        let holder = null;
          if (mongoose.isValidObjectId(idOrGPLX)) {
            holder = await LicenseHolder.findById(idOrGPLX);
            if (holder) {
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
            return res.json({
                message: 'Found holder by MaGPLX',
                MaGPLX: holder.MaGPLX, // Returning MaGPLX
                holder // Returning the full holder object
            });
        }
        holder = await LicenseHolder.findOne({ CCCD: idOrGPLX });

        // Check if the holder was found by MaGPLX
        if (holder) {
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
router.post('/createData', addNewGPLXtoBlockchain);

router.put('/updateData', updateGPLXData);

router.get('/truyvanGPLX/:MaGPLX', TruyvanData);

module.exports = router;