const Cake = require("./cake.model");

//admin add cake 
exports.addCake = async (req , res )=> {
    try {
        const {name, description , price , image } = req.body;
        const cake = await Cake.create({
            name,
            description,
            price,
            image,
        });

        res.status(201).json({
            message: " Cake added successfully",
            cake,
        })
    } catch (err){
        res.status(500).json({
            message : "failed to add cake" , 
            error : err.message,
        });
    }
};

//get all cakes(public)
exports.getAllCakes = async(req, res) => {
    try{
        const cake = await Cake.find({isAvailable: true});
        res.json(cakes);
    } catch (err){
        res.status(500).json({
            message:" failed to fetch cakes",
            error : err.message,
        })
    }
};