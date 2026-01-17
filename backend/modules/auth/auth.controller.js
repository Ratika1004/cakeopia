const User = require("./auth.model");
const {encodePassword , matchPassword} =  require("../../shared/utils/password-utils");
const {encodeToken} =  require("../../shared/utils/jwt-utils");

exports.register = async(req , res) => {
    try { 
        const { name , email , password } = req.body;

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: "Email already exists"});
        }

        const hashedPassword = encodePassword(password);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });
        res.status(201).json({
            message: "Registration successful",
            userId: user._id,
        });
    } catch(err){
        res.status(500).json({
            message: " Registration failed" , error : err.message
        });
    }
};

//login
exports.login = async (req , res) => {
    try {
        const {email , password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message :" Invalid credentials"})
        }

        const token = encodeToken({
            _id : user._id,
            email: user.email,
            roles : user.roles,

        });

        res.json({
            message :"Login successful",
            token,
        })
    }catch(err){
        res.status(500).json({message:"login failed", error:err.message})
    }
};