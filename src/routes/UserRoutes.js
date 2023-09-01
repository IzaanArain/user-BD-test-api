const express=require("express");
const { getUser, updateUser, deleteUser, getAllUsers, addUser, loginUser } = require("../controller/UserController");
const user_token_auth = require("../middleware/Auth");

const router=express.Router();

router.get('/',user_token_auth,getAllUsers);
router.post("/create",addUser);
router.post("/login",loginUser);
router.get('/:id',user_token_auth,getUser);
router.put("/update",user_token_auth,updateUser);
router.delete("/delete",user_token_auth,deleteUser);


module.exports=router;