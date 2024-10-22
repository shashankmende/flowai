const IncomeModel = require("../models/IncomeModel")
const mongoose = require("mongoose")

exports.addTrans = async (req, res) => {
    try {
        const { type, category, amount, description, date } = req.body;

    
        const newType = type ? type.toLowerCase() : null;

        
        if (!newType || !category || !description || !amount || !date) {
            return res.status(400).json({ message: "All fields are required" });
        }

        
        if (typeof amount !== "number" || amount <= 0) {
            return res.status(400).json({ message: "Amount must be a positive number" });
        }

        
        const incomeInstance = new IncomeModel({
            type: newType,
            category,
            amount,
            description,
            date,
            userId:req.userId
        });

        
        await incomeInstance.save();
        res.status(200).json({ message: "Transaction Added", income: incomeInstance });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


exports.getTrans = async(req,res)=>{
    try {
        const trans = await IncomeModel.find({userId:req.userId}).sort({createdAt:-1})
        res.status(200).json(trans)
    } catch (error) {
      res.status(500).json({message:"Server Error"})
    }
}

exports.delTrans = async(req,res)=>{
try {
    

        const {id}=req.params 
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }
        const isExist = await IncomeModel.findById(id)
        
        if (!isExist) {
            return res.status(404).json({ message: "No transaction found with the provided ID" });
        }
        await IncomeModel.findByIdAndDelete(id);
        return res.status(200).json({ message: "Transaction deleted successfully" });
}
        catch (error) {
            
        return res.status(500).json({ message: "Server Error", error: error.message });
        }
}

exports.transById = async(req,res)=>{
    try {
        const {id}=req.params
        const trans = await IncomeModel.findById(id)
        
        res.status(200).json({message:"Transaction recieved successfully",transaction:trans})
    } catch (error) {
        res.status(500).json({message:"Failed to get transaction",error:error})
        
    }
}

exports.updateTransById = async(req,res)=>{
    try {
        const {id} = req.params
        const {type,category,amount,description,date}=req.body
        const updatedType = type? type.toLowerCase():undefined

        if (!category || (amount && amount<=0) || !description || !date){
            res.status(400).json({message:"Invalid input, all required fields must be provided and valid"})
        }

        if (amount !== undefined && (amount<=0 || typeof amount !=="number")){
            res.status(400).json({message:"Amount must be a positive number"})
            
        }

        const updatedTransaction = await IncomeModel.findByIdAndUpdate(
            id,
            {
                ...(updatedType && { type: updatedType }),  
                category,
                amount,
                description,
                date,
            },
            { new: true } 
        );

        if (!updatedTransaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        res.status(200).json({ message: "Transaction updated", transaction: updatedTransaction });
        
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

exports.summary = async(req,res)=>{
    try {
        const summary = await IncomeModel.aggregate([
            {
                $group:{
                    _id:"$type",
                    total: {$sum:"$amount"}
                }
            }
        ])

        let totalIncome =0
        let totalExpense = 0

        summary.forEach(item=>{
            if (item._id==="income"){
                totalIncome= item.total
            }
            else if(item._id==="expense"){
                totalExpense=item.total
            }
        })

        const balance = totalIncome-totalExpense


        res.status(200).json({totalIncome,totalExpense,balance})
    } catch (error) {
        
    }
}

exports.filterByCategory = async(req,res)=>{
    try {
        const {type}=req.body 
        const updatedType = type? type.toLowerCase(): undefined
        
        const filteredDocs = await IncomeModel.find({type:updatedType})

        res.status(200).json({data:filteredDocs})

    } catch (error) {
        res.status(400).json({message:'Server Error',error:error.message})
        
    }
}

