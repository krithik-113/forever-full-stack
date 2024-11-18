const mongoose = require('mongoose')

const connectDB = async () => {
    mongoose.connection.on('connected', () => {
        console.log('DB Connected')
    })
        await mongoose.connect(
          `mongodb+srv://krithikroshan113:tD4gXO6M84FledyR@cluster0.amfwh.mongodb.net/e-commerce`
        );
}
 
module.exports = connectDB