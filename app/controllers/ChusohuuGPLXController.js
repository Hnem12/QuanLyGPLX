const { name } = require('ejs');
const ChusohuuGPLXModel = require('../models/ChusohuuGPLXModel');
const { check, validationResult } = require('express-validator');
const { pushDataBlockchain } = require('../blockchain/Daydulieuvao');
const { updateDataBlockchain } = require('../blockchain/SuadulieuBlockChain');
const { queryGPLXData } = require('../blockchain/Truyvandulieu');

// hiển thị toàn bộ chủ sở hữu GPLX 
exports.getAll =  (req, res, next) => {
    ChusohuuGPLXModel.find({})
        .then(data => {
            //  res.json(data)
            res.render('danhmuc',{ danhmucs :data})
        })
        .catch(err => {
        res.status(500).json('Loi server 1')
    })
}
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
        idSignature, signature, Name, DateOfBirth, CCCD, Address, HangGPLX, PhoneNumber, Email,
        Ngaycap, Ngayhethan, Ngaytrungtuyen, Status, Giamdoc, Loivipham, MaGPLX
    } = req.body;

    try {
        await pushDataBlockchain(
            idSignature, signature, Name, DateOfBirth, CCCD, Address, HangGPLX, PhoneNumber, Email,
            Ngaycap, Ngayhethan, Ngaytrungtuyen, Status, Giamdoc, Loivipham, MaGPLX
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

// const TruyvanData = async (req, res) => {
//     try {
//         // Extract the MaGPLX from the request body
//         const { MaGPLX } = req.body;

//         // Validate the required field
//         if (!MaGPLX) {
//             return res.status(400).json({ success: false, message: 'MaGPLX is required' });
//         }

//         // Execute the blockchain query with the MaGPLX data
//         const gplxData = await queryGPLXData(MaGPLX);

//         // Return the queried data
//         return res.status(200).json({ success: true, data: JSON.parse(gplxData) });
//     } catch (error) {
//         console.error('Error querying GPLX:', error);

//         // Additional logging to help debug the error
//         if (error.message.includes('does not exist')) {
//             return res.status(404).json({ success: false, message: 'GPLX data not found' });
//         }

//         return res.status(500).json({ success: false, message: 'Failed to query GPLX data' });
//     }
// };


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




exports.addLicenseHolder = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(500).json({ errors: errors.array() });
    }

    // Extract fields from the request body
    const {
        name, maGPLX, DateOfBirth, CCCD, Address, PhoneNumber,
        Email, Ngaycap, Ngayhethan, Status, Giamdoc, Loivipham
    } = req.body;

    // Check if the license holder already exists
    ChusohuuGPLXModel.findOne({
        Name: name,
        DateOfBirth,
        CCCD,
        Address,
        PhoneNumber,
        Email,
        Ngaycap,
        Ngayhethan,
        Status,
        MaGPLX: maGPLX
    })
    .then(data => {
        if (data) {
            return res.json('Người dùng này đã tồn tại');
        } else {
            // Create a new license holder, MongoDB will automatically generate _id
            return ChusohuuGPLXModel.create({
                Name: name,
                DateOfBirth,
                CCCD,
                Address,
                PhoneNumber,
                Email,
                Ngaycap,
                Ngayhethan,
                Status,
                MaGPLX: maGPLX
            });
        }
    })
    .then(data => {
        if (data) {
            res.json('Tạo danh mục thành công');
        }
    })
    .catch(err => {
        res.status(500).json('Tạo danh mục thất bại');
    });
};


// sửa GPLX
exports.updateLicenseHolder = async (req, res) => {
    try {
        const _id = req.params.id; // Lấy ID từ URL
        const updateData = {
            MaGPLX: req.body.maGPLX,
            Name: req.body.newname,
            DateOfBirth: req.body.newDateOfBirth,
            CCCD: req.body.newcCCD,
            Address: req.body.newaddress,
            HangGPLX: req.body.newHangGPLX,
            PhoneNumber: req.body.newphoneNumber,
            Email: req.body.newemail,
            Ngaycap: req.body.newngaycap,
            Ngayhethan: req.body.newngayhethan,
            Ngaytrungtuyen: req.body.newngaytrungtuyen,
            Status: req.body.newstatus,
            Giamdoc: req.body.giamdoc,
            Loivipham: req.body.loivipham
        };

        // Tìm đối tượng GPLX bằng ID và cập nhật thông tin
        const licenseHolder = await LicenseHolder.findById(_id);

        if (!licenseHolder) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng với ID này.' });
        }

        // Sử dụng method `updateInfo` đã được định nghĩa trong schema
        await licenseHolder.updateInfo(updateData);

        res.json({ message: 'Cập nhật thành công!' });
    } catch (error) {
        console.error('Lỗi khi cập nhật GPLX:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi, vui lòng thử lại sau.' });
    }
};

// xóa danh mục 
exports.deleteCategory = (req, res, next) => {
    var id = req.params.id;
    ChusohuuGPLXModel.deleteOne({
        _id: id
    })
        .then(data => {
            if (data) {
                res.json('Xoa thanh cong');
            }
            else {
                res.json('Xoa that bai')
            }
        })
        .catch(err => {
        res.status(500).json('loi server 4')
    })
}

module.exports = {
    addNewGPLXtoBlockchain, 
    updateGPLXData,
    
    updateLicenseWithCAKey
}