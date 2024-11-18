const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require("./config/mogodb");
const connectCloudinary = require('./config/cloudinary');

//  App Config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()
dotenv.config()

// middlewares
app.use(express.json())
app.use(cors())


// api endpoints
app.use('/api/user', require('./routes/userRoute'))
app.use('/api/product', require('./routes/productRoute'))
app.use('/api/cart', require('./routes/cartRoute'))
app.use('/api/order',require('./routes/orderRoute'))

app.get('/', (req, res) => {
    res.json({message:'API Working'})
})

app.listen(port,'0.0.0.0',() => {
    console.log(`Server is started on PORT : ${port}`)
})
