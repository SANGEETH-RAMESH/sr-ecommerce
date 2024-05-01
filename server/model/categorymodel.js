const mongoose=require('mongoose')
const categorySchema=mongoose.Schema({
    categoryname:{
        unique:true,
        type:String,
        required:true
    },
    image:{
        type:String
    },
    is_delete:{
        type:Boolean,
        default:false 
    },
    Offer:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'categoryOffer'
    }
    
})

module.exports=mongoose.model('category',categorySchema)