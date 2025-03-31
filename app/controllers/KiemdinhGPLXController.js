const KiemdinhGPLX = require('../models/KiemdinhGPLXModel');

const themKiemDinhGPLX = async (req, res) => {
    try {
        // Lấy dữ liệu từ request body
        const {
            Name,
            DateOfBirth,
            CCCD,
            Gender,
            Address,
            HangGPLX, 
            Country,
            PhoneNumber,
            Email,
            Ngaycap,
            Ngayhethan,
            Ngaytrungtuyen,
            Giamdoc,
            Loivipham,
            MaGPLX,
            Status,
            NgayKiemDinh,
            NguoiKiemDinh,
            BuocKiemDinh
        } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!MaGPLX || !Name || !DateOfBirth || !NgayKiemDinh || !NguoiKiemDinh || !Gender) {
            return res.status(400).json({
                message: 'Các trường bắt buộc chưa được điền đầy đủ.'
            });
        }

        // Kiểm tra nếu có file ảnh thì lấy file từ req.file
        let imagePath = null;
        if (req.file) {
            imagePath = req.file.path; // Assuming you are using multer for file upload
        }

        // Tạo mới đối tượng kiểm định GPLX
        const kiemdinhGPLX = new KiemdinhGPLX({
            Name,
            DateOfBirth,
            CCCD,
            Gender,
            Address,
            HangGPLX, 
            Country,
            PhoneNumber,
            Email,
            Ngaycap,
            Ngayhethan,
            Ngaytrungtuyen,
            Giamdoc,
            Loivipham,
            MaGPLX,
            Status: 'Đang kiểm định',
            image: imagePath, // Image file path
            NgayKiemDinh,
            NguoiKiemDinh: 'Adminkd', // Assuming NguoiKiemDinh is fixed as "Adminkd"
            BuocKiemDinh
        });

        // Lưu kiểm định GPLX vào database
        const savedKiemdinhGPLX = await kiemdinhGPLX.save();

        // Trả về kết quả
        return res.status(201).json({
            data: savedKiemdinhGPLX
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Có lỗi xảy ra khi thêm kiểm định GPLX',
            error: err.message
        });
    }
};

// Controller để lấy tất cả kiểm định GPLX
const getAllKiemDinhGPLX = async (req, res) => {
    try {
        // Get page and pageSize from query parameters, default to 1 and 5 if not provided
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 5;
        
        // Calculate the number of records to skip based on the page
        const skip = (page - 1) * pageSize;

        // Count the total number of records
        const totalRecords = await KiemdinhGPLX.countDocuments();

        // Calculate the total number of pages
        const totalPages = Math.ceil(totalRecords / pageSize);

        // Fetch the records with pagination
        const kiemdinhGPLXList = await KiemdinhGPLX.find()
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


// Controller để lấy kiểm định GPLX theo ID
const getKiemDinhGPLXById = async (req, res) => {
    try {
        const { id } = req.params;

        // Tìm kiểm định GPLX theo ID
        const kiemdinhGPLX = await KiemdinhGPLX.findById(id);

        if (!kiemdinhGPLX) {
            return res.status(404).json({ message: 'Không tìm thấy kiểm định GPLX' });
        }

        return res.status(200).json({
            kiemdinhGPLX
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: 'Có lỗi xảy ra khi lấy kiểm định GPLX',
            error: err.message
        });
    }
};

// Controller để cập nhật kiểm định GPLX
const capNhatKiemDinhGPLX = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Tìm kiểm định GPLX theo ID và cập nhật thông tin
        const kiemdinhGPLX = await KiemdinhGPLX.findById(id);

        if (!kiemdinhGPLX) {
            return res.status(404).json({ message: 'Không tìm thấy kiểm định GPLX để cập nhật' });
        }

        // Cập nhật dữ liệu kiểm định GPLX
        Object.assign(kiemdinhGPLX, updateData);

        // Lưu lại kiểm định GPLX đã cập nhật
        const updatedKiemdinhGPLX = await kiemdinhGPLX.save();

        return res.status(200).json({
            message: 'Cập nhật kiểm định GPLX thành công',
            data: updatedKiemdinhGPLX
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Có lỗi xảy ra khi cập nhật kiểm định GPLX',
            error: err.message
        });
    }
};

// Controller để xóa kiểm định GPLX theo ID
const xoaKiemDinhGPLX = async (req, res) => {
    try {
        const { id } = req.params;

        // Tìm và xóa kiểm định GPLX theo ID
        const kiemdinhGPLX = await KiemdinhGPLX.findByIdAndDelete(id);

        if (!kiemdinhGPLX) {
            return res.status(404).json({ message: 'Không tìm thấy kiểm định GPLX để xóa' });
        }

        return res.status(200).json({
            message: 'Xóa kiểm định GPLX thành công',
            data: kiemdinhGPLX
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Có lỗi xảy ra khi xóa kiểm định GPLX',
            error: err.message
        });
    }
};

module.exports = {
    themKiemDinhGPLX,
    getAllKiemDinhGPLX,
    getKiemDinhGPLXById,
    capNhatKiemDinhGPLX,
    xoaKiemDinhGPLX
};
