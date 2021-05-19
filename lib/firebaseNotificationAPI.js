const axios = require('axios');
const config = require('../config');
const logger = config.logger.createLogger('lib/firebase');
const moment = require('moment');

// Android & IOS User & Driver Apps keys.
const android_userApp_key = 'AAAADqnSCn8:APA91bHM9j78CH_rSmIhLv8dEVkPMapE-02loUvtfC1PiOIvi_bJBvpkaAm6ceugJF1MVfju1T1Jsa8fdwbJpt4kEj37tdph1t1EZ2u-xPgprOIbebfmu0UNf_V2bQNRf70xFnzXnaG_';
const android_driverApp_key = 'AAAAQ8w4fSk:APA91bHWJ8SHof2wSdR2zT1XsV-L55iZPuRnkJt4yKP-BytWM6RBO60f-WqG4sr_Iw9HCxLZpuYYUdi4t-T_sOXtgAKokjnEDo4ry9sgpDVczPbJ6myLM-YDporfsv3a4x7lpGkHQ1kZ';
const ios_userApp_key = 'AAAA27XnJks:APA91bGt4JaIfOcvWn_ty1k7iByIPdMkHZ-ANO64vUSX2EfY_8YbF0X4Oz70e0E-9dR09S3HRGyFbL0a03n_2UaGY5x6ArHhS5DV9Gk_GwTu-V7B_T5vq5Hth_VhDIofmIvANAFI45QT';
const ios_driverApp_key = '';

// Ride FCM Msg
exports.sendFireBaseNotification = async (fcmToken, deviceType, title, description, appType, rideId, rideStatus) => {
    try {
        let key = '';
        let results;
        let dataObj = {};
        if (deviceType.match('android')) {
            if (appType.match('appUser')) {
                key = android_userApp_key;
                logger.info('Sending FCM notifications to Android App User', fcmToken);
            } else if (appType.match('driver')) {
                key = android_driverApp_key;
                logger.info('Sending FCM notifications to Android Driver', fcmToken);
            } else {
                logger.debug('Wrong app type');
            }
        } else if (deviceType.match('ios')) {
            if (appType.match('appUser')) {
                key = ios_userApp_key;
                logger.info('Sending FCM notifications to IOS App User', fcmToken);
                dataObj = {
                    notification: {
                        title: title,
                        body: description,
                        sound: 'default'
                    },
                };
            } else if (appType.match('driver')) {
                key = ios_driverApp_key;
                logger.info('Sending FCM notifications to IOS Driver', fcmToken);
                dataObj = {
                    notification: {
                        title: title,
                        body: description,
                        sound: 'default'
                    },
                };
            } else {
                logger.debug('Wrong app type');
            }
        } else {
            logger.debug('Wrong device type');
        }

        results = await axios({
            method: 'post',
            url: 'https://fcm.googleapis.com/fcm/send',
            headers: {'Content-type': 'application/json', 'Authorization': `key=${key}`},
            data: {
                data: {
                    title: title,
                    body: description,
                    rideId: rideId,
                    type: 'ride',
                    time: (moment(new Date()).add(5, 'h')).format('YYYY-MM-DD hh:mm:ss A'),
                    rideStatus: rideStatus
                },
                ...dataObj,
                content_available: true,
                priority: 'high',
                to: fcmToken
            }
        });

        if (results.status === 200) {
            logger.debug('FCM Successfully Send');
            logger.debug(results.data.results);
        } else {
            logger.debug('FCM Successfully Not Send');
            logger.debug(results.data.results);
        }
    } catch (error) {
        logger.error(error);
    }

};

// Ride Request FCM Msg 
exports.sendRideRequestFireBaseNotification = async (fcmToken, deviceType, title, description, appType, rideDetails) => {
    try {
        let results;
        let key = '';
        if (deviceType.match('android')) {
            if (appType.match('driver')) {
                key = android_driverApp_key;
                logger.info('Sending Ride Request FCM notifications to Android Driver', fcmToken);
            } else {
                logger.debug('Wrong app type');
            }
        } else if (deviceType.match('ios')) {
            if (appType.match('driver')) {
                key = ios_driverApp_key;
                logger.info('Sending FCM notifications to IOS Driver', fcmToken);
            } else {
                logger.debug('Wrong app type');
            }
        } else {
            logger.debug('Wrong device type');
        }

        results = await axios({
            method: 'post',
            url: 'https://fcm.googleapis.com/fcm/send',
            headers: {'Content-type': 'application/json', 'Authorization': `key=${key}`},
            data: {
                data: {
                    title: title,
                    body: description,
                    type: 'rideRequest',
                    rideStatus: 'searching',
                    ride_id: rideDetails.ride_id,
                    user_id: rideDetails.user_id,
                    user_rating: rideDetails.user_rating,
                    appUser_first_name: rideDetails.appUser_first_name,
                    appUser_last_name: rideDetails.appUser_last_name,
                    appUser_profile_pic: rideDetails.appUser_profile_pic,
                    pickup_address: rideDetails.pickup_address,
                    pickup_lat: rideDetails.pickup_lat,
                    pickup_long: rideDetails.pickup_long,
                    dropoff_lat: rideDetails.dropoff_lat,
                    dropoff_long: rideDetails.dropoff_long,
                    dropoff_address: rideDetails.dropoff_address,
                    time: (moment(new Date()).add(5, 'h')).format('YYYY-MM-DD hh:mm:ss A'),
                    ride_status: rideDetails.ride_status
                },
                content_available: true,
                priority: 'high',
                to: fcmToken
            }
        });

        if (results.status === 200) {
            logger.debug('FCM Successfully Send');
            logger.debug(results.data.results);
        } else {
            logger.debug('FCM Successfully Not Send');
            logger.debug(results.data.results);
        }
    } catch (error) {
        logger.error(error);
    }

};

// Notification FCM Msg
exports.sendNotificationByFireBase = async (fcmToken, deviceType, title, description, appType, notificationId) => {
    if (description.length > 100) {
        description = (description.slice(0, 100)) + '...';
    }
    let key = '';
    let dataObj = {};
    if (deviceType.match('android')) {
        if (appType.match('appUser')) {
            key = android_userApp_key;
            logger.info('Sending Notification FCM to Android App User', fcmToken);
        } else if (appType.match('driver')) {
            key = android_driverApp_key;
            logger.info('Sending Notification FCM to Android Driver', fcmToken);
        } else {
            logger.debug('Wrong app type');
        }
    } else if (deviceType.match('ios')) {
        if (appType.match('appUser')) {
            key = ios_userApp_key;
            logger.info('Sending Notification FCM to IOS App User', fcmToken);
            dataObj = {
                notification: {
                    title: title,
                    body: description,
                    sound: 'default'
                },
            };
        } else if (appType.match('driver')) {
            key = ios_driverApp_key;
            logger.info('Sending Notification FCM to IOS Driver', fcmToken);
            dataObj = {
                notification: {
                    title: title,
                    body: description,
                    sound: 'default'
                },
            };
        } else {
            logger.debug('Wrong app type');
        }
    } else {
        logger.debug('Wrong device type');
    }
    try {
        let results = await axios({
            method: 'post',
            url: 'https://fcm.googleapis.com/fcm/send',
            headers: {'Content-type': 'application/json', 'Authorization': `key=${key}`},
            data: {
                data: {
                    title: title,
                    body: description,
                    notificationId: notificationId,
                    time: (moment(new Date()).add(5, 'h')).format('YYYY-MM-DD hh:mm:ss A'),
                    type: 'simple'
                },
                ...dataObj,
                content_available: true,
                priority: 'high',
                to: fcmToken
            }
        });

        return {fcmToken: fcmToken, sendStatus: results.status};
    } catch (error) {
        logger.error(error);
        return {fcmToken: fcmToken, sendStatus: 400};
    }
};

// Ride Chat FCM Msg
exports.sendChatMessageByFireBase = async (fcmToken, deviceType, title, description, appType, rideId) => {
    if (description.length > 100) {
        description = (description.slice(0, 100)) + '...';
    }
    let key = '';
    let dataObj = {};
    if (deviceType.match('android')) {
        if (appType.match('appUser')) {
            key = android_userApp_key;
            logger.info('Sending ride chat msg FCM to Android App User', fcmToken);
        } else if (appType.match('driver')) {
            key = android_driverApp_key;
            logger.info('Sending ride chat msg FCM to Android Driver', fcmToken);
        } else {
            logger.debug('Wrong app type');
        }
    } else if (deviceType.match('ios')) {
        if (appType.match('appUser')) {
            key = ios_userApp_key;
            logger.info('Sending ride chat msg FCM to IOS App User', fcmToken);
            dataObj = {
                notification: {
                    title: title,
                    body: description,
                    sound: 'default'
                },
            };
            console.log('Set notification in DATA for IOS');
        } else if (appType.match('driver')) {
            key = ios_driverApp_key;
            logger.info('Sending ride chat msg FCM to IOS Driver', fcmToken);
            dataObj = {
                notification: {
                    title: title,
                    body: description,
                    sound: 'default'
                },
            };
            console.log('Set notification in DATA for IOS');
        } else {
            logger.debug('Wrong app type');
        }
    } else {
        logger.debug('Wrong device type');
    }

    try {
        let results = await axios({
            method: 'post',
            url: 'https://fcm.googleapis.com/fcm/send',
            headers: {'Content-type': 'application/json', 'Authorization': `key=${key}`},
            data: {
                data: {
                    title: title,
                    body: description,
                    ride_id: rideId,
                    time: (moment(new Date()).add(5, 'h')).format('YYYY-MM-DD hh:mm:ss A'),
                    type: 'chat'
                },
                ...dataObj,
                content_available: true,
                priority: 'high',
                to: fcmToken
            }
        });

        if (results.status === 200) {
            logger.debug('FCM Successfully Send');
            logger.debug(results.data.results);
        } else {
            logger.debug('FCM Successfully Not Send');
            logger.debug(results.data.results);
        }

        return {fcmToken: fcmToken, sendStatus: results.status};
    } catch (error) {
        logger.error(error);
        return {fcmToken: fcmToken, sendStatus: 400};
    }
};

// Driver Account Approval FCM Msg
exports.sendDriverApprovalFireBaseNotification = async (fcmToken, deviceType, title, description, appType, driver) => {
    try {
        let key = '';
        let results;
        if (deviceType.match('android')) {
            if (appType.match('driver')) {
                key = android_driverApp_key;
                logger.info('Sending Account Approval FCM notifications to Android Driver', fcmToken);
            } else {
                logger.debug('Wrong app type');
            }
        } else if (deviceType.match('ios')) {
            if (appType.match('driver')) {
                key = ios_driverApp_key;
                logger.info('Sending Account Approval FCM notifications to IOS Driver', fcmToken);
            } else {
                logger.debug('Wrong app type');
            }
        } else {
            logger.debug('Wrong device type');
        }

        results = await axios({
            method: 'post',
            url: 'https://fcm.googleapis.com/fcm/send',
            headers: {'Content-type': 'application/json', 'Authorization': `key=${key}`},
            data: {
                data: {
                    title: title,
                    body: description,
                    type: 'accountApproval',
                    time: (moment(new Date()).add(5, 'h')).format('YYYY-MM-DD hh:mm:ss A'),
                    user_id: driver.user_id,
                    first_name: driver.first_name,
                    last_name: driver.last_name,
                    profile_pic: driver.profile_pic,
                    token: driver.token,
                    email: driver.email,
                    verified: driver.verified
                },
                content_available: true,
                priority: 'high',
                to: fcmToken
            }
        });

        if (results.status === 200) {
            logger.debug('FCM Successfully Send');
            logger.debug(results.data.results);
        } else {
            logger.debug('FCM Successfully Not Send');
            logger.debug(results.data.results);
        }
    } catch (error) {
        logger.error(error);
    }

};

// In Active Driver FCM Msg
exports.sendInActiveDriverFireBaseNotification = async (fcmToken, deviceType, title, description, appType) => {
    try {
        let key = '';
        let results;
        if (deviceType.match('android')) {
            if (appType.match('driver')) {
                key = android_driverApp_key;
                logger.info('Sending Un-Active Driver FCM notifications to Android Driver', fcmToken);
            } else {
                logger.debug('Wrong app type');
            }
        } else if (deviceType.match('ios')) {
            if (appType.match('driver')) {
                key = ios_driverApp_key;
                logger.info('Sending Un-Active Driver FCM notifications to IOS Driver', fcmToken);
            } else {
                logger.debug('Wrong app type');
            }
        } else {
            logger.debug('Wrong device type');
        }

        results = await axios({
            method: 'post',
            url: 'https://fcm.googleapis.com/fcm/send',
            headers: {'Content-type': 'application/json', 'Authorization': `key=${key}`},
            data: {
                data: {
                    title: title,
                    body: description,
                    type: 'inActiveDriver',
                    time: (moment(new Date()).add(5, 'h')).format('YYYY-MM-DD hh:mm:ss A')
                },
                content_available: true,
                priority: 'high',
                to: fcmToken
            }
        });

        if (results.status === 200) {
            logger.debug('FCM Successfully Send');
            logger.debug(results.data.results);
        } else {
            logger.debug('FCM Successfully Not Send');
            logger.debug(results.data.results);
        }
    } catch (error) {
        logger.error(error);
    }

};

// Driver Bonus FCM Msg
exports.sendDriverBonusFireBaseNotification = async (fcmToken, deviceType, title, description, appType) => {
    try {
        let key = '';
        let results;
        if (deviceType.match('android')) {
            if (appType.match('driver')) {
                key = android_driverApp_key;
                logger.info('Sending Driver Bonus FCM notifications to Android Driver', fcmToken);
            } else {
                logger.debug('Wrong app type');
            }
        } else if (deviceType.match('ios')) {
            if (appType.match('driver')) {
                key = ios_driverApp_key;
                logger.info('Sending Driver Bonus FCM notifications to IOS Driver', fcmToken);
            } else {
                logger.debug('Wrong app type');
            }
        } else {
            logger.debug('Wrong device type');
        }

        results = await axios({
            method: 'post',
            url: 'https://fcm.googleapis.com/fcm/send',
            headers: {'Content-type': 'application/json', 'Authorization': `key=${key}`},
            data: {
                data: {
                    title: title,
                    body: description,
                    type: 'driverBonus',
                    time: (moment(new Date()).add(5, 'h')).format('YYYY-MM-DD hh:mm:ss A')
                },
                content_available: true,
                priority: 'high',
                to: fcmToken
            }
        });

        if (results.status === 200) {
            logger.debug('FCM Successfully Send');
            logger.debug(results.data.results);
        } else {
            logger.debug('FCM Successfully Not Send');
            logger.debug(results.data.results);
        }
    } catch (error) {
        logger.error(error);
    }
};