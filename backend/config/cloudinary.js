const { v2: cloudinary } = require('cloudinary')

const connectCloudinary = async () => {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME || "dxvracvvl",
      api_key: process.env.CLOUDINARY_API_KEY || 122161371118831,
      api_secret: process.env.CLOUDINARY_SECRET_KEY || 'G-YOgFT7no1T7BAa6YKu43Pmgo4',
    });
}

module.exports = connectCloudinary