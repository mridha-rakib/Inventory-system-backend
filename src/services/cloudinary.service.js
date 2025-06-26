import { cloudinary } from "../config/cloudinary.config.js";
import fs, { unlink } from "fs/promises";
import util, { promisify } from "util";

const unlinkFile = promisify(unlink);

class CloudinaryService {
  async uploadImage(filePath) {
    try {
      await fs.access(filePath);

      const result = await cloudinary.uploader.upload(filePath, {
        folder: "products",
        use_filename: true,
        unique_filename: false,
        resource_type: "auto",
      });

      await fs.unlink(filePath);

      return {
        url: result.secure_url,
        public_id: result.public_id,
      };
    } catch (error) {
      throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
  }

  async deleteImage(publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error("Cloudinary delete error:", error.message);
      throw new Error(`Cloudinary delete failed: ${error.message}`);
    }
  }
}

export default CloudinaryService;
