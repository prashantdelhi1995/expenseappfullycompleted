const jwt = require("jsonwebtoken");
const SignUp = require("../modal/signup");

const authenticate = async (req, res, next) => {
  try {
    // Extract token from the Authorization header
    const token = req.header('authorization')
    

    if (!token) {
      return res.status(401).json({ success: false, message: 'Authorization token is missing' });
    }

    // Verify the token
    const user = jwt.verify(token, "secretKey");
   
    

    // Find the user by their ID
    const foundUser = await SignUp.findByPk(user.userId);
    

    if (!foundUser) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    // Attach user to the request for further use
    req.user = foundUser;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    console.log("Error:", err);
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

module.exports = authenticate;
