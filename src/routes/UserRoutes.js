const express=require("express");
const { getUser, updateUser, deleteUser, getAllUsers, addUser, loginUser } = require("../controller/UserController");

const router=express.Router();

router.get('/',getAllUsers);
router.post("/create",addUser);
router.post("/login",loginUser);
router.get('/:id',getUser);
router.put("/update/:id",updateUser);
router.delete("/delete/:id",deleteUser);


module.exports=router;