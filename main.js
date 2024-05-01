const express=require('express')
const dotenv=require('dotenv').config()

const bodyparser=require('body-parser')
const path=require('path')
const session=require('express-session')


const connectDB=require('./server/database/connection')
// const { connect } = require('http2')

const app=express() 

const errorHandlingMiddleware = require('./server/middleware/errorhandling');



// console.log(process.env.PORT)

// dotenv.config({path:'config.env'})

const PORT=process.env.PORT||3500

console.log(PORT)


connectDB();

app.set('view engine','ejs')



app.use(express.static('public'))

app.use(express.static('server/uploads'))

app.use('/uploads',express.static(path.resolve(__dirname,'server/uploads')))

app.use((req,res,next)=>{
    res.setHeader('Cache-Control','no-cache,no-Store,must-revalidate');
    res.setHeader('Pragma','no-cache')
    res.setHeader('Expires','0')
    next()
})

app.use(
    session({
        secret:process.env.secretg, 
        resave:false,
        saveUninitialized:true
    })
)


app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json())


// app.use('/',require('./server/routes/adminRoute'))
app.use('/',require('./server/routes/userRoute'))


app.use('/',require('./server/routes/adminRoute'))
// console.log(  Math.floor(1000 + Math.random() * 9000))
app.use(errorHandlingMiddleware);

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}/`)
    console.log(`Server is running on http://localhost:${PORT}/admin/login`)
})   

