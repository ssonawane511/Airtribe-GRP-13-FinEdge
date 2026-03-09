import jwt from "jsonwebtoken";
import User from "../../modules/users/users.model.js";
import { UnauthorizedError } from "../errors/errors.js";

const authenticate = async (req, _, next) => {
  const [type, token] = req.headers.authorization?.split(" ") || [];
  if (type !== "Bearer" || !token) {
    throw new UnauthorizedError("Unauthorized");
  }
  const { userId } = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(userId);
  if (!user) {
    throw new UnauthorizedError("Unauthorized");
  }
  req.user = user.toJSON();
  next();
};

export default authenticate;
