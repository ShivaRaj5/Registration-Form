const mongoose=require('mongoose')
const bcrypt=require('bcryptjs');
const jwt = require('jsonwebtoken');
//creating the schema
const employeeSchema=new mongoose.Schema({
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    gender:{
        type:String,
        required:true
    },
    pass:{
        type:String,
        required:true
    },
    cpass:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})
//password hash
employeeSchema.pre("save",async function(next){
    if(this.isModified("pass")){
        this.pass=await bcrypt.hash(this.pass,10);
        this.cpass=await bcrypt.hash(this.cpass,10);
    }
    next();
})
//generating tokens
employeeSchema.methods.generateAuthToken=async function(){
    try{
        const token=jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY)
        this.tokens=this.tokens.concat({token:token})
        await this.save();
        return token;
    }catch(err){
        res.send(err);
        console.log("register wala "+err);
    }
}
//creating the models
const RegisterData=new mongoose.model("RegisterData",employeeSchema);
module.exports=RegisterData;