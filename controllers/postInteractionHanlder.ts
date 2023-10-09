import {RequestWithData, UserTypes} from "../types";
import {Response} from "express";
import {resSend} from "../modules/resSend";
const postDb = require('../modules/postSchema')
export const toggleCommentInteraction = async (username: string | undefined, commentId: number, res: Response, reactionType: 'likes' | 'dislikes') => {
    const post: UserTypes.Post = await postDb.findOne({'comments.id': commentId})
    if (!post) return resSend(res, true, 'Couldn\'t find post', null)
    const comment: UserTypes.Comment | undefined = post.comments.find((x: UserTypes.Comment) => x.id === commentId)
    if (!comment) return resSend(res, true, 'Couldn\'t find comment', null)
    if (!username) return resSend(res, true, 'Couldn\'t find user', null)
    const isAlreadyInteracted: boolean = comment[reactionType].includes(username)
    const oppositeReaction: 'likes' | 'dislikes' = reactionType === 'likes' ? 'dislikes' : 'likes'
    const isOppositeInteracted: boolean = comment[oppositeReaction].includes(username)
    if (isAlreadyInteracted){
        await postDb.findOneAndUpdate({'comments.id': commentId}, {$pull: {[`comments.$.${reactionType}`]: username}})
        return resSend(res, false, 'Comment unliked', null)
    }else{
        const updatedPost = await postDb.findOneAndUpdate({'comments.id': commentId}, {$push: {[`comments.$.${reactionType}`]: username}})
        if (isOppositeInteracted){
            await postDb.findOneAndUpdate({'comments.id': commentId}, {$pull: {[`comments.$.${oppositeReaction}`]: username}})
        }
        return resSend(res, false, 'Comment liked', null)
    }
}

export const togglePostInteraction = async (username: string | undefined, postId: string, res: Response, reactionType: 'likes' | 'dislikes') => {
    const post: UserTypes.Post = await postDb.findOne({_id: postId})
    if (!username) return resSend(res, true, 'Couldn\'t find user', null)
    const isAlreadyInteracted: boolean = post[reactionType].includes(username)
    const oppositeReaction: 'likes' | 'dislikes' = reactionType === 'likes' ? 'dislikes' : 'likes'
    const isOppositeInteracted: boolean = post[oppositeReaction].includes(username)
    if (isAlreadyInteracted){
        await postDb.findOneAndUpdate({_id: postId}, {$pull: {[reactionType]: username}})
        return resSend(res, false, 'Comment unliked', null)
    }else{
        await postDb.findOneAndUpdate({_id: postId}, {$push: {[reactionType]: username}}, {new:true})
        if (isOppositeInteracted){
            const updatedOpposite = await postDb.findOneAndUpdate({_id: postId}, {$pull: {[oppositeReaction]: username}})
        }
        return resSend(res, false, 'Comment liked', null)
    }
}