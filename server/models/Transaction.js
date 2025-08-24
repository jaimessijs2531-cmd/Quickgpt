import mongoose from "mongoose"

const transactionSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.ObjectId,ref:"user",required:true},
    planId:{type:String,required:true,unique:true},
    amount:{type:Number,required:true},
    isPaid:{type:Boolean,default:false},
},{timestamps:true})

const Transaction = mongoose.model('Transaction',transactionSchema);

export default Transaction;
