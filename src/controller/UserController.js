const Users = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
//Create Token function
const createToken = (_id) => {
  return jwt.sign({ _id: _id }, process.env.SECRET_TOKEN, { expiresIn: "1d" });
};

//@desc get all user
//@route GET /api/v1/users/
//@access Private
const getAllUsers = async (req, res) => {
  try {
    const user = await Users.find({}).sort({ createdAt: -1 });
    res.status(200).send(user);
  } catch (err) {
    console.error("Error", `${err.message}`.red);
    res.send({ Error: err.message });
  }
};

//@desc get a user
//@route GET /api/v1/users/:id
//@access Private
const getUser = async (req, res) => {
  const { id } = req.params;
  // const {id}=req;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404);
      throw new Error("invalid user id");
    }
    const user = await Users.findById(id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    if (user._id.toString() !== id.toString()) {
      res.status(403);
      throw new Error("you is not authorized view this user");
    }

    return res.status(200).send({
      status: 1,
      message: "user created successfully",
      user,
    });
  } catch (err) {
    console.error("Error", `${err.message}`.red);
    res.send({ Error: err.message });
  }
};

//@desc add a user
//@route POST /api/v1/users/create
//@access public
const addUser = async (req, res) => {
  const { name, email, password, phone, status, isBlocked } = req.body;
  try {
    if(!password){
      res.status(401);
      throw new Error("please enter your name");
    }
    if(!email){
      res.status(401);
      throw new Error("please enter your email");
    }
    if(!password){
      res.status(401);
      throw new Error("please enter your pasword");
    }
    if(!phone){
      res.status(401);
      throw new Error("please enter your phone number");
    }
    if (!name | !email | !password | !phone) {
      res.status(401);
      throw new Error("all fields are mandatory");
    }
    const userExists = await Users.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("user is already registered");
    }
    // let test=password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/)
    // console.log("test: ",test);// this returns null if it does not match

    if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      res.status(400);
      throw new Error("Please enter a valid email");
    }
    if (
      !password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
      res.status(400);
      throw new Error("Password should include at least 8 characters, one uppercase letter, one lowercase letter, one digit, and one special character.");
    }
    if (!phone.match(/^[0-9]{11}$/)) {
      res.status(400);
      throw new Error("Phone number must have 11 digits");
    }
    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await Users.create({
      name,
      email,
      password: hashedPassword,
      phone,
      status,
      isBlocked,
    });

    return res.status(200).send({
      status: 1,
      message: "user created successfully",
      user,
    });
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
    if(!email){
      res.status(401);
      throw new Error("please enter email");
    }
    if(!password){
      res.status(401);
      throw new Error("please enter password");
    }
    if (!email | !password) {
      res.status(401);
      throw new Error("both email and password are mandatory");
    }
    if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      res.status(400);
      throw new Error("not a valid Email");
    }
    // if (
    //   !password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
    //   res.status(400);
    //   throw new Error("not a valid password");
    // }
    const user = await Users.findOne({ email });

    if (!user) {
      res.status(400);
      throw new Error("user does not exist");
    }

    //compare password with hashed password
    const matchPassword = await bcrypt.compare(password, user.password);
    // console.log("matchPassword",matchPassword);
    if (!matchPassword) {
      res.status(400);
      throw Error("Incorrecrt password");
    }
    //create token
    const token = createToken(user?._id);
    // console.log("token: ",token)

    //save token by updating userAuth in user
    const save_token = await Users.findByIdAndUpdate(
      { _id: user?._id?.toString() },
      { userAuth: token },
      { new: true }
    );
    // console.log(save_token);

    if (user) {
      res.status(200).send({
        message: "login successful",
        status: 200,
        user: save_token,
      });
    } else {
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
const updateUser = async (req, res) => {
  // const {id}=req.params;
  const { id } = req;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404);
      throw new Error("invalid user id, no such user exists");
    }

    const user = await Users.findById(id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
      // return res.status(401).send({
      //   status:1,
      //   message:'user not authorized',
      // })
    }
    if (user._id.toString() !== id.toString()) {
      res.status(403);
      throw new Error("user is not update this user");
    }
    if(!password){
      res.status(401);
      throw new Error("please enter your name");
    }
    if(!email){
      res.status(401);
      throw new Error("please enter your email");
    }
    if(!password){
      res.status(401);
      throw new Error("please enter your pasword");
    }
    if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      res.status(400);
      throw new Error("not a valid Email");
    }
    if (
      !password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
      res.status(400);
      throw new Error("not a valid password");
    }
    if (!phone.match(/^[0-9]{11}$/)) {
      res.status(400);
      throw new Error("Phone number must have 11 digits");
    }

    const updateUser = await Users.findByIdAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true }
    );

    return res.status(200).send({
      status: 1,
      message: "user has been updated",
      data: updateUser,
    });
  } catch (err) {
    console.error("Error", `${err.message}`.red);
    res.send({ Error: err.message });
  }
};

//@desc delete a user
//@route DELETE /api/v1/users/delete
//@access Private
const deleteUser = async (req, res) => {
  // const { id } = req.params;
  const { id } = req;
  console.log("delete id:", id);
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404);
      throw new Error("invalid user id, no such user exists");
    }

    const user = await Users.findById(id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    if (user._id.toString() !== id.toString()) {
      res.status(403);
      throw new Error("user is not authorized to delete this event");
    }

    const deleteUser = await Users.findByIdAndDelete({ _id: id });
    // res.status(200).send({ message: `deleted user sucessfully at ID:${id}`,user:deleteUser });
    return res.status(401).send({
      status: 1,
      message: `deleted user sucessfully at ID:${id}`,
      user: deleteUser,
    });
  } catch (err) {
    console.error("Error", `${err}`.red);
    res.send({ Error: err.message });
  }
};

module.exports = {
  getAllUsers,
  getUser,
  addUser,
  loginUser,
  updateUser,
  deleteUser,
};
