import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = (req, res, next) => {
    try {
        //Retrieve JWT token from cookies.
        const token = req.cookies.jwt;

        //if no token then return 401
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No token provided" });
        }

        //Verify token using JWT_SECRET.
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized - Invalid token" });
        }

        //Find user by id and exclude password.
        const user = User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({ message: "Unauthorized - User not found" });
        }

        //Add user to request object.
        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
};


