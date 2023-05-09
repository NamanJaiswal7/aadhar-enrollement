const mongoose = require("mongoose");
const aadharSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    firstName: {
        type: String,
        required:true        
    },
    lastName: {
        type: String,
        required:true        
    },
    phoneNumber: {
        type: String,
        required:true,
        unique:true        
    },
    email: {
        type:String,
        required: [true, "Must for creating aadhar"],
        unique:true
    },
    address: {
        type: String,
        required: [true, "Required address for creating aadhar"]
    },
    photo: {
        type: String,
    },
    aadharNumber: {
        type: Number,
        required: true,
        unique:true
    },
    dateOfBirth:{type:String,required:true},
    gender:{type:String,required:true}
})
const aadharModel =
    mongoose.model("aadhar", aadharSchema);
module.exports = aadharModel;