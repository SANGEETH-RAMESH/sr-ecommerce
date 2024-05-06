const mongoose=require('mongoose')
const CategoryOfferSchema=mongoose.Schema({
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'category'
    },
    offer:{
        type:Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expires: {
        type: Date,
        default: Date.now() + (5 * 24 * 60 * 60 * 1000) // Five days in milliseconds
    }
})

CategoryOfferSchema.index({ "createdAt": 1 }, { expireAfterSeconds: 3 * 24 * 60 * 60 });
module.exports=mongoose.model('categoryOffer',CategoryOfferSchema)