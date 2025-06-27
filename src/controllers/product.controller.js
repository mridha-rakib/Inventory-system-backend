import ProductService from "../services/product.service.js";
import CloudinaryService from "../services/cloudinary.service.js";
import { createdResponse, successResponse } from "../utils/response.js";
import logger from "../utils/logger.js";
import fs from "fs/promises";

export class ProductController {
  constructor() {
    this.productService = new ProductService();
    this.cloudinaryService = new CloudinaryService();
  }

  async createProduct(req, res, next) {
    if (!req.file) {
      throw new Error("Product image is required");
    }

    const filePath = req.file.path;
    let uploadResult;

    try {
      await fs.access(req.file.path);

      uploadResult = await this.cloudinaryService.uploadImage(filePath);

      const product = await this.productService.create({
        ...req.body,
        image: uploadResult.url,
      });

      await this.cleanupFile(filePath);
      createdResponse(res, "Product created successfully", product);
    } catch (error) {
      await this.cleanupFile(filePath);

      if (uploadResult?.public_id) {
        await cloudinaryService
          .deleteImage(uploadResult.public_id)
          .catch(console.error);
      }
      logger.error(`Create product controller error: ${error.message}`);
      next(error);
    }
  }

  async getProduct(req, res, next) {
    try {
      const product = await this.productService.findById(req.params.id);
      if (!product) {
        throw new NotFoundError("Product not found");
      }

      successResponse(res, "Product retrieved successfully", product);
    } catch (error) {
      logger.error(`Get product controller error: ${error.message}`);
      next(error);
    }
  }

  async getAllProducts(req, res, next) {
    try {
      const filters = {
        keyword: req.query.keyword || undefined,
      };

      const pagination = {
        pageSize: parseInt(req.query.pageSize) || 10,
        pageNumber: parseInt(req.query.pageNumber) || 1,
      };

      const result = await this.productService.getAllProducts({
        filters,
        pagination,
      });

      successResponse(res, "Products retrieved successfully", result);
    } catch (error) {
      console.error(error);
    }
  }

  async updateProduct(req, res, next) {
    let uploadResult;
    let filePath;
    const existingProduct = await this.productService.findById(req.params.id);
    if (!existingProduct) {
      throw new Error("Product not found");
    }
    if (req.file) {
      filePath = req.file.path;
    }
    try {
      if (req.file && filePath) {
        await fs.access(req.file.path);

        uploadResult = await this.cloudinaryService.uploadImage(filePath);
      }

      const productId = req.params.id;

      const productData = {
        ...req.body,
        ...(uploadResult && { image: uploadResult.url }),
      };

      const product = await this.productService.update({
        id: productId,
        productData,
      });

      if (filePath) {
        await this.cleanupFile(filePath);
      }
      createdResponse(res, "Product updated successfully", product);
    } catch (error) {
      if (filePath) {
        await this.cleanupFile(filePath);
      }
      logger.error(`Update product controller error: ${error.message}`);
      next(error);
    }
  }

  async deleteProduct(req, res, next) {
    const existingProduct = await this.productService.findById(req.params.id);
    if (!existingProduct) {
      throw new NotFoundError("Product not found");
    }
    try {
      const product = await this.productService.delete(req.params.id);

      successResponse(res, "Product deleted successfully", {});
    } catch (error) {
      logger.error(`Delete product controller error: ${error.message}`);
      next(error);
    }
  }

  async cleanupFile(filePath) {
    if (!filePath) return;

    try {
      await fs.unlink(filePath);
    } catch (error) {
      if (error.code !== "ENOENT") {
        console.error("File cleanup error:", error.message);
      }
    }
  }
}
