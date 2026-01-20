const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name : { type : String , required : true}, 
    description : { type : String } ,
    price : { type : Number , required : true },
    image : { type : String}, 
    category : { type : String ,
        enum : ["cake" , "cupcake" , "pastry" , "custom"],
        required : true,
    },
    isAvailable : { type : Boolean , default : true},
    createdBy : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "User" , 
        required : true,
    },
},
{timestamps : true});

module.exports = mongoose.model("Product" , productSchema);