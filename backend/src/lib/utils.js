import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  //generate token function
  const token = jwt.sign({ userId }, process.env.JWT_SECRET,{
    expiresIn: "7d",
  });
  //set cookie
  res.cookie("jwt", token, {
    httpOnly: true, //prevents XSS attacks
    secure: process.env.NODE_ENV !== "development", //prevents CSRF attacks
    sameSite: "strict", //prevents CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  
  return token;
}
