const crypto = require('crypto');
const hashServices = require('./hash-services');

const smsid = process.env.SMS_SID;
const smsAuthTocken = process.env.SMS_AUTH_TOKEN
const twilio = require('twilio')(smsid, smsAuthTocken, {
    lazyLoading: true
});


class OtpServices {
    async generateOTP() {
        const otp = crypto.randomInt(1000, 9999);
        return otp;
    }

    // async sendBySMS(phone, otp) {
    //     return await twilio.messages.create({
    //         to: phone,
    //         from: process.env.SMS_FROM_NUMBER,
    //         body: `Your Let's Talk OTP is ${otp}`
    //     })
    // }
    verifyOTP(hashedOtp, data) {
        let computedHash = hashServices.hashOtp(data);
        return computedHash == hashedOtp;
    }
}

module.exports = new OtpServices();