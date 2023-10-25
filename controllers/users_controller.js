const User = require('../models/users');
const customMware = require('../config/middleware');
const fs= require('fs');
const path = require('path');

module.exports.profile = function(req, res){
    User.findById(req.params.id)
        .then(user => {
            return res.render('user_profile', {
                title: 'User Profile',
                profile_user: user
            });
        })
        .catch(err => {
            console.error('Error fetching user:', err);
            return res.redirect('back');
        });
}

// module.exports.update = function(req, res){
//     if(req.user.id == req.params.id){
//         User.findByIdAndUpdate(req.params.id, req.body)
//             .then(user => {
//                 return res.redirect('back');
//             })
//             .catch(err => {
//                 console.error('Error updating user:', err);
//                 return res.redirect('back');
//             });
//     } else {
//         return res.status(401).send('Unauthorized');
//     }
// }
  /*if (req.cookies.user_id){
        User.findById(req.cookies.user_id)
            .then(user => {
                if (user){
                    return res.render('user_profile', {
                        title: "User Profile",
                        user: user
                    });
                } else {
                    return res.redirect('/users/sign-in');
                }
            })
            .catch(err => {
                console.log('Error finding user by ID:', err);
                return res.redirect('/users/sign-in');
            });
    } else {
        return res.redirect('/users/sign-in');
    }
    */
module.exports.update = async function(req, res){
    if(req.user.id == req.params.id){

        try{
            let user=await User.findById(req.params.id);
            User.uploadedAvatar(req,res, function(err){
                if(err){
                    console.log('****Multer Error:', err)
                }   
                user.name=req.body.name;
                user.email=req.body.email;

                if(req.file){
                        // if(user.avatar){
                        //     fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                        // }

                    //this is saving the path of uploaded file into the avatar field in the user
                    user.avatar=User.avatarPath + '/' +req.file.filename;
                }
                user.save();
                return res.redirect('back');
            }
            );
        }
        catch(err){
            req.flash('error', err);
            return res.redirect('back');
        }

    }
}


module.exports.signIn= function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
        return res.render('user_sign_in',{
            title: "Sign In Page"
        });
}

module.exports.signUp= function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up',{
        title: "Sign Up Page"
    });
}


// get the sign up data
module.exports.create = function(req, res){
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }   
    
    User.findOne({email: req.body.email})
        .then(user => {
            if(!user){
                User.create(req.body)
                    .then(user => {
                        return res.redirect('/users/sign-in');
                    })
                    .catch(err => {
                        console.log('Error in creating user:', err);
                        return res.redirect('back');
                    });
            } else {
                return res.redirect('back');
            }
        })
        .catch(err => {
            console.log('Error in finding already existing user while signing up:', err);
            return res.redirect('back');
        });
}


// sign in and create a session for the user
module.exports.createSession = function(req, res){
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');
    
    /* User.findOne({email: req.body.email})
        .then(user => {
            if (user){
                if (user.password === req.body.password){
                    res.cookie('user_id', user.id);
                    return res.redirect('/users/profile');
                } else {
                    return res.redirect('back');
                }
            } else {
                return res.redirect('back');
            }
        })
        .catch(err => {
            console.log('Error in finding user in signing in:', err);
            return res.redirect('back');
        });
        */
}


//Logout action implementation
//Logout action implementation
module.exports.destroySession = function(req, res){
    req.logout(function(err) {
        if(err) {
            console.error('Error during logout:', err);
            return res.redirect('/');
        }
        req.flash('success', 'You have logged out!');
        return res.redirect('/');
    });
    
}




