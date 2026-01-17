const express = require("express");
const {body} = require("express-validator");
const checkValidation = require("../../shared/middlewares/check-validation");
const authorize = require("../../shared/middlewares/authorize");
const cakeController = require("./cake.controller");

const router = express.Router();


//admin add cake
router.post("/", authorize (["admin"]),
[
    body("name").notEmpty(),
    body("description").notEmpty(),
    body("price").isNumeric(),
],
checkValidation,
cakeController.addCake);

//get all cakes(public)
router.get("/",cakeController.getAllCakes);

module.exports = router;