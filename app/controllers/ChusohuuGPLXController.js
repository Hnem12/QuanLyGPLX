const { name } = require('ejs');
const ChusohuuGPLXModel = require('../models/ChusohuuGPLXModel');
const { check, validationResult } = require('express-validator');
const { pushDataBlockchain } = require('../blockchain/Daydulieuvao');
const { updateDataBlockchain } = require('../blockchain/SuadulieuBlockChain');
const { queryGPLXData } = require('../blockchain/Truyvandulieu');
const moment = require('moment');

// hiển thị toàn bộ chủ sở hữu GPLX 
const Getall = (req, res) => {
    ChusohuuGPLXModel.find({})
        .then(data => {
            res.status(200).json({
                success: true,
                message: "Fetched all GPLX records successfully",
                data: data
            });
        })
        .catch(error => {
            res.status(500).json({
                success: false,
                message: "Failed to fetch GPLX records",
                error: error.message
            });
        });
};

// tìm GPLX theo id
exports.getId =  (req, res, next) => {
    var _id = req.params.id
    ChusohuuGPLXModel.findById({ _id })
        .then(data => {
            res.json(data)
        })
        .catch(err => {
        res.status(500).json('Loi server 2')
    })
}

exports.taodanhmuc= (req, res, next) => {
    res.render('addLicenseHolder')
}

const addNewGPLXtoBlockchain = async (req, res) => {
    const {
        idSignature, 
        signature, 
        MaGPLX, 
        Tenchusohuu,
        image, 
        Ngaysinh, 
        CCCD, 
        Ngaytrungtuyen, 
        Ngaycap, 
        Ngayhethan, 
        Email, 
        PhoneNumber, 
        Giamdoc, 
        Status, // Don't set default value here
    } = req.body;
    const status = 'Đã kích hoạt'; // Default 'Đã kích hoạt' if Status is not provided

    try {
        
        await pushDataBlockchain(
            idSignature, 
            signature, 
            MaGPLX, 
            Tenchusohuu, 
            image, 
            Ngaysinh, 
            CCCD, 
            Ngaytrungtuyen, 
            Ngaycap, 
            Ngayhethan, 
            Email, 
            PhoneNumber, 
            Giamdoc, 
            status // Use the status variable here
        );

        return res.status(200).json({
            success: true,
            message: "Transaction submitted successfully."
        });
    } catch (error) {
        console.error("Error in addNewGPLXtoBlockchain:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to submit transaction.",
            error: error.message
        });
    }
};


const updateGPLXData = async (req, res) => {
    try {
        const {
            idSignature, 
            signature, 
            Name, 
            DateOfBirth, 
            CCCD, 
            Address, 
            HangGPLX, 
            PhoneNumber, 
            Email, 
            Ngaycap, 
            Ngayhethan, 
            Ngaytrungtuyen, 
            Status, 
            Giamdoc, 
            Loivipham, 
            MaGPLX
        } = req.body;

        // Call the blockchain update function
        await updateDataBlockchain(
            idSignature, 
            signature, 
            Name, 
            DateOfBirth, 
            CCCD, 
            Address, 
            HangGPLX, 
            PhoneNumber, 
            Email, 
            Ngaycap, 
            Ngayhethan, 
            Ngaytrungtuyen, 
            Status, 
            Giamdoc, 
            Loivipham, 
            MaGPLX
        );

        return res.status(200).json({
            success: true, 
            message: "Data has been successfully updated on the blockchain"
        });
    } catch (error) {
        console.error(`Failed to update data: ${error}`);
        return res.status(500).json({
            success: false, 
            message: "Failed to update data on the blockchain", 
            error: error.message
        });
    }
};

const TruyvanData = async (req, res) => {
    try {
        // Lấy MaGPLX từ tham số URL
        const { MaGPLX } = req.params;

        // Kiểm tra xem MaGPLX có được cung cấp không
        if (!MaGPLX) {
            return res.status(400).json({ success: false, message: 'MaGPLX is required' });
        }

        // Thực hiện truy vấn dữ liệu GPLX với MaGPLX đã cung cấp
        const gplxData = await queryGPLXData(MaGPLX);

        // Phân tích cú pháp dữ liệu trả về (nếu nó là chuỗi JSON)
        const parsedData = JSON.parse(gplxData);

        // Trả về dữ liệu đã truy vấn
        return res.status(200).json({ success: true, data: parsedData });

    } catch (error) {

        // Xử lý lỗi nếu không tìm thấy dữ liệu
        if (error.message && error.message.includes('does not exist')) {
            return res.status(404).json({ success: false, message: `GPLX data for ${req.params.MaGPLX} not found` });
        }

        // Trả về lỗi 500 nếu có lỗi khác
        return res.status(500).json({ success: false, message: 'Failed to query GPLX data' });
    }
};

const updateLicenseWithCAKey = async (req, res) => {
    const { certificate, mspId, type } = req.body;

    if (!certificate || !mspId || !type) {
        return res.status(400).json({ message: 'Thông tin chứng chỉ không hợp lệ.' });
    }

    // Use the CA key (certificate, mspId, type) to update the license holder's details
    // Assuming you have a model to handle the license holder’s data
    const updateData = {
        certificate,
        mspId,
        type,
    };

    // Update the Driver’s License holder information with the CA key
    await LicenseModel.updateOne({ accountId: req.params.accountId }, { $set: updateData });

    res.status(200).json({
        message: "Chứng chỉ CA đã được cập nhật vào hồ sơ GPLX."
    });
};

const addLicenseHolder = async (req, res) => {
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
        const existingHolder = await ChusohuuGPLXModel.findOne({ MaGPLX });
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
        const licenseHolder = new ChusohuuGPLXModel({
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
        const savedHolder = await licenseHolder.save();

        // Respond with success
        res.status(201).json({
            success: true,
            message: 'Thêm chủ sở hữu GPLX thành công!',
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

const getLicenseHolders = async (req, res, targetStatus = 'Đã kích hoạt') => {
    try {
      // Retrieve pagination and status parameters from query
      const page = parseInt(req.query.page) || 1; // Default to page 1
      const pageSize = parseInt(req.query.pageSize) || 6; // Default to 6 items per page
  
      // Sanitize inputs to avoid negative or invalid pageSize
      if (page < 1 || pageSize < 1) {
        return res.status(400).json({ error: "Invalid pagination parameters." });
      }
  
      // Define query filter based on target status ('Đã kích hoạt')
      const query = { Status: targetStatus };
  
      // Fetch paginated and sorted license holders from the database
      const licenseHolders = await ChusohuuGPLXModel.find(query)
        .sort({ Status: 1, Name: 1 }) // Sort by 'Status' and 'Name'
        .skip((page - 1) * pageSize) // Skip records for pagination
        .limit(pageSize); // Limit the number of records returned
  
      if (!licenseHolders || licenseHolders.length === 0) {
        return res.status(404).json({ message: "No activated license holders found." });
      }
  
      // Calculate total records for pagination using the same model
      const totalRecords = await ChusohuuGPLXModel.countDocuments(query); // Use the correct model here
      const totalPages = Math.ceil(totalRecords / pageSize);
  
      // Send the paginated response
      res.status(200).json({
        licenseHolders,
        totalPages,
        totalRecords,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      });
    } catch (error) {
      console.error('Error fetching license holders:', error);
      res.status(500).json({ error: 'Failed to fetch license holders. Please try again later.' });
    }
  };
  

module.exports = {
    addNewGPLXtoBlockchain, 
    updateGPLXData,
    updateLicenseWithCAKey,
    addLicenseHolder,
    getLicenseHolders,
    Getall,
    TruyvanData
}