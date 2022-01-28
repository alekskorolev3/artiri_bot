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
            } else
            if (webhookEvent.postback) {
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
    // let response;
    // if (receivedMessage.text) {
    //
    // } else if (receivedMessage.attachments) {
    //
    //     let attachmentUrl = receivedMessage.attachments[0].payload.url;
    //     response = {
    //         'attachment': {
    //             'type': 'template',
    //             'payload': {
    //                 'template_type': 'generic',
    //                 'elements': [{
    //                     'title': 'Это нужное изображение?',
    //                     'subtitle': 'Нажмите кнопку для ответа.',
    //                     'image_url': attachmentUrl,
    //                     'buttons': [
    //                         {
    //                             'type': 'postback',
    //                             'title': 'Да!',
    //                             'payload': 'yes',
    //                         },
    //                         {
    //                             'type': 'postback',
    //                             'title': 'Нет!',
    //                             'payload': 'no',
    //                         }
    //                     ],
    //                 }]
    //             }
    //         }
    //     };
    // }
    //
    // let requestBody = {
    //     'recipient': {
    //         'id': senderPsid
    //     },
    //     'message': response
    // };
    // // Send the response message
    // callSendAPI(requestBody);

    if (receivedMessage.quick_reply) {
        let postback = {
            payload: receivedMessage.quick_reply.payload
        };
        console.log(postback)
        handlePostback(senderPsid, postback)
    }
}

// Handles messaging_postbacks events
function handlePostback(senderPsid, receivedPostback) {

    let response;

    // Get the payload for the postback
    let payload = receivedPostback.payload;

    switch (payload) {
        case 'COLOUR':
            response = {
                'text': 'Я использую специальную акриловую краску по ткани. Она НЕ СМЫВАЕТСЯ!\n' +
                    '👉Главное придерживаться рекомендаций по уходу',
                "quick_replies":[
                    {
                        "content_type":"text",
                        "title":"Рекомендации по уходу",
                        "payload":"RECOMMENDATIONS"
                    },
                    {
                        "content_type":"text",
                        "title":"Виды красок",
                        "payload":"TYPES_OF_COLOUR"
                    },
                    {
                        "content_type":"text",
                        "title":"Назад",
                        "payload":"BACK"
                    }
                ]
            };
            break;
        case 'RECOMMENDATIONS':
            response = {
                'text': '-Деликатный режим/режим ручной стирки\n' +
                    '-Передстиркой выверните вещь наизнанку\n' +
                    '-Вода не более 30°\n' +
                    '-Минимальный отжим\n' +
                    '-Не используйте отбеливающие средства\n' +
                    '-Утюжить место с рисунком через хлопковую ткань или с изнаночной стороны( утюг не должен касаться рисунка)\n' +
                    '-Храните вещи на плечиках\n' +
                    '-Не допускайте смятия рисунка при хранении\n' +
                    '-Не допускайте длительного контакта рисунка с горячими поверхностями(с кожаными сидениями в жаркую погоду)',
                "quick_replies":[
                    {
                        "content_type":"text",
                        "title":"Назад",
                        "payload":"BACK"
                    }
                ]
            };
            break;
        case 'TYPES_OF_COLOUR':
            response = {
                'text': '🖌На прилавке представлены краски десятка фирм, но я отдаю своё предпочтение в основном DEC0LA и РЕВЕО, это фавориты. DECOLA предназначена для натуральных тканей( хлопок, лён). PEBEO как для натуральных, так и для искусственных( полиэстер, болонь, плащевка, кожа)\n' +
                    '\n' +
                    '🎨Цветовая гамма огромная, в том числе флюоресцентные краски и люминесцентные уже других производителей.\n' +
                    '\n' +
                    '👩‍🎨Также я использую специальные баллончики с краской для одежды, что дает возможность создавать эффект граффити.',
                "quick_replies":[
                    {
                        "content_type":"text",
                        "title":"Назад",
                        "payload":"BACK"
                    }
                ]
            };
            break;
        case 'TIME':
            response = {
                'text': 'Время работы зависи от сложности работы и срочности исполнения заказа. Обсуждается в индивидуальном порядке 😏\n' +
                    'Срочный заказы от 2-5 дней\n' +
                    'Обычные от 3 до 14 дней',
                "quick_replies":[
                    {
                        "content_type":"text",
                        "title":"Назад",
                        "payload":"BACK"
                    }
                ]
            };
            break;
        case 'BACK':
            response = {
                'text': 'Чем я могу Вам помочь?',
                "quick_replies":[
                    {
                        "content_type":"text",
                        "title":"Стойкость краски 🎨",
                        "payload":"COLOUR"
                    },
                    {
                        "content_type":"text",
                        "title":"Время работы⏰",
                        "payload":"TIME"
                    },
                    {
                        "content_type":"text",
                        "title":"Тест",
                        "payload":"COLOUR"
                    }
                ]
            };
            break;
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
                        question: "Время работы⏰",
                        payload: "TIME"
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
