import {Request, RequestHandler, Response} from "express";
import {IncomingDataTypes, RequestWithData, UserTypes} from "../types";
import {resSend} from "../modules/resSend";
import {toggleCommentInteraction, togglePostInteraction} from "./postInteractionHanlder";
const userDb = require('../modules/userSchema')
const postDb = require('../modules/postSchema')
const bcrypt = require('bcrypt')

type GetAllData = {
    user: UserTypes.User
    allPosts: UserTypes.Post[]
    allUsers: UserTypes.User[]
}

const getAllData = async (res: Response, username: string | undefined): Promise<GetAllData | void> => {
    const user: UserTypes.User = await userDb.findOne({username}, {password: 0})
    if (!user) return resSend(res, true, 'User not found in database', null)
    const allPosts: UserTypes.Post[] = await postDb.find()
    let allUsers: UserTypes.User[] = await userDb.find()
    allUsers = allUsers.filter((x: UserTypes.User) => x.username !== username)
    return {user, allPosts, allUsers}
}

export const register: RequestHandler = (req: RequestWithData, res: Response): void => {
    const {username}: IncomingDataTypes.RegisterAndLoginData = req.body
    const {hash} = req
    const user: UserTypes.User = new userDb({
        username,
        password: hash,
        profilePic: 'https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg',
        messages: {},
        myPosts: []
    })
    // @ts-ignore
    user.save()
        .then((): void => {
            resSend(res, false, 'saved user to db', null)
        })
        .catch((): void => {
            resSend(res, true, 'failed to save user to db', null)
        })
}

export const login: RequestHandler = async (req: RequestWithData, res: Response): Promise<void> => {
    const {token, username} = req
    const data: GetAllData | void = await getAllData(res, username)
    if (!data) return
    const {user, allPosts, allUsers}: GetAllData = data
    resSend(res, false, null, {user, token, allPosts, allUsers})
}

export const getUserData: RequestHandler = async (req: RequestWithData, res: Response): Promise<void> => {
    const {username} = req
    const data: GetAllData | void = await getAllData(res, username)
    if (!data) return
    const {user, allPosts, allUsers}: GetAllData = data
    resSend(res, false, null, {user, allUsers, allPosts})
}

export const changePassword: RequestHandler = async (req: RequestWithData, res: Response): Promise<void> => {
    const {username} = req
    const {passwordOne}: {passwordOne: string} = req.body
    const newPassword: string = await bcrypt.hash(passwordOne, 10)
    const updatedUser: UserTypes.User = await userDb.findOneAndUpdate({username}, {$set: {password: newPassword}})
    if (!updatedUser) return resSend(res, true, 'User not found in database', null)
    resSend(res, false, 'Password changed', null)
}

export const changeProfilePic: RequestHandler = async (req: RequestWithData, res: Response): Promise<void> => {
    const {username} = req
    const {image}: {image: string} = req.body
    const updatedUser: UserTypes.User = await userDb.findOneAndUpdate({username}, {$set: {profilePic: image}}, {new: true, password: 0})
    if (!updatedUser) return resSend(res, true, 'User not found in database', null)
    resSend(res, false, 'Picture changed', updatedUser)
}

export const addPost: RequestHandler = async (req: RequestWithData, res: Response): Promise<void> => {
    const {username} = req
    const {title, image}: IncomingDataTypes.PostData = req.body
    const post: UserTypes.Post = new postDb({
        username,
        image,
        title,
        likes: [],
        dislikes: [],
        comments: [],
        timestamp: new Date()
    })
    // @ts-ignore
    post.save()
        .then((): void => {
            resSend(res, false, 'post added to db', null)
        })
        .catch((): void => {
            resSend(res, true, 'failed to add post to db', null)
        })
}

export const likePost: RequestHandler = async (req: RequestWithData, res: Response): Promise<void> => {
    const {username} = req
    const {id}: {id: string} = req.body
    await togglePostInteraction(username, id, res, 'likes')
}

export const dislikePost: RequestHandler = async (req: RequestWithData, res: Response): Promise<void> => {
    const {username} = req
    const {id}: {id: string} = req.body
    await togglePostInteraction(username, id, res, 'dislikes')
}

export const sendMessage: RequestHandler = async (req: RequestWithData, res: Response): Promise<void> => {
    const {username} = req
    const {messageValue, to}: IncomingDataTypes.MessageData = req.body
    if (!username) return resSend(res, true, 'Couldn\'t authorize sender', null)
    const message: UserTypes.Message = {
        sender: username,
        value: messageValue
    }
    await userDb.findOneAndUpdate({username: to.username}, {$push: {[`messages.${username}`]: message}})
    await userDb.findOneAndUpdate({username}, {$push: {[`messages.${to.username}`]: message}}, {new: true})
    resSend(res, false, 'Message sent', null)
}

export const getSinglePost: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const {id}: {id: string} = req.body
    const post: UserTypes.Post | undefined = await postDb.findOne({_id: id})
    if (!post) return resSend(res, true, 'Couldn\'t get post', null)
    resSend(res, false, null, post)
}

export const getSingleUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const {username}: {username: string} = req.body
    const user: UserTypes.User | undefined = await userDb.findOne({username})
    if (!user) return resSend(res, true, 'Couldn\'t get user', null)
    resSend(res, false, null, user)
}

export const comment: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const {comment, id}: IncomingDataTypes.CommentOnPostData = req.body
    const post = await postDb.findOneAndUpdate({_id: id}, {$push: {comments: comment}}, {new: true})
    if (!post) return resSend(res, true, 'Failed to add comment', null)
    resSend(res, false, 'Comment added', null)
}

export const likeComment: RequestHandler = async (req: RequestWithData, res: Response): Promise<void> => {
    const {username} = req
    const {commentId}: {commentId: number} = req.body
    await toggleCommentInteraction(username, commentId, res, 'likes')
}

export const dislikeComment: RequestHandler = async (req: RequestWithData, res: Response): Promise<void> => {
    const {username} = req
    const {commentId}: {commentId: number} = req.body
    const post: UserTypes.Post = await postDb.findOne({'comments.id': commentId})
    await toggleCommentInteraction(username, commentId, res, 'dislikes')
}