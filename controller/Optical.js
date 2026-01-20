const express = require("express");
const OpticalData = require("../model/OpticalTest.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {v4: uuid} = require("uuid");

module.exports.home = (req, res)=>{
    res.send("listening");
}

module.exports.listTestData = wrapAsync(async (req, res)=>{
    let fullData = await OpticalData.find({}).sort({date: -1}); // latest data first

    res.json(fullData);
});

module.exports.customerData = wrapAsync(async (req, res)=>{
    let {id} = req.params;

    let data = await OpticalData.findById(id);

    res.json({data, id:data._id});
});

module.exports.addCustomer = wrapAsync(async (req, res) => {
  try {
    // console.log("REQ.FILE:", req.file);
    // console.log("REQ.BODY:", req.body);

    let {
      name,
      age,
      phone_no,
      address,
      itemBought,
      lensPrice,
      framePrice,
      totalAmount,
      paidAmount,
      dueAmount,
      customerService,
      prescriptions,
    } = req.body;

    //  parse prescriptions if string
    if (typeof prescriptions === "string") {
      prescriptions = JSON.parse(prescriptions);  // convert it into object
    }

    const newData = new OpticalData({
      name,
      age,
      phone_no,
      address,
      prescriptions: prescriptions || {},
      itemBought,
      lensPrice,
      framePrice,
      totalAmount,
      paidAmount,
      dueAmount,
      customerService,
      customerId: uuid(),
    });

    //  save image
    if (req.file) {
      newData.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    await newData.save();

    res.status(201).json({
      message: "Customer Data Added Successfully",
      data: newData,
      customerId: newData._id,
    });
  } catch (err) {
    console.log("🔥 REAL ERROR:", err); //  THIS WILL SHOW EXACT ISSUE
    res.status(500).json({ message: err.message });
  }
});






module.exports.updateData = wrapAsync(async (req, res)=>{
    let {id} = req.params;

    let updatedData = OpticalData.findByIdAndUpdate(id, {...req.body.OpticalData}, {runValidators: true, new: true});
});

// seach functionality
module.exports.searchCustomer = wrapAsync(async (req, res)=>{
    let { phone_no } = req.body;

    let customers = await OpticalData.find({phone_no: phone_no}).sort({date: -1}); // find return an array

    if(customers.length == 0){
        return res.status(404).json({message: "Customer not found"});
    }   

    // console.log(customer.length)
    res.json({customers});

})

module.exports.deleteCustomer = wrapAsync(async (req, res) => {
  let { id } = req.params;

  const deletedCustomer = await OpticalData.findByIdAndDelete(id);

  if (!deletedCustomer) {
    return res.status(404).json({ message: "Customer not found" });
  }

  res.json({ message: "Customer data deleted successfully" });
});

module.exports.editCustomerData = wrapAsync(async (req, res) => {
  const { id } = req.params;

  //  prescriptions comes as string when using FormData()
  if (req.body.prescriptions && typeof req.body.prescriptions === "string") {
    req.body.prescriptions = JSON.parse(req.body.prescriptions);
  }

  //  convert number fields (optional but recommended)
  const numberFields = [
    "age",
    "phone_no",
    "lensPrice",
    "framePrice",
    "totalAmount",
    "paidAmount",
    "dueAmount",
  ];

  numberFields.forEach((field) => {
    if (req.body[field] !== undefined && req.body[field] !== "") {
      req.body[field] = Number(req.body[field]);
    }
  });

  //  Create update object safely
  const updateData = { ...req.body };

  //  if image uploaded, update it
  if (req.file) {
    updateData.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  const updatedCustomer = await OpticalData.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!updatedCustomer) {
    return res.status(404).json({ message: "Customer not found" });
  }

  res.json({
    message: "Customer updated successfully",
    data: updatedCustomer,
    id: updatedCustomer._id,
  });
});


