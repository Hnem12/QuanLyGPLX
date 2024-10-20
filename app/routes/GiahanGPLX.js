const express = require('express');
const router = express.Router();
const LicenseController = require('../controllers/GiahanGPLXController');

// Route to add a new license
router.post('/renewals', LicenseController.addLicense);

// Route to update an existing license by ID
router.put('/renewals/:id', LicenseController.updateLicense);

// Route to delete a license by ID
router.delete('/licenses/:id', LicenseController.deleteLicense);

// Route to renew a license by adding a new renewal entry
router.post('/licenses/:id/renew', LicenseController.renewLicense);

router.get('/renewals/getall', LicenseController.getAllLicenseRenewals);

router.get('/renewals/:gplxCode/:issuingPlace', LicenseController.getLicenseRenewalByIdentifier);

module.exports = router;