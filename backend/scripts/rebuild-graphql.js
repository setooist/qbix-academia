const fs = require('fs');
const path = require('path');

const pathsToClear = [
    path.join(__dirname, '..', '.cache'),
    path.join(__dirname, '..', '.tmp', 'data.db'),
    path.join(__dirname, '..', 'build'),
    path.join(__dirname, '..', 'dist'),
];

pathsToClear.forEach(dirPath => {
    if (fs.existsSync(dirPath)) {
        fs.rmSync(dirPath, { recursive: true, force: true });
    }
});
