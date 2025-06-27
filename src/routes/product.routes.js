import { Router } from "express";
import { ProductController } from "../controllers/product.controller.js";
import upload from "../utils/upload.js";
import { protect, admin } from "../middlewares/auth.middleware.js";

const productRoutes = Router();
const productController = new ProductController();

productRoutes
  .route("/")
  .post(protect, upload.single("image"), (req, res, next) =>
    productController.createProduct(req, res, next)
  )
  .get(protect, (req, res, next) =>
    productController.getAllProducts(req, res, next)
  );

productRoutes
  .route("/:id")
  .get(protect, (req, res, next) =>
    productController.getProduct(req, res, next)
  )
  .put(protect, upload.single("image"), (req, res, next) =>
    productController.updateProduct(req, res, next)
  )
  .delete(protect, admin, (req, res, next) =>
    productController.deleteProduct(req, res, next)
  );

export default productRoutes;
