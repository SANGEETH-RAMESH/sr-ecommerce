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
        default: function() {
            // Calculate expiration date (5 days from now)
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 5);
            return expirationDate;
        },
        expires: '5d'
    }
})

module.exports=mongoose.model('productoffer',ProductOfferSchema)