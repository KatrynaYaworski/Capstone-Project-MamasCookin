require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const { SERVER_PORT } = process.env;

const {
  seed,
  getMenuItems,
  getCart,
  addToCart,
  deleteCart,
  adjustCartQuantity,
  registerUser,
  userLogin,
  getusers,
  logOut,
} = require("./controller");


app.use(express.json());
app.use(cors());
app.use(
  session({
    secret: "keyboard cat",
    saveUninitialized: false,
    resave: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);
// app.use((req, res, next) => {
  //   if (!req.session.cart) {
//     req.session.cart = [];
//     // req.session.user = {
//     //   email: 'john.doe@gmail.com',
//     //   firstName: 'John',
//     //   lastName: 'Doe'
//     // }
//   }
//   next();
// });

app.use(express.static(`public`));

app.post("/seed", seed);

app.get("/menu_items", getMenuItems);

app.put("/cart/:id/:type", adjustCartQuantity);
app.get("/cart", getCart);
app.post("/cart", addToCart);
app.delete("/cart/:id", deleteCart);

app.post("/users", registerUser);
app.get("/users", getusers);

app.post("/login", userLogin);
app.delete("/login", logOut);


app.get('/reset.css',(req,res) => {
  res.sendFile(path.join(__dirname,'../public/reset.css'))
});

app.get('/home.html',(req,res) => {
  res.sendFile(path.join(__dirname,'../public/home/home.html'))
});
app.get('/home.css',(req,res) => {
  res.sendFile(path.join(__dirname,'../public/home/home.css'))
});
app.get('/home.js',(req,res) => {
  res.sendFile(path.join(__dirname,'../public/home/home.js'))
});

app.get('/menu.html',(req,res) => {
  res.sendFile(path.join(__dirname,'../public/menu/menu.html'))
});
app.get('/menu.css',(req,res) => {
  res.sendFile(path.join(__dirname,'../public/menu/menu.css'))
});
app.get('/menu.js',(req,res) => {
  res.sendFile(path.join(__dirname,'../public/menu/menu.js'))
});

app.get('/payment.html',(req,res) => {
  res.sendFile(path.join(__dirname,'../public/payment/payment.html'))
});
app.get('/payment.css',(req,res) => {
  res.sendFile(path.join(__dirname,'../public/payment/payment.css'))
});
app.get('/payment.js',(req,res) => {
  res.sendFile(path.join(__dirname,'../public/payment/payment.js'))
});

app.get('/pickMeals.html',(req,res) => {
  res.sendFile(path.join(__dirname,'../public/pickMeals/pickMeals.html'))
});
app.get('/pickMeals.css',(req,res) => {
  res.sendFile(path.join(__dirname,'../public/pickMeals/pickMeals.css'))
});
app.get('/pickMeals.js',(req,res) => {
  res.sendFile(path.join(__dirname,'../public/pickMeals/pickMeals.js'))
});

app.get('/register.html',(req,res) => {
  res.sendFile(path.join(__dirname,'../public/register/register.html'))
});
app.get('/register.css',(req,res) => {
  res.sendFile(path.join(__dirname,'../public/register/register.css'))
});
app.get('/register.js',(req,res) => {
  res.sendFile(path.join(__dirname,'../public/register/register.js'))
});


app.listen(SERVER_PORT, () => console.log(`up on ${SERVER_PORT}`));
