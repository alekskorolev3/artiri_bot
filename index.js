'use strict';

const
    express = require('express'),
    request = require('request'),
    config = require("./services/config"),
    {urlencoded, json} = require('body-parser'),
    app = express();
const {verifyToken, pageAccessToken} = require("./services/config");

app.use(urlencoded({extended: true}));

app.use(json());

app.post('/webhook', (req, res) => {

    let body = req.body;

    if (body.object === 'instagram') {

        console.log(body)
        body.entry.forEach(function (entry) {
            if ("changes" in entry) {
                console.log("here")
                if (entry.changes[0].field === "comments") {
                    let change = entry.changes[0].value;
                    if (entry.changes[0].value) console.log("Got a comments event");
                    let requestBody = {
                        recipient: {
                            "comment_id": change.id
                        },
                        message: "Спасибо за комментарий;)",
                        tag: "HUMAN_AGENT"
                    };

                    callSendAPI(requestBody);
                }
            }

            let webhookEvent = entry.messaging[0];

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
            'text': `Вы отправили сообщение: '${receivedMessage.text}`
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
                        'title': 'Это нужное изображение?',
                        'subtitle': 'Нажмите кнопку для ответа.',
                        'image_url': attachmentUrl,
                        'buttons': [
                            {
                                'type': 'postback',
                                'title': 'Да!',
                                'payload': 'yes',
                            },
                            {
                                'type': 'postback',
                                'title': 'Нет!',
                                'payload': 'no',
                            }
                        ],
                    }]
                }
            }
        };
    }

    let requestBody = {
        'recipient': {
            'id': senderPsid
        },
        'message': response
    };
    // Send the response message
    callSendAPI(requestBody);
}

// Handles messaging_postbacks events
function handlePostback(senderPsid, receivedPostback) {
    let response;

    // Get the payload for the postback
    let payload = receivedPostback.payload;

    // Set the response based on the postback payload
    if (payload === 'SALES') {
        response = {'text': '*Написать текст по стоимости оплаты*'};
    } else if (payload === 'ORDER') {
        response = {
            'text': '*Здесь располагается алгоритм заказа*',
            'payload': 'QUALITY'
        };
    } else if (payload === 'QUALITY') {
        response = {'text': '*Здесь текст по качеству*'};
    }

    let requestBody = {
        'recipient': {
            'id': senderPsid
        },
        'message': response
    };
    // Send the message to acknowledge the postback
    callSendAPI(requestBody);
}

// Sends response messages via the Send API
function callSendAPI(requestBody) {



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

async function setIcebreakers(iceBreakers) {
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

async function main() {
    config.checkEnvVariables();
    const iceBreakers = [
        {
            call_to_actions:
                [
                    {
                        question: "Price",
                        payload: "SALES"
                    },
                    {
                        question: "Time",
                        payload: "ORDER"
                    },
                    {
                        question: "Quality",
                        payload: "QUALITY"
                    }
                ],
            locale: "default"
        },
        {
            call_to_actions:
                [
                    {
                        question: "Стойкость краски 🎨",
                        payload: "COLOUR"
                    },
                    {
                        question: "Время",
                        payload: "ORDER"
                    },
                    {
                        question: "Качество",
                        payload: "QUALITY"
                    }
                ],
            locale: "ru_RU"
        }

    ];

    await setIcebreakers(iceBreakers);
    app.listen(process.env.PORT || 1337, () => console.log('webhook is listening on port 1337'));
}

main();
