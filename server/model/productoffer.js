const mongoose=require('mongoose')
const ProductOfferSchema=mongoose.Schema({
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'product'
    },
    offer:{
        type:String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expires: {
        type: Date,
        default: Date.now() + (3 * 24 * 60 * 60 * 1000) 
    }
})

ProductOfferSchema.index({ "createdAt": 1 }, { expireAfterSeconds: 3 * 24 * 60 * 60 });

module.exports=mongoose.model('productoffer',ProductOfferSchema)