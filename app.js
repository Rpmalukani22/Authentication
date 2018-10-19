var express = require("express");
var mongoose=require("mongoose");
var User=require("./models/users").User;
var passport=require("passport");
var bodyParser=require("body-parser");
var localStrategy=require("passport-local");
var app = express();
var expressSession=require("express-session");

app.set("view engine","ejs");
mongoose.connect("mongodb://localhost/users",{ useNewUrlParser: true });
app.use(passport.initialize());
app.use(passport.session());
app.use(expressSession({
    secret:"Secret text",
    resave:false,
    saveUninitialized:false
}));
app.use(bodyParser.urlencoded({ extended: true }));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/",(req,res)=>{
    res.render("home");
});

app.get("/main",(req,res)=>{
    res.render("main");
});

app.get("/register",(req,res)=>{
   res.render('register') 
});
app.post("/register",(req,res)=>{
//   res.send("Username : "+req.body.username+"<br>Password : "+req.body.password);
/**
 * Storing the password directly in the database is not a good idea so I have used concept of hashing here.
 * -Ruchitesh Malukani.
 **/
 User.register(new User({username:req.body.username}),req.body.password,(err,user)=>{
     if(err){
         console.log(err);
         return res.render('register');
     }
     else{
         passport.authenticate("local")(req,res,()=>{
             res.redirect('main');
         });
     }
 });
 
});
app.listen(process.env.PORT,process.env.IP,()=>{
    console.log("Server started!\nPORT:",process.env.PORT);
});