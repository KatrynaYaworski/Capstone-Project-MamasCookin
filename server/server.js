require('dotenv').config();
const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')
const session = require('express-session')
const {SERVER_PORT} = process.env

const { seed, getMenuItems, getCart, addToCart, deleteCart, adjustCartQuantity } = require('./controller')

app.use(express.json())
app.use(cors())
app.use(session({ secret: 'keyboard cat', saveUninitialized: false, resave: true, cookie: { maxAge: 60000 }}))
app.use((req,res,next)=>{
    if(!req.session.cart){
        req.session.cart = [];
    }
    next();
})

app.use(express.static(`public`))

app.post('/seed', seed)

app.get('/menu_items', getMenuItems)

app.put('/cart/:id/:type', adjustCartQuantity)
app.get('/cart', getCart)
app.post('/cart', addToCart)
app.delete('/cart/:id', deleteCart)

app.listen(SERVER_PORT, () => console.log(`up on ${SERVER_PORT}`))