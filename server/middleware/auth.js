// isuser=async(req,res)=>{
//     if(req.session.user_id){
//         next()
//     }else{
//         res.redirect('/login')
//     }
// }
exports.user=async(req,res,next)=>{
    if (req.session._id) {
        res.redirect('/')
       
    } else {
       
        next()
        
    }
}

exports.nouser=async(req,res,next)=>{
    if( req.session.user == 'undefined' ||  req.session.user== null){
        res.redirect('/')
    }
    else{
        next();
    }
}

exports.tologin=async(req,res,next)=>{
    
    if( req.session.user== null){
       
        res.redirect('/login')
    }
    else{
        
        next();
    }
}

exports.toadminlogin=async(req,res,next)=>{
  
    if(req.session.adminid==null){
        res.redirect('/admin/login')
    }
    else{
        next()
    }
}

exports.isuser=(req,res,next)=>{
    if(req.session.user){
        next()
    }else{
        res.redirect('/logout')
    }
}



exports.admin=(req,res,next)=>{
    if (req.session.admin) {
        res.redirect('/admin/index')
    } else {
       next()
    }
}

exports.isadmin=(req,res,next)=>{
    if(req.session.admin){
        next()
    }else{
       res.redirect('/admin/login')
    }
}