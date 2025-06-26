import cloudinary from "cloudinary";

const cloudinaryV2 = cloudinary.v2;
const config = () => {
  cloudinaryV2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
};

export { config, cloudinaryV2 as cloudinary };
