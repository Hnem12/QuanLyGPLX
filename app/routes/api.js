// In your Express router file (e.g., routes/api.js)
const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

router.post("/verify-key", async (req, res) => {
    const { holderId, privateKey } = req.body;
    const keyFilePath = path.join(__dirname, "wallet", `${holderId}.id`);
  
    if (!fs.existsSync(keyFilePath)) {
      return res.status(404).json({ success: false, message: "Không tìm thấy khóa!" });
    }
  
    const storedKey = fs.readFileSync(keyFilePath, "utf8").trim();
    if (storedKey === privateKey.trim()) {
      return res.json({ success: true });
    } else {
      return res.status(401).json({ success: false, message: "Khóa không đúng!" });
    }
  });

module.exports = router;