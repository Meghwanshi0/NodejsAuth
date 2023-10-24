const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = async function(req, res) {
    try {
        const post = await Post.findById(req.body.post);

        if (post) {
            const comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });

            post.comments.push(comment);
            await post.save();

            return res.redirect('/');
        }
    } catch (err) {
        console.log('Error creating comment:', err);
        return res.redirect('back');
    }
}


module.exports.destroy = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.redirect('back');
        }

        if (comment.user == req.user.id) {
            const postId = comment.post;
            await Comment.deleteOne({ _id: req.params.id });

            const post = await Post.findByIdAndUpdate(
                postId,
                { $pull: { comments: req.params.id } }
            );

            return res.redirect('back');
        } else {
            return res.redirect('back');
        }
    } catch (error) {
        console.error('Error in deleting comment:', error);
        return res.redirect('back');
    }
};
