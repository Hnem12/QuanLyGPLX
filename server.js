const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); // Import cookie-parser
const { dbconnect } = require('./app/configs/dbConfig');
const ejs = require('ejs');
const checkAuthentication = require('./app/middleware/checkAuthentication');
const accountRouter = require('./app/routes/accountRoute');
const licenseHolderRoutes = require('./app/routes/ChusohuuGPLXRoute');
const LicenseHolderModels = require('./app/models/ChusohuuGPLXModel');
const CaplaiGPLXModel = require('./app/models/CaplaiGPLXModels');
// const AccountManagement = require('./license-management/src/components/AccountManagement');
const React = require('react');
const mongoose = require('mongoose');
const ReactDOMServer = require('react-dom/server');
const app = express();
dbconnect();
module.exports = { dbconnect };

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app/views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser()); // Use cookie-parser middleware here

app.use(express.static(path.join(__dirname, 'app/public')));
app.use(express.static(path.join(__dirname, 'app/public/js')));
app.use(express.static(path.join(__dirname, 'app/public/css')));

// Use routes
app.use('/api/account/', accountRouter);
app.use('/api/licenseHolder/', licenseHolderRoutes);
app.use('/api/register/', accountRouter);
app.use('/addlicenseHolder/', licenseHolderRoutes);

app.use(express.static(path.join(__dirname, 'client/build')));


app.get('/login', (req, res) => {
    res.render('login'); // Render the login page
});

app.get('/register', (req, res) => {
    res.render('register'); // Render the register page
});
app.get('/account', (req, res) => {
    res.render('Account'); // Render the register page
});
app.get('/licenseHolder', (req, res) => {
    res.render('licenseHolder'); // Render the register page
});

app.get('/truyxuatbanglaixeoto', (req, res) => {
    res.render('truyxuatbanglaixeoto'); // Render the license retrieval page
});

app.get('/', (req, res) => {
    res.render('login'); // Render the login page
});
app.use(checkAuthentication); 
app.get('/trangchu',checkAuthentication, (req, res) => {
    res.render('index'); // Render the index page
});
app.get('/api/account/', async (req, res) => {
    try {
      const accounts = await AccountModel.find(); // Lấy tất cả dữ liệu từ collection 'account'
      res.json(accounts); // Trả về dữ liệu dưới dạng JSON
     
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch accounts' });
    }
  });
  
app.listen(3000, () => {
    console.log(`Server started on port 3000`);
});
