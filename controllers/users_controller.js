const User = require('../models/users');

module.exports.signIn=function(req, res){
    return res.render('Sign_In',{
        title: "Sign in page"
    });
};


module.exports.signUp=function(req, res){
    return res.render('Sign_Up',{
        title: "Sign Un page"
    });
};

module.exports.create= async function(req,res){

    try{
        if(req.body.password!=req.body.confirm_password){
            return res.redirect('back');
        }
    
        const user = await User.findOne({email : req.body.email});
        if(!user){
            const newUser= User.create(req.body);
            return res.redirect('/users/sign-in');
        }
        else{
            return res.redirect('back');
        }
    }catch{
        return res.redirect('/');
    }
   
};