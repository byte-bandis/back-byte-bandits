const multer = require("multer");
const path = require("node:path");

// Configuración de almacenamiento para multer
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    const baseRoute = path.join(__dirname, "..", "public", "images");

    const route =
      file.fieldname === "userPhoto" || file.fieldname === "headerPhoto"
        ? path.join(baseRoute, "profiles")
        : baseRoute;
    callback(null, route);
  },
  filename: function (req, file, callback) {
    try {
      const filename = `${file.fieldname}-${Date.now()}-${file.originalname}`;
      callback(null, filename);
    } catch (error) {
      callback(error);
    }
  },
});

// Configuración del middleware de upload
const upload = multer({ storage: storage });

module.exports = upload;
