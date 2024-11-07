const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); // Import cookie-parser
const { dbconnect } = require('./app/configs/dbConfig');
const checkAuthentication = require('./app/middleware/checkAuthentication');
const accountRouter = require('./app/routes/accountRoute');
const licenseHolderRoutes = require('./app/routes/ChusohuuGPLXRoute');
var cors = require("cors");
// const AccountManagement = require('./license-management/src/components/AccountManagement');
const LicenseHolder = require('./app/models/ChusohuuGPLXModel');
const CaplaiGPLXRouter = require('./app/routes/caplaiGPLXRoute');
const GiahanGPLXRouter = require('./app/routes/GiahanGPLX');
const imageRoutes = require('./app/routes/imageRoute');
const { DangKyAdmin } = require('./app/blockchain/enrollAdmin'); // Điều chỉnh đường dẫn
const { queryGPLXData } = require('./app/blockchain/Truyvandulieu');



const app = express();
dbconnect();
module.exports = { dbconnect };

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app/views'));
app.use(express.json()); // để xử lý dạng dữ liệu json
app.use(express.urlencoded({ extended: true })); // để xử lý dữ liệu url encoded
app.use(cors({ credentials: true, origin: "*" })); 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser()); // Use cookie-parser middleware here

app.use(express.static(path.join(__dirname, 'app/public')));
app.use(express.static(path.join(__dirname, 'app/public/js')));
app.use(express.static(path.join(__dirname, 'app/public/css')));
app.use(express.static(path.join(__dirname, 'client/build')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Sử dụng router upload ảnh
app.use('/api/images', imageRoutes);
require('./auto-upload');

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
app.use('/api', GiahanGPLXRouter);
app.use('/api', CaplaiGPLXRouter);



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
    res.render('LicenseHolder/ApprovelicenselHoder'); // Render the register page
});

app.get('/renewals',checkAuthentication, (req, res) => {
    res.render('LicenseHolder/LicenseRenewal'); // Render the register page
});
app.get('/renew',checkAuthentication, (req, res) => {
    res.render('LicenseHolder/LicenseRenew'); // Render the register page
});

app.get('/trangchu',checkAuthentication, (req, res) => {
    res.render('Home/index'); // Render the index page
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
