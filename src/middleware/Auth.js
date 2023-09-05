const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const user_token_auth = async (req, res, next) => {
  //   let tok;
  //   let authorization = req.headers.Authorization || req.headers.authorization;
  //   if (!authorization) {
  //     res.status(400);
  //     throw new Error("Authorization token required");
  //   }
  //   token = authorization.split(" ")[1];

  const token = req.headers["authorization"]?.split(" ")[1];
  // console.log("header: ", token);
  const auth = await User.findOne({ userAuth: token });
  // console.log("userAuth:", auth?.userAuth);
  try {
    if (!token) {
      res.status(400);
      throw new Error("token does not exist,must have a token");
    } else if (auth?.userAuth !== token) {
      res.status(400);
      throw new Error("token does not matched");
    } else if (auth?.isBlocked === true) {
      res.status(400);
      throw new Error(`Dear ${auth?.name} your account is temporaray blocked`);
    }
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
    // console.log("decoded:", decoded._id);
    req.id = decoded._id;
    next();
  } catch (err) {
    console.error("Error", `${err.message}`.red);
    res.send({ Error: err.message });
  }
};

module.exports = user_token_auth;
