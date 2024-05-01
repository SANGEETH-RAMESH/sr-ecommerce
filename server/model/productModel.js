const mongoose=require('mongoose')
const productSchema=mongoose.Schema({
    productname:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    image: [{
        type: String,
    }],
    description:{
        type:String,
        required:true
    },
    createdAt:{ 
        type:Date,
        default:Date.now
    },
    price:{
        type:Number,
        required:true
    },
    is_delete:{
        type:Boolean,
        default:false
    },
    categoryId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'category',
        required:true
    },
    offer:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'productoffer'
    },
    oldprice:{
        type:Number,
        default:0
    }
})

module.exports=mongoose.model('product',productSchema)