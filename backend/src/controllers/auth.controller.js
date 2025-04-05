import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js"
import bcryptjs from "bcryptjs";


export const signup = async (req, res) => {
  const { email, fullName, password } = req.body;
  try {

    if (!email || !fullName || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }
    const user = await User.findOne({ email });
    if (user) {
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

    if (newUser) {
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

export const login = async (req, res) => {
  //get email and password from request body
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //find user by email
    const user = await User.findOne({ email });
    if (!user) {
      //if user not found
      return res.status(400).json({ message: "User not found" });
    }
    //compare password in database that if it is correct or not. thats why we use bcryptjs in user model
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    //if password is not correct
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    //generate token
    generateToken(user._id, res);
    return res.status(200).json({
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      profilePic: user.profilePic
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  //delete cookie
  try {
    res.cookie("jwt", "", {
      maxAge: 0
    });
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    //Validate the presence of a profile picture in the request body.
    const {profilePic} = req.body;
    const userId = req.user._id;
    
    //if no profile picture is provided
    if (!profilePic) {
      return res.status(400).json({ message: "Profile picture is required" });
    }
    //Upload the image to Cloudinary and retrieve its secure URL.
    //Cloudinary is a cloud-based image and video storage service that provides a secure way to store and manage images and videos.
    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    //Update the user's profile with the new profile picture URL.
    const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in updateProfile: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const updatedUser = await User.findById(req.user._id).select("-password");
    res.status(200).json(updatedUser);  // Return full user data
  } catch (error) {
    console.log("Error in checkAuth controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export default {
  signup,
  login,
  logout,
  updateProfile,
  checkAuth
};
