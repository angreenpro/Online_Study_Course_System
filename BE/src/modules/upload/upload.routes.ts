import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { requireAuth } from '../../middleware/auth.middleware';
import { sendSuccess } from '../../utils/response';
import { createError } from '../../middleware/errorHandler';

const router = express.Router();

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), process.env.UPLOAD_DIR || 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${uuidv4()}${ext}`;
    cb(null, uniqueName);
  },
});

// File filter (optional: restrict to images and videos)
const fileFilter = (req: express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'video/mp4', 'video/webm', 'application/pdf'
  ];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'));
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '52428800', 10), // Default 50MB
  },
  fileFilter,
});

// Upload route
router.post('/', requireAuth, upload.single('file'), (req, res, next) => {
  try {
    if (!req.file) {
      throw createError('No file uploaded', 400);
    }

    // Return the URL to access the file
    // In production, this would be an S3 URL. For local dev, it's a relative path.
    const fileUrl = `/uploads/${req.file.filename}`;

    return sendSuccess(res, { url: fileUrl }, 'File uploaded successfully', 201);
  } catch (error) {
    console.error('Upload error:', error);
    next(createError('Internal server error during upload', 500));
  }
});

export default router;
