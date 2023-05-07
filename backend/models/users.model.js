const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String,
        default:"GENERAL"
        
    },
    email: {
        type:String,
        required: [true, "Must for creating aadhar"],
        unique:true
    },
    password: {
        type: String,
        required: [true, "Required Password for creatinng"]
    },
})
const UserModel =
    mongoose.model("users", userSchema);
module.exports = UserModel;