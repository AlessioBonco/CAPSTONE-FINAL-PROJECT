const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('🔗 Cloudinary configurato:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'events', // Nome della cartella su Cloudinary
    allowed_formats: ['jpeg', 'png', 'jpg', 'webp', 'gif'], // Formati consentiti originali
  },
});

module.exports = { cloudinary, storage };


