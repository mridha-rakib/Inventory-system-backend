import { Router } from "express";

import authRoutes from "./auth.routes.js";
import taskRoutes from "./product.routes.js";

const rootRoutes = Router();

const moduleRoutes = [
  { path: "/auth", route: authRoutes },
  {
    path: "/products",
    route: taskRoutes,
  },
];

moduleRoutes.forEach((route) => {
  rootRoutes.use(route.path, route.route);
});

export default rootRoutes;
