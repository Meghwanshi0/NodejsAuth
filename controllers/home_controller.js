const Post = require('../models/post');
const User = require('../models/users');

// module.exports.home = function(req, res){
//     // console.log(req.cookies);
//     // res.cookie('user_id', 25);

//     // Post.find({}, function(err, posts){
//     //     return res.render('home', {
//     //         title: "Codeial | Home",
//     //         posts:  posts
//     //     });
//     // });

//     // populate the user of each post
//     // Post.find({}).populate('user')
//     // .populate({
//     //     path: 'comments',
//     //     populate: {
//     //         path: 'user'
//     //     }
//     // })
//     //     .then(posts => {
//     //         User.find({}, function(err, users){
//     //             return res.render('home', {
//     //                 title: "Codeial | Home",
//     //                 posts:  posts,
//     //                 all_users: users
//     //             });
//     //         });
//     //     })
//     //     .catch(err => {
//     //         console.log('Error fetching posts:', err);
//     //         return res.redirect('back');
//     //     });

// }

// module.exports.actionName = function(req, res){}

module.exports.home = async (req, res) => {
    try {
        const posts = await Post.find({}).populate('user')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user'
                }
            });
        
        const users = await User.find({});

        return res.render('home', {
            title: "Codeial | Home",
            posts: posts,
            all_users: users
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        return res.redirect('back');
    }
};
