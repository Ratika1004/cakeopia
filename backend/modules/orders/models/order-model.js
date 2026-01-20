const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    productId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Product",
        required : true,
    },
    name :{
        type : String,
        required : true,
    },
    price : {
        type: Number,
        required : true,
    },
    quantity : {
        type: Number,
        required : true,
    },
},
{_id : false} //prevents mongodb from creating id for each item
);

//orderSchema

const orderSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    items : {
        type :[orderItemSchema],
        required : true,
    },
    totalAmount : {
        type: Number,
        required : true,
    },

    status :{
        type : String,
        enum : ["pending" ,"confirmed","delivered","cancelled"],
        default : "pending",
    },
},
{timestamps : true});

module.exports = mongoose.model("Order",orderSchema);