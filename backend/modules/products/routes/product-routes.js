const {Router} = require("express");
const ProductModel = require("../models/product-model");
const createProductRules = require("../middlewares/create-product-rules");
const updateProductRules = require("../middlewares/update-product-rules");
const checkValidation = require("../../../shared/middlewares/check-validation");
const authorize = require("../../../shared/middlewares/authorize");

const productRoutes = Router();

//get all products
productRoutes.get("/",async(req,res)=>{
    try{
        const products = await ProductModel.find({ isAvailable : true});
        res.json(products);
    } catch(err){
        res.status(500).json({message : "error fetching products"});
    }
});

//get product by id
productRoutes.get("/:id", async(req,res)=>{
    try{
        const product = await ProductModel.findByIdAndDelete(req.params.id);
        if(!product){
            return res.status(404).json({message : "Product not found"});
        }
        res.json(product);
    } catch(err){
        res.status(400).json({message: "Invalid product ID"});
    }
});

// create product(admin only)
productRoutes.post("/",authorize(["admin"]),createProductRules,checkValidation, async(req,res)=> {
    try{
        const product = await ProductModel.create({
            ...req.body,
            createdBy : req.account._id,
        });

        res.status(201).json(product);
    } catch(err) {
        return res.status(500).json({message : "Error creating product"});
    }
});

//update product (admin only )
productRoutes.put("/:id" , authorize(["admin"]),updateProductRules,checkValidation, async (req,res)=>{
    try {
        const updated = await ProductModel.findByIdAndUpdate(req.params.id,
            {$set : req.body},
            {new : true}
        );
        if(!updated){
            return res.status(404).json({message : "Product not found"});
        }
        res.json(updated);
    } catch (err){
        res.status(500).json({message : "Error updating Product"});
    }
});

//deleting product(admin only)

productRoutes.delete("/:id" , authorize(["admin"]), async (req,res)=>{
    try { 
        const deleted = await ProductModel.findByIdAndDelete(req.params.id);
        if(!deleted){
            return res.status(404).json({message:"Product not found"});
        }
        res.status(201).json({message : "Product deleted successfully"})
    } catch(err) {
        res.status(400).json({message: "Error deleting product"});
    }
})

module.exports = productRoutes;