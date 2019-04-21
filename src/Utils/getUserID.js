import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./Constants";

const getUserID = request => {
  const header = request.request.headers.authorization;
  console.log(request.request);

  if (!header) {
    throw new Error("Authentication required");
  }

  const token = header.replace("Bearer ", "");

  const decoded = jwt.verify(token, JWT_SECRET);

  return decoded.userId;
};

export { getUserID as default };
