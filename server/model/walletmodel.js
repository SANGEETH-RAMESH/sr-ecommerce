const mongoose=require('mongoose');
const WalletSchema=mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:true
    },
    balance:{
        type:Number
    },
    Transactionhistory:[{
        createdAt:{
            type:Date,
            default:Date.now
        },
        amount:{
            type:Number
        },
        transactiontype:{
            type:String
        },
        oldbalance:{
            type:Number
        }
    }]
})
module.exports=mongoose.model('wallet',WalletSchema)