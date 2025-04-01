export const signup = (req, res) => {
  const { email, fullName, password } = req.body;
  try {
    
   
  } catch (error) {

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
