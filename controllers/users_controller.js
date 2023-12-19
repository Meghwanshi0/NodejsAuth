const { randomBytes } = require('crypto');
const User = require('../models/users');
const randomstring = require('randomstring');
const nodeMailer = require('nodemailer');
const config= require('../config/config');
const { builtinModules } = require('module');
const bcryptjs = require('bcryptjs');

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
        title: "Sign Up page"
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
            req.flash('error', 'Password and Confirm password are not matching, Please try again! ');
            return res.redirect('back');
        }
    
        const user = await User.findOne({email : req.body.email});
        if(!user){
            const newUser= User.create(req.body);
            req.flash('success', 'Success, Please Log in!!')
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
    req.flash('success','Logged in successfully');
    return res.redirect('/users/profile');
};

module.exports.destroySession = function(req, res){
    req.logout(function(err) {
        if(err) {
            console.error('Error during logout:', err);
            return res.redirect('/');
        }
        req.flash('success','Logged out successfully');
        return res.redirect('/');
    });
    
}

module.exports.sendResetPassowrdEmail= async (name,email, token)=>{
    try {
        const transporter= nodeMailer.createTransport(
            {
                host:'smtp.gmail.com',
                port: 587,
                secure:false,
                auth:{
                    user: config.emailUser,
                    pass: config.passowrdUser
                }
            }
        );

        const mailOptions ={
            from: config.emailUser,
            to: email,
            subject: 'NodejsAuth: Rest your password',
            html: '<p> Hi '+name+', Please rest your password using <a href="http://127.0.0.1:8002/users/reset-password?token='+token+'">this link</a> </p>'
        }
        transporter.sendMail(mailOptions,function(err, info){
            if(err){
                console.log(err);
            }
            else{
                // console.log(mailOptions);
                console.log("Rest password link has been sent in your email-",info.response);
                return;
            }
        });
    } 
    catch (error) {
        res.status(400).send({success:false,msg:error.message});
    }
}

module.exports.forgotPasswordPage= async function(req,res){
       return res.render('forgot_password_page',{
        title:"forgot password"
       });
};

module.exports.forgotPassword= async function(req, res){
    try{
        const email =  req.body.email;
        // console.log(email);
        const user = await User.findOne({email:email});
        if(user){
            const random_string = randomstring.generate();
            const update_token = await User.updateOne({email: email}, {$set:{token : random_string}});
            module.exports.sendResetPassowrdEmail(user.name,user.email, random_string);
            res.render('success',{
                title: "success"
            })
        }
        else{
        res.status(200).send({success:true, msg :"Email doesn't exist"});
    }
  } 
    catch(error){
        res.status(400).send({success:false,msg:error.message});
    }

};


module.exports.renderResetPasswordForm = function (req, res) {
    const token = req.query.token;
    res.render('reset_password_form', { title: 'Reset Password', token: token });
};

module.exports.resetPassword = async function(req, res) {
    try {
        const token = req.body.token;
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;

        if (password !== confirmPassword) {
            return res.status(400).send({ success: false, msg: "Passwords do not match" });
        }

        const tokenData = await User.findOne({ token: token });

        if (tokenData) {

            if (password !== undefined) {
                const userData = await User.findByIdAndUpdate(
                    { _id: tokenData._id },
                    { $set: { password: password, token: '' } },
                    { new: true }
                );

                return res.render('reset_success',{
                    title:"SUCCESS!"
                })
            } else {
                return res.status(500).send({ success: false, msg: "Invalid password" });
            }
        } else {
            return res.status(200).send({ success: true, msg: "This link has expired or is not valid" });
        }
    } catch (error) {
        return res.status(400).send({ success: false, msg: error.message });
    }
};

module.exports.contact_us = function(req, res){
    return res.render('contact', {
        title: 'Contact Us'
    })
};