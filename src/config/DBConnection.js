const mongoose=require("mongoose");


const connect=async()=>{
    try{
        const conn=await mongoose.connect(process.env.CONNECTION_STRING);
        console.log(`database connected at : ${conn.connection.host} ${conn.connection.name}`.cyan);
    }catch(err){
        console.error("Error".red,`${err.message}`.red);
        process.exit(1)
    }
}

module.exports=connect