// const router = require('express').Router();
// const User = require('../models/user');
// const bcrypt = require("bcrypt");

// // Render sign-up page
// router.get("/sign-up", (req, res) => {
//   res.render("auth/sign-up.ejs");
// })

// // Handle sign-up logic
// router.post("/sign-up", async (req, res) => {
//   try {
//     const { username, password, confirmPassword } = req.body;

//     // Check if username exists
//     const userInDatabase = await User.findOne({ username });
//     if (userInDatabase) {
//       return res.send("Username already taken");
//     }

//     // Check password match
//     if (password !== confirmPassword) {
//       return res.send("Password and confirm password must match");
//     }

//     // Hash password
//     const hashedPassword = bcrypt.hash(password, 10);
//     req.body.password = hashedPassword;
//     // Create user WITHOUT confirmPassword
//     const user = await User.create({
//       username,
//       password: hashedPassword
//     });

//     res.send(`Thanks for signing up ${user.username}`);
//   } catch (error) {
//     console.error("Error during sign-up:", error);
//     res.status(500).send("Internal server error");
//   }
// });

// // Render sign-in page
// // router.get("/sign-in", (req, res) => {
// //   res.render("auth/sign-in.ejs");
// // });

// // Handle sign-in logic
// router.get("/sign-in", (req,res)=>{
//     res.render("auth/sign-in.ejs");
// })
// router.post("/sign-in", async (req, res) => {
//   const userInDatabase = await User.findOne({ username: req.body.username});
//   if(!userInDatabase){
//     return res.send("Login Failed. Please try again later");
//   }
//   const validPassword = bcrypt.compareSync(req.body.password, userInDatabase.password);
//   if(!validPassword){
//     return res.send("Login Failed. Please try again later");
//   }
//   req.session.user = {
//     username: userInDatabase.username,
//     _id: userInDatabase._id
//   };
//   res.redirect("/");


//   //   console.log(`Signed in successfully! User: ${username}`);
//   //   res.redirect("/");
//   // } catch (error) {
//   //   console.error("Error during sign-in:", error);
//   //   res.status(500).send("Internal server error");
//   // }
// });

// // Sign-out route
// router.get("/sign-out", (req, res) => {
//   req.session.destroy();
//   res.redirect("/");
// });

// module.exports = router;
const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require("bcrypt");


router.get("/sign-up",(req,res)=>{
    res.render("auth/sign-up.ejs");
})


router.post("/sign-up", async (req, res )=>{
  const userInDatabase = await User.findOne({ username: req.body.username});
  if(userInDatabase) {
    return res.send("Username already taken");
  }
  if(req.body.password !== req.body.confirmPassword){
    return res.send("Password and confirm password must match")
  }
  // Register a User
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  req.body.password = hashedPassword;
  // Create a User
  const user = await User.create(req.body);
  res.send(`Thanks for signing up ${user.username}`);
});

//router to sign in
router.get("/sign-in", (req,res)=>{
    res.render("auth/sign-in.ejs");
})
router.post("/sign-in", async (req, res) => {
  const userInDatabase = await User.findOne({ username: req.body.username});
  if(!userInDatabase){
    return res.send("Login Failed. Please try again later");
  }
  const validPassword = bcrypt.compareSync(req.body.password, userInDatabase.password);
  if(!validPassword){
    return res.send("Login Failed. Please try again later");
  }
  req.session.user = {
    username: userInDatabase.username,
    _id: userInDatabase._id
  };
  res.redirect("/books");
})


// sign out
router.get("/sign-out", (req,res)=>{
    req.session.destroy();
        res.redirect("/");  
});

module.exports = router;