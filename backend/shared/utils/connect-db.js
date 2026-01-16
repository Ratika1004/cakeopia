const mongoose = require("mongoose");

const DB_URL = process.env.DB_URL;

async function connectDB(req, res, next){
    try{
        if(mongoose.connection.readyState === 1) {
            return next();
        }

        await mongoose.connect(DB_URL,{
            dbName : "cakeopia",
        });

        console.log("connected to cakeopia mongoDB");
        next();
    } catch ( error) {
         console.error("database connection failed" , error.message);
         res.status(500).json({
            message : "database connection failed",
            error : error.message,
         })
    }

}

module.exports = connectDB;