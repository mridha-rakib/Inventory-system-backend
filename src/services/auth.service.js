import { BadRequestError, UnauthorizedError } from "../utils/errors/index.js";
import logger from "../utils/logger.js";
import User from "../models/user.model.js";

class AuthService {
  async register({ name, email, password }) {
    try {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        throw new Error("User already exist");
      }

      const user = await User.create({
        name,
        email,
        password,
      });

      return user;
    } catch (error) {
      logger.error(`Registration error: ${error.message}`);
      throw error;
    }
  }

  async login({ res, email, password }) {
    try {
      const user = await User.findOne({ email });

      if (user && (await user.matchPassword(password))) {
        return user;
      } else {
        throw new Error("Invalid credential!");
      }
    } catch (error) {
      logger.error(`Login error: ${error.message}`);
      throw error;
    }
  }
}

export default AuthService;
