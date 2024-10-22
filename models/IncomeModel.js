
const mongoose = require("mongoose")

const IncomeSchema = new mongoose.Schema({
    type:{
        type:String,
        required:true ,
        trim:true
    },
    category:{
        type:String,
        required:true,
    },
    amount:{
        type:Number,
        required:true,
        trim:true 
    },
    date:{
        type:Date,
        required:true,
    },
    description:{
        type:String,
        required:true
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: "User", 
    },

},{timestamps:true})

const IncomeModel = mongoose.model("Transactions",IncomeSchema)

module.exports = IncomeModel