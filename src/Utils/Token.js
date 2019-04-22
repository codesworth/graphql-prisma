import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./Constants";

export const createAuthTokenFor = userId => {
  return jwt.sign({ userId: userId }, JWT_SECRET, { expiresIn: "7 days" });
};
