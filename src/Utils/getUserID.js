import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./Constants";

const getUserID = (request, requireAuth = true) => {
  const header = request.request
    ? request.request.headers.authorization
    : request.connection.context.Authorization;

  //console.log(request.request);

  if (header) {
    const token = header.replace("Bearer ", "");

    const decoded = jwt.verify(token, JWT_SECRET);

    return decoded.userId;
  }

  if (requireAuth) {
    throw new Error("Authentication required");
  }
  return null;
};

export { getUserID as default };
