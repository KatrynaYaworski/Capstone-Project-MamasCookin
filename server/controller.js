require("dotenv").config();
const { CONNECTION_STRING } = process.env;
const bcrypt = require("bcryptjs");

const seedData = require("./seedData");

const Sequelize = require("sequelize");

const sequelize = new Sequelize(CONNECTION_STRING, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});
module.exports = {
  seed: async (req, res) => {
    try {
      await sequelize.query(
        `
        drop table if exists menu_items;
        drop table if exists users;
        
        CREATE TABLE menu_items(
                  menu_id SERIAL PRIMARY KEY,
                  calories integer NOT NULL,
                  fat integer NOT NULL,
                  carbohydrates integer NOT NULL,
                  protein integer NOT NULL,
                  sodium integer NOT NULL,
                  ingredients text NOT NULL,
                  name varchar (40) NOT NULL,
                  image_url varchar (300) NOT NULL,
                  prep_cook_time integer NOT NULL
              );
        
              CREATE TABLE users(
                        user_id SERIAL PRIMARY KEY,
                        email varchar (40) NOT NULL,
                        password varchar (200) NOT NULL,
                        first_name varchar (20) NOT NULL,
                        last_name varchar (20) NOT NULL
                    );
               
              `
      );
      const seedPromiseArr = seedData.map((item) => {
        return sequelize.query(`INSERT INTO menu_items (calories, fat, carbohydrates, protein, sodium, ingredients, name, image_url, prep_cook_time)
            VALUES (
                ${item.calories},
                ${item.fat},
                ${item.carbohydrates},
                ${item.protein},
                ${item.sodium},
                '${item.ingredients}',
                '${item.name}',
                '${item.image_url}',
                ${item.prep_cook_time})`);
      });
      await Promise.all(seedPromiseArr);
      console.log("DB seeded!");
      res.sendStatus(200);
    } catch (e) {
      console.log("error seeding DB", e);
    }
  },

  //Preference rules
  // calories < 500 = calorie smart
  // Protein > 30 = Protein plus
  // Keto Where carbohydrates < 30 AND fat > 30 and protein < 44

  getMenuItems: (req, res) => {
    let mySequelQuery = `Select * From menu_items`;
    if (req.query.preference === "protein") {
      mySequelQuery = `Select * From menu_items Where protein > 40;`;
    }
    if (req.query.preference === "keto") {
      mySequelQuery = `Select * From menu_items where carbohydrates < 30 AND fat > 30 and protein < 44;`;
    }
    if (req.query.preference === "calorie") {
      mySequelQuery = `Select * From menu_items where calories < 500;`;
    }
    if (req.query.preference === "carb") {
      mySequelQuery = `Select * From menu_items where carbohydrates < 20;`;
    }
    if (req.query.preference === "popular") {
      mySequelQuery = `Select * From (Select * From (Select * From (select * From menu_items where carbohydrates > 20) as z where protein < 40) as y where calories > 500) as x where carbohydrates > 30 or fat < 30 or protein < 30;`;
    }
    if (req.query.search) {
      mySequelQuery = `Select * From menu_items Where name ilike '%${req.query.search}%';`;
    }
    sequelize
      .query(mySequelQuery)
      .then((dbRes) => {
        res.status(200).send(dbRes[0]);
      })
      .catch((e) => console.log("error when retrieving the items", e));
  },

  getCart: (req, res) => {
    const {cart} = req.session; 
    res.status(200).send(cart);
  },

  addToCart: (req, res) => {
    const {cart} = req.session; 
    const { body } = req;
    body.quantity = (body.quantity) + 1; // checks if body.quantity is truthy. If it exists and is truthy, it will use its current value. Then, we increment by 1.
    cart.push(body);
    res.status(200).send(cart);
  },
  adjustCartQuantity: (req, res) => {
    const {cart} = req.session;
    const { id, type } = req.params;
    let meal = cart.find((item) => item.menu_id === +id);
    if (type === "increment") {
      meal.quantity++;
    } else {
      meal.quantity--;
    }
    res.sendStatus(200);
  },

  deleteCart: (req, res) => {
    const { id } = req.params;
     const {cart} = req.session;
    let index = cart.findIndex((item) => +item.menu_id === +id);
    if (index !== -1) {
      cart.splice(index, 1);
    }
    res.status(200).send(cart);
  },

  registerUser: (req, res) => {
    const { email, firstName, lastName, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    sequelize
      .query(
        `
    INSERT INTO users (email, password, first_name, last_name)
    VALUES ('${email}', '${hashedPassword}', '${firstName}', '${lastName}');
    `
      )
      .then((dbRes) => {
        req.session.user = { ...dbRes[0], password: undefined };
        res.sendStatus(200);
      })
      .catch((e) => console.log("error when registering a user", e));
  },

  userLogin: (req, res) => {
    const { email, password } = req.body;
    sequelize
      .query(
        `
    select * from users Where email = '${email}'
    `
      )
      .then((dbRes) => {
        console.log(password);
        console.log(dbRes[0][0].password);
        if (bcrypt.compareSync(password, dbRes[0][0].password)) {
          req.session.user = { ...dbRes[0], password: undefined };
          res.status(200).send(req.session.user);
        } else {
          res.status(400).send("User not found in condition");
        }
      })
      .catch((e) => res.status(400).send("User not found."));
  },

  getusers: (req, res) => {
    if (req.session.user) {
      res.status(200).send(req.session.user);
    } else {
      res.sendStatus(400);
    }
  },

  logOut: (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  },
};
