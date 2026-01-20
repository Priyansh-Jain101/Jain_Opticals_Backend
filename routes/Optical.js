const express = require("express");
const router = express.Router();
const OpticalData = require("../model/OpticalTest.js");

const OpticalController = require("../controller/Optical.js");

// multer for parsing the multipart/form data
const multer  = require('multer')

// requiring cloudinary and storage 
const {storage} = require('../cloudConfig.js');

const upload = multer({storage})  //initialize

// home page 
router.get("/", OpticalController.home);

// list all the test data that are performed
router.get("/customers", OpticalController.listTestData);

// individual cutomet test data
router.get("/customer/:id", OpticalController.customerData);


// add customer to database
router.post("/add_customer", upload.single("image"), OpticalController.addCustomer);

// seacrch customer
router.post("/search_customer", OpticalController.searchCustomer);

// delete customer
router.delete("/customer/:id", OpticalController.deleteCustomer);

// edit customer
router.put("/customer/:id",  upload.single("image"), OpticalController.editCustomerData);

module.exports = router;