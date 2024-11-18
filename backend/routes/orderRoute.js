const express = require("express");
const adminAuth = require("../middleware/adminAuth");
const { allOrders, updateStatus, placeOrder, placeOrderStripe, placeOrderRazorpay, userOrders, verifyStripe, verifyRazorpay } = require("../controllers/orderController");
const Auth = require('../middleware/Auth')

const orderRouter = express.Router()

//  Admin Features
orderRouter.post('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, updateStatus)

//  Payment Features
orderRouter.post('/place', Auth, placeOrder)
orderRouter.post('/stripe', Auth, placeOrderStripe)
orderRouter.post("/razorpay", Auth, placeOrderRazorpay);

//   User Features
orderRouter.post("/userorders", Auth, userOrders);

// Verify Payment
orderRouter.post('/verifyStripe', Auth, verifyStripe)
orderRouter.post("/verifyRazorpay", Auth, verifyRazorpay);

module.exports = orderRouter
