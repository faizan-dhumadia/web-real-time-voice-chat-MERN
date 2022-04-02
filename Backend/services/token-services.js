const jwt = require('jsonwebtoken')
const refreshModels = require('../models/refreshModels')
const accessTokenSecrets = process.env.JWT_ACCESS_TOKEN_SECRET
const refreshTokenSecrets = process.env.JWT_REFRESH_TOKEN_SECRET
class TokenServices {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, accessTokenSecrets, {
            expiresIn: '1m'
        })
        const refreshToken = jwt.sign(payload, refreshTokenSecrets, {
            expiresIn: '1y'
        })
        return { accessToken, refreshToken }
    }

    async storeRefreshToken(token, userId) {
        try {
            await refreshModels.create({
                token,
                userId
            })
        } catch (error) {
            console.log(error.message);
        }
    }
    async verifyaccesstoken(token) {
        return jwt.verify(token, accessTokenSecrets)
    }
    async verifyRefreshToken(refreshToken) {
        return jwt.verify(refreshToken, refreshTokenSecrets)
    }
    async findRefreshToken(userId, refreshToken) {
        return await refreshModels.findOne({ userId: userId, token: refreshToken })
    }
    async updateRefreshToken(userId, refreshToken) {
        return await refreshModels.updateOne({ userId: userId }, { token: refreshToken })
    }
    async removeToken(refreshToken) {
        return await refreshModels.deleteOne({ token: refreshToken })
    }
}

module.exports = new TokenServices();