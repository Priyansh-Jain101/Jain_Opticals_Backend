const mongoose = require("mongoose");

let Schema = mongoose.Schema;

const eyeSchema = new Schema(
  {
    sph: { type: String, default: "" },
    cyl: { type: String, default: "" },
    axis: { type: String, default: "" },
    add: { type: String, default: "" },  
  },
  { _id: false }
);

const prescriptionSchema = new Schema(
  {
    right: { type: eyeSchema, default: () => ({}) },
    left: { type: eyeSchema, default: () => ({}) },
  },
  { _id: false }
);

const OpticalTestSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    phone_no: {
        type: Number,
        required: true
    },
    address: {
        type: String,
    },
    date: {
        type: Date,
        // default: () => new Date().toLocaleString("en-US"),
        default: Date.now
    },

    customerId: {
        type: String,
        required: true,
        unique: true,
    },
    // actual test results

    prescriptions: {
    old: { type: prescriptionSchema, default: () => ({}) },
    new: { type: prescriptionSchema, default: () => ({}) },
    ar: { type: prescriptionSchema, default: () => ({}) },
    },

    // what are the item being bought
    itemBought: {
        type: String,
        enum: ["", "Lens only", "Frame only", "Lens + Frame"],
        default: ""
    },

    lensPrice: {
        type: Number
    },

    framePrice: {
        type: Number
    },

    totalAmount: {
        type: Number
    },
    paidAmount: {
        type: Number,
    },
    dueAmount: {
        type: Number
    },

    // remark if any
    remark: {
        type: String
    },

    // customer service
    customerService: {
        type: String,
        enum: ["In-Progress", "Completed"],
        default: "In-Progress",
        // required: true
    },

    image: {
        url: { type: String, default: "" },
        filename: { type: String, default: "" }
    }

})

const OpticalData = mongoose.model("OpticalData", OpticalTestSchema);
module.exports = OpticalData;