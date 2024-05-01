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
        default: function() {
            // Calculate expiration date (3 days from now)
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 3);
            return expirationDate;
        },
        expires: 259200 // 3 days in seconds (3 * 24 * 60 * 60)
    }
})
module.exports=mongoose.model('categoryOffer',CategoryOfferSchema)