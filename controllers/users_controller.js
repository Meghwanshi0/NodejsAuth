const User = require('../models/users');

module.exports.signIn=function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('Sign_In',{
        title: "Sign in page"
    });
};


module.exports.signUp=function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('Sign_Up',{
        title: "Sign Un page"
    });
};

module.exports.profile= async function(req,res){
    return res.render('profile', {
        title: 'User Profile'
    })
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

// //Using manual authentication
// module.exports.createSession= async function(req, res){
//         try {
//             const user = await User.findOne({email: req.body.email});
//             if (user){
//                 if (user.password === req.body.password){
//                     res.cookie('user_id', user.id);
//                     return res.redirect('/users/profile');
//                 } else {
//                     return res.redirect('back');
//                 }
//             } else {
//                 return res.redirect('back');
//             }
//         }
//         catch {
//             console.log('Error in finding user in signing in:', err);
//             return res.redirect('back');
//         };
//     }

//using passport express session
// sign in and create a session for the user
module.exports.createSession = function(req, res){
    return res.redirect('/users/profile');
};