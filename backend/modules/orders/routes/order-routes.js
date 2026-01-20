const {Router} = require("express");
const OrderModel = require("../models/order-model");
const CartModel = require("../../cart/models/cart-model");
const authorize = require("../../../shared/middlewares/authorize");

const ordersRoute = Router();

//place order(customer)
ordersRoute.post("/",authorize(["customer"]),async(req,res)=>{
    try{
        const user= req.account;
        const cart = await CartModel.findOne({ userId : user._id}).populate("items.productId");
        if(!cart || cart.items.length === 0) {
            return res.status(400).json({ message : "cart is empty"});
        }

        const orderItems = cart.items.map((item)=> ({
            productId : item.productId._id,
            name : item.productId.name,
            price : item.productId.price,
            quantity : item.quantity,
        }));

        const totalAmount = orderItems.reduce(
            (sum,item)=> sum + item.price * item.quantity,0
        );

        const order = await OrderModel.create({
            userId : user._id,
            items : orderItems,
            totalAmount,
        });

        cart.items = [];
        await cart.save();
        res.status(201).json(order);
    }catch(error){
        console.error("Place order error : error");
        res.status(500).json({message : "failed to place order"});
    }
});

//get my orders(logged in user)
ordersRoute.get("/my",authorize(["customer"]), async(req,res)=>{
    try { 
        const user= req.account;

        const orders = await OrderModel.find({userId : user._id}).sort({
            createdAt: -1,
        });
        res.json(orders);

        }catch(error){
            res.status(500).json({
                message: "Failed to fetch orders"
            });
        }
});

//get all orders(admin)

ordersRoute.get("/" ,authorize(["admin"]), async(req,res)=>{
    try{
        const orders = await OrderModel.find()
        .populate("userId" , "name email")
        .sort({createdAt : -1});

        res.json(orders);
    } catch(error){
        res.status(500).json({ message : "failed to fetch all orders"});
    }
});

//update order status (admin)
ordersRoute.put("/:id/status",authorize(["admin"]),async(req,res)=>{
    try{
        const {status} = req.body;
        const allowedStatuses = [
            "pending",
            "confirmed",
            "delivered",
            "cancelled",
        ];

        if(!allowedStatuses.includes(status)) { 
            return res.status(400).json({
                message : "Invalid order status"
            });
        }

        const order = await OrderModel.findByIdAndUpdate(req.params.id,{status},{new:true});
        if(!order){
            return res.status(400).json({ message : "Order not found"});
        }

        res.json(order);
    } catch(error){
        res.status(500).json({message : "Failed to update order status"});
    }
});

module.exports = ordersRoute;