const mongoose=require('mongoose')



const orderSchema = mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        quantity: {
          type: String,
          required: true,
        },
        Status: {
          type: String,
          enum: ["Pending", "Shipped", "Cancelled", "Delivered", "Return"],
          default: "Pending",
        },
        reason:{
          type:String
          
        },
        price:{
          type:Number
        },
        approve:{
          type:Number,
          default:0
        },
        categoryId:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "category",
          required: true,
        }
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    address: [{
        name:{
          type:String,
          required:true
        },
        city:{
          type:String,
          required:true
        },
        state:{
          type:String,
          required:true
        },
        Zipcode:{
          type:Number,
          required:true
        },
        country:{
          type:String,
          required:true
        }
    }],
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Success", "Failed"],
      default: "Pending",
    },
    orderId: {
      type: String,
      required: true
    },
    currentDate: {
      type: Date,
      default: () => Date.now(),
    },
    discount:{
      type:Number,
      default:0
    }
  });
  
  module.exports = mongoose.model("Order", orderSchema);