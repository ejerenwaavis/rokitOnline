const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const isVideo = (mimetype) => mimetype.startsWith('video/');

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'rokit-media',
    resource_type: isVideo(file.mimetype) ? 'video' : 'image',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'svg', 'mp4', 'mov', 'webm', 'avi'],
    ...(isVideo(file.mimetype)
      ? {}
      : { transformation: [{ quality: 'auto', fetch_format: 'auto' }] }),
  }),
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB (videos need more headroom)
  fileFilter: (req, file, cb) => {
    const allowed = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'image/svg+xml',
      'video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo',
    ];
    if (allowed.includes(file.mimetype)) return cb(null, true);
    cb(new Error('File type not allowed'));
  },
});

module.exports = upload;
