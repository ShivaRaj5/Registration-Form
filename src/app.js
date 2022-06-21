require('dotenv').config()
const express=require('express');
const app=express();
const path=require('path')
const bcrypt=require('bcryptjs');
const port=process.env.PORT || 3000;
const hbs=require('hbs');
const RegisterData=require('../src/models/registers.js')
require('./db/conn.js')
const staticPath=path.join(__dirname,'../public')
app.use(express.static(staticPath))
const templatesPath=path.join(__dirname,'../templates/views');
const partialsPath=path.join(__dirname,'../templates/partials');
// console.log(templatesPath)
hbs.registerPartials(partialsPath) 
app.set('view engine', 'hbs');
app.set('views', templatesPath);
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.get('/',(req,res)=>{
    res.render("index")
})
app.get('/about',(req,res)=>{
    res.render("about")
})
app.get('/services',(req,res)=>{
    res.render("services")
})
app.get('/login',(req,res)=>{
    res.render("login")
})
app.post('/login',async (req,res)=>{
    try{
        const email=req.body.loginemail;
        const pass=req.body.loginpass;
        const readData=await RegisterData.findOne({email:email});
        const matchData=await bcrypt.compare(pass,readData.pass);
        const token= await readData.generateAuthToken();
        if(matchData){
            res.render('index')
        }
        else{
            res.send("Invalid Credentials")
        }
        console.log(readData);
    }catch(err){
        res.send(err)
    }
})
app.get('/register',(req,res)=>{
    res.render("register")
})
app.post('/register',async (req,res)=>{
    try{
        const pass=req.body.pass;
        const cpass=req.body.cpass;
        if(pass===cpass){
            const registerEmployee=new RegisterData({
                fname:req.body.fname,
                lname:req.body.lname,
                email:req.body.email,
                gender:req.body.gender,
                pass:pass,
                cpass:cpass
            })
            const token= await registerEmployee.generateAuthToken();
            const saveData=await registerEmployee.save();
            console.log("Data of app page "+saveData);
            res.render('index');
        }
        else{
            res.send("Passwords do not match")
        }
    }catch(err){
        res.send(err)
        // console.log("app wala "+err);
    }
})
app.listen(port,()=>{
    console.log("Listening to the port "+port);
})