import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { initializeCloudinary } from '../config/cloudinary.js';

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10),
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'application/pdf',
      'video/mp4',
      'video/webm',
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
      return;
    }

    cb(new Error('Invalid file type. Allowed: images, PDF, MP4, WEBM.'));
  },
});

const uploadBufferToCloudinary = (fileBuffer: Buffer, folder: string, resourceType: 'image' | 'video' | 'raw'): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error || !result?.secure_url) {
          reject(error || new Error('Cloudinary upload failed'));
          return;
        }

        resolve(result.secure_url);
      }
    );

    stream.end(fileBuffer);
  });
};

const getResourceType = (mimeType: string): 'image' | 'video' | 'raw' => {
  if (mimeType.startsWith('image/')) {
    return 'image';
  }

  if (mimeType.startsWith('video/')) {
    return 'video';
  }

  return 'raw';
};

export const uploadToCloudinary = (folder: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      initializeCloudinary();

      if (req.file) {
        const resourceType = getResourceType(req.file.mimetype);
        const fileUrl = await uploadBufferToCloudinary(req.file.buffer, folder, resourceType);
        (req as any).fileUrl = fileUrl;
        next();
        return;
      }

      if (Array.isArray(req.files) && req.files.length > 0) {
        const uploadedUrls = await Promise.all(
          req.files.map((file) => {
            const resourceType = getResourceType(file.mimetype);
            return uploadBufferToCloudinary(file.buffer, folder, resourceType);
          })
        );

        (req as any).fileUrls = uploadedUrls;
      }

      next();
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      res.status(500).json({
        success: false,
        message: 'File upload failed',
      });
    }
  };
};
