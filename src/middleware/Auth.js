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
  const auth = await User.findOne({ userAuth: token });

  if (!token) {
    res.status(400).send({
      message: "token does not exist,must have a token",
      status: 400,
    });
  } else if (auth?.user_authentication !== token) {
    return res.send({ message: "token does not matched", status: 400 });
  } else if (auth?.isBlocked === true) {
    return res.send({
      message: `Dear ${auth?.name} your account is temporaray blocked`,
      status: 400,
    });
  }

  try{
    const decoded=jwt.verify(token,process.env.SECRET_TOKEN);
    req.id=decoded.id
    next()
  }catch(err){
    res.status(400).send("Invalid token.");
  }
  return next;
};

module.exports=user_token_auth;
