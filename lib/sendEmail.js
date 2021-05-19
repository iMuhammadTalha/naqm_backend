var nodemailer = require('nodemailer');
const moment = require('moment');
const config = require('../config');
const logger = config.logger.createLogger('lib/sendEmail');
const emailAddress = 'info@buraak.org';
const password = 'Saba@143143';


transporter = nodemailer.createTransport({
    //service: 'gmail',
    host: 'mail.privateemail.com',
    port: 465,
    secure: true,
    auth: {
        user: emailAddress,
        pass: password
    }
});

exports.sendRideCompletionEmail = function (email, rideDetails) {
    logger.info('Sending receipt email to: ', email);
    if (rideDetails.dropoff_location === null || rideDetails.dropoff_location === '') {
        rideDetails.dropoff_location = 'Guided by user';
    }
    let mailOptions = {
        from: emailAddress,
        to: email,
        name: 'Buraak Billing',
        subject: 'Receipt for Buraak Ride',
        // text: 'Ride detail',
        html: '<div class="">  \n' +
            '  <div style="margin:0;padding:0;border:0;font-size:100%;font:inherit;line-height:1;padding:15px;font-size:14px;background:#B4903A">\n' +
            '    <table style="margin:0;padding:0;border:0;font-size:100%;font:inherit;border-collapse:collapse;border-spacing:0;background:white;border-radius:4px;padding:32px 0;border-collapse:separate;width:100%;display:table">\n' +
            '      <tbody><tr style="margin:0;padding:0;border:0;font-size:100%;font:inherit">\n' +
            '        <td style="margin:0;padding:0;border:0;font-size:100%;font:inherit">\n' +
            '          <div style="margin:0;padding:0;border:0;font-size:100%;font:inherit;text-align:right;margin-right:24px">\n' +
            '            <img src="https://buraak.org/asset/new/images/logo.png" style="margin:0;padding:0;border:0;font-size:100%;font:inherit;width:100px;max-width:100px;height:auto" class="CToWUd">\n' +
            '          </div>\n' +
            '        </td>\n' +
            '      </tr>\n' +
            '      <tr style="margin:0;padding:0;border:0;font-size:100%;font:inherit">\n' +
            '        <td style="margin:0;padding:0;border:0;font-size:100%;font:inherit">\n' +
            '          <div style="margin:0;padding:0;border:0;font-size:100%;font:inherit;padding:0 32px">\n' +
            '            <p style="margin:0;padding:0;border:0;font-size:100%;font:inherit;color:#6d6e70;margin:30px 0 0 0;margin-top:0">\n' +
            '              Hey\n' +
            '            <span style="margin:0;padding:0;border:0;font-size:100%;font:inherit;color:#000;font-weight:bold"> \n' +
            '' + rideDetails.appuser_firstname + ' ' + rideDetails.appuser_lastname + '\n' +
            '</span>,\n' +
            '          </p>\n' +
            '            <p style="margin:0;padding:0;border:0;font-size:100%;font:inherit;color:#6d6e70;margin:30px 0 0 0">\n' +
            '              Thank you for using Buraak on\n' +
            '            <span style="margin:0;padding:0;border:0;font-size:100%;font:inherit;color:#000;font-weight:bold">\n' +
            (moment(new Date(rideDetails.start_time))).format('LLLL') + '\n' +
            '</span>.\n' +
            '          </p>\n' +
            '            <p style="margin:0;padding:0;border:0;font-size:100%;font:inherit;color:#6d6e70;margin:30px 0 0 0;margin-bottom:30px;padding-bottom:30px;vertical-align:baseline;border-bottom:1px solid #e3e8ec">\n' +
            '              Your ride fare was\n' +
            '            <span style="margin:0;padding:0;border:0;font-size:100%;font:inherit;color:#000;font-weight:bold">PKR\n' +
            rideDetails.fares +
            '</span>.\n' +
            '          </p>\n' +
            '          </div>\n' +
            '        </td>\n' +
            '      </tr>\n' +
            '      <tr style="margin:0;padding:0;border:0;font-size:100%;font:inherit">\n' +
            '        <td style="margin:0;padding:0;border:0;font-size:100%;font:inherit">\n' +
            '          <div style="margin:0;padding:0;border:0;font-size:100%;font:inherit;padding:0 32px">\n' +
            '            <div style="margin:0;padding:0;border:0;font-size:100%;font:inherit;display:flex">\n' +
            '              <div style="margin:0;padding:0;border:0;font-size:100%;font:inherit;width:8px;height:8px;border-radius:6px;border:2px solid #CBB94F"></div>\n' +
            '              <div style="margin:0;padding:0;border:0;font-size:100%;font:inherit;font-weight:bold;margin:0 0 0 16px">Pickup</div>\n' +
            '              <div style="margin:0;padding:0;border:0;font-size:100%;font:inherit;margin:0 0 0 auto;color:#8899a6;font-size:12px">\n' +
            (moment(new Date(rideDetails.start_time))).format('LT') + '\n' +
            '</div>\n' +
            '            </div>\n' +
            '            <div style="margin:0;padding:0;border:0;font-size:100%;font:inherit;color:#6d6e70;padding:0 0 14px 22px;border-left:2px solid #CBB94F;margin:2px 0 0 5px">\n' +
            '              <div style="margin:0;padding:0;border:0;font-size:100%;font:inherit;padding:4px 0 0 0">\n' +
            rideDetails.pickup_location + '\n' +
            '</div>\n' +
            '            </div>\n' +
            '            <div style="margin:0;padding:0;border:0;font-size:100%;font:inherit;display:flex;margin-top:2px">\n' +
            '              <div style="margin:0;padding:0;border:0;font-size:100%;font:inherit;width:8px;height:8px;border-radius:6px;border:2px solid #CBB94F;background:#CBB94F"></div>\n' +
            '              <div style="margin:0;padding:0;border:0;font-size:100%;font:inherit;font-weight:bold;margin:0 0 0 16px">Dropoff</div>\n' +
            '              <div style="margin:0;padding:0;border:0;font-size:100%;font:inherit;margin:0 0 0 auto;color:#8899a6;font-size:12px">\n' +
            (moment(new Date(rideDetails.end_time))).format('LT') + '\n' +
            '</div>\n' +
            '            </div>\n' +
            '            <div style="margin:0;padding:0;border:0;font-size:100%;font:inherit;color:#6d6e70;padding:0 0 14px 22px;border-left:2px solid #CBB94F;margin:2px 0 0 5px;border-color:transparent;padding-bottom:0">\n' +
            '              <div style="margin:0;padding:0;border:0;font-size:100%;font:inherit;padding:4px 0 0 0">\n' +
            rideDetails.dropoff_location + '\n' +
            '</div>\n' +
            '            </div>\n' +
            '          </div>\n' +
            '        </td>\n' +
            '      </tr>\n' +
            '    </tbody></table>\n' +
            '\n' +
            '    <tr style="margin:0;padding:0;border:0;font:inherit">\n' +
            '                <td style="margin:2px;padding-left:25px;border:0;font-size:12px">\n' +
            '  <sub>\n' +
            '</sub>\n' +
            '</td>\n' +
            '</tr>\n' +
            '\n' +
            '</tbody></table>\n' +
            '    <table style="margin:0;padding:0;border:0;font-size:100%;font:inherit;border-collapse:collapse;border-spacing:0;background:white;border-radius:4px;padding:32px 0;border-collapse:separate;width:100%;display:table;margin:15px 0 0 0">\n' +
            '      <tbody><tr style="margin:0;padding:0;border:0;font-size:100%;font:inherit">\n' +
            '        <td style="margin:0;padding:0;border:0;font-size:100%;font:inherit">\n' +
            '          <table style="margin:0;padding:0;border:0;font-size:100%;font:inherit;border-collapse:collapse;border-spacing:0;border-collapse:separate;width:100%;display:table;padding:0 32px">\n' +
            '            <tbody><tr style="margin:0;padding:0;border:0;font-size:100%;font:inherit">\n' +
            '              <td style="margin:0;padding:0;border:0;font-size:100%;font:inherit">\n' +
            '                <div style="margin:0;padding:0;border:0;font-size:100%;font:inherit;color:#8899a6;font-size:12px;display:flex">\n' +
            '                  Your fare breakdown\n' +
            '                </div>\n' +
            '              </td>\n' +
            '            </tr>\n' +
            '            <tr style="margin:0;padding:0;border:0;font-size:100%;font:inherit">\n' +
            '              <td style="margin:0;padding:0;border:0;font-size:100%;font:inherit">\n' +
            '                <div style="margin:0;padding:0;border:0;font-size:100%;font:inherit;margin:5px 0 0 0">\n' +
            '                  <div style="margin:0;padding:0;border:0;font-size:100%;font:inherit;padding:7px 0 10px 0;border-bottom:1px solid #e3e8ec;color:#606c74">\n' +
            '                                     <div style="margin:0;padding:0;border:0;font-size:100%;font:inherit;display:flex;margin:10px 0 0 0">\n' +
            '                          <div style="margin:0;padding:0;border:0;font-size:100%;font:inherit">Base Fare</div>\n' +
            '                          <div style="margin:0;padding:0;border:0;font-size:100%;font:inherit;margin:0 0 0 auto">\n' +
            rideDetails.base_fare +
            '</div>\n' +
            '                        </div>\n' +
            '                                     <div style="margin:0;padding:0;border:0;font-size:100%;font:inherit;display:flex;margin:10px 0 0 0">\n' +
            '                          <div style="margin:0;padding:0;border:0;font-size:100%;font:inherit">Distance Fare</div>\n' +
            '                          <div style="margin:0;padding:0;border:0;font-size:100%;font:inherit;margin:0 0 0 auto">\n' +
            rideDetails.distance_fare +
            '</div>\n' +
            '                        </div>\n' +
            '                                     <div style="margin:0;padding:0;border:0;font-size:100%;font:inherit;display:flex;margin:10px 0 0 0">\n' +
            '                          <div style="margin:0;padding:0;border:0;font-size:100%;font:inherit">Time Fare</div>\n' +
            '                          <div style="margin:0;padding:0;border:0;font-size:100%;font:inherit;margin:0 0 0 auto">\n' +
            rideDetails.time_fare +
            '</div>\n' +
            '                        </div>\n' +
            '                                     <div style="margin:0;padding:0;border:0;font-size:100%;font:inherit;display:flex;margin:10px 0 0 0">\n' +
            '                          <div style="margin:0;padding:0;border:0;font-size:100%;font:inherit">Insurance fee</div>\n' +
            '                          <div style="margin:0;padding:0;border:0;font-size:100%;font:inherit;margin:0 0 0 auto">\n' +
            rideDetails.insurance_fee +
            '</div>\n' +
            '                        </div>\n' +
            '                  </div>\n' +
            '                  \n' +
            '                  \n' +
            '                             <div style="margin:0;padding:0;border:0;font-size:100%;font:inherit;display:flex;margin:10px 0 0 0">\n' +
            '                        <div style="margin:0;padding:0;border:0;font-size:100%;font:inherit">Discount</div>\n' +
            '                        <div style="margin:0;padding:0;border:0;font-size:100%;font:inherit;margin:0 0 0 auto">\n' +
            rideDetails.discount +
            '</div>\n' +
            '                      </div>\n' +
            '                             <div style="margin:0;padding:0;border:0;font-size:100%;font:inherit;display:flex;margin:10px 0 0 0">\n' +
            '                        <div style="margin:0;padding:0;border:0;font-size:100%;font:inherit"> Payment dues</div>\n' +
            '                        <div style="margin:0;padding:0;border:0;font-size:100%;font:inherit;margin:0 0 0 auto">\n' +
            rideDetails.payment_dues +
            '</div>\n' +
            '                      </div>\n' +
            '\n' +
            '\n' +
            '                  </div>\n' +
            '                  <div style="margin:0;padding:0;border:0;font-size:100%;font:inherit;padding:7px 0 10px 0;border-bottom:1px solid #e3e8ec;color:#606c74;padding-bottom:0;border-bottom:0">\n' +
            '                    <div style="margin:0;padding:0;border:0;font-size:100%;font:inherit;display:flex;margin:10px 0 0 0;font-weight:bold;color:#2d2e2e">\n' +
            '                      <div style="margin:0;padding:0;border:0;font-size:100%;font:inherit">Total fares</div>\n' +
            '                      <div style="margin:0;padding:0;border:0;font-size:100%;font:inherit;margin:0 0 0 auto">PKR \n' +
            rideDetails.fares +
            '</div>\n' +
            '                    </div>\n' +
            '                  </div>\n' +
            '                </td></tr></tbody></table></td></tr></tbody></table></div>\n' +
            '\n' +
            '                <table style="text-align: center;margin:auto;padding:0;border:0;font-size:100%;font:inherit;border-collapse:collapse;border-spacing:0;background:white;border-radius:4px;border-collapse:separate;width:100%;display:table;margin:15px 0 0 0">\n' +
            '                  <tbody>\n' +
            '                  <tr style="margin:0;padding:0;border:0;font-size:100%;font:inherit">\n' +
            '                    <td style="margin:0;padding:0;border:0;font-size:100%;font:inherit">\n' +
            '                      <table style="margin:auto;padding:0;border:0;font-size:100%;font:inherit;border-collapse:collapse;border-spacing:0;display:block;border-collapse:separate;width:100%;display:table;padding:0 32px">\n' +
            '                        <tbody><tr style="margin:0;padding:0;border:0;font-size:100%;font:inherit">\n' +
            '                          <td style="margin:0;padding:0;border:0;font-size:100%;font:inherit;display:inline">\n' +
            '                            <table style="margin:auto;padding:0;border:0;font-size:100%;font:inherit;border-collapse:collapse;border-spacing:0;width:100%;">\n' +
            '                              <tbody><tr>\n' +
            '                              <td style="margin:0;padding:0;border:0;font-size:100%;font:inherit;width:88%">\n' +
            '                                <table style="margin:auto;padding:0;border:0;font-size:100%;font:inherit;border-collapse:collapse;border-spacing:0;text-align: center;">\n' +
            '                                  <tbody>\n' +
            '                                    <tr style="margin:0;padding:0;border:0;font-size:100%;font:inherit">\n' +
            '                                      <td style="margin:0;padding:0;border:0;font-size:100%;font:inherit;font-weight:bold">\n' +
            '                                        <img src="https://ci4.googleusercontent.com/proxy/Yb06t-fHjOK9L9oQNWF_xmsbOy4gtgH-1Kg5_6kmQSOOCCz0jJIN-mlfIq1BgQYx3mQf8oe-yBELYI22hNwJfYmls32TBJLtyFWoZcAObHTo0EbryHPz_t1i_OM=s0-d-e1-ft#https://s3-eu-west-1.amazonaws.com/trip-reciept/assets/captain_avatar.png" style="margin:auto;padding:0;border:0;font-size:100%;font:inherit;width:56px;height:56px" class="CToWUd">\n' +
            '                                      </td>\n' +
            '                                    </tr>\n' +
            '  \n' +
            '                                    <tr style="margin:0;padding:0;border:0;font-size:100%;font:inherit">\n' +
            '                                    <td style="margin:0;padding:0;border:0;font-size:100%;font:inherit;font-weight:bold">\n' +
            rideDetails.driver_firstname + ' ' + rideDetails.driver_lastname + '\n' +
            '                                                  </td>\n' +
            '                                  </tr>\n' +
            '                                  <tr style="margin:0;padding:0;border:0;font-size:100%;font:inherit">\n' +
            '                                    <td style="margin:0;padding:0;border:0;font-size:100%;font:inherit;color:#606c74">\n' +
            rideDetails.vehicle + '\n' +
            '                                    </td>\n' +
            '                                  </tr>\n' +
            '                                  <tr style="margin:0;padding:0;border:0;font-size:100%;font:inherit">\n' +
            '                                    <td style="margin:0;padding:0;border:0;font-size:100%;font:inherit;color:#606c74">\n' +
            '+92' + rideDetails.driver_mobile +
            '                                    </td>\n' +
            '                                  </tr>\n' +
            '                                </tbody></table>\n' +
            '                              </td>\n' +
            '                            </tr></tbody></table>\n' +
            '                          </td>\n' +
            '                        </tr>\n' +
            '                      </tbody></table>\n' +
            '                    </td>\n' +
            '                  </tr>\n' +
            '                </tbody></table>\n' +
            '\n' +
            '    <table style="margin:15px 0;padding:0;border:0;font-size:100%;font:inherit;border-collapse:collapse;border-spacing:0;background:white;border-radius:4px;border-collapse:separate;width:100%;display:table;">\n' +
            '      <tbody><tr style="margin:0;padding:0;border:0;font-size:100%;font:inherit">\n' +
            '        <td style="margin:0;padding:0;border:0;font-size:100%;font:inherit">\n' +
            '          <table style="margin:0;padding:0;border:0;font-size:100%;font:inherit;border-collapse:collapse;border-spacing:0;border-collapse:separate;width:100%;display:table;padding:0 32px">\n' +
            '            <tbody><tr style="margin:0;padding:0;border:0;font-size:100%;font:inherit">\n' +
            '              <td style="margin:0;padding:0;border:0;font-size:100%;font:inherit">\n' +
            '                <a href="https://buraak.org/">\n' +
            '                <p style="margin:0;padding:0;border:0;font-size:100%;font:inherit;font-weight:bold;text-align:center;font-size:14px;margin-bottom:3px">\n' +
            '                  Thank you for using Buraak\n' +
            '                      </p>\n' +
            '                    </a>\n' +
            '              </td>\n' +
            '            </tr>\n' +
            '\n' +
            '            <tr style="margin:0;padding:0;border:0;font-size:100%;font:inherit">\n' +
            '              <td style="margin:0;padding:0;border:0;font-size:100%;font:inherit">\n' +
            '                <div style="margin:20px auto;padding:0;border:0;font-size:100%;font:inherit;display:flex;width:max-content;margin-bottom:4px">\n' +
            '                  <div style="margin:0;padding:0;border:0;font-size:100%;font:inherit;margin-left:3px;margin-right:3px">\n' +
            '                    <a href="https://www.facebook.com/Buraak.pk/" style="margin:0;padding:0;border:0;font-size:100%;font:inherit" rel="noreferrer" target="_blank">\n' +
            '                      <img src="https://ci4.googleusercontent.com/proxy/IUn-uW3enJKbEW5CU4STwp0wS_Pw4hBRvaumNXzf0DAWPOxberLVy5Vmp0b_Ect9cjowS6bciU8lTbFhARF9kCGBzscEQtuqAR3iJZNdpHX-MW_7YSe2HqCxlsLV=s0-d-e1-ft#https://s3-eu-west-1.amazonaws.com/trip-reciept/assets/icons/Social_Fb.png" style="margin:0;padding:0;border:0;font-size:100%;font:inherit;width:24px;height:24px" class="CToWUd">\n' +
            '                    </a>\n' +
            '                  </div>\n' +
            '                  <div style="margin:0;padding:0;border:0;font-size:100%;font:inherit;margin-left:3px;margin-right:3px">\n' +
            '                    <a href="https://twitter.com/bzamwa" style="margin:0;padding:0;border:0;font-size:100%;font:inherit" rel="noreferrer" target="_blank" >\n' +
            '                      <img src="https://ci3.googleusercontent.com/proxy/c17zWDS7qdZjLbLc6JedkGdyiCuXTQ5oJ3zw9RPKzs9NOTSK3YYmqrDwm-MFGvcd4dYMX7mS9Ieywnb94ub_MHNHrZbRsTTyqvRNsUVH47VJ477U8j5JnzCwwQlzWd3ca7c=s0-d-e1-ft#https://s3-eu-west-1.amazonaws.com/trip-reciept/assets/icons/Social_twitter.png" style="margin:0;padding:0;border:0;font-size:100%;font:inherit;width:24px;height:24px" class="CToWUd">\n' +
            '                    </a>\n' +
            '                  </div>\n' +
            '                  <div style="margin:0;padding:0;border:0;font-size:100%;font:inherit;margin-left:3px;margin-right:3px">\n' +
            '                    <a href="https://www.instagram.com/buraak_cab/" style="margin:0;padding:0;border:0;font-size:100%;font:inherit" rel="noreferrer" target="_blank" >\n' +
            '                      <img src="https://ci6.googleusercontent.com/proxy/v52KjYwxz7r0LZ98K4y91rZZwV6beEzxcmY5WWLEWSrs5uPla_3S4wcA_21wPpXY2MalmDWv3dib0fmZ0Y35ocrSv9GlbSXnFYYavmKTUyTseJEck-UznXJhUwRxHUt-=s0-d-e1-ft#https://s3-eu-west-1.amazonaws.com/trip-reciept/assets/icons/Social_Insta.png" style="margin:0;padding:0;border:0;font-size:100%;font:inherit;width:24px;height:24px" class="CToWUd">\n' +
            '                    </a>\n' +
            '                  </div>\n' +
            '                </div>\n' +
            '              </td>\n' +
            '            </tr>\n' +
            '            <tr style="margin:0;padding:0;border:0;font-size:100%;font:inherit">\n' +
            '              <td style="margin:0;padding:0;border:0;font-size:100%;font:inherit">\n' +
            '                <p style="margin:0;padding:0;border:0;font-size:100%;font:inherit;color:#8899a6;text-align:center">\n' +
            '                  Copyright ⓒ 2020 Buraak. All rights reserved.\n' +
            '                    </p>\n' +
            '              </td>\n' +
            '            </tr>\n' +
            '          </tbody></table>\n' +
            '        </td>\n' +
            '      </tr>\n' +
            '    </tbody></table><div class="yj6qo"></div><div class="adL">\n' +
            '  \n' +
            '\n' +
            '</div></div><div class="adL">\n' +
            '</div></div></div><div id=":18c" class="ii gt" style="display:none"><div id=":18d" class="a3s aXjCH undefined"></div></div><div class="hi"></div></div>'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

exports.emailAddress = emailAddress;
exports.transporter = transporter;