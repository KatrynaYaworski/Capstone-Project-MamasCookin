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
app.use((req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = [];
    // req.session.user = {
    //   email: 'john.doe@gmail.com',
    //   firstName: 'John',
    //   lastName: 'Doe'
    // }
  }
  next();
});

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

app.listen(SERVER_PORT, () => console.log(`up on ${SERVER_PORT}`));
