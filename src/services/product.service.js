import mongoose from "mongoose";
import Product from "../models/product.model.js";
import logger from "../utils/logger.js";


class ProductService {
  async create(productData) {
    try {
      const existingProduct = await Product.findOne({ name: productData.name });
      if (existingProduct) {
        const error = new Error("Product already exists");
        error.statusCode = 409;
        throw error;
      }

      const product = new Product(productData);
      return await product.save();
    } catch (error) {
      logger.error(`Create product service error: ${error.message}`);
      if (!error.statusCode) {
        error.statusCode = 400;
      }
      throw error;
    }
  }

  async findById(id) {
    try {
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error("Invalid product ID");
        error.statusCode = 400;
        throw error;
      }
      return await Product.findById(id);
    } catch (error) {
      logger.error(`Find product by ID service error: ${error.message}`);
      if (!error.statusCode) {
        error.statusCode = 400;
      }
      throw error;
    }
  }

  async getAllProducts({ filters, pagination }) {
    try {
      const query = {};

      if (filters.keyword && filters.keyword.trim() !== "") {
        query.$or = [
          { name: { $regex: filters.keyword, $options: "i" } },
          { Category: { $regex: filters.keyword, $options: "i" } },
        ];
      }

      const { pageSize, pageNumber } = pagination;

      if (pageSize <= 0 || pageNumber <= 0) {
        const error = new Error("Invalid pagination parameters");
        error.statusCode = 400;
        throw error;
      }

      const skip = (pageNumber - 1) * pageSize;

      const [products, totalCount] = await Promise.all([
        Product.find(query).skip(skip).limit(pageSize).sort({ createdAt: -1 }),
        Product.countDocuments(query),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);

      return {
        products,
        pagination: {
          pageSize,
          pageNumber,
          totalCount,
          totalPages,
          skip,
        },
      };
    } catch (error) {
      logger.error(`Get all products service error: ${error.message}`);
      if (!error.statusCode) {
        error.statusCode = 400;
      }
      throw error;
    }
  }

  async update({ id, productData }) {
    try {
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error("Invalid product ID");
        error.statusCode = 400;
        throw error;
      }

      const updatedProduct = await Product.findByIdAndUpdate(id, productData, {
        new: true,
        runValidators: true,
      });

      if (!updatedProduct) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        throw error;
      }

      return updatedProduct;
    } catch (error) {
      logger.error(`Update product service error: ${error.message}`);
      if (!error.statusCode) {
        error.statusCode = 400;
      }
      throw error;
    }
  }

  async delete(id) {
    try {
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error("Invalid product ID");
        error.statusCode = 400;
        throw error;
      }

      const deletedProduct = await Product.findByIdAndDelete(id);
      if (!deletedProduct) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        throw error;
      }

      return deletedProduct;
    } catch (error) {
      logger.error(`Delete product service error: ${error.message}`);
      if (!error.statusCode) {
        error.statusCode = 400;
      }
      throw error;
    }
  }

  async count() {
    return await Product.countDocuments();
  }
}

export default ProductService;
