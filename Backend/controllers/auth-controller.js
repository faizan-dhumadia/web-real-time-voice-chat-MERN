const UserDto = require("../dtos/user-dto");
const hashServices = require("../services/hash-services");
const otpServices = require("../services/otp-services");
const tokenServices = require("../services/token-services");
const usersServices = require("../services/users-services");



class AuthController {
    async sendOtp(req, res) {
        const { phone } = req.body;
        if (!phone) {
            res.status(400).json({ message: 'Phone field is required!' });
        }

        const otp = await otpServices.generateOTP();

        const ttl = 1000 * 60 * 2; // 2 min
        const expires = Date.now() + ttl;
        const data = `${phone}.${otp}.${expires}`;
        const hash = hashServices.hashOtp(data);
        console.log("OTP:", otp);
        // send OTP
        try {
            // await otpServices.sendBySms(phone, otp);
            res.json({
                hash: `${hash}.${expires}`,
                phone,
                otp,
            });
        } catch (err) {
            console.log("Error in OTP:", err);
            res.status(500).json({ message: 'message sending failed' });
        }
    }

    async verifyOtp(req, res) {
        const { otp, hash, phone } = req.body;
        if (!otp || !hash || !phone) {
            res.status(400).json({ message: "All field required" })
        }
        const [hashedOtp, expires] = hash.split('.');
        if (Date.now() > +expires) {
            res.status(400).json({ message: "OTP expires" })
        }
        const data = `${phone}.${otp}.${expires}`;
        const isValid = otpServices.verifyOTP(hashedOtp, data);

        if (!isValid) {
            res.status(400).json({ message: "Invalid otp" })
        }
        let user;

        try {

            user = await usersServices.findUser({ phone })
            if (!user) {
                user = await usersServices.createUser({ phone })
            }
        } catch (error) {
            console.log("Error in finding user:", err);
            res.status(500).json({ message: "DB error" })
        }


        const { accessToken, refreshToken } = tokenServices.generateTokens({ _id: user._id, activated: false })

        await tokenServices.storeRefreshToken(refreshToken, user._id)

        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true
        });
        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true
        });
        const userDto = new UserDto(user)
            // res.json({accessToken,user: userDto})
        res.json({ user: userDto, auth: true })
    }

    async refresh(req, res) {
        const { refreshToken: refreshTokenFromCookies } = req.cookies;
        let userData;
        try {
            userData = await tokenServices.verifyRefreshToken(refreshTokenFromCookies)

        } catch (error) {
            return res.status(401).json({ message: "invalid token" })
        }


        try {
            const token = await tokenServices.findRefreshToken(userData._id, refreshTokenFromCookies);
            if (!token) {
                return res.status(401).json({ message: "Invalid Token" })
            }

        } catch (error) {
            return res.status(500).json({ message: "internal server error" })
        }

        const user = await usersServices.findUser({ _id: userData._id })
        if (!user) {
            return res.status(404).json({ message: "noUser" })

        }

        const { refreshToken, accessToken } = tokenServices.generateTokens({ _id: userData._id })

        try {
            await tokenServices.updateRefreshToken(userData._id, refreshToken)
        } catch (error) {

            res.status(500).json({ message: "internal server error" })
        }

        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true
        });
        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true
        });
        const userDto = new UserDto(user)
        res.json({ user: userDto, auth: true })
    }

    async logout(req, res) {
        const { refreshToken } = req.cookies;
        await tokenServices.removeToken(refreshToken);
        res.clearCookie('refreshToken')
        res.clearCookie('accessToken')
        res.json({ user: null, isAuth: false })

    }

}

module.exports = new AuthController();