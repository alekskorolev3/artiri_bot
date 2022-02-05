'use strict';

const
    express = require('express'),
    config = require("./services/config"),
    {urlencoded, json} = require('body-parser'),
    app = express();
const {verifyToken} = require("./services/config");
const Receive = require("./services/receive");
const User = require("./services/user");
const {iceBreakers} = require("./services/const");
const GraphAPI = require("./services/graph-api");

let users = {};

app.use(urlencoded({extended: true}));

app.use(json());

app.post('/webhook', (req, res) => {

    let body = req.body;

    if (body.object === 'instagram') {

        res.status(200).send('EVENT_RECEIVED');

        body.entry.forEach(function (entry) {
            if ("changes" in entry) {
                let receiveMessage = new Receive();
                if (entry.changes[0].field === "comments") {
                    let change = entry.changes[0].value;
                    if (entry.changes[0].value) console.log("Got a comments event");
                    return receiveMessage.handlePrivateReply("comment_id", change.id);
                }
            }

            if (!("messaging" in entry)) {
                console.warn("No messaging field in entry. Possibly a webhook test.");
                return;
            }

            entry.messaging.forEach(async function (webhookEvent) {
                if ("message" in webhookEvent && webhookEvent.message.is_echo === true) {
                    console.log("Got an echo");
                    return;
                }

                let senderIgsid = webhookEvent.sender.id;

                if (!(senderIgsid in users)) {
                    let user = new User(senderIgsid);
                    let userProfile = await GraphApi.getUserProfile(senderIgsid);
                    if (userProfile) {
                        user.setProfile(userProfile);
                        users[senderIgsid] = user;
                        console.log(`Created new user profile`);
                        console.dir(user);
                    }
                }

                let receiveMessage = new Receive(users[senderIgsid], webhookEvent);
                return receiveMessage.handleMessage();
            });
        });
    } else {
        res.sendStatus(404);
    }

});

app.get('/webhook', (req, res) => {

    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === verifyToken) {

            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            res.sendStatus(403);
        }
    }
});

// function handleMessage(senderPsid, receivedMessage) {
//
//     if (receivedMessage.text === '+') {
//         let postback = {
//             payload: "BACK"
//         };
//         console.log(postback)
//         handlePostback(senderPsid, postback)
//     }
//
//     if (receivedMessage.quick_reply) {
//         let postback = {
//             payload: receivedMessage.quick_reply.payload
//         };
//         console.log(postback)
//         handlePostback(senderPsid, postback)
//     }
// }

// function handlePostback(senderPsid, receivedPostback) {
//
//     let response;
//     let payload = receivedPostback.payload;
//
//     // switch (payload) {
//     //     case 'COLOUR':
//     //         response = colourResponse;
//     //         break;
//     //     case 'RECOMMENDATIONS':
//     //         response = recommendationResponse;
//     //         break;
//     //     case 'TYPES_OF_COLOUR':
//     //         response = typesOfColoursResponse;
//     //         break;
//     //     case 'PRICE':
//     //         response = priceResponse;
//     //         break;
//     //     case 'TIME':
//     //         response = timeResponse;
//     //         break;
//     //     case 'CLOTHES':
//     //         response = clothesResponse;
//     //         break;
//     //     case 'CLOTHES_LIST':
//     //         response = clothesListResponse;
//     //         break;
//     //     case 'PLACE_TO_BUY':
//     //         response = placeToBuyResponse;
//     //         break;
//     //     case 'HOW_TO_DELIVER':
//     //         response = howToDeliverResponse;
//     //         break;
//     //     case 'DELIVERING_AND_PAYMENT':
//     //         response = deliveringAndPaymentResponse;
//     //         break;
//     //     case 'DISCOUNT':
//     //         response = discountResponse;
//     //         break;
//     //     case 'CERTIFICATES':
//     //         response = certificatesResponse;
//     //         break;
//     //     case 'HUMAN_AGENT':
//     //         response = humanAgentResponse;
//     //         break;
//     //     case 'BACK':
//     //         response = backResponse;
//     //         break;
//     // }
//
//     let requestBody = {
//         'recipient': {
//             'id': senderPsid
//         },
//         'message': response
//     };
//
//     callSendAPI(requestBody);
// }

// function callSendAPI(requestBody) {
//
//
//     // Send the HTTP request to the Messenger Platform
//     request({
//         'uri': 'https://graph.facebook.com/v12.0/me/messages',
//         'qs': {'access_token': pageAccessToken},
//         'method': 'POST',
//         'json': requestBody
//     }, (err, _res, _body) => {
//         if (!err) {
//             console.log('Message sent!');
//         } else {
//             console.error('Unable to send message:' + err);
//         }
//     });
// }


async function main() {
    config.checkEnvVariables();

    await GraphAPI.setIcebreakers(iceBreakers);

    app.listen(process.env.PORT || 1337, () => console.log('webhook is listening on port 1337'));
}

main();
