const fs = require('fs');

function removePhotoFile(photoPath) {
    fs.unlink(photoPath, (err) => {
      if (err) {
        console.error("Error al eliminar la foto anterior: ", err);
      } else {
        console.log("Foto anterior eliminada con éxito");
      }
    });
  }

module.exports = removePhotoFile;