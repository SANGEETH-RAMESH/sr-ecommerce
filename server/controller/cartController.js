

const Product = require('../model/productModel')

const Coupon = require('../model/couponmodel')

const Order = require('../model/ordermodel')

const Address = require('../model/addressmodel')

const paypal = require('paypal-rest-sdk')

const mongoose = require('mongoose');

const { ObjectId } = require('mongoose').Types;

// const { EMAIL, PASSWORD } = require('../env/env')

const Cart = require('../model/cartmodel')

const Wallet = require('../model/walletmodel')

const User = require('../model/userModel')

const Wishlist = require('../model/wishlistmodel')

console.log(process.env.client_id,'dfdfd')
console.log(process.env.client_secret,'dfdfdsfdfdfdf')


paypal.configure({
    'mode': 'sandbox',
    'client_id': process.env.client_id,
    'client_secret': process.env.client_secret
    
})


const cart = async (req, res) => {
    try {
        const isLogin = req.session.isLogin

        const cart = await Cart.findOne({ userId: req.session._id })
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



        res.render('cart', { isLogin, req: req, Products: cart })
    }
    catch (error) {
        console.log(error)
        next(error)
    }
}

const CartUpdate = async (req, res, next) => {
    try {

        const ProductData = req.body.ProductId;
        const Userdata = await Cart.findOne({ userId: req.session._id })
        const ProductDetails = await Product.findOne({ _id: req.body.ProductId })
        Userdata.product.forEach(item => {
            if (ProductData == item.productId) {

                item.Quantity = req.body.quantity;


                Userdata.save();

                let success = "jhj"
                res.json({ success: true, quantity: item.Quantity })

            }
        })


    } catch (error) {
        console.log(error.message)
        next(error)
    }
}

const deleteCart = async (req, res) => {
    try {


        const deleteproduct = await Cart.updateOne(
            { 'product.productId': req.body.ProductId },
            { $pull: { 'product': { 'productId': req.body.ProductId } } }
        )

        res.json({ success: true })

    } catch (error) {
        console.log(error.message)
        next(error)
    }
}

const deleteFullCart = async (req, res, next) => {
    try {


        const deleteFullCart = await Cart.findOneAndDelete({ _id: req.body.ProductId })

        res.json({ success: true })
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}

const DeleteFullWishlist = async (req, res, next) => {
    try {

        const deletefullwishlist = await Wishlist.findOneAndDelete({ _id: req.body.ProductId })

        res.json({ message: "Deleted" })
    } catch (error) {
        next(error)
    }
}

const LoadCheckOutEditAddress = async (req, res) => {
    try {

        const AddressId = req.params.AddressId
        const address = await Address.findOne(
            { 'address': { $elemMatch: { _id: AddressId } } },
            { 'address.$': 1 }
        );
        res.render('checkouteditaddress', { Address: address, req: req })
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}

const EditCheckoutAddress = async (req, res) => {
    try {

        const updatedAddress = await Address.findOneAndUpdate(
            { 'address._id': req.params.AddressId },
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

        res.redirect('/checkout')

    } catch (error) {
        console.log(error.message)
        next(error)
    }
}


const RemoveCoupon = async (req, res) => {
    try {
        req.session.coupon = null
        req.session.discount = null
        res.json({ message: 'success' })
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}

const CheckCoupon = async (req, res) => {
    try {

        const CheckCoupon = await Coupon.findOne({ couponcode: req.body.couponCode })
        if (CheckCoupon) {
            if (CheckCoupon.minprice < req.body.subtotal) {
                req.session.coupon = CheckCoupon.couponcode
                req.session.discount = CheckCoupon.discount;
                req.session.minprice = CheckCoupon.minprice
                res.json({ success: true, message: "Coupon Applied" });
            } else {
                res.json({ success: false, message: 'Coupon Cannot Applied' });
            }
        }
        else {
            res.json({ message: 'No Coupons' })
        }

    } catch (error) {
        console.log(error.message)
        next(error)
    }
}

const AddtoCart = async (req, res) => {
    try {

        const Products = await Product.findOne({ _id: req.body.id })
        const ProductData = req.body.id

        const UserID = req.session._id
        const Already = await Cart.findOne({ userId: req.session._id })
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
                res.json({ message: "Product Already Added to cart" });
            }
            else {

                const newProduct = {
                    productId: ProductData,
                    Quantity: 1
                };
                // Push the new product into the product array
                Already.product.push(newProduct);
                // Save the changes to the Already object
                await Already.save();
                res.json({ message: "Product Added to cart" });
            }
        }
        else {

            const NewUserCart = new Cart({
                userId: UserID,
                product: [{
                    productId: req.body.id,
                    Quantity: 1
                }]
            })
            await NewUserCart.save();
            res.json({ message: "Product Added to cart" });
        }

    } catch (error) {
        console.log(error)
        next(error)
    }
}

const LoadCheckoutAddAddress = async (req, res) => {
    try {
        res.render('checkoutaddaddress', { req: req })
    } catch (error) {
        console.log(error.message)
    }
}

const AddCheckoutAddress = async (req, res) => {
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
        res.redirect('/checkout')
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}

const checkout = async (req, res, next) => {
    try {

        const isLogin = req.session.isLogin
        const cart = await Cart.findOne({ userId: req.session._id }).populate({
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



        const page = parseInt(req.query.page) || 1;
        const limit = 2;
        const wallet = await Address.findOne({ userId: req.session._id });
        if (wallet != null) {
            var count = wallet.address.length;

        }
        else {
            count = 1;
        }
        const totalPages = Math.ceil(count / limit);
        const skip = (page - 1) * limit;



        const address = await Address.find({ userId: req.session._id }, { address: { $slice: [skip, limit] } })



        const coupon = await Coupon.find();

        res.render('checkout', { Address: address, coupon, currentPage: page, totalPages: totalPages, Products: cart, isLogin, req: req })
    }
    catch (error) {
        console.log(error)
        next(error)
    }
}

function OrderIdgenerator() {
    return Math.floor(10000000 + Math.random() * 90000000);
}

const OrderPlaced = async (req, res, next) => {
    try {


        req.session.coupon = null
        const { selectedAddress, paymentMethod, subtotal, products, discount } = req.body;


        if (paymentMethod == 'paypal') {
            const productsArray = req.body.products


            const productIds = productsArray.map(product => product.productId);


            const products = await Product.find({ _id: { $in: productIds } });


            let availability = true; // Initialize availability to true

            products.forEach(product => {
                productsArray.forEach(productid => {
                    const productIdFromString = new ObjectId(productid.productId);
                    if (productIdFromString.equals(product._id)) {

                        if (productid.quantity > product.quantity) {
                            availability = false; // If any product is not available, set availability to false
                        }
                    }
                });
            });

            if (availability) {
                const subtotalNumber = parseFloat(subtotal);

                const noFraction = subtotalNumber.toFixed(2);
                const amount = noFraction.toString();
                console.log('hdfld')
                console.log(amount,'dfd')
                const paypalmethod = {
                    'intent': 'sale',
                    'payer': {
                        'payment_method': 'paypal'
                    },
                    'redirect_urls': {
                        'return_url': 'https://thetimex.online/success',
                        'cancel_url': 'https://thetimex.online/failure'
                    },
                    'transactions': [{
                        'amount': {
                            'total': amount,
                            'currency': 'USD'
                        },
                        'description': "Your purchase description goes here"
                    }]
                };
                console.log(paypalmethod,'payment')
                paypal.payment.create(paypalmethod, async function (error, payment) {
                    if (error) {
                        console.error('Error creating PayPal payment:', error);

                        console.error('Validation details:', error.response.details);
                    } else {

                        console.log('dfldfldjfldfjlkdfjkdfjdk')

                        req.session.discount1 = req.body.discount;
                        req.session.address = req.body.selectedAddress;
                        req.session.paymentMethod = req.body.paymentMethod,
                            req.session.total = req.body.subtotal;
                        req.session.products = req.body.products;
                        // Iterate through payment links to find the approve_url
                        for (let i = 0; i < payment.links.length; i++) {
                            if (payment.links[i].rel === 'approval_url') {
                                // Send the approve_url to the client
                                return res.json({ redirectUrl: payment.links[i].href });
                            }
                        }
                    }
                });

            }
            else {
                res.json({ message: 'Some Products are not available' })
            }


        }


        if (paymentMethod == "wallet") {

            const userCheck = await Order.findOne({ userId: req.session._id })
            if (global.refId) {
                if (!userCheck) {


                    const walletCheck = await Wallet.findOne({ userId: req.session._id })
                    if (walletCheck) {

                        walletCheck.balance = walletCheck.balance + 50;


                        const newbalance = walletCheck.balance
                        const newTransaction = {
                            amount: 50,
                            transactiontype: "Credit",
                            oldbalance: newbalance
                        };

                        walletCheck.Transactionhistory.push(newTransaction);

                        await walletCheck.save();

                    } else {
                        var RefferalWallet = new Wallet({
                            userId: req.session._id,
                            balance: 50,
                            Transactionhistory: [{
                                amount: 50,
                                transactiontype: 'Credit ',
                                oldbalance: 50
                            }]
                        })


                        await RefferalWallet.save();

                    }

                    const RefferalAmount = await User.findOne({ refferalcode: global.refId })

                    var WalletAdding = await Wallet.findOne({ userId: RefferalAmount._id })

                    var balance = parseInt(WalletAdding.balance);







                    if (WalletAdding) {


                        var amount = 100
                        WalletAdding.balance = WalletAdding.balance + amount;

                        const newTransaction = {
                            amount: 100,
                            transactiontype: "Credit",
                            oldbalance: WalletAdding.balance
                        };

                        WalletAdding.Transactionhistory.push(newTransaction);

                        await WalletAdding.save();
                    }
                    else {
                        const Amounts = 100
                        const CreateWallet = new Wallet({
                            userId: RefferalAmount._id,
                            balance: Amounts,
                            Transactionhistory: [{
                                amount: Amounts,
                                transactiontype: 'Credit ',
                                oldbalance: Amounts
                            }]
                        })


                        await CreateWallet.save();

                    }




                    global.refId = null;
                }
            }
            const productsArray = req.body.products


            const productIds = productsArray.map(product => product.productId);


            const products = await Product.find({ _id: { $in: productIds } });

            let availability = true; // Initialize availability to true

            products.forEach(product => {
                productsArray.forEach(productid => {
                    const productIdFromString = new ObjectId(productid.productId);
                    if (productIdFromString.equals(product._id)) {

                        if (productid.quantity > product.quantity) {
                            availability = false; // If any product is not available, set availability to false
                        }
                    }
                });
            });


            if (availability) {
                const total = req.body.subtotal;
                const Wallettotal = await Wallet.findOne({ userId: req.session._id })

                if (total > Wallettotal.balance) {
                    res.json({ message: `Insufficient Balance, Wallet Balance is ${Wallettotal.balance}` });
                }
                else {


                    var items = []
                    const Productttss = req.body.products

                    for (const product of Productttss) {

                        try {
                            const Productfind = await Product.findOne({ _id: product.productId });

                            if (Productfind) {
                                product.categoryId = Productfind.categoryId.toString();;
                                items.push(product);
                            }
                        } catch (error) {
                            console.error("Error finding product:", error);
                        }
                    }


                    const address = await Address.findOne(
                        { 'address': { $elemMatch: { _id: selectedAddress } } },
                        { 'address.$': 1 }
                    );

                    const SelectAddress = {
                        name: address.address[0].name,
                        city: address.address[0].city,
                        Zipcode: address.address[0].Zipcode,
                        state: address.address[0].state,
                        country: address.address[0].country
                    };
                    const UserFind = await Wallet.findOne({ userId: req.session._id })
                    if (req.body.subtotal && !isNaN(req.body.subtotal)) {
                        // Convert req.body.amount to a number
                        const amountToSubtract = parseInt(req.body.subtotal);

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

                    const OrderId = OrderIdgenerator();

                    const OrderResult = new Order({
                        userId: req.session._id,
                        items: Productttss,
                        totalAmount: subtotal,
                        paymentMethod: paymentMethod,
                        address: SelectAddress,
                        orderId: OrderId,
                        discount: discount,
                        paymentStatus: "Success",

                    })

                    const userdata = await Cart.findOneAndDelete({ userId: req.session._id })
                    await OrderResult.save();

                    for (const item of Productttss) {
                        const productId = item.productId; 
                        const quantity = item.quantity;

                        // Find the product by productId
                        const product = await Product.findById(productId);

                        // Check if product exists and if decrementing by quantity will result in a non-negative quantity
                        if (product && product.quantity - quantity >= 0) {
                            // Update the quantity by decrementing it
                            product.quantity -= quantity;
                            await product.save();
                            res.json({ message: "Order Placed" })
                        }

                    }

                }
            } else {


                res.json({ message: "Some Products are not available" })
            }

        }






        if (paymentMethod == 'Cash On Delivery') {

            const userCheck = await Order.findOne({ userId: req.session._id })
            if (global.refId) {
                if (!userCheck) {


                    const walletCheck = await Wallet.findOne({ userId: req.session._id })
                    if (walletCheck) {

                        walletCheck.balance = walletCheck.balance + 50;


                        const newTransaction = {
                            amount: 50,
                            transactiontype: "Credit",
                            oldbalance: walletCheck.balance - amount
                        };

                        walletCheck.Transactionhistory.push(newTransaction);

                        await walletCheck.save();

                    } else {
                        var RefferalWallet = new Wallet({
                            userId: req.session._id,
                            balance: 50,
                            Transactionhistory: [{
                                amount: 50,
                                transactiontype: 'Credit ',
                                oldbalance: 50
                            }]
                        })


                        await RefferalWallet.save();

                    }

                    const RefferalAmount = await User.findOne({ refferalcode: global.refId })

                    const WalletAdding = await Wallet.findOne({ userId: RefferalAmount._id })

                    if (WalletAdding) {


                        var amount = 100
                        WalletAdding.balance = WalletAdding.balance + amount;

                        const newTransaction = {
                            amount: 100,
                            transactiontype: "Credit",
                            oldbalance: WalletAdding.balance
                        };

                        WalletAdding.Transactionhistory.push(newTransaction);

                        await WalletAdding.save();
                    }
                    else {
                        const Amounts = 100
                        const CreateWallet = new Wallet({
                            userId: RefferalAmount._id,
                            balance: Amounts,
                            Transactionhistory: [{
                                amount: Amounts,
                                transactiontype: 'Credit ',
                                oldbalance: Amounts
                            }]
                        })


                        await CreateWallet.save();

                    }



                    global.refId = null;
                    console.log(global.refId, 'global')
                }
            }
            const productsArray = req.body.products


            const productIds = productsArray.map(product => product.productId);


            const products = await Product.find({ _id: { $in: productIds } });

            let availability = true; // Initialize availability to true

            products.forEach(product => {
                productsArray.forEach(productid => {
                    const productIdFromString = new ObjectId(productid.productId);
                    if (productIdFromString.equals(product._id)) {

                        if (productid.quantity > product.quantity) {
                            availability = false; // If any product is not available, set availability to false
                        }
                    }
                });
            });
            if (availability) {
                var items = []
                const Productttss = req.body.products

                for (const product of Productttss) {

                    try {
                        const Productfind = await Product.findOne({ _id: product.productId });

                        if (Productfind) {
                            product.categoryId = Productfind.categoryId.toString();;
                            items.push(product);
                        }
                    } catch (error) {
                        console.error("Error finding product:", error);
                    }
                }


                const address = await Address.findOne(
                    { 'address': { $elemMatch: { _id: selectedAddress } } },
                    { 'address.$': 1 }
                );

                const SelectAddress = {
                    name: address.address[0].name,
                    city: address.address[0].city,
                    Zipcode: address.address[0].Zipcode,
                    state: address.address[0].state,
                    country: address.address[0].country
                };

                const OrderId = OrderIdgenerator();

                const OrderResult = new Order({
                    userId: req.session._id,
                    items: Productttss,
                    totalAmount: subtotal,
                    paymentMethod: paymentMethod,
                    address: SelectAddress,
                    orderId: OrderId,
                    discount: discount

                })
                const userdata = await Cart.findOneAndDelete({ userId: req.session._id })
                await OrderResult.save();
                for (const item of Productttss) {
                    const productId = item.productId;
                    const quantity = item.quantity;

                    // Find the product by productId
                    const product = await Product.findById(productId);

                    // Check if product exists and if decrementing by quantity will result in a non-negative quantity
                    if (product && product.quantity - quantity >= 0) {
                        // Update the quantity by decrementing it
                        product.quantity -= quantity;
                        await product.save();
                        res.json({ message: "Order Placed" })
                    }

                }



            } else {
                res.json({ message: "Some Products are not available" })
            }

        }







    } catch (error) {
        console.log(error.message)
        next(error)
    }
}

const LoadOrderPlace = async (req, res) => {
    try {
        const orderplaced = await Order.findOne({}).sort({ currentDate: -1 })

        res.render('orderplaced', { Order: orderplaced, req: req })
    } catch (error) {
        console.log(error.message)
    }
}

const cancelOrder = async (req, res) => {
    try {

        const productfind = await Product.findOne({ _id: req.body.productId })
        const checkingProduct = await Order.findOne({ _id: req.body.orderId })
        if (checkingProduct) {
            checkingProduct.items.forEach(item => {
                if (item.productId.toString() === req.body.productId) {
                   
                    global.total=item.quantity*item.price
                    item.Status = 'Cancelled'
                    
                    item.reason = req.body.cancellationReason



                    productfind.quantity = parseInt(productfind.quantity) + parseInt(item.quantity);

                }

            })
            await checkingProduct.save();
        }
        
        await productfind.save();
        if(checkingProduct.paymentMethod=='paypal' || checkingProduct.paymentMethod=='wallet'){
        
            const walletCheck = await Wallet.findOne({ userId: req.session._id })
        if (walletCheck) {

            walletCheck.balance = walletCheck.balance + global.total;


            const newbalance = walletCheck.balance - global.total;
            const newTransaction = {
                amount: global.total,
                transactiontype: "Credit",
                oldbalance: newbalance
            };

            walletCheck.Transactionhistory.push(newTransaction);

            await walletCheck.save();

        } else {
            var RefferalWallet = new Wallet({
                userId: req.session._id,
                balance: global.total,
                Transactionhistory: [{
                    amount: global.total,
                    transactiontype: 'Credit ',
                    oldbalance: global.total
                }]
            })


            await RefferalWallet.save();

        }
        }
        
        global.total=null;
        res.json({ success: true })


    } catch (error) {
        console.log(error.message)
    }
}

const returnOrder = async (req, res) => {
    try {

        const Productfind = await Product.findOne({ _id: req.body.productId })
        const AlreadyProduct = await Order.findOne({ _id: req.body.orderId })

        if (AlreadyProduct) {
            AlreadyProduct.items.forEach(item => {
                if (item.productId == req.body.productId) {

                    if (item.approve == 0) {
                        item.Status = 'Delivered'
                        item.approve = 1;
                        item.reason = req.body.returnReason
                        req.session.returnreason = req.body.returnReason

                    } else if (item.approve == 2) {

                        item.Status = 'Delivered'
                        item.reason = req.body.returnReason
                    }
                    else if (item.approve == 3) {

                        item.Status = 'Return'

                        if (item.reason != 'Item damaged') {
                            Productfind.quantity = parseInt(Productfind.quantity) + parseInt(item.quantity);
                        }


                    }

                }

            })
            await Productfind.save();
            await AlreadyProduct.save();
            res.json({ success: true })
        }
    } catch (error) {
        console.log(error.message)
    }
}

const OrderSuccess = async (req, res) => {
    try {

        const userCheck = await Order.findOne({ userId: req.session._id })
        console.log(global.refId, 'sangee')
        if (global.refId) {
            if (!userCheck) {


                const walletCheck = await Wallet.findOne({ userId: req.session._id })
                if (walletCheck) {

                    walletCheck.balance = walletCheck.balance + 50;


                    const newTransaction = {
                        amount: 50,
                        transactiontype: "Credit",
                        oldbalance: walletCheck.balance - amount
                    };

                    walletCheck.Transactionhistory.push(newTransaction);

                    await walletCheck.save();

                } else {
                    var RefferalWallet = new Wallet({
                        userId: req.session._id,
                        balance: 50,
                        Transactionhistory: [{
                            amount: 50,
                            transactiontype: 'Credit ',
                            oldbalance: 50
                        }]
                    })


                    await RefferalWallet.save();

                }

                const RefferalAmount = await User.findOne({ refferalcode: global.refId })

                const WalletAdding = await Wallet.findOne({ userId: RefferalAmount._id })

                if (WalletAdding) {


                    var amount = 100
                    WalletAdding.balance = WalletAdding.balance + amount;

                    const newTransaction = {
                        amount: 100,
                        transactiontype: "Credit",
                        oldbalance: WalletAdding.balance
                    };

                    WalletAdding.Transactionhistory.push(newTransaction);

                    await WalletAdding.save();
                }
                else {
                    const Amounts = 100
                    const CreateWallet = new Wallet({
                        userId: RefferalAmount._id,
                        balance: Amounts,
                        Transactionhistory: [{
                            amount: Amounts,
                            transactiontype: 'Credit ',
                            oldbalance: Amounts
                        }]
                    })


                    await CreateWallet.save();

                }



                global.refId = null;
            }
        }
        console.log("keridfh")
        const Productttss = req.session.products

        const productIds = Productttss.map(product => product.productId);

        let availability = true;

        const products = await Product.find({ _id: { $in: productIds } });

        products.forEach(product => {
            Productttss.forEach(productid => {
                const productIdFromString = new ObjectId(productid.productId);
                if (productIdFromString.equals(product._id)) {

                    if (productid.quantity > product.quantity) {
                        availability = false; // If any product is not available, set availability to false
                    }
                }
            });
        });

        if (availability) {
            var items = []
            for (const product of Productttss) {

                try {
                    const Productfind = await Product.findOne({ _id: product.productId });

                    if (Productfind) {
                        // Assign categoryId to product object's property
                        product.categoryId = Productfind.categoryId.toString();
                    }
                } catch (error) {
                    console.error("Error finding product:", error);
                }
            }
            const address = await Address.findOne({ userId: req.session._id, 'address._id': req.session.address }, { 'address.$': 1 })

            const SelectAddress = {
                name: address.address[0].name,
                city: address.address[0].city,
                Zipcode: address.address[0].Zipcode,
                state: address.address[0].state,
                country: address.address[0].country
            };

            const OrderId = OrderIdgenerator();

            const OrderResult = new Order({
                userId: req.session._id,
                items: Productttss,
                totalAmount: req.session.total,
                paymentMethod: req.session.paymentMethod,
                address: SelectAddress,
                discount: req.session.discount1,
                paymentStatus: "Success",
                orderId: OrderId

            })
            const userdata = await Cart.findOneAndDelete({ userId: req.session._id })

            await OrderResult.save();
            for (const item of Productttss) {
                const productId = item.productId;
                const quantity = item.quantity;

                // Find the product by productId
                const product = await Product.findById(productId);
                req.session.address = null;
                req.session.paymentMethod = null;
                req.session.total = null;
                req.session.products = null;
                req.session.discount1 = null
                // Check if product exists and if decrementing by quantity will result in a non-negative quantity
                if (product && product.quantity - quantity >= 0) {
                    // Update the quantity by decrementing it
                    product.quantity -= quantity;

                    await product.save();
                    res.redirect('/loadorderplaced')
                }


            }

        }
        else {
            res.redirect('/checkout')
        }




    } catch (error) {
        console.log(error.message)
    }
}

const OrderFailure = async (req, res) => {
    try {

        var items = []
        
        const Productttss = req.session.products

        for (const product of Productttss) {

            try {
                const Productfind = await Product.findOne({ _id: product.productId });

                if (Productfind) {
                    product.categoryId = Productfind.categoryId.toString();
                }
            } catch (error) {
                console.error("Error finding product:", error);
            }
        }




        const address = await Address.findOne({ userId: req.session._id, 'address._id': req.session.address }, { 'address.$': 1 })

        const SelectAddress = {
            name: address.address[0].name,
            city: address.address[0].city,
            Zipcode: address.address[0].Zipcode,
            state: address.address[0].state,
            country: address.address[0].country
        };

        const OrderId = OrderIdgenerator();

        const OrderResult = new Order({
            userId: req.session._id,
            items: Productttss,
            totalAmount: req.session.total,
            paymentMethod: req.session.paymentMethod,
            address: SelectAddress,
            discount: req.session.discount1,
            paymentStatus: "Pending",
            orderId: OrderId

        })
        const userdata = await Cart.findOneAndDelete({ userId: req.session._id })

        await OrderResult.save();
        for (const item of Productttss) {
            const productId = item.productId;
            const quantity = item.quantity;

            // Find the product by productId
            const product = await Product.findById(productId);
            req.session.address = null;
            req.session.paymentMethod = null;
            req.session.total = null;
            req.session.products = null;
            req.session.discount1 = null
            // Check if product exists and if decrementing by quantity will result in a non-negative quantity
            if (product && product.quantity - quantity >= 0) {
                // Update the quantity by decrementing it
                product.quantity -= quantity;

                await product.save();
                res.redirect('/orderplacedfailure')
            }


        }

    } catch (error) {
        console.log(error.message)
    }
}

const FailedPaymentRepay = async (req, res) => {
    try {

        const OrderDetail = await Order.findOne({ _id: req.body.orderId })


        let subtotal = 0;
        OrderDetail.items.forEach(item => {
            subtotal += item.price
        })

        const subtotalNumber = parseFloat(subtotal);

        const noFraction = subtotalNumber.toFixed(2);
        const amount = noFraction.toString();

        const paypalmethod = {
            'intent': 'sale',
            'payer': {
                'payment_method': 'paypal'
            },
            'redirect_urls': {
                'return_url': 'http://localhost:4049/repaysuccess',
                'cancel_url': 'http://localhost:4049/repayfailure'
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
                // return res.status(500).send('Failed to create PayPal payment');
                console.error('Validation details:', error.response.details);
            } else {
                req.session.OrderId = req.body.orderId

                for (let i = 0; i < payment.links.length; i++) {
                    if (payment.links[i].rel === 'approval_url') {
                        // Send the approve_url to the client

                        return res.json({ redirectUrl: payment.links[i].href });
                    }
                }
            }
        });
    } catch (error) {
        console.log(error.message)
    }
}

const Repaysuccess = async (req, res) => {
    try {

        const OrderPaymentSuccess = await Order.findOne({ _id: req.session.OrderId })
        OrderPaymentSuccess.paymentStatus = "Success"
        await OrderPaymentSuccess.save()
        res.redirect('/order')
    } catch (error) {
        console.log(error.message)
    }
}

const Repayfailure = async (req, res) => {
    try {
        res.redirect('/order')
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    LoadCheckOutEditAddress,
    LoadCheckoutAddAddress,
    EditCheckoutAddress,
    AddCheckoutAddress,
    cart,
    CartUpdate,
    cancelOrder,
    returnOrder,
    checkout,
    OrderPlaced,
    AddtoCart,
    deleteCart,
    deleteFullCart,
    LoadOrderPlace,
    // ApplyCoupon,
    RemoveCoupon,
    CheckCoupon,
    OrderSuccess,
    OrderFailure,
    FailedPaymentRepay,
    Repaysuccess,
    DeleteFullWishlist,
    Repayfailure
}