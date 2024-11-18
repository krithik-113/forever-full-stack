const express = require('express')
const { getUserCart, addToCart, updateCart } = require('../controllers/cartController')
const AuthUser = require('../middleware/Auth')

const cartRouter = express.Router()

cartRouter.post('/get',AuthUser, getUserCart)
cartRouter.post('/add',AuthUser, addToCart)
cartRouter.post('/update',AuthUser,updateCart)

module.exports = cartRouter