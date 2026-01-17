const express = require("express");
const {body} = require("express-validator");
const checkValidation = require("../../shared/middlewares/check-validation");
const authController = require("./auth.controller");

const router = express.Router();

//register route 
router.post ("/register" , [ 
    body("name").notEmpty(),
     body("email").isEmail(),
     body("password").isLength({min:6}),
    ],
     checkValidation, authController.register
    );

//login route
router.post("/login",[
    body("email").isEmail(),
    body("password").notEmpty(),
],
checkValidation,
authController.login
);
module.exports = router;