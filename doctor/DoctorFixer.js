const fs = require('fs');
const path = require('path');

class DoctorFixer {
  static ensureDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      return true;
    }
    return false;
  }

  static ensureFileFromTemplate(targetPath, defaultContent = '') {
    if (!fs.existsSync(targetPath)) {
      const dir = path.dirname(targetPath);
      this.ensureDirectory(dir);
      fs.writeFileSync(targetPath, defaultContent, 'utf8');
      return true;
    }
    return false;
  }
}

module.exports = DoctorFixer;
