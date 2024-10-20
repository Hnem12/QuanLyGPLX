const LicenseRenewal = require('../models/GiahanGPLX');  // Import the LicenseRenewal model

// Controller for managing GPLX (driver's license)
const LicenseController = {

    // Add a new license
    addLicense: async (req, res) => {
        try {
            const newLicense = new LicenseRenewal(req.body);
            const savedLicense = await newLicense.save();
            return res.status(201).json({
                message: 'License added successfully!',
                data: savedLicense
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Error adding license',
                error: error.message
            });
        }
    },
    
    getLicenseRenewalByIdentifier: async (req, res) => {
        try {
            const { gplxCode, issuingPlace } = req.params; // Extract all parameters
        
            // Normalize parameters
            const normalizedGplxCode = gplxCode.trim();
            const normalizedIssuingPlace = issuingPlace.trim();
        
            // Find by LicenseNumber, IssuingCountry, and IssuingPlace (case insensitive)
            const licenseRenewal = await LicenseRenewal.findOne({
                LicenseNumber: normalizedGplxCode,
                IssuingPlace: { $regex: new RegExp(`^${normalizedIssuingPlace}$`, 'i') } // Case insensitive
            });
    
            if (!licenseRenewal) {
                return res.status(404).json({ message: 'License renewal not found' });
            }
    
            return res.status(200).json({
                message: 'License renewal found',
                data: licenseRenewal,
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Error fetching license renewal',
                error: error.message,
            });
        }
    },      
    
    getAllLicenseRenewals: async (req, res) => {
        try {
            // Fetch all license renewals
            const licenseRenewals = await LicenseRenewal.find(); // This retrieves all records
            
            if (!licenseRenewals || licenseRenewals.length === 0) {
                return res.status(404).json({ message: 'No license renewals found' });
            }
    
            // Send the response with the data
            return res.status(200).json({
                message: 'All license renewals retrieved successfully',
                data: licenseRenewals
            });
        } catch (error) {
            // Log the error and return a 500 status
            console.log(error.message);  // Log error for debugging
            return res.status(500).json({
                message: 'Error fetching license renewals',
                error: error.message
            });
        }
    },
    
    // Update a license by ID
    updateLicense: async (req, res) => {
        try {
            const { id } = req.params; // ID từ URL
            const { LicenseNumber, gender, nationality } = req.body; // Mã GPLX, giới tính và quốc tịch từ body nếu cần

            // Tìm giấy phép theo ID hoặc mã GPLX
            const updatedLicense = await LicenseRenewal.findOneAndUpdate(
                { 
                    $or: [
                        { _id: id }, // Tìm theo ObjectId
                        { LicenseNumber: LicenseNumber } // Tìm theo mã GPLX
                    ] 
                },
                { gender, nationality, ...req.body }, // Cập nhật các trường mới
                { new: true } // Trả về tài liệu đã cập nhật
            );
    
            if (!updatedLicense) {
                return res.status(404).json({
                    message: 'License not found'
                });
            }
    
            return res.status(200).json({
                message: 'License updated successfully!',
                data: updatedLicense
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Error updating license',
                error: error.message
            });
        }
    },
    
    // Delete a license by ID
    deleteLicense: async (req, res) => {
        try {
            const licenseId = req.params.id;
            const deletedLicense = await LicenseRenewal.findByIdAndDelete(licenseId);
            if (!deletedLicense) {
                return res.status(404).json({
                    message: 'License not found'
                });
            }
            return res.status(200).json({
                message: 'License deleted successfully!',
                data: deletedLicense
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Error deleting license',
                error: error.message
            });
        }
    },

    // Renew a license by adding a new renewal entry
    renewLicense: async (req, res) => {
        try {
            const licenseId = req.params.id;
            const renewalData = req.body;

            // Find the license and add a renewal entry
            const license = await LicenseRenewal.findById(licenseId);
            if (!license) {
                return res.status(404).json({
                    message: 'License not found'
                });
            }

            await license.addRenewal(renewalData);  // Add renewal data using the model's method

            return res.status(200).json({
                message: 'License renewed successfully!',
                data: license
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Error renewing license',
                error: error.message
            });
        }
    }
};

module.exports = LicenseController;
