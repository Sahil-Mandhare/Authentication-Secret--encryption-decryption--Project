//jshint esversion:6
const express=require("express")
const bodyParser=require("body-parser")
const ejs=require("ejs")
const mongoose=require("mongoose")
const encrypt=require("mongoose-encryption");
require('dotenv').config()


const app=express();

mongoose.connect("mongodb://127.0.0.1:27017/userDB", { useNewUrlParser: true });



app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

const userSchema=new mongoose.Schema({
    email:String,
    password:String
});
app.get("/",function(req,res){
    res.render("home");
});


userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});
app.get("/login",function(req,res){
    res.render("login");
})
const User=new mongoose.model("User",userSchema);

app.post("/login", async function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const foundUser = await User.findOne({ email: username });
        if (foundUser && foundUser.password === password) {
            console.log(password);
            res.render("secrets");
        }
    } catch (err) {
        console.log(err);
        // Handle the error here
    }
});

app.get("/register",function(req,res){
    res.render("register");
})

app.post("/register", async function (req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    try {
        await newUser.save();
        res.render("secrets");
    } catch (err) {
        console.log(err);
        // Handle the error here
    }
});

app.listen(3000,function(){
    console.log("Started on port 3000");
})
