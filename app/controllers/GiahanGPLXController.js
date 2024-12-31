const { name } = require('ejs');
const GiahanGPLXModel = require('../models/GiahanGPLX');
const { check, validationResult } = require('express-validator');
const { pushDataBlockchain } = require('../blockchain/Daydulieuvao');
const moment = require('moment');

const addLicenseHolderRewals = async (req, res) => {
    try {
        // Validate input data
        const { 
            MaGPLX, Name, DateOfBirth, CCCD, Address, PhoneNumber, Email, Ngaycap, Ngayhethan, Status, Giamdoc, Ngaytrungtuyen, HangGPLX 
        } = req.body;

        // Handle image path (null if no file is uploaded)
        const image = req.file ? req.file.path : null;

        // Required fields validation
        if (!MaGPLX || !Name || !DateOfBirth || !CCCD || !Address || !PhoneNumber || !Email || !Ngaycap || !Ngayhethan || !Giamdoc || !Ngaytrungtuyen || !HangGPLX) {
            return res.status(400).json({
                success: false,
                message: 'Mã GPLX, tên, ngày sinh, CCCD, địa chỉ, số điện thoại, email, ngày cấp, ngày hết hạn, giám đốc, ngày trúng tuyển, và hạng GPLX là bắt buộc.'
            });
        }
                
        // Check for existing license holder
        const existingHolder = await GiahanGPLXModel.findOne({ MaGPLX });
        if (existingHolder) {
            return res.status(400).json({
                success: false,
                message: 'Mã GPLX đã tồn tại.'
            });
        }

        // Validate Email
        const emailPattern = /.+\@.+\..+/;
        if (!emailPattern.test(Email)) {
            return res.status(400).json({
                success: false,
                message: 'Email không hợp lệ.'
            });
        }

        // Validate Dates using moment.js
        if (!moment(DateOfBirth, 'YYYY-MM-DD', true).isValid()) {
            return res.status(400).json({
                success: false,
                message: 'Ngày sinh không hợp lệ. Vui lòng nhập định dạng ngày hợp lệ (YYYY-MM-DD).'
            });
        }

        const dateFields = [Ngaycap, Ngayhethan, Ngaytrungtuyen];
        for (let field of dateFields) {
            if (!moment(field, 'YYYY-MM-DD', true).isValid()) {
                return res.status(400).json({
                    success: false,
                    message: `Ngày ${field} không hợp lệ. Vui lòng nhập định dạng ngày hợp lệ (YYYY-MM-DD).`
                });
            }
        }

        // Create new LicenseHolder
        const licenseHolderRewals = new GiahanGPLXModel({
            MaGPLX,
            Name,
            DateOfBirth,
            CCCD,
            Address,
            PhoneNumber,
            Email,
            Ngaycap,
            Ngayhethan,
            Status: 'Chờ kiểm định',
            Giamdoc,
            Ngaytrungtuyen,
            HangGPLX,
            image
        });

        // Save to DB
        const savedHolder = await licenseHolderRewals.save();

        // Respond with success
        res.status(201).json({
            success: true,
            message: 'Thêm GPLX thành công!',
            data: savedHolder
        });

    } catch (err) {
        // Handle errors
        console.error('Error:', err);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tạo chủ sở hữu GPLX',
            error: err.message
        });
    }
};

const getAllGiahanGPLX = async (req, res) => {
    try {
        // Get page and pageSize from query parameters, default to 1 and 5 if not provided
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 5;
        
        // Calculate the number of records to skip based on the page
        const skip = (page - 1) * pageSize;

        // Count the total number of records
        const totalRecords = await GiahanGPLXModel.countDocuments();

        // Calculate the total number of pages
        const totalPages = Math.ceil(totalRecords / pageSize);

        // Fetch the records with pagination
        const kiemdinhGPLXList = await GiahanGPLXModel.find()
            .skip(skip)      // Skip the records based on the page number
            .limit(pageSize) // Limit the records to the pageSize
            .exec();

        // If no records found
        if (!kiemdinhGPLXList.length) {
            return res.status(404).json({ message: 'Không có dữ liệu' });
        }

        // Return the results with pagination details
        return res.status(200).json({
            kiemdinhGPLXList,
            totalRecords,
            totalPages,
            currentPage: page,
            pageSize
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Có lỗi khi lấy dữ liệu kiểm định GPLX',
            error: error.message
        });
    }
};
const getallRenewal = async (req, res) => {
    try {
        // Get page and pageSize from query parameters, default to 1 and 5 if not provided
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 999;

        // Calculate the number of records to skip based on the page
        const skip = (page - 1) * pageSize;

        // Define the filter for status
        const filter = { Status: "Đã hết hạn" };

        // Count the total number of records with the filter
        const totalRecords = await GiahanGPLXModel.countDocuments(filter);

        // Calculate the total number of pages
        const totalPages = Math.ceil(totalRecords / pageSize);

        // Fetch the records with pagination and the status filter
        const GiahanGPLXList = await GiahanGPLXModel.find(filter)
            .skip(skip)      // Skip the records based on the page number
            .limit(pageSize) // Limit the records to the pageSize
            .exec();

        // If no records found
        if (!GiahanGPLXList.length) {
            return res.status(404).json({ message: 'Không có dữ liệu' });
        }

        // Return the results with pagination details
        return res.status(200).json({
            GiahanGPLXList,
            totalRecords,
            totalPages,
            currentPage: page,
            pageSize
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Có lỗi khi lấy dữ liệu kiểm định GPLX',
            error: error.message
        });
    }
};


module.exports = {
    addLicenseHolderRewals,
    getAllGiahanGPLX,
    getallRenewal
}