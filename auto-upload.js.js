const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, 'uploads');

// Function to add and commit new files to Git
function autoUploadImages() {
    exec('git add uploads/*', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error adding files: ${stderr}`);
            return;
        }
        exec('git commit -m "Auto-upload images"', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error committing files: ${stderr}`);
                return;
            }
            exec('git push', (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error pushing files: ${stderr}`);
                } else {
                    console.log('Images uploaded to Git successfully!');
                }
            });
        });
    });
}

// Monitor the uploads directory for new files
fs.watch(uploadsDir, (eventType, filename) => {
    if (eventType === 'rename' && filename) {
        autoUploadImages();
    }
});