const jwt = require('jsonwebtoken')
module.exports = {
    verifyToken: (token: string): string | undefined => {
        try{
            return jwt.verify(token, process.env.JWT_SECRET)
        } catch (e) {
            console.log('Jwt verification failed')
            return undefined
        }
    }
}