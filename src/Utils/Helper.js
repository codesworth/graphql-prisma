import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./Constants";
import {} from "bcryptjs";

export const createAuthTokenFor = userId => {
  return jwt.sign({ userId: userId }, JWT_SECRET, { expiresIn: "7 days" });
};

export const hashPassword = password => {
  if (password.trim().length < 6) {
    throw new Error("Passowrd is not strong enough");
  }

  return bcrypt.hash(password, 10);
};
