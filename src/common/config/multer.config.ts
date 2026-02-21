import { existsSync, mkdirSync } from "fs";
import { diskStorage, memoryStorage } from "multer";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { BadRequestException } from "@nestjs/common";

export enum StorageType {
    LOCAL = 'LOCAL',
    CLOUD = 'CLOUD',
}

export const ACTIVE_STORAGE_TYPE = StorageType.LOCAL;

// Helper for local disk configuration
const diskStorageConfig = diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = './public/uploads';
        if (!existsSync(uploadDir)) {
            mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const originalName = file.originalname.replace(/\s+/g, '_');
        cb(null, `${uniqueSuffix}-${originalName}`);
    },
});

export const multerOptions: MulterOptions = {
    // Toggle storage engine based on your Enum
    storage: ACTIVE_STORAGE_TYPE === StorageType.LOCAL
        ? diskStorageConfig
        : memoryStorage(),

    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new BadRequestException('Only JPEG, PNG, and GIF files are allowed'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
    },
};