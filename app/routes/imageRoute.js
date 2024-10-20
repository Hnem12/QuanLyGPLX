const express = require('express');
const { imageUpload } = require('../middleware/upload');
const { register } = require('../controllers/accountController'); // Account logic

const router = express.Router();

// Route xử lý upload ảnh
router.post('/upload', imageUpload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded!' });
        }

        const newImage = {
            filename: req.file.filename,
            originalname: req.file.originalname,
            path: req.file.path.replace(/\\/g, '/'), // Adjust for Windows
        };

        return res.status(200).json({ message: 'Upload successful!', image: newImage });
    } catch (error) {
        console.error('Error uploading image:', error);
        return res.status(500).json({ message: 'Upload failed!', error: error.message });
    }
});


module.exports = router;