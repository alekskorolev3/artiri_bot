"use strict";
const request = require("request");
const {pageAccessToken} = require("./config")
const config = require("./config")
const {URL, URLSearchParams} = require("url");
const fetch = require("node-fetch")

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


    static async passThreadControl(senderIgsid) {

        let requestBody = {
            recipient: {
                id: senderIgsid
            },
            target_app_id: 1217981644879628
        }

        request({
            'uri': 'https://graph.facebook.com/v12.0/me/pass_thread_control',
            'qs': {'access_token': pageAccessToken},
            'method': 'POST',
            'json': requestBody
        }, (err, _res, _body) => {
            if (!err) {
                console.log('Pass thread control: ' + JSON.stringify(_body));
            } else {
                console.error('Unable to pass thread:' + err);
            }
        });
    }

    static async takeThreadControl(senderIgsid) {

        let requestBody = {
            recipient: {
                id: senderIgsid
            }
        }

        request({
            'uri': 'https://graph.facebook.com/v12.0/me/take_thread_control',
            'qs': {'access_token': pageAccessToken},
            'method': 'POST',
            'json': requestBody
        }, (err, _res, _body) => {
            if (!err) {
                console.log('Thread control successful! ' + JSON.stringify(_body));
            } else {
                console.error('Unable to pass thread:' + err);
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

    static async getUserProfile(senderIgsid) {
        let url = new URL(`${config.apiUrl}/${senderIgsid}`);
        url.search = new URLSearchParams({
            access_token: config.pageAccesToken,
            fields: "name,profile_pic"
        });
        let response = await fetch(url);
        if (response.ok) {
            let userProfile = await response.json();
            return {
                name: userProfile.name,
                profilePic: userProfile.profile_pic
            };
        } else {
            console.warn(
                `Could not load profile for ${senderIgsid}: ${response.statusText}`
            );
            return null;
        }
    }
};
