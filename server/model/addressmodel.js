const mongoose = require('mongoose')
const users=require('../model/userModel')
const AddressSchema = mongoose.Schema({
    
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    address:[{
        name: {
            type: String, 
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        Zipcode: {
            type: Number,
            required: true
        },
        country: {
            type: String,
            required: true
        }
    }]
    
})

module.exports = mongoose.model('address', AddressSchema)