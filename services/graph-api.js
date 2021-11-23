"use strict";

const config = require("./config"),
    fetch = require("node-fetch"),
    { URL, URLSearchParams } = require("url");
const request = require("request");
const {pageAccessToken} = require("./services/config");

module.exports = class GraphApi {
    static async callSendAPI(senderPsid, response) {

        let requestBody = {
            'recipient': {
                'id': senderPsid
            },
            'message': response
        };

        // Send the HTTP request to the Messenger Platform
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

    // static async getUserProfile(senderIgsid) {
    //     let url = new URL(`${config.apiUrl}/${senderIgsid}`);
    //     url.search = new URLSearchParams({
    //         access_token: config.pageAccesToken,
    //         fields: "name,profile_pic"
    //     });
    //     let response = await fetch(url);
    //     if (response.ok) {
    //         let userProfile = await response.json();
    //         return {
    //             name: userProfile.name,
    //             profilePic: userProfile.profile_pic
    //         };
    //     } else {
    //         console.warn(
    //             `Could not load profile for ${senderIgsid}: ${response.statusText}`
    //         );
    //         return null;
    //     }
    // }

    static async setIcebreakers(iceBreakers) {
        let url = new URL(`${config.apiUrl}/me/messenger_profile`);
        url.search = new URLSearchParams({
            access_token: config.pageAccessToken
        });
        let json = {
            platform: "instagram",
            ice_breakers: iceBreakers
        };
        let response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(json)
        });
        if (response.ok) {
            console.log(`Icebreakers have been set.`);
        } else {
            console.warn(`Error setting ice breakers`, response.statusText);
        }
    }

    // static async setPageSubscriptions() {
    //     let url = new URL(`${config.apiUrl}/${config.pageId}/subscribed_apps`);
    //     url.search = new URLSearchParams({
    //         access_token: config.pageAccesToken,
    //         subscribed_fields: "feed"
    //     });
    //     let response = await fetch(url, {
    //         method: "POST"
    //     });
    //     if (response.ok) {
    //         console.log(`Page subscriptions have been set.`);
    //     } else {
    //         console.warn(`Error setting page subscriptions`, response.statusText);
    //     }
    // }
};
