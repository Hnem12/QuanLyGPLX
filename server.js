const fs = require("fs");
var cors = require("cors");
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); // Import cookie-parser
const { dbconnect } = require('./app/configs/dbConfig');
const checkAuthentication = require('./app/middleware/checkAuthentication');
const accountRouter = require('./app/routes/accountRoute');
const licenseHolderRoutes = require('./app/routes/ChusohuuGPLXRoute');
// const AccountManagement = require('./license-management/src/components/AccountManagement');
const LicenseHolder = require('./app/models/ChusohuuGPLXModel');
const CaplaiGPLXRouter = require('./app/routes/caplaiGPLXRoute');
const GiahanGPLXRouter = require('./app/routes/GiahanGPLX');
const imageRoutes = require('./app/routes/imageRoute');
const { DangKyAdmin } = require('./app/blockchain/enrollAdmin'); // Điều chỉnh đường dẫn
const { queryGPLXData } = require('./app/blockchain/Truyvandulieu');
const KiemdinhGPLXRoute = require('./app/routes/KiemdinhGPLXRoute') 


const app = express();
dbconnect();
module.exports = { dbconnect };

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app/views'));

// Middleware xử lý request body
app.use(express.json({ limit: '50mb' })); // Hỗ trợ JSON, tăng giới hạn nếu cần
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // Hỗ trợ form-data

// Cấu hình CORS
app.use(cors({ credentials: true, origin: '*' }));

// Middleware xử lý cookie
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'app/public')));
app.use(express.static(path.join(__dirname, 'app/public/js')));
app.use(express.static(path.join(__dirname, 'app/public/css')));
app.use(express.static(path.join(__dirname, 'client/build')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Sử dụng router upload ảnh
app.use('/api/images', imageRoutes);
// Use routes
app.use('/api/account/', accountRouter);
app.use('/api/licenseHolder/', licenseHolderRoutes);
app.use('/api/ApprovelicenselHoder/', licenseHolderRoutes);
app.use('/api/register/', accountRouter);
app.use('/api/addAccount/', accountRouter);
app.use('/api/updatedAccount/', accountRouter);
app.use('/api/truyxuatbanglaixeoto/', licenseHolderRoutes);
app.use('/api/deleteLicenseHolder', licenseHolderRoutes);
app.use('/api/', licenseHolderRoutes);
app.use('/api/', accountRouter);
app.use('/api/search/', licenseHolderRoutes);
app.use('/api/renewal', GiahanGPLXRouter);
app.use('/api/Caplai', CaplaiGPLXRouter);
app.use('/api/kiemdinh/', KiemdinhGPLXRoute);

const normalizeKey = (key) => {
    return key.replace(/\r\n/g, "").replace(/\n/g, "").trim();
};

app.post("/verify-key", async (req, res) => {
    const { accountId, privateKey } = req.body;
    const keyFilePath = path.join("/home/hnem/QuanLyGPLX/wallet", `${accountId}.id`);

    if (!fs.existsSync(keyFilePath)) {
        return res.status(404).json({ success: false, message: "Không tìm thấy khóa cho tài khoản này!" });
    }

    try {
        const storedData = JSON.parse(fs.readFileSync(keyFilePath, "utf8"));
        const storedKey = normalizeKey(storedData.credentials.privateKey);
        const inputKey = normalizeKey(privateKey);


        if (storedKey === inputKey) {
            return res.json({ success: true });
        } else {
            return res.status(401).json({ success: false, message: "Khóa không chính xác!" });
        }
    } catch (error) {
        console.error("Lỗi đọc khóa:", error);
        return res.status(500).json({ success: false, message: "Lỗi xử lý tệp khóa!" });
    }
});

app.post('/api/account/login', (req, res) => {
    const { username, password } = req.body;

    // Kiểm tra username, password
    const user = findUserInDatabase(username, password);
    if (!user) {
        return res.status(401).json({ message: "Sai thông tin đăng nhập" });
    }

    // Trả về dữ liệu user (bao gồm accountId)
    res.json({
        message: "Đăng nhập thành công",
        userData: {
            _id: user._id,
            username: user.username,
            image: user.image,
            certificate: user.certificate,
            mspId: user.mspId,
            type: user.type
        }
    });
});



DangKyAdmin();
app.get('/', (req, res) => {
    res.render('Account/Login'); // Render the login page
});

app.get('/login', (req, res) => {
    res.render('Account/Login'); // Render the login page
});

app.get('/register', (req, res) => {
    res.render('Account/Register'); // Render the register page
});

app.post('/api/reissue-license', (req, res) => {
    const { licenseID, name, reason } = req.body;
    
    // Xử lý dữ liệu (lưu vào cơ sở dữ liệu, kiểm tra, v.v.)
    console.log('Received data:', { licenseID, name, reason });

    // Gửi phản hồi về frontend
    res.json({ message: 'Dữ liệu đã được nhận thành công!', data: req.body });
});

app.use(checkAuthentication); 

app.get('/account',checkAuthentication, (req, res) => {
    res.render('Account/Account'); // Render the register page
});

app.get('/licenseHolder',checkAuthentication, (req, res) => {
    res.render('LicenseHolder/LicenseHolder'); // Render the register page

});
app.get('/ApprovelicenselHoder',checkAuthentication, (req, res) => {
    res.render('LicenseHolder/ApprovelicenselHoder', { role: req.user.role }); // Render the register page
});

app.get('/renewals',checkAuthentication, (req, res) => {
    res.render('LicenseHolderRenewal/LicenseRenewal'); // Render the register page
});
app.get('/renew',checkAuthentication, (req, res) => {
    res.render('LicenseHolderRenew/LicenseRenew'); // Render the register page
})

app.get('/trangchu',checkAuthentication, (req, res) => {
    res.render('Home/index'); // Render the index page
});
app.get('/loi404', (req, res) => {
    res.render('Home/404'); // Render the 404 page
});

app.get('/kiemdinhGPLX',checkAuthentication, (req, res) => {
    res.render('Kiemdinh/KiemdinhGPLX'); // Render the index page
});
app.get('/api/account/', async (req, res) => {
    try {
      const accounts = await AccountModel.find(); // Lấy tất cả dữ liệu từ collection 'account'
      res.json(accounts); // Trả về dữ liệu dưới dạng JSON
     
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch accounts' });
    }
  });
  
  app.get('/truyxuatbanglaixeoto', (req, res) => {
    res.render('Home/Truyxuatbanglaixeoto'); // Render the license retrieval page
});
app.get('/api/licenseHolder/search/:MaGPLX', async (req, res) => {
    try {
        const { MaGPLX } = req.params;
        const holder = await LicenseHolder.findOne({ MaGPLX });

        if (!holder) {
            return res.status(404).json({ message: "Holder not found" });
        }

        // Check and log the holder data
        console.log('Found holder:', holder);

        return res.json(holder); // Trả về holder cho frontend
    } catch (error) {
        console.error('Error fetching license holder:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});
app.listen(3000, () => {
    console.log(`Server started on port 3000`);
});
