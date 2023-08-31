const Users = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  // console.log(process.env.SECRET_TOKEN)
  return jwt.sign({ _id: _id }, process.env.SECRET_TOKEN, { expiresIn: "1d" });
};

//@desc get all user
//@route GET /api/v1/users/
//@access Private
const getAllUsers = async (req, res) => {
  const user = await Users.find({});
  res.status(200).send(user);
};

//@desc get a user
//@route GET /api/v1/users/:id
//@access Private
const getUser = async(req, res) => {
    const {id}=req.params;
    const user = await Users.findById(id)
    res.status(200).send({user})
};

//@desc add a user
//@route POST /api/v1/users/create
//@access Private
const addUser = async (req, res) => {
  const { name, email, password, phone, status, isBlocked } = req.body;
  try {
    if (!name | !email | !password | !phone) {
      res.status(401);
      throw new Error("all fields are mandatory");
    }
    const userExists = await Users.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("user is already registered");
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // console.log("hashed Password:",hashedPassword)

    const user = await Users.create({
      name,
      email,
      password: hashedPassword,
      phone,
      status,
      isBlocked,
    });
    res.status(200).send({ message: "user created successfully", user });
  } catch (err) {
    console.error("Error", `${err.message}`.red);
    res.send({ Error: err.message });
  }
};
//@desc login a user
//@route POST /api/v1/users/login
//@access Private
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email | !password) {
      res.status(401);
      throw new Error("both email and password are mandatory");
    }

    const user=await Users.findOne({email})
    //  console.log(user)
    if(!user){
        res.status(400)
        throw new Error("user not found")
    }

    //compare password with hashed password
    const matchPassword=await bcrypt.compare(password, user.password)
     // console.log("matchPassword",matchPassword);
    if(!matchPassword){
        res.status(400)
        throw Error("Incorrecrt password")
    }
    //create token
    const token = createToken(user._id);
    // console.log("token: ",token)

    //save token by updating userAuth in user 
    const save_token=await Users.findByIdAndUpdate(
        {_id:user?._id?.toString()}, //user._id
        { $set: { userAuth: `${token}` } }, // {...req.body,userAuth:save_token}}
        {new:true},
    )
    console.log(save_token)

    const {userAuth}=save_token;
    if(user){
        res.status(200).send({
            message:"login successful",
            status: 200,
            user
        })
    }else{
        res.send({
            message: "Login failed",
            status: 403,
          });
    }
  } catch (err) {
    console.error("Error", `${err.message}`.red);
    res.send({ Error: err.message });
  }
};
//@desc update a user
//@route PUT /api/v1/users/create
//@access Private
const updateUser = (req, res) => {
  res.status(200).send({ message: "update a user" });
};

//@desc delete a user
//@route DELETE /api/v1/users/delete
//@access Private
const deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await Users.findByIdAndDelete({ id });
  res.status(200).send({ message: `deleted user sucessfully at ID:${id}` });
};

module.exports = {
  getAllUsers,
  getUser,
  addUser,
  loginUser,
  updateUser,
  deleteUser,
};
