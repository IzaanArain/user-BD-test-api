const mongoose=require("mongoose");


const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
    },
    status:{
        type:Boolean,
        default:false
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    userAuth:{
        type:String,
        default:"",
    }

},{
    timestamps:true
});

module.exports=mongoose.model("User",UserSchema);