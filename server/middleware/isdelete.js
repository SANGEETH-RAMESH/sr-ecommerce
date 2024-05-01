
const users=require('../model/userModel')

exports.isdelete=async(req,res,next)=>{
    try {
        
        const Delete=await users.findOne({_id:req.session._id})
       
        if(typeof Delete===null){
            next()
        }

        if (Delete?.is_delete === true) {
            console.log('hello')
            req.session.user = null;
           
        req.session._id = null
        req.session.email = null
        req.session.name = null
            console.log(req.session.user)
            return res.render('login', { req: req, message: "Admin has blocked" });
            // res.json({message:'Blocked'})
            // res.render('login',{ req: req, message: "Admin has blocked" })
        }
        next() 
    } catch (error) {
        console.log(error) 
    }
}  