import { getEnv } from "../utils/get-env.js";

const appConfig = () => ({
  NODE_ENV: getEnv("NODE_ENV", "development"),
  PORT: getEnv("PORT", "5000"),
  BASE_PATH: getEnv("BASE_PATH", "/api"),
  MONGO_URI: getEnv("MONGO_URI", ""),
  JWT_SECRET: getEnv("JWT_SECRET", "your_jwt_secret"),
  JWT_ISSUER: getEnv("JWT_ISSUER", "your_jwt_issuer"),
  JWT_AUDIENCE: getEnv("JWT_AUDIENCE", "your_jwt_audience"),
  JWT_EXPIRES_IN: getEnv("JWT_EXPIRES_IN", "1h"),
  FRONTEND_ORIGIN: getEnv("FRONTEND_ORIGIN"),
});

export const config = appConfig();
