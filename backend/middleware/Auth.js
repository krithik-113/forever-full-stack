const jwt = require("jsonwebtoken");

const AuthUser = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.json({ success: false, message: "Not Authorized Login Again" });
  }
  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!token_decode) {
      return res.json({ success: false,message: "Not Authorized Login Again"});
    }
    req.body.userId = token_decode.id;
    next();
  } catch (error) {
      console.log(error.message)
      res.json({success:false,message:error.message})
  }
};

module.exports = AuthUser;
