const {Router} = require("express");
const CartModel = require("../models/cart-model");
const ProductModel = require("../../products/models/product-model");
const updateCartRules = require("../middlewares/update-cart-rules");
const checkValidation = require("../../../shared/middlewares/check-validation");
const authorize = require("../../../shared/middlewares/authorize");

const cartRoutes = Router();

//get current user's cart
cartRoutes.get("/",authorize(["customer","admin"]), async (req,res)=>{
    try {
        const cart = await CartModel.findOne({ user : req.account._id})
        .populate("items.product");

        res.json(cart || {user: req.account._id , items : []});
    } catch (err) {
        res.status(500).json({message: "Error fetching cart"});
    }
});

//add product to cart or update quantity

cartRoutes.post("/add",authorize(["customer" ,"admin"]),updateCartRules,checkValidation, async(req,res)=>{
    try{
        const {productId , quantity } = req.body;
        const product = await ProductModel.findById(productId);
        if(!product || !product.isAvailable){
            return res.status(404).json({message : "Product not available"});
        }

        let cart = await CartModel.findOne({ user : req.account._id});
        if(!cart){
            cart = await CartModel.create({
                user: req.account._id,
                items : [{ product : productId , quantity}],
            });
            return res.status(201).json(cart);
        }

        //check if already in cart
        const itemIndex = cart.items.findIndex(
            (item) => item.product.toString () === productId
        );

        if (itemIndex > -1){
            cart.items[itemIndex].quantity += quantity;
        }else { 
            cart.items.push({ product : productId , quantity})
        }

        await cart.save();
        res.json(cart);
    } catch(err){
        res.status(500).json({message:"Error updating cart"});
    }
});

//update quantity of a cart item

cartRoutes.put("/update" , authorize(["customer","admin"]),updateCartRules,checkValidation, async (req,res)=>{
    try {
        const {productId , quantity} = req.body;
        //check if user has cart
        const cart = await CartModel.findOne({user : req.account._id});
        if(!cart){
            return res.status(404).json({message: "Cart not found"});
        }
        //check item in cart or not
        const item = cart.items.find(
            (item)=>item.product.toString()=== productId
        );
        if(!item){
            return res.status(404).json({ message : "Item not in cart"});
        }

        item.quantity = quantity;
        await cart.save();
        res.json(cart);
    }catch(err){
        res.status(500).json({ message : "Error updating cart item"})
    }
});

//remove product from cart

cartRoutes.delete("/remove/:productId",authorize(["customer","admin"]), async(req,res)=>{
    try{
        const cart = await CartModel.findOne({user : req.account._id});
        if(!cart){
            return res.status(404).json({message: "Cart not found"});
        }

        cart.items = cart.items.filter(
            (item) => item.product.toString() !==req.params.productId
        );
        await cart.save();
        res.json(cart);
    } catch(err){
        res.status(500).json({message: "Error removing item from cart"})
    }
});


//clear cart

cartRoutes.delete("/clear",authorize(["customer","admin"]),async(req,res)=>{
    try{
        await CartModel.findOneAndDelete({user :req.account._id});
        res.json({message : "Cart cleared successfully"});
    } catch (err) {
        res.status(500).json({message : "Error clearing cart"});
    }
});

module.exports = cartRoutes;