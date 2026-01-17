const User = require("../auth/auth.model");
const {encodePassword} = require("../../shared/utils/password-utils")

exports.getMe =  async(req,res) => {
    try{
        const user = await User.findById(req.account._id).select("-password");
        if(!user){
            return res.status(404).json({message: " user not found"});
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({
            message: " failed to fetch user" , error :err.message
        });
    }
};

//update profile

exports.updateProfile = async (req, res) => {
    try {
        const updates = {};
        const {name, password} = req.body;
        if(name) updates.name = name;
        if(password) updates.password = encodePassword(password);

        const user =  await User.findByIdAndUpdate(
            req.account._id,
            updates,
            {new : true} 
        ).select("-password");

        res.json({
            message : "profile updated successfully",
            user,
        });
    } catch(err) {
        res.status(500).json({ message :" profile update failed" , error : err.message})
    }
}