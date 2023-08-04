require("dotenv").config();
const { CONNECTION_STRING } = process.env;
const seedData = require("./seedData");

const Sequelize = require("sequelize");
const cart = [];

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

// mostPopularButton.onclick(()=>getMenuItems('?preference=popular'))
// carbSmartButton.onclick(()=>getMenuItems('?preference=carb'))




//Preference rules
// calories < 500 = calorie smart
// Protein > 30 = Protein plus
// Keto Where carbohydrates < 30 AND fat > 30 and protein < 44

  getMenuItems: (req, res) => {
    let mySequelQuery = `Select * From menu_items`;
    if(req.query.preference === 'protein'){
      mySequelQuery = `Select * From menu_items Where protein > 40;`
    }
    if(req.query.preference === 'keto'){
      mySequelQuery = `Select * From menu_items where carbohydrates < 30 AND fat > 30 and protein < 44;`
    }
    if(req.query.preference === 'calorie'){
      mySequelQuery = `Select * From menu_items where calories < 500;`
    }
    if(req.query.preference === 'carb'){
      mySequelQuery = `Select * From menu_items where carbohydrates < 20;`
    }
    if(req.query.preference === 'popular'){
      mySequelQuery = `Select * From (Select * From (Select * From (select * From menu_items where carbohydrates > 20) as z where protein < 40) as y where calories > 500) as x where carbohydrates > 30 or fat < 30 or protein < 30;`
    }
    sequelize
      .query(mySequelQuery)
      .then((dbRes) => {
        res.status(200).send(dbRes[0]);
      })
      .catch((e) => console.log("error when retrieving the items", e));
   
  },

  getCart: (req, res) => {
    // const {cart} = req.session; UNCOMMENT AND DELETE CART VAR AT TOP WHEN HOSTING
    res.status(200).send(cart);
  },

  addToCart: (req, res) => {
    if (!req.session.cart) {
      req.session.cart = [];
    }
    // const {cart} = req.session; UNCOMMENT AND DELETE CART VAR AT TOP WHEN HOSTING
    const { body } = req;
    body.quantity = (body.quantity || 0) + 1; // checks if body.quantity is truthy. If it exists and is truthy, it will use its current value. Then, we increment by 1.
    cart.push(body);
    res.status(200).send(cart);
  },

  deleteCart: (req, res) => {
    const { id } = req.params;
    //  const {cart} = req.session; UNCOMMENT WHEN HOSTING
    let index = cart.findIndex((item) => +item.menu_id === +id);
    if (index !== -1) {
      cart.splice(index, 1);
    }
    res.status(200).send(cart);
  },
};
//req.session.cart is an array of objects!
