const express=require('express')
const user_route=express();
// const bodyParser = require('body-parser');

require('dotenv').config()

const session=require('express-session')

// user_route.set('view engine','ejs')

user_route.set('views','./views/users')

const bodyparser=require('body-parser')


user_route.use(bodyparser.json())
user_route.use(bodyparser.urlencoded({extended:true}))

// user_route.set('view engine','ejs')

const path=require('path')
 
const auth =require('../middleware/auth')

const userController=require('../controller/userController');

const cartController=require('../controller/cartController');

const { isdelete } = require('../middleware/isdelete');

const passport = require('passport');

user_route.get('/',userController.base)
  
user_route.get('/shop',isdelete,userController.shop)

user_route.get('/register',auth.user,userController.loginregister)

user_route.post('/register',userController.insertUser)
 
//SignIn with google



user_route.use(passport.initialize());

user_route.use(passport.session())

user_route.get('/auth/google',
    passport.authenticate('google',{scope:
    ['email','profile']}
    ))

user_route.get('/auth/google/callback',
    passport.authenticate('google',{
        successRedirect:'/auth/google/success',
        failureRedirect:'/auth/google/failure'
    }))

user_route.get('/auth/google/success',isdelete,userController.success)
user_route.get('/auth/google/failure',(req,res)=>{
    res.send('something went wrong')
})

//Login ,register,forgot password and otp

user_route.get('/login',auth.user,userController.Loadlogin)

user_route.post('/login',userController.verifyLogin)

user_route.get('/forgotpassword',userController.ForgotPassword)

user_route.post('/forgotpassword',userController.ForgotPasswordOtp)

user_route.post('/forgotpasswordotp',userController.checkForgotPasswordOtp)

// user_route.post('/login-register',userController.handleInsertUser)

user_route.get('/otp',userController.LoadOtp)

user_route.post('/otp',userController.VerifyOtp)

user_route.post('/resend',userController.resendotp)

user_route.post('/sendotpaddress',userController.SendOtpAddress)

user_route.post('/resendotpemail',userController.resendOtpEmail)

user_route.post('/otpemailverify',userController.OtpVerifyEmail)

// Order Details

user_route.get('/orderview/:OrderId',auth.tologin,userController.OrderView)

user_route.get('/order',auth.tologin,userController.LoadOrder)

user_route.post('/cancelorder',cartController.cancelOrder)

user_route.post('/returnOrder',cartController.returnOrder)

user_route.get('/success',cartController.OrderSuccess)

user_route.get('/failure',cartController.OrderFailure)

user_route.get('/orderplacedfailure',userController.LoadOrderPlacedFailure)

user_route.post('/orderplace',cartController.OrderPlaced)

// Profile

user_route.get('/accountdetails',auth.tologin,userController.accountdetails)

user_route.get('/addwalletsuccess',userController.AddWallet)

user_route.get('/withdrawwalletsuccess',userController.WithdrawWallet)

user_route.get('/walletfailure',userController.WalletFailure)

user_route.get('/loadwallet',auth.tologin,userController.LoadWallet)

user_route.get('/wallethistory',auth.tologin,userController.LoadWalletHistory)

//Update

user_route.post('/updateaccountdetails',userController.UpdateAccountDetails)

user_route.post('/addwallet',userController.LoadWalletAdd)

user_route.post('/withdrawamount',userController.loadWalletWithdraw)

user_route.post('/removecoupon',cartController.RemoveCoupon)

user_route.post('/checkcoupon',cartController.CheckCoupon)

user_route.post('/newpassword',userController.NewPassword)
 
user_route.post('/addcheckoutaddress',cartController.AddCheckoutAddress)

user_route.post('/editcheckoutaddress/:AddressId',cartController.EditCheckoutAddress)

user_route.post('/updatequantity',cartController.CartUpdate)

user_route.post('/addtocart',cartController.AddtoCart)

user_route.post('/addaddress',userController.AddAddress)

user_route.patch('/deleteAddress/:AddressId',userController.deleteAddress)

user_route.post('/Editaddress/:AddressId',userController.EditAddress)

user_route.post('/addtowishlist',userController.AddtoWishlist)

user_route.post('/changepassword',auth.tologin,userController.ChangePassword)

user_route.post('/changeemail',userController.ChangeEmail)

user_route.post('/repayfailedpayment',cartController.FailedPaymentRepay)

// user_route.get('/shop',userController.categoryname)

// user_route.post('/applycoupon',cartController.ApplyCoupon)

//Open page

user_route.get('/categoryname',userController.categoryname)

user_route.get('/repaysuccess',cartController.Repaysuccess)

user_route.get('/repayfailure',cartController.Repayfailure)

// user_route.get('/sorting',userController.Sorting)

user_route.get('/wishlist',isdelete,auth.tologin,userController.wishlist)

user_route.get('/cart',isdelete,auth.tologin,cartController.cart)

user_route.get('/newpassword',userController.newpassword)

user_route.get('/checkout',auth.tologin,isdelete,cartController.checkout)

user_route.get('/checkouteditaddress/:AddressId',auth.tologin,cartController.LoadCheckOutEditAddress)

user_route.get('/addcheckoutaddress',auth.tologin,cartController.LoadCheckoutAddAddress)

user_route.get('/my-account',isdelete,auth.tologin,userController.myaccounts) 

user_route.get('/address',auth.tologin,userController.LoadAddress)

user_route.get('/loadAddaddress',auth.tologin,userController.LoadAddAddress)

user_route.get('/editaddress/:AddressId',auth.tologin,userController.LoadEditAddress)

user_route.get('/refferal',auth.tologin,userController.LoadRefferal)

user_route.get('/singleproduct/:ProductId',userController.LoadSingleProduct)

user_route.get('/hi',userController.Hi)

user_route.get('/invoice-generate',userController.InvoiceGenerate)

user_route.get('/logout',isdelete,auth.isuser,userController.Logout)

user_route.get('/loadorderplaced',auth.tologin,cartController.LoadOrderPlace)

user_route.get('/change-password',auth.tologin,userController.Loadchangepassword)

//Delete

user_route.delete('/deleteFullWishlist',cartController.DeleteFullWishlist)

user_route.delete('/deletewishlist',userController.DeleteWishlist)

user_route.delete('/deletecart',cartController.deleteCart)

user_route.delete('/deleteFullCart',cartController.deleteFullCart)

// user_route.get('/product-details',isdelete,userController.productdetails)

module.exports=user_route