const express = require('express');
const router = express.Router();
const {addLicenseHolderRenew, getAllCaplaiGPLX} = require('../controllers/CaplaiGPLXController');
const { imageUpload } = require('../middleware/upload');
const LicenseHolderCaplai = require('../models/CaplaiGPLXModels');

// Route to add a new license
router.post('/addRenew', imageUpload.single('image'), addLicenseHolderRenew);

router.get('/getallRenew', getAllCaplaiGPLX);


router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params; // Extract ID from request parameters
        
        // Directly attempt to delete the license holder
        const deletedHolder = await LicenseHolderCaplai.findByIdAndDelete(id);
        
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
  

module.exports = router;