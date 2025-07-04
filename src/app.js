import express from "express";
import "dotenv/config";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import { errorMiddleware, notFound } from "./middlewares/error.middleware.js";
import { config } from "./config/app.config.js";
import logger from "./utils/logger.js";
import rootRoutes from "./routes/index.routes.js";

const app = express();

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(cookieParser());
app.use(morgan("combined", { stream: logger.morganStream }));

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://inventory-ms-frontend-5.onrender.com",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));

app.get("/.well-known/appspecific/com.chrome.devtools.json", (req, res) => {
  return res.status(204).send();
});
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

app.use(config.BASE_PATH, rootRoutes);

app.get("api/v1/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: {
      code: 404,
      message: "Not Found",
    },
  });
});

app.use(errorMiddleware);
app.use(notFound);

export default app;
