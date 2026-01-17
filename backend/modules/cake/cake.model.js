const mongoose = require("mongoose");
const { applyTimestamps } = require("../auth/auth.model");

const cakeSchema = new mongoose.Schema({
    name:{
        type : String,
        required: true,
        trim: true,
    }, 
    description : {
        type : String,
        required : true,
    }, 
    price : {
        type : Number,
        required : true,
    },
    image : {
        type : String ,
    },
    isAvailable : {
        type : Boolean ,
        default : true,
    },
},
{timestamps : true});

module.exports = mongoose.model("Cake",cakeSchema);