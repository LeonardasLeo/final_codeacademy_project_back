import mongoose, {Schema} from 'mongoose'

const postSchema = new Schema({
    username: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: true
    },
    title: {
        type: String,
        require: true
    },
    likes: {
        type: Array,
        require: true
    },
    dislikes: {
        type: Array,
        require: true,
    },
    comments: {
        type: Array,
        require: true
    },
    timestamp: {
        type: Date,
        require: true
    }
})

const post = mongoose.model('final_project_posts', postSchema)

module.exports = post