"use strict";
const request = require("request");
const {pageAccessToken} = require("./config")

module.exports = class GraphApi {

    static async callSendAPI(requestBody) {
        request({
            'uri': 'https://graph.facebook.com/v12.0/me/messages',
            'qs': {'access_token': pageAccessToken},
            'method': 'POST',
            'json': requestBody
        }, (err, _res, _body) => {
            if (!err) {
                console.log('Message sent!');
            } else {
                console.error('Unable to send message:' + err);
            }
        });
    }

    static async setIcebreakers(iceBreakers) {
        let json = {
            platform: "instagram",
            ice_breakers: iceBreakers
        };
        const options = {
            url: 'https://graph.facebook.com/v12.0/me/messenger_profile',
            qs: {'access_token': pageAccessToken},
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(json)
        };

        request(options, (err, _res, _body) => {
            if (!_body.err) {
                console.log(_body);
                console.log('Icebreakers have been set!');
            } else {
                console.warn(`Error setting ice breakers`, err);
            }
        });
    }
};
