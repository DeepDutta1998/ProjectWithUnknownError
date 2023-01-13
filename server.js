const express = require("express");
const mongoose = require("mongoose");
const app = express();
require('dotenv').config();
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const parser = require("cookie-parser");
const Authadmin = require("./middleware/adminAuth");
const Authuser = require("./middleware/userAuth");


app.use(
  session({
    secret: "DEEP98",
    saveUninitialized: true,
    resave: true,
  })
);

app.use(flash());
app.use(parser());

app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static(path.join(__dirname, "public")));

app.use(
  express.urlencoded({
    extended: true,
  })
);

// middleware




app.use(Authadmin.adminAuth);
app.use(Authuser.userAuth);

const adminRouter = require("./routes/admin.routes");
const userRouter = require("./routes/user.routes")

app.use("/admin", adminRouter);
app.use("/user", userRouter);
;




const port = process.env.PORT || 1998;



const dbDriver =
  "mongodb+srv://lofi:bLZgeMO7Qs872Qqx@cluster0.rmvujxb.mongodb.net/AdminProject2";

  // connection to the database 


mongoose
  .connect(dbDriver, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    app.listen(port, () => {
      console.log(`DataBase is connected\u{1F44D}`);
      console.log(`Admin side Server is running on \u{1F449} http://localhost:${port}/admin`);
      console.log(`User side Server is running on \u{1F449} http://localhost:${port}/user`);
    });
  })
  .catch((err) => {
    console.log(err);
  });


  