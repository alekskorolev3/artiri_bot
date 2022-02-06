'use strict';

const
    express = require('express'),
    config = require("./services/config"),
    {urlencoded, json} = require('body-parser'),
    app = express();
const Receive = require("./services/receive");
const User = require("./services/user");
const {iceBreakers} = require("./services/const");
const GraphApi = require("./services/graph-api");

let users = {};

app.use(urlencoded({extended: true}));

app.use(json());

app.post('/webhook', (req, res) => {

    let body = req.body;

    console.log(body)

    if (body.object === 'instagram') {

        res.status(200).send('EVENT_RECEIVED');

        body.entry.forEach(function (entry) {
            if ("changes" in entry) {
                console.log(entry.changes)
                let receiveMessage = new Receive();
                if (entry.changes[0].field === "comments") {
                    let change = entry.changes[0].value;
                    if (entry.changes[0].value) console.log("Got a comments event");
                    return receiveMessage.handlePrivateReply("comment_id", change.id);
                }
            }

            if ("standby" in entry) {
                let requestBody = {
                    recipient: {
                        id: this.senderIgsid
                    },
                    target_app_id: 1217981644879628
                };
                GraphApi.passThreadControl(requestBody)
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

                let receiveMessage = new Receive(senderIgsid, webhookEvent);
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
        if (mode === 'subscribe' && token === config.verifyToken) {

            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            res.sendStatus(403);
        }
    }
});

async function main() {
    config.checkEnvVariables();

    await GraphApi.setIcebreakers(iceBreakers);

    app.listen(process.env.PORT || 1337, () => console.log('webhook is listening on port 1337'));
}

main();
