const jwt = require("jsonwebtoken");

//secret to lock/unlock token
const SECRET = process.env.TOKEN_SECRET;
//expires in
const EXPIRES_IN = '1h';

//creates token , takes data as payload to store in token 
const encodeToken = (payload)=> {
    //creates duplicate , to avoid original manipulation
    const p = { ...payload } ;
    //if payload has password , delete , donot store password in token
    if(p.password) delete p.password;
    //creates token using secret , p , expires in
    return jwt.sign(p,SECRET,{expiresIn:EXPIRES_IN});
};

//decode token (verifies)
const decodeToken = (raw) => {
    //no token , return (user is not logged in)
    if(!raw) return;

    //checks if token has spaces than spit
    const token = raw.includes(" ") ? raw.split(" ")[1] : raw;
    if(!token) return;

    //verifies token using secret key 
    try{
        return jwt.verify(token,SECRET);
    } catch (err){
        return;
    }
};

module.exports= {
    encodeToken , decodeToken
};