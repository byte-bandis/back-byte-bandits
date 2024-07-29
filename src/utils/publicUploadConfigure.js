const multer = require('multer');
const path = require('node:path');

// Configuración de almacenamiento para multer
const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    const ruta = path.join(__dirname, '..', 'public', 'images');
    callback(null, ruta);
  },
  filename: function(req, file, callback) {
    try {
      const filename = `${file.fieldname}-${Date.now()}-${file.originalname}`;
      callback(null, filename);
    } catch (error) {
      callback(error);
    }
  }
});

// Configuración del middleware de upload
const upload = multer({ storage: storage });

module.exports = upload;
