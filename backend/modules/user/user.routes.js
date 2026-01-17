const express = require("express");
const authorize = require("../../shared/middlewares/authorize");
const {body} = require("express-validator");
const userController = require("./user.controller");
const checkValidation = require("../../shared/middlewares/check-validation");

const router= express.Router();

//get current user
router.get("./me", authorize(["customer"]),
userController.getMe);

//update profile
router.put("./me" , authorize(["customer"]),
[
    body("name").optional().notEmpty(),
    body("password").optional().isLength({ min: 6}),
],
checkValidation,
userController.updateProfile);

module.exports = router;