const tokenServices = require("../services/token-services");

module.exports = async function(req, res, next) {
    try {
        const { accessToken } = req.cookies;
        console.log("Access Token:", accessToken);
        if (!accessToken) {
            throw new Error();
        }
        const userData = await tokenServices.verifyaccesstoken(accessToken)
        if (!userData) {
            throw new Error();
        }
        req.user = userData;
        console.log("User Data:", userData);
        next()

    } catch (error) {
        res.status(401).json({ message: 'Invalid Token' })
    }
}