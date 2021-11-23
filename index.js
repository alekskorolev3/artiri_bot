'use strict';

const
    express = require('express'),
    request = require('request'),
    config = require("./services/config"),
    {urlencoded, json} = require('body-parser'),
    GraphApi = require("./services/graph-api"),
    app = express();
const {verifyToken} = require("./services/config");

app.use(urlencoded({extended: true}));

app.use(json());

app.post('/webhook', (req, res) => {

    let body = req.body;

    if (body.object === 'instagram') {

        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(function (entry) {
            let webhookEvent = entry.messaging[0];

            // Get the sender PSID
            let senderPsid = webhookEvent.sender.id;
            console.log('Sender PSID: ' + senderPsid);

            if (webhookEvent.message) {
                handleMessage(senderPsid, webhookEvent.message);
            } else if (webhookEvent.postback) {
                handlePostback(senderPsid, webhookEvent.postback);
            }
        });

        res.status(200).send('EVENT_RECEIVED');
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

function handleMessage(senderPsid, receivedMessage) {
    let response;

    // Checks if the message contains text
    if (receivedMessage.text) {
        // Create the payload for a basic text message, which
        // will be added to the body of your request to the Send API
        response = {
            'text': `You sent the message: '${receivedMessage.text}'. Now send me an attachment!`
        };
    } else if (receivedMessage.attachments) {

        // Get the URL of the message attachment
        let attachmentUrl = receivedMessage.attachments[0].payload.url;
        response = {
            'attachment': {
                'type': 'template',
                'payload': {
                    'template_type': 'generic',
                    'elements': [{
                        'title': 'Is this the right picture?',
                        'subtitle': 'Tap a button to answer.',
                        'image_url': attachmentUrl,
                        'buttons': [
                            {
                                'type': 'postback',
                                'title': 'Yes!',
                                'payload': 'yes',
                            },
                            {
                                'type': 'postback',
                                'title': 'No!',
                                'payload': 'no',
                            }
                        ],
                    }]
                }
            }
        };
    }

    // Send the response message
    GraphApi.callSendAPI(senderPsid, response);
}

// Handles messaging_postbacks events
function handlePostback(senderPsid, receivedPostback) {
    let response;

    // Get the payload for the postback
    let payload = receivedPostback.payload;

    // Set the response based on the postback payload
    if (payload === 'yes') {
        response = {'text': 'Thanks!'};
    } else if (payload === 'no') {
        response = {'text': 'Oops, try sending another image.'};
    }
    // Send the message to acknowledge the postback
    callSendAPI(senderPsid, response);
}


async function main() {

    config.checkEnvVariables();

    const iceBreakers = [
        {
            question: "Test case 1",
            payload: "CARE_SALES"
        },
        {
            question: "Test case 3",
            payload: "SEARCH_ORDER"
        },
        {
            question: "Test case 3",
            payload: "CARE_HELP"
        }
    ];

    await GraphApi.setIcebreakers(iceBreakers);

    // // Set our page subscriptions
    // await GraphApi.setPageSubscriptions();

    app.listen(process.env.PORT || 1337, () => console.log('webhook is listening on port 1337'));
}

main();
