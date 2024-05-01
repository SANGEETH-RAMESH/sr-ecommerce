const mongoose=require('mongoose')
const couponSchema=mongoose.Schema({
    couponcode:{
        type:String
    },
    description:{
        type:String
    },
    minprice:{
        type:Number
    },
    discount:{
        type:Number
    },
    startdate:{
        type:Date,
        default:()=>Date.now()
    },
    expirydate:{
        type:Date,
        default:()=> Date.now()+60000
    }
})
module.exports=mongoose.model('coupon',couponSchema)