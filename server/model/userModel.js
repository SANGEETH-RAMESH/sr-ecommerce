const mongoose=require('mongoose')
const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String
        
    },
    email:{ 
        type:String,
        required:true
     
    },
    mobile:{
        type:Number,
        required:true
    },
    is_delete:{
        type:Boolean,
        default:false
    },
    refferalcode:{
        type:String
    }
})
module.exports=mongoose.model('User',userSchema)