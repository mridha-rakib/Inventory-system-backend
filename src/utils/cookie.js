import { config } from "../config/app.config.js";

const setAuthCookie = (res, token) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  };

  res.cookie("jwt", token, cookieOptions);
};

const clearAuthCookie = (res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "strict",
  });
};

export { setAuthCookie, clearAuthCookie };
