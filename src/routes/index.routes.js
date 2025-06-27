import { Router } from "express";

import authRoutes from "./auth.routes.js";
import productRoutes from "./product.routes.js";

const rootRoutes = Router();

const moduleRoutes = [
  { path: "/auth", route: authRoutes },
  {
    path: "/products",
    route: productRoutes,
  },
];

moduleRoutes.forEach((route) => {
  rootRoutes.use(route.path, route.route);
});

export default rootRoutes;
