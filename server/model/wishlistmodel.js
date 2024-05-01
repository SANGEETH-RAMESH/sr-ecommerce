const mongoose=require('mongoose')
const WishlistSchema=mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
      product: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
            required: true,
          }
        },
      ],
})

module.exports=mongoose.model('wishlist',WishlistSchema)