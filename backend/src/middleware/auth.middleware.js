import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    // Get the token from the cookies
    const token = req.cookies.jwt;

    // If no token is provided, return an unauthorized response
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // If the token is invalid, return an unauthorized response
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    // Find the user with the ID from the decoded token
    const user = await User.findById(decoded.userId).select('email fullName profilePic');

    // If the user is not found, return an unauthorized response
    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    // Set the user on the request object
    req.user = user;

    // Call the next middleware
    next();
  } catch (error) {
    console.error("Error in protectRoute:", error.message);
    // If any error occurs, return an unauthorized response
    return res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
};
