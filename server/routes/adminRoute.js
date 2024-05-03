const express=require('express')
const admin_route=express()

const fs=require('fs')
const path=require('path')

const multer=require('multer')

const auth=require('../middleware/auth')

admin_route.set('views','./views/admin')

const bodyparser=require('body-parser')

admin_route.use(bodyparser.json())
admin_route.use(bodyparser.urlencoded({extended:true}))

 const adminController=require('../controller/adminController')

 const productController=require('../controller/productController')

 const categoryController=require('../controller/categoryController')

// admin_route.use(express.static('uploads'))

const uploadDir = path.join(__dirname, '../uploads/product');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}


const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,uploadDir)
    },
    filename:function(req,file,cb){
        console.log(file)
        // const name= Date.now()+'-'+file.originalname;
        // cb(null,name,function(error1,success1){
        //     if(error1) throw error1
        // })
        cb(null,Date.now()+path.extname(file.originalname))
        // console.log("hello")
    }    
       
})


const upload = multer({ storage: storage, array: 'image' }); 

// console.log('2')
admin_route.get('/admin/login',auth.admin,adminController.adminbase)

admin_route.get('/BacktoDashboard',auth.toadminlogin,adminController.LoadDashboard)

admin_route.post('/admin/login',adminController.adminVerify)

admin_route.get('/admin/index',auth.toadminlogin,adminController.index)



//User Details Route

admin_route.get('/admin/userdetails',auth.toadminlogin,adminController.userdetails)

admin_route.patch('/block/:userId', categoryController.Block);

admin_route.patch('/unblock/:userId', categoryController.UnBlock);

//Category Route

admin_route.get('/admin/category',auth.toadminlogin,categoryController.LoadCategory)

admin_route.get('/addCategory',auth.toadminlogin,categoryController.LoadAddCategory)

admin_route.post('/addedCategory',upload.single('image'),categoryController.addCategory)

admin_route.get('/Editcategory/:CategoryId',auth.toadminlogin,categoryController.LoadeditCategory)

admin_route.post('/editedcategory/:CategoryId',upload.single('image'),categoryController.EditedCategory)

admin_route.get('/unlistedcategory',auth.toadminlogin,categoryController.unlistedCategory)

admin_route.patch('/deleteCategory/:CategoryId',categoryController.deleteCategory)

admin_route.patch('/Retrievecategory/:CategoryId',categoryController.RetrieveCategory)

admin_route.get('/Backtocategory',auth.toadminlogin,categoryController.BacktoCategory)


//Order Route

admin_route.get('/loadadminorder',auth.toadminlogin,adminController.LoadAdminOrder)

admin_route.post('/approve',adminController.Approve)

admin_route.post('/decline',adminController.Decline)

admin_route.post('/admin/order/update-order-status',adminController.StatusChange)

admin_route.get('/loadorderdetail',auth.toadminlogin,adminController.Loadorderdetail)

//Coupon Route

admin_route.get('/loadcoupon',auth.toadminlogin,adminController.LoadCoupon)

admin_route.get('/loadaddcoupon',auth.toadminlogin,adminController.LoadAddCoupon)

admin_route.post('/addcoupon',adminController.AddCoupon)

admin_route.get('/editcoupon/:CouponId',auth.toadminlogin,adminController.LoadEditCoupon)

admin_route.post('/editcoupon/:CouponId',adminController.EditCoupon)

admin_route.post('/deletecoupon',adminController.DeleteCoupon)

//Product Route

admin_route.get('/admin/product',auth.toadminlogin,productController.LoadProduct)

admin_route.get('/LoadProduct',auth.toadminlogin,productController.LoadaddProduct)

admin_route.post('/addProduct',upload.array('image'),productController.addproduct)

admin_route.get('/BacktoProduct',auth.toadminlogin,productController.BacktoProduct)

admin_route.get('/loadeditproduct/:ProductId',auth.toadminlogin,productController.Loadeditproduct)

// admin_route.post('/editProduct/:ProductId',upload.single('image'),productController.editproduct)

admin_route.post('/editProduct',upload.array('image'),productController.editproduct)

admin_route.post('/imageupdate',upload.single('image'),productController.imageupdate)

admin_route.patch('/delete-image/:ProductId/:Filename',productController.deleteimage)

admin_route.patch('/deleteProduct/:ProductId',productController.deleteProduct)

admin_route.get('/UnlistedProduct',auth.toadminlogin,productController.UnlistedProduct)
 
admin_route.patch('/RetrieveProduct/:ProductId',productController.RetrieveProduct)

//Sales Route

admin_route.get('/salesreport',auth.toadminlogin,adminController.LoadSalesReport)

admin_route.get('/dailyreport',auth.toadminlogin,adminController.LoadDailyReport)

admin_route.get('/weeklyreport',auth.toadminlogin,adminController.LoadWeeklyReport)

admin_route.get('/monthlyreport',auth.toadminlogin,adminController.LoadMonthlyReport)

admin_route.get('/yearlyreport',auth.toadminlogin,adminController.LoadYearlyReport)

admin_route.post('/filterOrders',adminController.RandomDateReport)

admin_route.post('/randomDate',adminController.RandomDateSalesReport)

admin_route.post('/downloadreport',adminController.DownLoadReport)

// admin_route.post('/Download',adminController.DownloadSalesReport)

admin_route.get('/dailydownload',auth.toadminlogin,adminController.Dailydownload)

admin_route.get('/weeklydownload',auth.toadminlogin,adminController.Weeklydownload)

admin_route.get('/monthlydownload',auth.toadminlogin,adminController.Monthlydownload)

admin_route.get('/yearlydownload',auth.toadminlogin,adminController.Yearlydownload)


//Offer Route

admin_route.get('/admin/offer',auth.toadminlogin,adminController.LoadAdminOffer)

admin_route.get('/loadaddcategoryoffer',auth.toadminlogin,adminController.LoadAddCategoryOffer)

admin_route.post('/addcategoryoffer',adminController.AddCategoryOffer)

admin_route.get('/loadaddproductOffer',auth.toadminlogin,adminController.LoadAddProductOffer)

admin_route.post('/addproductoffer',adminController.AddProductOffer)

admin_route.post('/deletecategoryoffer',adminController.DeleteCategoryOffer)

admin_route.post('/deleteproductoffer',adminController.DeleteProductOffer)

//Logout Route

admin_route.get('/admin/logout',auth.isadmin, adminController.adminLogout)

 
// console.log("Hello");    

module.exports=admin_route