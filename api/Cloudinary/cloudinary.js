import {v2 as cloudinary} from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from "dotenv"
dotenv.config(); // Load environment variables from .env file


// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  });

// Configure Multer storage with Cloudinary
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "secure-uploads", // Specify the folder in Cloudinary
      resource_type: "auto", // Automatically detect file type
      allowed_formats: ["jpg", "png", "jpeg", "gif"], // Optional: restrict file types
    },
  });

// Create the Multer instance
const upload = multer({ storage });

export { cloudinary, upload };