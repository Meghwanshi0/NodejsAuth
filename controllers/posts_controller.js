const Post = require('../models/post');
const Comment = require('../models/comment');

// module.exports.create = function(req, res){
//     Post.create({
//         content: req.body.content,
//         user: req.user._id
//     })
//     .then(post => {
//         return res.redirect('back');
//     })
//     .catch(err => {
//         console.log('error in creating a post', err);
//         return res.redirect('back');
//     });
// }




// module.exports.destroy = function(req, res){
//     Post.findById(req.params.id)
//         .then(post => {
//             if (post.user.toString() === req.user.id) {
//                 return Post.deleteOne({_id: req.params.id});
//             } else {
//                 return res.redirect('back');
//             }
//         })
//         .then(() => {
//             Comment.deleteMany({post: req.params.id})
//                 .then(() => {
//                     return res.redirect('back');
//                 });
//         })
//         .catch(err => {
//             console.log('Error in deleting post:', err);
//             return res.redirect('back');
//         });
// }

// module.exports.create = async function(req, res){
//     try{
//         await Post.create({
//             content: req.body.content,
//             user: req.user._id
//         });
        
//         req.flash('success', 'Post published!');
//         return res.redirect('back');

//     }catch(err){
//         req.flash('error', err);
//         return res.redirect('back');
//     }
  
// }

module.exports.create = async function(req, res){
    try{
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });

        
        
        if (req.xhr){
            return res.status(200).json({
                data: {
                    post: post
                },
                message: "Post created!"
            });
        }


        req.flash('success', 'Post published!');
        return res.redirect('back');

    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
  
}


module.exports.destroy = async function(req, res){

    try{
        let post = await Post.findById(req.params.id);

        if (post.user == req.user.id){
            post.deleteOne({_id: req.params.id});

            await Comment.deleteMany({post: req.params.id});

            req.flash('success', 'Post and associated comments deleted!');

            return res.redirect('back');
        }else{
            req.flash('error', 'You cannot delete this post!');
            return res.redirect('back');
        }

    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
    
}