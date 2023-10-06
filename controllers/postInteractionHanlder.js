"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleCommentInteraction = void 0;
const resSend_1 = require("../modules/resSend");
const postDb = require('../modules/postSchema');
const toggleCommentInteraction = async (username, commentId, res, reactionType) => {
    const post = await postDb.findOne({ 'comments.id': commentId });
    const comment = post.comments.find((x) => x.id === commentId);
    if (!comment)
        return (0, resSend_1.resSend)(res, true, 'Couldn\'t find comment', null);
    if (!username)
        return (0, resSend_1.resSend)(res, true, 'Couldn\'t find user', null);
    const isAlreadyInteracted = comment[reactionType].includes(username);
    const oppositeReaction = reactionType === 'likes' ? 'dislikes' : 'likes';
    const isOppositeInteracted = comment[oppositeReaction].includes(username);
    if (isAlreadyInteracted) {
        const updatedPost = await postDb.findOneAndUpdate({ 'comments.id': commentId }, { $pull: { [`comments.$.${reactionType}`]: username } });
        return (0, resSend_1.resSend)(res, false, 'Comment unliked', null);
    }
    else {
        const updatedPost = await postDb.findOneAndUpdate({ 'comments.id': commentId }, { $push: { [`comments.$.${reactionType}`]: username } });
        if (isOppositeInteracted) {
            const updatedOpposite = await postDb.findOneAndUpdate({ 'comments.id': commentId }, { $pull: { [`comments.$.${oppositeReaction}`]: username } });
        }
        return (0, resSend_1.resSend)(res, false, 'Comment liked', null);
    }
};
exports.toggleCommentInteraction = toggleCommentInteraction;