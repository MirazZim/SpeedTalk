import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js"
import bcryptjs from "bcryptjs";


export const signup = async (req, res) => {
  const { email, fullName, password } = req.body;
  try {
    
    if(!email || !fullName || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if(password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }
    const user = await User.findOne({ email });
    if(user) {
      return res.status(400).json({ message: "Email/User already exists" });
    }
    //hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      email,
      fullName,
      password: hashedPassword
    });

    if(newUser){
      //generate jwt
      generateToken(newUser._id, res)
      await newUser.save();
      return res.status(201).json({ 
        _id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName,
        profilePic: newUser.profilePic
       });
    } else {
      return res.status(500).json({ message: "Invalid user data" });
    }
    
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = (req, res) => {
  res.send("Login route");
};

export const logout = (req, res) => {
  res.send("Logout route");
};

export default {
  signup,
  login,
  logout,
};
