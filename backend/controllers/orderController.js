const orderModel = require("../models/orderModel");
const userModel = require("../models/userModel");
const Stripe = require('stripe')
const razorpay = require('razorpay')

// global variables
const currency = 'inr'
const deliveryCharges = 10

// gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Placing orders using COD Method
const placeOrder = async (req, res) => {
    const { userId, items, amount, address } = req.body;
  try {
    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };
    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });
    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//  PLacing orders using stripe Method
const placeOrderStripe = async (req, res) => {
     const { userId, items, amount, address } = req.body;
    try {
        const { origin } = req.headers 
         const orderData = {
           userId,
           items,
           amount,
           address,
           paymentMethod: "Stripe",
           payment: false,
           date: Date.now(),
         };
        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const line_items = items.map((item)=>({price_data:{currency:currency,product_data:{name:item.name},unit_amount:item.price * 100},quantity:item.quantity}))
         line_items.push({
           price_data: {
             currency: currency,
             product_data: { name: "Delivery Charges" },
             unit_amount: deliveryCharges * 100,
           },
           quantity: 1,
         });
        const session = await stripe.checkout.sessions.create({
          success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
          mode:'payment'
        });
        res.json({success:true,session_url:session.url})
    } catch (err) {
        console.log(err.message)
        res.json({success:false,message:err.message})
    }
};
// verify stripe 
const verifyStripe = async (req,res) => {
    const { userId, success, orderId } = req.body 
    try {
        if (success === 'true') {
            await orderModel.findByIdAndUpdate(orderId, { payment: "true" })
            await userModel.findByIdAndUpdate(userId, { cartData: {} })
            res.json({success:true})
        } else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({success:false})
        }
    } catch (error) {
         console.log(error.message);
         res.json({ success: false, message: error.message });
    }
}

const verifyRazorpay = async (req, res) => {
  const {userId,razorpay_order_id} = req.body
  try {
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
    if (orderInfo.status === 'paid') {
      await orderModel.findByIdAndUpdate(orderInfo.receipt, { payment: true })
      await userModel.findByIdAndUpdate(userId, { cartData: {} })
      res.json({success:true,message:"Payment Successfully"})
    } else {
      res.json({success:false,message:"Payment Failed"})
   }
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
}
//  PLacing orders using Razor Method
const placeOrderRazorpay = async (req, res) => {
   const { userId, items, amount, address } = req.body;
    try {
         const orderData = {
           userId,
           items,
           amount,
           address,
           paymentMethod: "Razorpay",
           payment: false,
           date: Date.now(),
         };
        const newOrder = new orderModel(orderData);
      await newOrder.save();
         
      const options = {
        amount: amount * 100,
        currency: currency.toUpperCase(),
        receipt: newOrder._id.toString(),
        
      }
      await razorpayInstance.orders.create(options, (error, order) => {
        if (error) {
          console.log(error)
          return res.json({success:false,message:"Error"})
        }
        res.json({success:true,order})
      })

    } catch (error) {
       console.log(error.message);
       res.json({ success: false, message: error.message });
    }
};

// All Orders data for admin panel
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({})
        res.json({success:true,orders})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// user Orders data for frontend
const userOrders = async (req, res) => {
    const {userId} = req.body
    try {
        const orders = await orderModel.find({ userId })
        res.json({success:true,orders})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// update Orders status from admin panel
const updateStatus = async (req, res) => {
    const {orderId,status} = req.body
    try {
        await orderModel.findByIdAndUpdate(orderId, { status });
        res.json({success:true,message:"Status Updated"})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

module.exports = {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
  verifyStripe,
  verifyRazorpay,
};
