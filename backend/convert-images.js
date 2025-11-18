const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const uploadsDir = './uploads';

async function convertImagesToBaseline() {
  const files = fs.readdirSync(uploadsDir);

  for (const file of files) {
    if (file.match(/.(jpg|jpeg)$/i)) {
      const filePath = path.join(uploadsDir, file);
      
      try {
        console.log(`Convertiendo: ${file}`);
        
        await sharp(filePath)
          .jpeg({
            progressive: false,  // ✅ Convierte a Baseline
            quality: 85,
            mozjpeg: true,
          })
          .toFile(filePath + '.tmp');

        fs.unlinkSync(filePath);
        fs.renameSync(filePath + '.tmp', filePath);
        
        console.log(`✅ ${file} convertido`);
      } catch (err) {
        console.error(`❌ Error con ${file}:`, err.message);
      }
    }
  }

  console.log('✅ Conversión completada');
}

convertImagesToBaseline();