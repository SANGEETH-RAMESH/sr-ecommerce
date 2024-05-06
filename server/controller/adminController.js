
const admin = require('../model/adminmodel')

const user = require('../model/userModel')

const category = require('../model/categorymodel')
 
const Product = require('../model/productModel')

const Order = require('../model/ordermodel')

const Coupon = require('../model/couponmodel')

const Address = require('../model/addressmodel')

const CategoryOffer = require('../model/categoryoffer')

const ProductOffer = require('../model/productoffer')

const path = require('path')

const ejs = require('ejs');

const puppeteer = require('puppeteer-core')

const { ObjectId } = require('mongodb');


const adminbase = ((req, res) => {

    try {

        res.render('adminlogin')
    }
    catch (error) {
        res.render('error404',{error:error})
    }
})

const index = async (req, res) => {
    try {
        const Revenue = await Order.find();
        const OrderDetails = await Order.find()
   
     

        // top selling products

        const productCount = {}
        Revenue.forEach(order => {
            order.items.forEach(item => {
                const { productId, quantity } = item


                if (productId in productCount) {

                    productCount[productId] += Number(quantity)
                }
                else {
                    productCount[productId] = Number(quantity);
                }
            })
        })
        // console.log(productCount,'productcount')
        const countEntries = Object.entries(productCount);

        // Sort the array based on the count in descending order
        countEntries.sort((a, b) => b[1] - a[1]);
        // console.log(countEntries,'countentries')
        // Get the top two entries' productId
        const topTwoProductIds = countEntries.slice(0, 2).map(entries=>entries[0])
        // console.log(topTwoProductIds,'toptwo')
        // console.log(topTwoProductIds)
       
        // const productMatches=await Promise.all(topTwoProductIds.map(async(productId)=>{
        //     return await Product.findOne({_id:productId})
        // }))

        const productMatches=[];
        for(const productId of topTwoProductIds){
            const product=await Product.findOne({_id:productId})
            productMatches.push(product)
        }
        // console.log(productMatches,'matching')
        //top selling category
        console.log('category')
        const categoryCount = {}
        Revenue.forEach(order => {
            order.items.forEach(item => {
                const { categoryId, quantity } = item


                if (categoryId in categoryCount) {

                    categoryCount[categoryId] += Number(quantity)
                }
                else {
                    categoryCount[categoryId] = Number(quantity);
                }
            })
        })

        //created an array of nested array
        const count = Object.entries(categoryCount);


        //making descending order
        count.sort((a, b) => b[1] - a[1]);

        // Get the top two entries' productId

        //taking top two categoryId
        const toptwocategory = count.slice(0, 2).map(entry => entry[0]);

        const categorymatch=[];
        for(const categoryId of toptwocategory){
            const Category=await category.findOne({_id:categoryId})
            categorymatch.push(Category)
        }
        
       


        if (req.query.sortingOption == undefined) {

            var WeekData = Array(7).fill(0);
            const today = new Date();
            const lastWeek = new Date(today);
            lastWeek.setDate(lastWeek.getDate() - 7);

            var WeeklyOrder = await Order.find({
                currentDate: { $gte: lastWeek, $lte: today }
            }).populate('items.productId');

            var value = 'weekly'
            WeeklyOrder.forEach(orders => {
                const week = orders.currentDate.getDay();
                if (!WeekData[week]) {
                    WeekData[week] = 0;
                }
                WeekData[week] += orders.totalAmount;
            });
        } else if (req.query.sortingOption == 'weekly') {
           
            var WeekData = Array(7).fill(0);
            const today = new Date();
            const lastWeek = new Date(today);
            lastWeek.setDate(lastWeek.getDate() - 7);

            var WeeklyOrder = await Order.find({
                currentDate: { $gte: lastWeek, $lte: today }
            }).populate('items.productId');

            var value = 'weekly'
            WeeklyOrder.forEach(orders => {
                const week = orders.currentDate.getDay();
                if (!WeekData[week]) {
                    WeekData[week] = 0;
                }
                WeekData[week] += orders.totalAmount;
            });
            
        }
        else if (req.query.sortingOption == 'monthly') {
            
            var MonthlyData = Array(12).fill(0);
            var today = new Date();
            const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            // const lastMonth = new Date(firstDayOfMonth);
            // lastMonth.setMonth(lastMonth.getFullYear() - 1);
            const lastyearago = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());


            var MonthlyOrder = await Order.find({
                currentDate: { $gte: lastyearago, $lte: today }
            }).populate('items.productId');

            var value = 'monthly'


            MonthlyOrder.forEach(orders => {
                const month = orders.currentDate.getMonth();

                MonthlyData[month] += orders.totalAmount;


            });


        }
        else if (req.query.sortingOption == 'yearly') {
           

            let totalOrder = 0;
            var yearData = {};
            let orders = await Order.find();

            for (let order of orders) {
                const year = order.currentDate.getFullYear();
                if (!yearData[year]) {
                    yearData[year] = 0;
                }
                yearData[year] += order.totalAmount;
                totalOrder += order.items.length;
            }


            var value = 'yearly'
        }
        

        res.render('index', { Revenue, OrderDetails, startDateValue: null, yearData, MonthlyData, WeekData, value: req.query.sortingOption, value: value, endDateValue: null, mostSale: productMatches, mostsalecategory: categorymatch })

    } catch (error) {
        res.render('error404',{error:error})
    }
}

const LoadAdminOffer = async (req, res) => {
    try {
        const categoryOffer = await CategoryOffer.find().populate('category');
        const productOffer = await ProductOffer.find().populate('product')
        res.render('offer', { categoryOffer, productOffer })
    } catch (error) {
        res.render('error404',{error:error})
    }
}

const adminVerify = async (req, res) => {
    try {
        
        const email = req.body.email;
        const password = req.body.password;
        const adminData = await admin.findOne({ email: email })
        
        if (adminData) {
            if (password == adminData.password) {
               
                req.session.admin = adminData
                req.session.adminid=adminData._id
                console.log(req.session.adminid,'adminid')
                res.redirect('/admin/index')
            }
            else {
                res.render('adminlogin', { message: 'Password is incorrect' })
            }
        }
        else {
            res.render('adminlogin', { message: 'Email is Incorrect' })
        }
    } catch (error) {
        res.render('error404',{error:error})
    }
}

// const adminUser = async (req, res) => {
//     try {
//         await user.save();
//         res.status(200).send('User saved successfully');
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Internal Server Error');
//     }
// }


const userdetails = async (req, res) => {
    try {
        const users = await user.find()
        res.render('userdetails', { users })
        
    } catch (error) {
        res.render('error404',{error:error})
    }
}

const LoadAdminOrder = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Current page, default to 1 if not provided
        const limit = 5;
        const count = await Order.countDocuments(); // Total number of products
        const totalPages = Math.ceil(count / limit); // Total number of pages

        const skip = (page - 1) * limit; // Number of products to skip
        const order = await Order.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            }
        ]).sort({currentDate:-1}).skip(skip).limit(limit)
       
        res.render('adminorder', { orders: order, currentPage: page, totalPages: totalPages })
    } catch (error) {
        res.render('error404',{error:error})
    }
}

const LoadCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.find();
        res.render('loadcoupon', { coupon })
    } catch (error) {
        res.render('error404',{error:error})
    }
}

const LoadAddCoupon = async (req, res) => {
    try {
        res.render('addcoupon')
    } catch (error) {
        res.render('error404',{error:error})
    }
}

const AddCoupon = async (req, res) => {
    try {
       
        const AlreadyCoupon = await Coupon.findOne({ couponcode: req.body.couponcode })
        if (AlreadyCoupon) {
            res.render('addcoupon', { message: 'Coupon already Exist' })
        }
        else {
            
            const NewCoupon = new Coupon({
                couponcode: req.body.couponcode,
                description: req.body.description,
                minprice: req.body.minprice,
                discount: req.body.discount
            })
            await NewCoupon.save();
            res.redirect('/loadcoupon')
        }
    } catch (error) {
        res.render('error404',{error:error})
    }
}

const LoadEditCoupon = async (req, res) => {
    try {
        
        const coupon = await Coupon.findOne({ _id: req.params.CouponId })
     
        res.render('editcoupon', { coupon })
    } catch (error) {
        console.log('dfjd')
        res.render('error404',{error:error})
    }
}

const EditCoupon = async (req, res) => {
    try {

        const { couponcode, description, minprice, discount } = req.body
        const AlreadyCoupon = await Coupon.findOne({ couponcode: couponcode })

        const coupon = await Coupon.findOne({ _id: req.params.CouponId })

        if (AlreadyCoupon.couponcode == req.body.couponcode && AlreadyCoupon._id.toString() !== coupon._id.toString()) {

            res.render('editcoupon', { message: "Coupon Already Exist", coupon })
        }
        else {
            const Editing = await Coupon.findOne({ _id: req.params.CouponId })
            if (Editing) {
                if (couponcode) {
                    Editing.couponcode = couponcode
                }
                if (description) {
                    Editing.description = description
                }
                if (minprice) {
                    Editing.minprice = minprice
                }
                if (discount) {
                    Editing.discount = discount
                }
            }
            await Editing.save();
            res.redirect('/loadcoupon')
        }
    } catch (error) {
        res.render('error404',{error:error})
    }
}

const DeleteCoupon = async (req, res) => {
    try {

        const CouponDelete = await Coupon.findOneAndDelete({ _id: req.body.couponId })
        res.json({ message: 'Coupon Deleted' })
    } catch (error) {
        res.render('error404',{error:error})
    }
}

const Loadorderdetail = async (req, res) => {
    try {


        const User = await user.find({ _id: req.query.userId })

        const address = await Order.find({ orderId: req.query.orderId }).populate('address')

        const ordersss = await Order.find({ orderId: req.query.orderId })

        const orders = await Order.aggregate([
            {
                $match: {
                    orderId: req.query.orderId
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$items' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.productId',
                    foreignField: '_id',
                    as: 'items.product'
                }
            },
            { $unwind: '$items.product' }
        ])

        res.render('orderdetails', { order: orders, User, address })
    } catch (error) {
        console.log('jf')
        res.render('error404',{error:error})
    }
}


const Approve = async (req, res) => {
    try {

        let productfind = await Product.findOne({ _id: req.body.productid })
        const order = await Order.findOne({ _id: req.body.orderId })
        
        const Approving = order.items.forEach(item => {
            if (item.productId == req.body.productid) {

                item.approve = 3;

                if (req.session.returnreason != 'Item damaged') {
                    productfind.quantity = parseInt(productfind.quantity) + parseInt(item.quantity);
                    req.session.returnreason = null
                }
                item.Status = 'Return'

                res.json({ message: 'approved' })
            }
        })
        await productfind.save();
        await order.save();
    } catch (error) {
        res.render('error404',{error:error})
    }
}

const Decline = async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.body.orderId })
        const Declining = order.items.forEach(item => {
            if (item.productId == req.body.productid) {
               
                item.approve = 2;
                res.json({ message: 'declined' })
            }
        })
        await order.save();
    } catch (error) {
        res.render('error404',{error:error})
    }
}

const StatusChange = async (req, res) => {
    try {
        
        const order = await Order.findOne({ _id: req.body.orderId });
       
        let allItemsDelivered = true;
        const orderId = new ObjectId(req.body.productId);

        order.items.forEach(item => {
            
            if (item.productId.equals(orderId)) {
              
                item.Status = req.body.orderStatus;
                
            }
            
            // Check if any item's status is not 'Delivered'
            if (item.Status !== 'Delivered' && item.Status!=='Cancelled') {
                allItemsDelivered = false;
            }
        });

        if (allItemsDelivered && req.body.orderStatus === 'Delivered' && order.paymentMethod === 'Cash On Delivery') {
            order.paymentStatus = 'Success';
        }
        
        await order.save();
        res.json({ success: "StatusChanged" })
    } catch (error) {
        res.render('error404',{error:error})
    }
}


const LoadDashboard = async (req, res) => {
    try {
        res.redirect('/admin/index')
    } catch (error) {
        res.render('error404',{error:error})
    }
}

const adminLogout = async (req, res) => {
    try {
       
        req.session.destroy()
        res.redirect('/admin/login')
    } catch (error) {
        res.render('error404',{error:error})
    }
}

const LoadDailyReport = async (req, res) => {
    try {
        
        req.session.doc = null

        const today = new Date().toLocaleDateString();
        const FindDaily = await Order.find().populate('items.productId')
        const matchedDocs = [];
        FindDaily.forEach(doc => {
            if (new Date(doc.currentDate).toLocaleDateString() === today) {
                matchedDocs.push(doc);
            }
        });
        req.session.doc = FindDaily
        res.render('salesreport', { doc: matchedDocs, Names: "Daily", endDateValue: null, startDateValue: null });
    } catch (error) {
        res.render('error404',{error:error})
    }
}

const LoadWeeklyReport = async (req, res) => {
    try {
        
        req.session.doc = null

        const today = new Date();
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);

        const FindWeekly = await Order.find({
            currentDate: { $gte: lastWeek, $lte: today }
        }).populate('items.productId');
        req.session.doc = FindWeekly
        res.render('salesreport', { doc: FindWeekly, Names: "Weekly", endDateValue: null, startDateValue: null })
    } catch (error) {
        res.render('error404',{error:error})
    }
}

const LoadMonthlyReport = async (req, res) => {
    try {
      
        req.session.doc = null

        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastMonth = new Date(firstDayOfMonth);
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        const FindMonthly = await Order.find({
            currentDate: { $gte: lastMonth, $lte: today }
        }).populate('items.productId');
        req.session.doc = FindMonthly
        res.render('salesreport', { doc: FindMonthly, Names: "Monthly", endDateValue: null, startDateValue: null });
    } catch (error) {
        res.render('error404',{error:error})
    }
}

const LoadYearlyReport = async (req, res) => {
    try {
        
        req.session.doc = null

        const today = new Date();
        const lastYear = new Date(today);
        lastYear.setFullYear(lastYear.getFullYear() - 1);

        const FindYearly = await Order.find({
            currentDate: { $gte: lastYear, $lte: today }
        }).populate('items.productId');
        req.session.doc = FindYearly
        res.render('salesreport', { doc: FindYearly, Names: "Yearly", endDateValue: null, startDateValue: null });

    } catch (error) {
        res.render('error404',{error:error})
    }
}

const LoadSalesReport = async (req, res) => {
    try {
        
        req.session.doc = null

        const TotalSales = await Order.find().populate('items.productId')
        req.session.doc = TotalSales
        res.render('salesreport', { doc: TotalSales, Names: "Sales", endDateValue: null, startDateValue: null })

    } catch (error) {
        res.render('error404',{error:error})
    }
}

const RandomDateReport = async (req, res) => {
    try {
       
        req.session.doc = null

        const StartDate = new Date(req.body.startDate);
        const EndDate = new Date(req.body.endDate);
        

        //make startdate date object into a string representation in iso format "2024-04-30T12:00:00.000Z"
        const StartDateUTC = new Date(StartDate.toISOString());
        const EndDateUTC = EndDate.toISOString();
        const NewDate = new Date();
        const endDateDatePart = EndDateUTC.split('T')[0];
        const newDateTimePart = NewDate.toISOString().split('T')[1];
        const combinedDateTime = endDateDatePart + 'T' + newDateTimePart;
    

        const RandomDateReport = await Order.find({
            currentDate: { $gte: StartDateUTC, $lte: combinedDateTime }
        }).populate('items.productId');
        
        const data = {
            doc: RandomDateReport
        }
        // Render the EJS template

        //path.resolve is a method ,built-in path module
        const ejsTemplate = path.resolve(__dirname, "../../views/admin/salesreportdownload1.ejs");
        const ejsData = await ejs.renderFile(ejsTemplate, data);


        // here launch method is used to launch a new instance of the chrome browser

        //headless means making the chrome in headless mode
        const browser = await puppeteer.launch({ headless: 'new' });

        // This variable likely holds an instance of a browser created using puppeteer.launch()
        const page = await browser.newPage();

        // page.setContent() is a method provided by Puppeteer that sets the HTML content of the page.
        await page.setContent(ejsData, { waitUntil: "networkidle0" });

        // page.pdf() method to generate a PDF file from the content of the web page
        const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

        // Close the browser
        await browser.close();


        // This line sets the Content-Type header of the HTTP response to "application/pdf".
        res.setHeader("Content-Type", "application/pdf");

        // Content-Disposition is an HTTP header that suggests a filename for
        //  the downloaded file and specifies how the browser should handle the response.
        res.setHeader("Content-Disposition", "inline; filename=sales_report.pdf");

        // res.send(pdfBuffer); is used to send the PDF content stored in the pdfBuffer
        //  variable as the response to an HTTP request
        res.send(pdfBuffer);

    } catch (error) {
        res.render('error404',{error:error})
    }
}

const RandomDateSalesReport = async (req, res) => {
    try {
        const StartDate = new Date(req.body.startDate);
        const EndDate = new Date(req.body.endDate);
        const StartDateUTC = new Date(StartDate.toISOString());
        const EndDateUTC = EndDate.toISOString();
        const NewDate = new Date();
        const endDateDatePart = EndDateUTC.split('T')[0];
        const newDateTimePart = NewDate.toISOString().split('T')[1];
        const combinedDateTime = endDateDatePart + 'T' + newDateTimePart;
        

        const RandomDateReport = await Order.find({
            currentDate: { $gte: StartDateUTC, $lte: combinedDateTime }
        }).populate('items.productId');
        

        res.render('salesreport', { doc: RandomDateReport, startDateValue: req.body.startDate, endDateValue: req.body.endDate, Names: null })
    } catch (error) {
        res.render('error404',{error:error})
    }
}

const DownLoadReport = async (req, res) => {
    try {
        
        const { timeFrame, startDate, endDate } = req.body
        if (timeFrame) {
            
            if (timeFrame == 'lastDay') {
                const today = new Date().toLocaleDateString();
                const FindDaily = await Order.find().populate('items.productId')
                const matchedDocs = [];
                FindDaily.forEach(doc => {
                    if (new Date(doc.currentDate).toLocaleDateString() === today) {
                        matchedDocs.push(doc);
                    }
                });
                var data = {
                    doc: matchedDocs
                }
                
            } else if (timeFrame == 'lastWeek') {
                const today = new Date();
                const lastWeek = new Date(today);
                lastWeek.setDate(lastWeek.getDate() - 7);

                const FindWeekly = await Order.find({
                    currentDate: { $gte: lastWeek, $lte: today }
                }).populate('items.productId');
                var data = {
                    doc: FindWeekly
                }
                
            } else if (timeFrame == 'lastMonth') {
                const today = new Date();
                const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                const lastMonth = new Date(firstDayOfMonth);
                lastMonth.setMonth(lastMonth.getMonth() - 1);

                const FindMonthly = await Order.find({
                    currentDate: { $gte: lastMonth, $lte: today }
                }).populate('items.productId');
                var data = {
                    doc: FindMonthly
                }
                
            }
            else if (timeFrame == 'lastYear') {
                const today = new Date();
                const lastYear = new Date(today);
                lastYear.setFullYear(lastYear.getFullYear() - 1);

                const FindYearly = await Order.find({
                    currentDate: { $gte: lastYear, $lte: today }
                }).populate('items.productId');
                var data = {
                    doc: FindYearly
                }
                
            }

        }
        else if (startDate && endDate) {
          
            const StartDate = new Date(req.body.startDate);
            const EndDate = new Date(req.body.endDate);
            const StartDateUTC = new Date(StartDate.toISOString());
            const EndDateUTC = EndDate.toISOString();
            const NewDate = new Date();
            const endDateDatePart = EndDateUTC.split('T')[0];
            const newDateTimePart = NewDate.toISOString().split('T')[1];
            const combinedDateTime = endDateDatePart + 'T' + newDateTimePart;
            

            const RandomDateReport = await Order.find({
                currentDate: { $gte: StartDateUTC, $lte: combinedDateTime }
            }).populate('items.productId');
            var data = {
                doc: RandomDateReport
            }
            var docs=RandomDateReport
        }
        
        
        // this line constructs path to EJS template file salesreportdownload1
        const ejsTemplate = path.resolve(__dirname, "../../views/admin/salesreportdownload1.ejs");

        // render the ejstemplate using data
        const ejsData = await ejs.renderFile(ejsTemplate, data);

        // launchs a new instance of puppeteer
        // new browser window should be openend in headless mode
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.setContent(ejsData, { waitUntil: "networkidle0" });
        const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
 
        // Close the browser
        await browser.close();

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "inline; filename=sales_report.pdf");
        res.send(pdfBuffer);
    } catch (error) {
        res.render('error404',{error:error})
    }
}

const DownloadSalesReport = async (req, res) => {
    try {

        const { startDate, endDate, timeFrame } = req.body

        if (startDate && endDate) {

            const StartDate = new Date(startDate);
            const EndDate = new Date(endDate);
            const StartDateUTC = new Date(StartDate.toISOString());
            const EndDateUTC = EndDate.toISOString();
            const NewDate = new Date();
            const endDateDatePart = EndDateUTC.split('T')[0];
            const newDateTimePart = NewDate.toISOString().split('T')[1];
            const combinedDateTime = endDateDatePart + 'T' + newDateTimePart;


            const RandomDateReport = await Order.find({
                currentDate: { $gte: StartDateUTC, $lte: combinedDateTime }
            }).populate('items.productId');

            var doc = RandomDateReport
        }
        else if (timeFrame == 'lastDay') {


            const today = new Date().toLocaleDateString();
            const FindDaily = await Order.find().populate('items.productId')
            const matchedDocs = [];
            FindDaily.forEach(doc => {
                if (new Date(doc.currentDate).toLocaleDateString() === today) {
                    matchedDocs.push(doc);
                }
            });


            var doc = FindDaily
        }
        else if (timeFrame == 'lastWeek') {


            const today = new Date();
            const lastWeek = new Date(today);
            lastWeek.setDate(lastWeek.getDate() - 7);

            const FindWeekly = await Order.find({
                currentDate: { $gte: lastWeek, $lte: today }
            }).populate('items.productId');

            var doc = FindWeekly
        }
        else if (timeFrame == 'lastMonth') {
            const today = new Date();
            const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            const lastMonth = new Date(firstDayOfMonth);
            lastMonth.setMonth(lastMonth.getMonth() - 1);

            const FindMonthly = await Order.find({
                currentDate: { $gte: lastMonth, $lte: today }
            }).populate('items.productId');

            var doc = FindMonthly
        }
        else if (timeFrame == 'lastYear') {


            const today = new Date();
            const lastYear = new Date(today);
            lastYear.setFullYear(lastYear.getFullYear() - 1);

            const FindYearly = await Order.find({
                currentDate: { $gte: lastYear, $lte: today }
            }).populate('items.productId');

            var doc = FindYearly
        }



        // const s = await Order.find().populate('items.productId')
        const data = {
            doc: doc
        }

        // Render the EJS template
        const ejsTemplate = path.resolve(__dirname, "../../views/admin/salesreportdownload1.ejs");
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

        // Set headers and send the PDF as a response
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename=sales_report.pdf');
        res.send(pdfBuffer);
        // res.render('salesreportdownload1',{doc:doc})


    } catch (error) {
        res.render('error404',{error:error})
    }
}

const Dailydownload = async (req, res) => {
    try {
        const today = new Date().toLocaleDateString();
        const FindDaily = await Order.find().populate('items.productId')
        const matchedDocs = [];
        FindDaily.forEach(doc => {
            if (new Date(doc.currentDate).toLocaleDateString() === today) {
                matchedDocs.push(doc);
            }
        });
        const data = {
            doc: matchedDocs
        }
        // Render the EJS template
        const ejsTemplate = path.resolve(__dirname, "../../views/admin/salesreportdownload1.ejs");
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
        res.setHeader("Content-Disposition", "inline; filename=sales_report.pdf");
        res.send(pdfBuffer);
    } catch (error) {
        res.render('error404',{error:error})
    }
}

const Weeklydownload = async (req, res) => {
    try {
        const today = new Date();
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);

        const FindWeekly = await Order.find({
            currentDate: { $gte: lastWeek, $lte: today }
        }).populate('items.productId');
        const data = {
            doc: FindWeekly
        }
        // Render the EJS template
        const ejsTemplate = path.resolve(__dirname, "../../views/admin/salesreportdownload1.ejs");
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
        res.setHeader("Content-Disposition", "inline; filename=sales_report.pdf");
        res.send(pdfBuffer);
    } catch (error) {
        res.render('error404',{error:error})
    }
}

const Monthlydownload = async (req, res) => {
    try {
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastMonth = new Date(firstDayOfMonth);
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        const FindMonthly = await Order.find({
            currentDate: { $gte: lastMonth, $lte: today }
        }).populate('items.productId');
        const data = {
            doc: FindMonthly
        }
        //rendering ejs
        const ejsTemplate = path.resolve(__dirname, "../../views/admin/salesreportdownload1.ejs");
        const ejsData = await ejs.renderFile(ejsTemplate, data);

        //puppeteer setup
        const browser = await puppeteer.launch({ 
            headless: "new",
            executablePath: '/snap/bin/chromium',
        });
        const page = await browser.newPage();
        await page.setContent(ejsData, { waitUntil: "networkidle0" });
        const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

        // Close the browser
        await browser.close();

        //response handle
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "inline; filename=sales_report.pdf");
        res.send(pdfBuffer);
        // res.render('salesreportdownload1',{doc:FindMonthly})
    } catch (error) {
        res.render('error404',{error:error})
    }
}

const Yearlydownload = async (req, res) => {
    try {
        const today = new Date();
        const lastYear = new Date(today);
        lastYear.setFullYear(lastYear.getFullYear() - 1);

        const FindYearly = await Order.find({
            currentDate: { $gte: lastYear, $lte: today }
        }).populate('items.productId');

        const data = {
            doc: FindYearly
        }
        // Render the EJS template
        const ejsTemplate = path.resolve(__dirname, "../../views/admin/salesreportdownload1.ejs");
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
        res.setHeader("Content-Disposition", "inline; filename=sales_report.pdf");
        res.send(pdfBuffer);
    } catch (error) {
        res.render('error404',{error:error})
    }
}

const LoadAddCategoryOffer = async (req, res) => {
    try {
        const Category = await category.find()
        const categoryData = Category.map(category => ({
            _id: category._id,
            categoryname: category.categoryname
        }))


        res.render('addcategoryoffer', { categoryData })
    } catch (error) {
        res.render('error404',{error:error})
    }
}

const AddCategoryOffer = async (req, res) => {
    try {

        const AlreadyOffer = await CategoryOffer.findOne({ category: req.body.categoryId });

        if (AlreadyOffer) {
            res.json({ message: "Offer Already Exist" });
        } else {
            const AddOffer = new CategoryOffer({
                category: req.body.categoryId,
                offer: req.body.offer
            });

            await AddOffer.save();
            const CategoryOfferAdd = await category.findOne({ _id: req.body.categoryId })
            CategoryOfferAdd.Offer = AddOffer._id;
            await CategoryOfferAdd.save();
            res.json({ message: 'Offer Added' });
        }
    } catch (error) {
        res.render('error404',{error:error})
    }
}

const LoadAddProductOffer = async (req, res) => {
    try {
        const product = await Product.find()
        const ProductData = product.map(products => ({
            _id: products._id,
            productname: products.productname
        }))

        res.render('addproductoffer', { ProductData })
    } catch (error) {
        res.render('error404',{error:error})
    }
}

const AddProductOffer = async (req, res) => {
    try {

        const AlreadyProductOffer = await ProductOffer.findOne({ product: req.body.productId })
        if (AlreadyProductOffer) {

            res.json({ message: 'Offer Already Exist' })
        }
        else {
            const AddOffer = new ProductOffer({
                product: req.body.productId,
                offer: req.body.offer
            })
            await AddOffer.save();
            const ProductOfferAdd = await Product.findOne({ _id: req.body.productId })
            ProductOfferAdd.offer = AddOffer._id;
            await ProductOfferAdd.save();
            res.json({ message: 'Offer Added' })
        }
    } catch (error) {
        res.render('error404',{error:error})
    }
}

const DeleteCategoryOffer = async (req, res) => {
    try {

        const deleteCategoryoffer = await CategoryOffer.findOneAndDelete({ _id: req.body.cofferId })
        res.json({ message: 'Category Offer Deleted' })
    } catch (error) {
        res.render('error404',{error:error})
    }
}

const DeleteProductOffer = async (req, res) => {
    try {

        const deleteCategoryoffer = await ProductOffer.findOneAndDelete({ _id: req.body.pofferId })
        res.json({ message: 'Product Offer Deleted' })

    } catch (error) {
        res.render('error404',{error:error})
    }
}

module.exports = {
    adminbase,
    adminVerify,
    userdetails,
    LoadAdminOrder,
    Loadorderdetail,
    Approve,
    Decline,
    index,
    StatusChange,
    LoadDashboard,
    LoadCoupon,
    LoadAddCoupon,
    AddCoupon,
    LoadEditCoupon,
    EditCoupon,
    LoadDailyReport,
    LoadSalesReport,
    LoadWeeklyReport,
    LoadMonthlyReport,
    RandomDateSalesReport,
    DownLoadReport,
    LoadYearlyReport,
    RandomDateReport,
    DownloadSalesReport,
    Dailydownload,
    Weeklydownload,
    Monthlydownload,
    Yearlydownload,
    LoadAdminOffer,
    LoadAddCategoryOffer,
    AddCategoryOffer,
    LoadAddProductOffer,
    AddProductOffer,
    DeleteCategoryOffer,
    DeleteProductOffer,
    DeleteCoupon,
    adminLogout
}