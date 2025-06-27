import logger from "../utils/logger.js";
import User from "../models/user.model.js";

class AuthService {
  async register({ name, email, password, image }) {
    try {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        const error = new Error("User already exists");
        error.statusCode = 409;
        throw error;
      }

      const user = await User.create({
        name,
        email,
        password,
        image,
      });

      return user;
    } catch (error) {
      logger.error(`Registration error: ${error.message}`);
      if (!error.statusCode) {
        error.statusCode = 400;
      }
      throw error;
    }
  }

  async login({ email, password }) {
    try {
      const user = await User.findOne({ email });

      if (user && (await user.matchPassword(password))) {
        return user;
      } else {
        const error = new Error("Invalid credentials!");
        error.statusCode = 401;
        throw error;
      }
    } catch (error) {
      logger.error(`Login error : ${error.message}`);
      if (error.statusCode) {
        throw error;
      }
      const dbError = new Error("Database error occurred");
      dbError.statusCode = 500;
      throw dbError;
    }
  }
}

export default AuthService;
