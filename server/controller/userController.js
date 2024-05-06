const User = require('../model/userModel')



const otp = require('../model/otpmodel')

const mongoose = require('mongoose')

const Product = require('../model/productModel')

const Wishlist = require('../model/wishlistmodel')

const Order = require('../model/ordermodel')

const Category = require('../model/categorymodel')
// const session=require('express-session')

// const MongoStore = require('connect-mongo')(session);

const Address = require('../model/addressmodel')

const OtpDbs = require('../model/otpmodel')

const Wallet = require('../model/walletmodel')

const path = require('path')

const ejs = require('ejs');

const puppeteer = require('puppeteer-core')

const nodemailer = require('nodemailer')

const paypal = require('paypal-rest-sdk')

const Mailgen = require('mailgen')
const Mail = require('nodemailer/lib/mailer')
const passport = require('passport')
const { user } = require('../middleware/auth')
const { ObjectId } = require('mongoose').Types;

function generateRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}



const base = async (req, res, next) => {
    try {


        const Productss = await Product.find().limit(4)
            .populate('offer')
            .populate({
                path: 'categoryId',
                populate: {
                    path: 'Offer'
                }
            })
        const Producct = await Product.find().skip(4).limit(1)
            .populate('offer')
            .populate({
                path: 'categoryId',
                populate: {
                    path: 'Offer'
                }
            })
            Productss.forEach(product=>{
                if(product?.offer!=null || product?.categoryId?.Offer!=null ){
                    if(product?.offer?.offer){
                        
                        var finalPrice=product.price;
                        
                        if(product?.categoryId?.Offer?.offer>product?.offer?.offer){
                            
                            product.oldprice=product.price
                            finalPrice=product.price-((product.categoryId.Offer.offer*product.price)/100)
                            
    
                            product.price=finalPrice
                        }
                        else{
                            
                            finalPrice=product.price-(product.price*(product.offer.offer/100))
                          
                            product.oldprice=product.price
                            
                            product.price=finalPrice
                        }
                    }
                    else if(product?.categoryId?.Offer){
                        product.oldprice=product.price
                        var newTotal=(product.price-(product.price*(product.categoryId.Offer.offer)/100))
                        
                        product.price=newTotal
                    }
                }
            })
        res.render('home', { req: req, Product: Productss, products: Producct });
    } catch (error) {
        error.statuscode = 404;
        next(error)

    }
};

const accountdetails = async (req, res, next) => {
    try {

        const Userdata = await User.findOne({ email: req.session.email })

        res.render('account-details', { req: req, user: Userdata })
    } catch (error) {
        error.statuscode = 404;
        next(error)
    }
}


const categoryname = async (req, res, next) => {
    try {
        console.log(req.query)
        const page = parseInt(req.query.page) || 1; // Current page, default to 1 if not provided
        const limit = 6;
        const count = await Product.countDocuments(); // Total number of products
        const totalPages = Math.ceil(count / limit); // Total number of pages

        const skip = (page - 1) * limit;
     
        if (req.query.query) {
           
            console.log('1')
            const query = req.query.query;


            const regex = new RegExp('^' + query, 'i');


            if (req.query.categories) {
            console.log('2')
               
                const categoryIds = req.query.categories.split(',');
                console.log(categoryIds,'hidf')
                const minPrice = req.query.minPrice;
                const maxPrice = req.query.maxPrice;

                let query = { categoryId: { $in: categoryIds } };

                if (minPrice && maxPrice) {
                    query = {
                        ...query,
                        price: { $gte: minPrice, $lte: maxPrice }
                    };
                }
                if (req.query.sortingOption == 'highToLow') {
                    
                    var s = await Product.find(query).populate('offer')
                        .populate({
                            path: 'categoryId',
                            populate: { 
                                path: 'Offer'
                            }
                        }).sort({ price: -1 })
                }
                else if (req.query.sortingOption == 'lowToHigh') {
                    var s = await Product.find(query).populate('offer')
                        .populate({
                            path: 'categoryId',
                            populate: {
                                path: 'Offer'
                            }
                        }).sort({ price: 1 })
                }
                else if (req.query.sortingOption == 'atoz') {
                    var s = await Product.find(query).populate('offer')
                        .populate({
                            path: 'categoryId',
                            populate: {
                                path: 'Offer'
                            }
                        }).sort({ productname: 1 })
                }
                else if (req.query.sortingOption == 'ztoa') {
                    var s = await Product.find(query).populate('offer')
                        .populate({
                            path: 'categoryId',
                            populate: {
                                path: 'Offer'
                            }
                        }).sort({ productname: -1 })
                }
                else {
                    var s = await Product.find(query).populate('offer')
                        .populate({
                            path: 'categoryId',
                            populate: {
                                path: 'Offer'
                            }
                        })
                }
                // var s = await Product.find(query).populate('offer')
                //     .populate({
                //         path: 'categoryId',
                //         populate: {
                //             path: 'Offer'
                //         }
                //     }).sort({ price: -1 })
            }
            else if (req.query.sortingOption == 'highToLow') {
                var s = await Product.find({}).populate('offer')
                    .populate({
                        path: 'categoryId',
                        populate: {
                            path: 'Offer'
                        }
                    }).sort({ price: -1 })
            }
            else if (req.query.sortingOption == 'lowToHigh') {
                var s = await Product.find({}).populate('offer')
                    .populate({
                        path: 'categoryId',
                        populate: {
                            path: 'Offer'
                        }
                    }).sort({ price: 1 })
            }
            else if (req.query.sortingOption == 'atoz') {
                var s = await Product.find({}).populate('offer')
                    .populate({
                        path: 'categoryId',
                        populate: {
                            path: 'Offer'
                        }
                    }).sort({ productname: 1 })
            }
            else if (req.query.sortingOption == 'ztoa') {
                var s = await Product.find({}).populate('offer')
                    .populate({
                        path: 'categoryId',
                        populate: {
                            path: 'Offer'
                        }
                    }).sort({ productname: -1 })
            }
            else if (req.query.sortingOption == 'default') {
                var s = await Product.find({}).populate('offer')
                    .populate({
                        path: 'categoryId',
                        populate: {
                            path: 'Offer'
                        }
                    })
            }

            const objectquery = s.filter(product => regex.test(product.productname.toLowerCase()));
            var Products = [...objectquery]


        }

        else if (req.query.sortingOption != 'default' && req.query.sortingOption != undefined) {
            console.log('3')
            
            if (req.query.categories) {

                const categoryIds = req.query.categories.split(',');


                let query = { categoryId: { $in: categoryIds } };

                if (req.query.sortingOption == 'lowToHigh') {

                    var Products = await Product.find(query).sort({ price: 1 }).populate('offer')
                        .populate({
                            path: 'categoryId',
                            populate: {
                                path: 'Offer'
                            }
                        })
                }
                else if (req.query.sortingOption == 'highToLow') {


                    var Products = await Product.find(query).sort({ price: -1 }).populate('offer')
                        .populate({
                            path: 'categoryId',
                            populate: {
                                path: 'Offer'
                            }
                        })
                }
                else if (req.query.sortingOption == 'atoz') {


                    var Products = await Product.find(query).sort({ productname: 1 }).populate('offer')
                        .populate({
                            path: 'categoryId',
                            populate: {
                                path: 'Offer'
                            }
                        })
                }
                else if (req.query.sortingOption == 'ztoa') {


                    var Products = await Product.find(query).sort({ productname: -1 }).populate('offer')
                        .populate({
                            path: 'categoryId',
                            populate: {
                                path: 'Offer'
                            }
                        })
                }




            }
            else
            console.log('4')

                if (req.query.categories && req.query.sortingOption) {

                    
                    const categoryIds = req.query.categories.split(',');
                    const minPrice = req.query.minPrice;
                    const maxPrice = req.query.maxPrice;

                    let query = { categoryId: { $in: categoryIds } };

                    if (minPrice && maxPrice) {
                        query = {
                            ...query,
                            price: { $gte: minPrice, $lte: maxPrice }
                        };
                    }
                    if (req.query.sortingOption == 'highToLow') {

                        var Products = await Product.find(query).sort({ price: -1 }).populate('offer')
                            .populate({
                                path: 'categoryId',
                                populate: {
                                    path: 'Offer'
                                }
                            })
                    }
                    else if (req.query.sortingOption == 'LowToHigh') {
                        var Products = await Product.find(query).sort({ price: 1 }).populate('offer')
                            .populate({
                                path: 'categoryId',
                                populate: {
                                    path: 'Offer'
                                }
                            })
                    }
                    else if (req.query.sortingOption = 'ztoa') {

                        var Products = await Product.find(query).sort({ productname: -1 }).populate('offer')
                            .populate({
                                path: 'categoryId',
                                populate: {
                                    path: 'Offer'
                                }
                            })
                    }
                    else if (req.query.sortingOption = 'atoz') {

                        var Products = await Product.find(query).sort({ productname: 1 }).populate('offer')
                            .populate({
                                path: 'categoryId',
                                populate: {
                                    path: 'Offer'
                                }
                            })
                    }



                }
                else if (req.query.minPrice && req.query.maxPrice) {
                   
                    const minPrice = req.query.minPrice;
                    const maxPrice = req.query.maxPrice;

                    let query;
                
                    if (minPrice && maxPrice) {
                        query = { price: { $gte: minPrice, $lte: maxPrice } };
                    }
                    
                    if (req.query.sortingOption == 'lowToHigh') {
                       
                        var Products = await Product.find(query).sort({ price: 1 })

                    }
                    else if (req.query.sortingOption == 'highToLow') {
                        var Products = await Product.find(query).sort({ price: -1 })

                    }
                    else if (req.query.sortingOption == 'atoz') {
                        var Products = await Product.find(query).sort({ productname: 1 })

                    }
                    else if (req.query.sortingOption == 'atoz') {
                        var Products = await Product.find(query).sort({ productname: -1 })

                    }
                    else {
                        var Products = await Product.find(query)
                    }


                }
                else {
                 
                    // var page = parseInt(req.query.page) || 1; // Current page, default to 1 if not provided
                    // const limit = 6;
                    // const count = await Product.countDocuments(); // Total number of products 

                    // var totalPages = Math.ceil(count / limit); // Total number of pages


                    // const skip = (page - 1) * limit; // Number of products to skip 

                    const sortingOption = req.query.sortingOption

                    if (sortingOption == "lowToHigh") {
                        var Products = await Product.find().sort({ price: 1 }).populate('offer')
                            .populate({
                                path: 'categoryId',
                                populate: {
                                    path: 'Offer'
                                }
                            })
                    }
                    else if (sortingOption == "highToLow") {
                        var Products = await Product.find().sort({ price: -1 }).populate('offer')
                            .populate({
                                path: 'categoryId',
                                populate: {
                                    path: 'Offer'
                                }
                            })
                    }
                    else if (sortingOption == "atoz") {
                        var Products = await Product.find().sort({ productname: 1 }).skip(skip).limit(limit).populate('offer')
                            .populate({
                                path: 'categoryId',
                                populate: {
                                    path: 'Offer'
                                }
                            })
                    }
                    else if (sortingOption == "ztoa") {
                        var Products = await Product.find().sort({ productname: -1 }).skip(skip).limit(limit).populate('offer')
                            .populate({
                                path: 'categoryId',
                                populate: {
                                    path: 'Offer'
                                }
                            })
                    }
                    else if (req.query.sortingOption = 'default') {
                        var Products = await Product.find().skip(skip).limit(limit).populate('offer')
                            .populate({
                                path: 'categoryId',
                                populate: {
                                    path: 'Offer'
                                }
                            })
                    }
                }

        }
        else if (req.query.categories) {
            

           

            const categoryIds = req.query.categories.split(',');
            const minPrice = req.query.minPrice;
            const maxPrice = req.query.maxPrice;

            let query = { categoryId: { $in: categoryIds } };

            if (minPrice && maxPrice) {
                query = {
                    ...query,
                    price: { $gte: minPrice, $lte: maxPrice }
                };
            }
           
           var Products = await Product.find(query).populate('offer')
                .populate({
                    path: 'categoryId',
                    populate: {
                        path: 'Offer'
                    }
                })
            
        
        }
        else if (req.query.minPrice & req.query.maxPrice) {

            const minPrice = req.query.minPrice;
            const maxPrice = req.query.maxPrice;
            var Products = await Product.find({ price: { $gte: minPrice, $lte: maxPrice } }).populate('offer')
                .populate({
                    path: 'categoryId',
                    populate: {
                        path: 'Offer'
                    }
                })
        }


        
        Products.forEach(product=>{
            if(product?.offer!=null || product?.categoryId?.Offer!=null ){
                if(product?.offer?.offer){
                    
                    var finalPrice=product.price;
                    
                    if(product?.categoryId?.Offer?.offer>product?.offer?.offer){
                        
                        product.oldprice=product.price
                        finalPrice=product.price-((product.categoryId.Offer.offer*product.price)/100)
                        

                        product.price=finalPrice
                        
                    }
                    else{
                        
                        finalPrice=product.price-(product.price*(product.offer.offer/100))
                        
                        product.oldprice=product.price
                        
                        product.price=finalPrice
                    }
                }
                else if(product?.categoryId?.Offer){
                    
                    product.oldprice=product.price
                    var newTotal=product.price-(product.price*(product.categoryId.Offer.offer)/100)
                    
                    product.price=newTotal
                   
                }
            }
        })
        console.log('dlfj',{Products})
        // console.log(Products,'rpdfdfd')
        if(req.query.sortingOption=='lowToHigh'){
            
           Products=Products.sort((a, b) => a.price - b.price).slice(skip, skip + limit);

        }
        else if(req.query.sortingOption=='highToLow'){
            Products=Products.sort((a, b) => b.price - a.price).slice(skip, skip + limit);
        }
        else if(req.query.sortingOption=='ztoa'){
            Products=Products
            
        }
        else if(req.query.sortingOption=='atoz'){
            Products=Products
        }
        else{
            Products=Products
        }

        const categories = await Category.find()
        const products=await Product.find()
        res.render('shop', {products, Products, req: req, totalPages, activecategory: req.query.categories, query: req.query.query, categories, currentPage: page, value: req.query.sortingOption, sortingOption: req.query.sortingOption, minprice: req.query.minPrice, maxprice: req.query.maxPrice })


    } catch (error) {
        error.statuscode = 404;
        next(error)
    }
}


const shop = async (req, res, next) => {
    try {

        const page = parseInt(req.query.page) || 1; // Current page, default to 1 if not provided
        const limit = 6;
        const count = await Product.countDocuments(); // Total number of products
        const totalPages = Math.ceil(count / limit); // Total number of pages

        const skip = (page - 1) * limit; // Number of products to skip
        const products = await Product.find()
            .skip(skip)
            .limit(limit)
            .populate('offer')
            .populate({
                path: 'categoryId',
                populate: {
                    path: 'Offer'
                }
            })

        req.session.isLogin = true;
        const isLogin = req.session.isLogin
        const Products = await Product.find();
        const categories = await Category.find().select('categoryname');
        const category = await Category.find().populate('Offer')
        products.forEach(product=>{
            if(product?.offer!=null || product?.categoryId?.Offer!=null ){
                if(product?.offer?.offer){
                    
                    var finalPrice=product.price;
                    
                    if(product?.categoryId?.Offer?.offer>product?.offer?.offer){
                        
                        product.oldprice=product.price
                        finalPrice=product.price-((product.categoryId.Offer.offer*product.price)/100)
                        

                        product.price=finalPrice
                    }
                    else{
                        
                        finalPrice=product.price-(product.price*(product.offer.offer/100))
                      
                        product.oldprice=product.price
                        
                        product.price=finalPrice
                    }
                }
                else if(product?.categoryId?.Offer){
                    product.oldprice=product.price
                    var newTotal=(product.price-(product.price*(product.categoryId.Offer.offer)/100))
                    
                    product.price=newTotal
                }
            }
        })
        // console.log(products,'prpdfdkfdhf')
        res.render('shop', {
            products:Products, isLogin, categories: categories, req: req, Products: products,
            currentPage: page,
            totalPages: totalPages, value: null,
            sortingOption: "default",
            activecategory: undefined,
            category,
            query: null,
            minprice: null,
            maxprice: null
        })
    }
    catch (error) {
        console.log(error.message)
        // error.statuscode = 404;
        next(error)
    }
}

const loginregister = async (req, res, next) => {
    try {
       
        global.refId = req.query.refId;
        req.session.isLogin == true;
        
        const isLogin = req.session.isLogin
        res.render('register', { req: req, isLogin })
    }
    catch (error) {
        error.statuscode = 404;
        next(error)
    }
}

const Loadlogin = async (req, res, next) => {
    try {

        res.render('login', { req: req })
    } catch (error) {
        error.statuscode = 404;
        next(error)
    }
}

const wishlist = async (req, res, next) => {
    try {
        const isLogin = req.session.isLogin
        const wishlist = await Wishlist.findOne({ userId: req.session._id })
            .populate({
                path: 'product.productId',
                populate: {
                    path: 'categoryId',
                    populate: {
                        path: 'Offer'
                    }
                }
            })
            .populate({
                path: 'product.productId',
                populate: {
                    path: 'offer'  // Populate the offer field within the product
                }
            });


        res.render('wishlist', { isLogin, req: req, Wishlist: wishlist })
    }
    catch (error) {
        error.statuscode = 404;
        next(error)
    }
}

const LoadAddress = async (req, res, next) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = 2;

        const addresss = await Address.findOne({ userId: req.session._id });



       
        if (addresss != null) {
            var count = addresss.address.length;
            var totalPages = Math.ceil(count / limit);
            var skip = (page - 1) * limit;

            var address = await Address.find({ userId: req.session._id }, { address: { $slice: [skip, limit] } })
            
        }
        else {
            totalPages = null
            address = null
            currentPage = null;
        }

        res.render('address', { req: req, currentPage: page, totalPages: totalPages, Address: address })
    } catch (error) {
        error.statuscode = 404;
        next(error)
    }
}

const LoadAddAddress = async (req, res, next) => {
    try {
        res.render('addaddress', { req: req })
    } catch (error) {
        error.statuscode = 404;
        next(error)
    }
}


const productdetails = async (req, res, next) => {
    try {
        res.render('product-details', { req: req })
    }
    catch (error) {
        error.statuscode = 404;
        next(error)
    }
}



const Loadchangepassword = async (req, res, next) => {
    try {
        res.render('change-password', { req: req })
    } catch (error) {
        error.statuscode = 404;
        next(error)
    }
}

const LoadOrder = async (req, res, next) => {
    try {
        // const orders=await Order.find({userId:req.session._id})

        const ObjectId = require('mongodb').ObjectId;
        const page = parseInt(req.query.page) || 1;
        const limit = 3;
        const skip = (page - 1) * limit;


        const orders = await Order.find({ userId: new ObjectId(req.session._id) }).skip(skip).limit(limit).populate('items.productId').sort({currentDate:-1})

        const counting = [
            { $match: { userId: new ObjectId(req.session._id) } },
            { $unwind: '$items' },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 }
                }
            }
        ];
        const ordercount = await Order.find({ userId: req.session._id })
        const count = ordercount.length // Total count of orders

        const totalPages = Math.ceil(count / limit); // Calculate total pages


        res.render('order', {
            req: req, orders: orders, currentPage: page,
            totalPages: totalPages
        })
    } catch (error) {
        error.statuscode = 404;
        next(error)
    }
}

const AddAddress = async (req, res, next) => {
    try {

        const Already = await Address.findOne({ userId: req.session._id })
        if (Already) {

            Already.address.push({
                name: req.body.name,
                city: req.body.city,
                state: req.body.state,
                Zipcode: req.body.zipcode,
                country: req.body.country
            });

            await Already.save();
        } else {
            const newAddress = new Address({
                address: {
                    name: req.body.name,
                    city: req.body.city,
                    state: req.body.state,
                    Zipcode: req.body.zipcode,
                    country: req.body.country
                },
                userId: req.session._id
            });
            // Save the new address document
            await newAddress.save();
        }

        res.redirect('/address')

    } catch (error) {
        error.statuscode = 404;
        next(error)
    }
}

const deleteAddress = async (req, res, next) => {
    try {
       
       

        const addresses = await Address.find({}); // Fetch all addresses

for (const address of addresses) {
    // Check if there's only one address left
    if (addresses.length === 1 && address.address.length === 1) {
        // Delete the entire address model
        await Address.deleteOne({ _id: address._id });
    } else {
        // Remove the specific address
        await Address.updateOne(
            { _id: address._id },
            { $pull: { 'address': { _id: req.params.AddressId } } }
        );
    }
}
        res.status(200).json({ success: true })
    } catch (error) {
        error.statuscode = 404;
        next(error)
    }
}



const LoadEditAddress = async (req, res, next) => {
    try {

        const AddressId = req.params.AddressId
        const address = await Address.find()
        const FindAddress = await Address.findOne({userId:req.session._id},
            { 'address': { $elemMatch: { _id: AddressId } } },
            { 'address.$': 1 }
        );

        res.render('editaddress', { Address: FindAddress, req: req })
    } catch (error) {
        error.statuscode = 404;
        next(error)
    }
}



const EditAddress = async (req, res, next) => {
    try {


        const updatedAddress = await Address.findOneAndUpdate(
            { 'address._id': req.params.AddressId }, // Find the address by its ID within the array
            {
                $set: {
                    'address.$.name': req.body.name,
                    'address.$.city': req.body.city,
                    'address.$.state': req.body.state,
                    'address.$.Zipcode': req.body.zipcode,
                    'address.$.country': req.body.country
                }
            },
            { new: true } // Return the updated document
        );
        await updatedAddress.save();

        res.redirect('/address')
    } catch (error) {
        error.statuscode = 404;
        next(error)
    }
}




const myaccounts = async (req, res, next) => {

    try {
        const isLogin = req.session.isLogin
        const user = await User.findOne({ name: req.session.name })
        res.render('my-account', { isLogin, req: req, user })
    }
    catch (error) {
        error.statuscode = 404;
        next(error)
    }
}


const handleInsertUser = async (req, res, next) => {
    try {
        // Call insertUser to handle user insertion
        await insertUser(req, res);

        // Call OTP1 after insertUser, passing globalemail as an argument
        await OTP1(req, res, globalemail);
    } catch (error) {
        error.statuscode = 404;
        next(error).error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
};

function otpgenerator() {
    return Math.floor(1000 + Math.random() * 9000);
}

function sendOtp(email, Otp) {

    let config = {
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASSWORD
        }
    }


    let transporter = nodemailer.createTransport(config)

    let MailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "Mailgen",
            link: 'http://mailgen.js/'
        }
    })


    let response = {
        body: {
            name: email,
            intro: `Your OTP is ${Otp}`,
            outro: "Thank you"
        }
    };


    let mail = MailGenerator.generate(response)

    let message = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Otp sent successfully',
        html: mail
    };


    transporter.sendMail(message);



}

let Otp;
// var globalname,globalemail,globalpassword;

const insertUser = async (req, res) => {



    try {


        const { name, email, password, mobile } = req.body;



        globalname = name

        req.session.email = email
        req.session.password = password
        req.session.name = name;
        req.session.mobile = mobile;

        const existingUser = await User.findOne({ email: email });

        if (existingUser) {

            // return res.render('Register', { message: 'Email is already registered', req: req });
            res.status(200).json({ message: 'Email is Already Registered' })
        }


        Otp = otpgenerator();

        sendOtp(email, Otp)

        const OTpdata = await otp.findOne({ email: email })
        if (OTpdata) {
            OTpdata.OTP = Otp;
            await OTpdata.save()
            res.status(200).json({ message: 'Otp Sented to Email' })

        }
        else {
            const otp1 = new otp({
                email: req.body.email,
                OTP: Otp
            })
            await otp1.save()
            res.status(200).json({ message: 'Otp Sented to Email' })

        }





    }
    catch (error) {
        console.log(error)
    }

}
const verifyLogin = async (req, res, next) => {
    try {
        console.log(global.refId)
       
        const email = req.body.email;



        const password = req.body.password

        const userData = await User.findOne({ email: email })



        if (userData) {

            if (password == userData.password) {
                if (userData.is_delete == true) {
                    res.status(200).json({ message: 'Admin has blocked' })

                }
                else {

                    req.session.isLogin = true;
                    const isLogin = req.session.isLogin
                    req.session.user = userData;
                    req.session._id = userData._id;
                    req.session.email = userData.email;
                    req.session.name = userData.name;


                    const User = req.session.user

                    res.status(200).json({ message: "Verified" })
                }

            }
            else {
                res.status(200).json({ message: 'Incorrect password' })
            }
        }
        else {
            res.status(200).json({ message: 'Incorrect email' })
        }

    }
    catch (error) {
        error.statuscode = 404;
        next(error)
    }
}

const ForgotPassword = async (req, res, next) => {
    try {

        res.render('forgotpassword', { req: req })
    } catch (error) {
        error.statuscode = 404;
        next(error)
    }
}

const ForgotPasswordOtp = async (req, res, next) => {
    try {

        const email = req.body.email;
        req.session.email = email;
        // const OTP = req.body.otp;
        // Otp
        const Otp = otpgenerator();

        sendOtp(email, Otp);
        let Otpdata = await otp.findOne({ email: email })
        if (Otpdata) {
            Otpdata.OTP = Otp;
            await Otpdata.save();
        } else {
            Otpdata = new otp({
                email: email,
                OTP: Otp
            })
            await Otpdata.save();
        }
        res.render('forgotpasswordotp', { req: req })
    } catch (error) {
        error.statuscode = 404;
        next(error)
    }
}

const LoadOtp = async (req, res) => {
    try {
        res.render('otp', { req: req })
    } catch (error) {
        console.log(error.message)
    }
}


const VerifyOtp = async (req, res, next) => {
    try {

        const email = req.session.email;
        const password = req.session.password
        const name = req.session.name;
        const mobile = req.session.mobile;
        const OTP = req.body.otp;

        const otpdata = await otp.findOne({ email: email });


        if (otpdata) {
            if (OTP == otpdata.OTP) {

                const s = generateRandomString(9)
                const newUser = new User({
                    email: email,
                    password: password,
                    name: name,
                    mobile: mobile,
                    refferalcode: s
                });
                const savedUser = await newUser.save();

                res.json({ message: 'Otp is correct' })
            } else {

                res.json({ message: "otp is incorrect" })
            }
        } else {

            res.json({ message: 'otp is expired' })
        }
    } catch (error) {
        error.statuscode = 404;
        next(error)
    }
};
// addTTLIndex(); 

const resendotp = async (req, res, next) => {
    try {

        const email = req.session.email;
        // const OTP = req.body.otp;
        // Otp
        const Otp = otpgenerator();

        sendOtp(email, Otp);

        let otpdata = await otp.findOne({ email: email });

        if (otpdata) {
            // If OTP data exists, update the OTP
            otpdata.OTP = Otp;
            otpdata = await otpdata.save();
        } else {
            // If OTP data doesn't exist, create a new OTP entry    
            otpdata = new otp({
                email: email,
                OTP: Otp
            });
            otpdata = await otpdata.save();
        }

    } catch (error) {
        error.statuscode = 404;
        next(error)
    }

}

const checkOtp = async (req, res, next) => {
    try {


        const { otp } = req.body;

        // Query the database to find a matching record
        const otpRecord = await OtpDbs.findOne({ otp });


        if (otpRecord) {
            // Valid OTP
            res.render('home', { req: req })
        } else {
            // Invalid OTP or no matching record found
            res.status(400).json({ message: "Invalid OTP" });
        }
    } catch (error) {
        error.statuscode = 404;
        next(error)
    }
};

const newpassword = async (req, res, next) => {
    try {
        res.render('newpassword', { req: req })
    } catch (error) {
        error.statuscode = 404;
        next(error)
    }
}

const checkForgotPasswordOtp = async (req, res, next) => {
    try {
        const email = req.session.email;
        const OTP = req.body.otp;

        const Otpdata = await otp.findOne({ email: email })

        if (Otpdata) {

            if (OTP == Otpdata.OTP) {
                res.json({ message: 'Otp is correct' })
            } else {
                res.json({ message: "otp is incorrect" })
            }
        } else {
            res.json({ message: 'otp is expired' })
        }
    } catch (error) {
        error.statuscode = 404;
        next(error)
    }
}

const NewPassword = async (req, res, next) => {
    try {
        const email = req.session.email

        const NewPasswordUser = await User.findOne({ email: email })
        if (NewPasswordUser) {
            NewPasswordUser.password = req.body.password;
            NewPasswordUser.save();

            req.session.destroy();

            res.redirect('/login')
        }
    } catch (error) {
        error.statuscode = 404;
        next(error)
    }
}

const UpdateAccountDetails = async (req, res, next) => {
    try {

        const Userdata = await User.findOne({ _id: req.body.userId })


        if (Userdata) {



            Userdata.name = req.body.name
            Userdata.mobile = req.body.mobile

            req.session.name = req.body.name
            await Userdata.save();

            // res.redirect('/accountdetails')
            res.json({ message: "Updated" })

        }


    } catch (error) {
        error.statuscode = 404;
        next(error)
    }
}



const LoadSingleProduct = async (req, res, next) => {
    try {

        const ProductId = req.params.ProductId

        const Products = await Product.findOne({ _id: ProductId }).populate('offer')
            .populate({
                path: 'categoryId',
                populate: {
                    path: 'Offer'
                }
            })
        const Productss = Products.categoryname;

        const p = await Product.find()

        const ProducT = await Product.find({ categoryId: Products.categoryId._id, _id: { $ne: ProductId } })

        res.render('singleproduct', { Products, ProducT, req: req })
    } catch (error) {
         error.statuscode =404;
        next(error)
    }
}

const ChangePassword = async (req, res, next) => {
    try {

        const currentpassword = req.body.currentpassword;
        const user = await User.findOne({ _id: req.session._id });
        if (user != null) {

            if (user.password == currentpassword) {

                if (user.password == req.body.password) {
                    res.json({ message: 'New Password should be different from Current Password' })
                }
                else {
                    user.password = req.body.password;

                    await user.save();
                    // Send a success response back to the client
                    var message = "Success"
                    res.status(200).json({ message });
                }

            } else {
                // Send an error response back to the client
                var message = "Current Password is Incorrect"
                res.status(200).json({ message })
            }
        }
    } catch (error) {
        error.statuscode = 404;
        next(error)
    }
}

const Logout = async (req, res, next) => {
    try {

        isLogin = false
        // req.session.user=null;
        req.session.user = null
        req.session._id = null
        req.session.email = null
        req.session.name = null

        res.redirect('/')
    } catch (error) {
        error.statuscode = 404;
        next(error)
    }
}

const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://thetimex.online/auth/google/callback",
    passReqToCallback: true
},
    function (request, accessToken, refreshToken, profile, done) {
        done(null, profile)
    }
))

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})

const success = async (req, res) => {
    req.session.user = req.user
    req.session.mobile=req.user.mobile
    const password = req.user.id;

    function MobileGenerator() {
        return Math.floor(1000000000 + Math.random() * 9000000000);
    }
    const mobile = MobileGenerator();
    const Already = await User.findOne({ email: req.user.email })

    const refferalcode = generateRandomString(9)
    const s = await User.findOne({ email: req.user.email })

    if (!Already) {
        var Signup = new User({
            name: req.user.displayName,
            email: req.user.email,
            password: password,
            mobile: mobile,
            refferalcode: refferalcode

        });
        // req.session._id = password._id,
        req.session.email = req.user.email
        req.session.name = req.user.displayName
        req.session.user = Signup;
        const n = await Signup.save();
        const New = await User.findOne({ email: req.session.email })
        req.session._id = New._id;

        res.redirect('/')
    }
    else {

        if (Already.is_delete == true) {

            res.redirect('/login')
        }
        else {

            req.session.email = s.email
            req.session._id = s._id;
            req.session.name = s.name
            req.session.user = s;

            res.redirect('/')
        }
    }






}

const OrderView = async (req, res, next) => {
    try {

        const ProductId = new ObjectId(req.params.ProductId);

        const OrderFind = await Order.findOne({userId:req.session._id, _id: req.params.OrderId }).populate('items.productId')


        const AddressFind = await Order.find({userId:req.session._id, _id: req.params.OrderId })

        const user = await User.findOne({ email: req.session.email })

        res.render('orderview', { address: AddressFind, order: OrderFind, user, req: req })
    } catch (error) {
        error.statuscode = 404;
        next(error)
    }
}

const AddtoWishlist = async (req, res, next) => {
    try {





        const Products = await Product.findOne({ _id: req.body.productId })
        const ProductData = req.body.productId

        const UserID = req.session._id
        const Already = await Wishlist.findOne({ userId: req.session._id })
        let isProductIdEqual = false;
        let ProductId;
        if (Already !== null && Already !== undefined) {

            Already.product.map((item) => {

                ProductId = item.productId;
                return ProductId;
            });
            for (const item of Already.product) {
                if (Products._id.equals(item.productId)) {
                    isProductIdEqual = true;
                    break;
                }
            }
            if (isProductIdEqual) {

                // const productIndex = Already.product.findIndex(item => item.productId.equals(Products._id));
                // Already.product[productIndex].Quantity += 1;

                // await Already.save();
                res.json({ message: "Product Already Added to Wishlist" });
            }
            else {

                // Construct the new product object
                const newProduct = {
                    productId: ProductData
                };
                // Push the new product into the product array
                Already.product.push(newProduct);
                // Save the changes to the Already object
                await Already.save();
                res.json({ message: "Product Added to Wislist" });
            }
        }
        else {

            const NewUserCart = new Wishlist({
                userId: UserID,
                product: [{
                    productId: req.body.productId
                }]
            })

            await NewUserCart.save();
            res.json({ message: "Product Added to Wislist" });
        }
    } catch (error) {
        error.statuscode = 404;
        next(error)
    }
}

const DeleteWishlist = async (req, res, next) => {
    try {


        const deleteproduct = await Wishlist.updateOne(
            { 'product.productId': req.body.ProductId },
            { $pull: { 'product': { 'productId': req.body.ProductId } } },

        )
        res.json({ message: 'Product Delete from Wishlist' })
    } catch (error) {
        error.statuscode = 404;
        next(error)
    }
}

const LoadWallet = async (req, res, next) => {
    try {

        const wallet = await Wallet.findOne({ userId: req.session._id })
        res.render('wallet', { req: req, wallet })
    } catch (error) {
        error.statuscode = 404;
        next(error)
    }
}

const LoadWalletAdd = async (req, res, next) => {
    try {

        const subtotalNumber = parseFloat(req.body.amount);

        const noFraction = subtotalNumber.toFixed(2);
        const amount = noFraction.toString();

        const paypalmethod = {
            'intent': 'sale',
            'payer': {
                'payment_method': 'paypal'
            },
            'redirect_urls': {
                'return_url': 'https://thetimex.online/addwalletsuccess',
                'cancel_url': 'https://thetimex.online/walletfailure'
            },
            'transactions': [{
                'amount': {
                    'total': amount,
                    'currency': 'USD'
                },
                'description': "Your purchase description goes here"
            }]
        };

        paypal.payment.create(paypalmethod, async function (error, payment) {
            if (error) {
                console.error('Error creating PayPal payment:', error);

                console.error('Validation details:', error.response.details);
            } else {

                req.session.amount = req.body.amount;

                // Iterate through payment links to find the approve_url
                for (let i = 0; i < payment.links.length; i++) {
                    if (payment.links[i].rel === 'approval_url') {
                        // Send the approve_url to the client
                        return res.json({ redirectUrl: payment.links[i].href });
                    }
                }
            }
        });
    } catch (error) {
        error.statuscode = 404;
        next(error)
    }
}

const AddWallet = async (req, res, next) => {
    try {

        const Addwallet = await Wallet.findOne({ userId: req.session._id })
        if (Addwallet) {
            if (Addwallet.balance && !isNaN(Addwallet.balance) && !isNaN(req.session.amount)) {
                var balance = parseInt(Addwallet.balance);
                var amount = parseInt(req.session.amount);
            }
            Addwallet.balance = balance + amount;
            const newTransaction = {
                amount: req.session.amount,
                transactiontype: "Credit",
                oldbalance: Addwallet.balance
            };
            Addwallet.Transactionhistory.push(newTransaction);
            req.session.amount = null;
            await Addwallet.save();
        }
        else {
            const newWallet = new Wallet({
                userId: req.session._id,
                balance: req.session.amount,
                Transactionhistory: [{
                    amount: req.session.amount,
                    transactiontype: 'Credit ',
                    oldbalance: req.session.amount
                }]
            })
            req.session.amount = null;
            await newWallet.save();
        }
        res.redirect('/loadwallet')

    } catch (error) {
        error.statuscode = 404;
        next(error)
    }
}

const loadWalletWithdraw = async (req, res, next) => {
    try {

        const UserFind = await Wallet.findOne({ userId: req.session._id })
        if (req.body.amount && !isNaN(req.body.amount)) {
            // Convert req.body.amount to a number
            const amountToSubtract = parseInt(req.body.amount);

            // Subtract the amount from the balance
            UserFind.balance -= amountToSubtract;
            const newTransaction = {
                amount: amountToSubtract,
                transactiontype: "Debit",
                oldbalance: UserFind.balance
            };
            UserFind.Transactionhistory.push(newTransaction);
            // Save the updated document to the database
            await UserFind.save();
        }
        res.json({ message: success })
    } catch (error) {
        error.statuscode = 404;
        next(error)
    }
}

const WithdrawWallet = async (req, res, next) => {
    try {

    } catch (error) {
        error.statuscode = 404;
        next(error)
    }
}

const WalletFailure = async (req, res) => {
    try {
        res.redirect('/loadwallet')
    } catch (error) {
        next(error)
    }
}

const LoadWalletHistory = async (req, res, next) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = 6;
        const wallet = await Wallet.findOne({ userId: req.session._id });
     
        if (wallet == null) {
            var count = null
            var totalPages = null
            var skip = null
            var UserFind = null
        }
        else {
            var count = wallet.Transactionhistory.length;
            var totalPages = Math.ceil(count / limit);
            var skip = (page - 1) * limit;
            var UserFind = await Wallet.findOne({ userId: req.session._id }, { Transactionhistory: { $slice: [skip, limit] } });
        }


        res.render('wallethistory', {
            req: req, history: UserFind, currentPage: page,
            totalPages: totalPages
        })
    } catch (error) {
        error.statuscode = 404;
        next(error)
    }
}

const Hi = async (req, res, next) => {
    try {

        res.render('new')
    } catch (error) {
        error.statuscode = 404;
        next(error)
    }
}

const InvoiceGenerate = async (req, res, next) => {
    try {


        const FindOrder = await Order.findOne(
            { _id: req.query.orderId, 'items': { $elemMatch: { productId: req.query.productId } } },
            { 'items.$': 1 }
        ).populate('items.productId')
        const OrderDetails = await Order.findOne({ _id: req.query.orderId }).populate('userId')
        const data = {
            Orders: OrderDetails,
            Products: FindOrder,
        }
        // Render the EJS template
        const ejsTemplate = path.resolve(__dirname, "../../views/users/invoice1.ejs");
        const ejsData = await ejs.renderFile(ejsTemplate, data);

        const browser = await puppeteer.launch({ 
            headless: "new",
            executablePath: '/snap/bin/chromium',
        });
        const page = await browser.newPage();
        await page.setContent(ejsData, { waitUntil: "networkidle0" });
        const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

        // Close the browser
        await browser.close();

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "inline; filename=order_invoice.pdf");
        res.send(pdfBuffer);

    } catch (error) {
        error.statuscode = 404;
        next(error)
    }
}

const SendOtpAddress = async (req, res, next) => {
    try {

        const AlreadyUserEmail = await User.findOne({ email: req.body.email })
        const UserEmail = await User.findOne({ email: req.session.email })

        if (AlreadyUserEmail === null) {
            res.json({ message: 'Enter current email' })
        }
        else if (req.body.email == AlreadyUserEmail.email && String(UserEmail._id) !== String(AlreadyUserEmail._id)) {
            res.json({ message: "Already Exists" })
        }
        else if (UserEmail.email == req.session.email) {

            const OTPP = otpgenerator();

            const email = req.body.email
            req.session.emailchange = req.body.email
            sendOtp(email, OTPP)
            const Already = await otp.findOne({ email: req.body.email })
            if (Already) {
                Already.OTP = OTPP;
                await Already.save();
            } else {
                const Otpsaving = new otp({
                    email: req.body.email,
                    OTP: OTPP
                })
                await Otpsaving.save();
            }


            res.json({ message: 'Not Exist' })
        }

    } catch (error) {
        console.log(error)
    }
}

const resendOtpEmail = async (req, res, next) => {
    try {

        const email = req.session.emailchange;

        const Otp = otpgenerator();

        sendOtp(email, Otp);

        let otpdata = await otp.findOne({ email: email });

        if (otpdata) {
            // If OTP data exists, update the OTP
            otpdata.OTP = Otp;
            otpdata = await otpdata.save();
        } else {
            // If OTP data doesn't exist, create a new OTP entry    
            otpdata = new otp({
                email: email,
                OTP: Otp
            });
            otpdata = await otpdata.save();
        }


        res.json({ message: 'OTP sented' })
    } catch (error) {
        console.log(error)
    }
}

const OtpVerifyEmail = async (req, res, next) => {
    try {

        const email = req.session.emailchange
        const OTp = req.body.otpInputValue
        const Otpverify = await otp.findOne({ email: req.session.emailchange })

        if (Otpverify) {
            if (Otpverify.OTP == OTp) {
                res.json({ message: 'Otp verified' })
            }
            else {
                res.json({ message: 'Incorrect Otp' })
            }
        }
        else {
            res.json({ message: 'Otp Expired' })
        }
    } catch (error) {
        console.log(error)
    }
}

const ChangeEmail = async (req, res, next) => {
    try {

        const EmailCheck = await User.findOne({ email: req.session.emailchange })
        const EmailChange = await User.findOne({ email: req.session.email })

        if (EmailCheck) {
            if (EmailCheck.email == req.body.email) {

                res.json({ message: "Cannot be current email" })
            }
            else {

                EmailChange.email = req.body.email;
                req.session.email = req.body.email;
                await EmailChange.save();
                res.json({ message: 'Not Current Email' })

            }
        }
    } catch (error) {
        console.log(error)
    }
}

const LoadRefferal = async (req, res, next) => {
    try {
        const Refferralcode = await User.findOne({ _id: req.session._id })
        res.render('refferal', { req: req, Refferralcode })
    } catch (error) {
        console.log(error)
    }
}

const LoadOrderPlacedFailure = async (req, res) => {
    try {
        const orderplaced = await Order.findOne({}).sort({ currentDate: -1 })
        res.render('orderplacedfailure', { req: req, Order: orderplaced })
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    base,
    shop,
    loginregister,
    wishlist,
    productdetails,

    Loadlogin,
    myaccounts,
    Loadchangepassword,
    LoadOrder,
    AddtoWishlist,
    DeleteWishlist,

    LoadAddress,
    LoadAddAddress,
    accountdetails,
    LoadOtp,
    AddAddress,
    deleteAddress,
    LoadEditAddress,
    EditAddress,
    insertUser,
    checkOtp,
    UpdateAccountDetails,
    newpassword,
    VerifyOtp,
    handleInsertUser,
    resendotp,
    checkForgotPasswordOtp,
    NewPassword,

    verifyLogin,
    categoryname,
    ForgotPassword,
    LoadSingleProduct,
    ChangePassword,
    ForgotPasswordOtp,
    Logout,
    OrderView,
    success,
    LoadWallet,
    WalletFailure,
    LoadWalletAdd,
    AddWallet,
    loadWalletWithdraw,
    WithdrawWallet,
    LoadWalletHistory,
    Hi,
    InvoiceGenerate,
    SendOtpAddress,
    resendOtpEmail,
    OtpVerifyEmail,
    ChangeEmail,
    LoadRefferal,
    LoadOrderPlacedFailure
}