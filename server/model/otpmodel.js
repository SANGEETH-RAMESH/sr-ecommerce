const mongoose=require('mongoose')
const otpSchema=mongoose.Schema({
    OTP:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
        // expires:'1m'
    },
    expires: {
        type: Date,
        default: Date.now() + (60 * 1000),
        expires: '1m' 
    }
})
module.exports=mongoose.model('otp',otpSchema)