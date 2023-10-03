import mongoose, {Schema} from 'mongoose'

const userSchema = new Schema({
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    profilePic: {
        type: String,
        require: true
    },
    messages: {
        type: Object,
        require: true,
    },
    myPosts: {
        type: Array,
        require: true
    },
}, {minimize: false})

const user = mongoose.model('final_project_users', userSchema)

module.exports = user