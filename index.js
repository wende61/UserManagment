const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const session = require('express-session');
dotenv.config();
const passport = require("passport");
const { loginCheck } = require("./auth/passport");
loginCheck(passport);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
 
// Mongo DB conncetion
const database = process.env.MONGOLAB_URI;
mongoose
  .connect(database, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log("e don connect"))
  .catch((err) => console.log(err));

app.set("view engine", "ejs");

//BodyParsing
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret:'oneboy',
    saveUninitialized: true,
    resave: true
  }));

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/users", require("./routes/api/users"));
//Routes
//app.get('/', (req, res) => res.redirect('views/login'))
app.use("/", require("./routes/login"));
// Root route of express app
app.get("/", (req, res) => {
  res.send("Hello Geeks");
});
const PORT = process.env.PORT || 4111;

app.listen(PORT, console.log("Server has started at port " + PORT));


app.listen(3000, () => console.log('Server started'));