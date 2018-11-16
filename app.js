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

app.use(expressSession({
    secret:"Secret text",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    if(req.user)
    res.locals.currentUser=req.user.username;
    else
    res.locals.currentUser=undefined;
    next();
});
app.get("/",(req,res)=>{
    res.render("home");
});

app.get("/main",isLoggedIn,(req,res)=>{
    res.render("main",{username:req.query.username});
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
         return res.send("<h1>"+err.message+"</h1> <a href='login'> login here</a>");
     }
     else{
         passport.authenticate("local")(req,res,()=>{
             res.redirect('/main');
         });
     }
 });
 
});
app.get("/login",(req,res)=>{
    res.render('login');
});

app.post('/login',(req, res, next) =>{
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (! user) {
      return res.send('<h1>authentication failed.</h1> <a href="login">Try again</a><br><a href="register">Register Now!</a>');
    }
    req.login(user, loginErr => {
      if (loginErr) {
        return next(loginErr);
      }
      return res.redirect('/main');
    });      
  })(req, res, next);
});

app.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/');
});

function isLoggedIn(req,res,next){
    console.log(req.isAuthenticated());
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}
app.listen(3000||process.env.PORT,process.env.IP,()=>{
    console.log("Server started!");
});
