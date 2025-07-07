const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();

// Middlewares
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require("express-session");
const passUserToView = require('./middleware/pass-user-to-view');
const isSignedIn = require('./middleware/is-signed-in');
const path= require ('path');



// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : "3000";
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));
// Morgan for logging HTTP requests
app.use(morgan('dev'));

// to show the css
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// Session Configurations
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passUserToView);

// GET
app.get("/", async(req, res) => {
  res.render("index.ejs");
});

// Require Controller
const authController = require("./controllers/auth");
const booksController = require("./controllers/books");
app.use("/auth", authController);
app.use("/books", isSignedIn, booksController);

// Route - Just for testing purpose
// VIP-lounge
app.get("/vip-lounge", isSignedIn, (req, res) => {
  res.send(`Welcome to the Book of your life`);
});



app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});