const axios = require('axios');
const config = require('../config');
const logger = config.logger.createLogger('lib/otp');

// const baseUrl = 'https://pk.eocean.us/APIManagement/API/RequestAPI?user=BURAAK&pwd=AIer1LFWwcp1dKYMTy1m25El67jI0uziB6yjoZ7U8NMREUfYWHWOkajXvOE2sUMfnw%3d%3d&sender=BURAAK&reciever=';

const baseUrl = 'http://smsctp3.eocean.us:24555/api?action=sendmessage&username=buraak&password=BurK9896&';
	
exports.sendMessage = async (verificationCode, role, phoneNumber, hash) => {
    // const message = `Dear Buraak ${role}, Your OTP for verification is ${verificationCode}. \n ${hash}`;
    // const sendSms = await axios.get(`${baseUrl}${phoneNumber}&msg-data=${message}&response=string`);
    // logger.debug('sendSms status ', sendSms.status);

    const message = `Dear ${role}, Your code for verification is ${verificationCode}. \n ${hash}`;
	const sendSms = await axios.get(`${baseUrl}recipient=${phoneNumber}&originator=99095&messagedata=${message}`);
	logger.debug('sendSms status', sendSms.data);
	
    // if (sendSms.status === 200) {
    if (sendSms.data) {
        return (200);
    } else {
        return (400);
    }
};

exports.sendDriverAccountApprovalMessage = async (phoneNumber, msg) => {
    const message = msg;
    const sendSms = await axios.get(`${baseUrl}recipient=${phoneNumber}&originator=99095&messagedata=${message}`);

    logger.debug('sendSms status ', sendSms.data);

    if (sendSms.data === 200) {
        return (200);
    } else {
        return (400);
    }
};