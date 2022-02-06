"use strict";

const GraphApi = require("./graph-api");
const {
    colourResponse,
    recommendationResponse,
    typesOfColoursResponse,
    priceResponse,
    timeResponse,
    clothesResponse,
    clothesListResponse,
    placeToBuyResponse,
    howToDeliverResponse,
    deliveringAndPaymentResponse,
    discountResponse,
    certificatesResponse,
    humanAgentResponse,
    backResponse, reactions, humanOtherResponse, humanPriceResponse, humanOrderResponse
} = require("./const");

module.exports = class Receive {
    constructor(senderIgsid, webhookEvent) {
        this.senderIgsid = senderIgsid;
        this.webhookEvent = webhookEvent;
        this.persona_id = null;
    }

    handleMessage() {
        let event = this.webhookEvent;

        let responses;

        console.log(event)

        try {
            if (event.message) {
                let message = event.message;

                if (message.is_echo) {
                    return;
                } else if (message.quick_reply) {
                    responses = this.handleQuickReply();
                } else if (message.attachments) {
                    responses = this.handleAttachmentMessage();
                } else if (message.text) {
                    responses = this.handleTextMessage();
                }
            } else if (event.postback) {
                responses = this.handlePostback();
            } else if (event.referral) {
                responses = this.handleReferral();
            }
        } catch (error) {
            console.error(error);
            responses = {
                text: `An error has occured: '${error}'. We have been notified and \
        will fix the issue shortly!`
            };
        }

        if (!responses) {
            return;
        }

        if (Array.isArray(responses)) {
            let delay = 0;
            for (let response of responses) {
                this.sendMessage(response, delay * 2000);
                delay++;
            }
        } else {
            this.sendMessage(responses);
        }
    }

    handleTextMessage() {
        console.log(
            `Received text from (${this.senderIgsid}):\n`,
            this.webhookEvent.message.text
        );

        let response;

        if (this.webhookEvent.message.text === '+') {
            response = this.handlePayload("BACK")
        }

        if (this.webhookEvent.message.quick_reply) {
            response = this.handlePayload(receivedMessage.quick_reply.payload)
        }

        if (this.webhookEvent.message.reply_to) {
            response = reactions[Math.floor(Math.random() * (17))];
            console.log(response)
        }

        return response;
    }

    handleAttachmentMessage() {
        let response;

        // Get the attachment
        let attachment = this.webhookEvent.message.attachments[0];
        console.log("Received attachment:", `${attachment} for ${this.senderIgsid}`);

        response = reactions[Math.floor(Math.random() * (17))]

        return response;
    }

    handleQuickReply() {
        let payload = this.webhookEvent.message.quick_reply.payload;

        return this.handlePayload(payload);
    }

    handlePostback() {

        console.log(this.webhookEvent)

        let payload = this.webhookEvent.postback.payload;

        console.log(payload, this.senderIgsid)

        return this.handlePayload(payload);
    }

    handleReferral() {
        let payload = this.webhookEvent.referral.ref.toUpperCase();

        return this.handlePayload(payload);
    }

    handlePayload(payload) {
        console.log(`Received Payload: ${payload} for user ${this.senderIgsid}`);

        let response;

        switch (payload) {
            case 'COLOUR':
                response = colourResponse;
                break;
            case 'RECOMMENDATIONS':
                response = recommendationResponse;
                break;
            case 'TYPES_OF_COLOUR':
                response = typesOfColoursResponse;
                break;
            case 'PRICE':
                response = priceResponse;
                break;
            case 'TIME':
                response = timeResponse;
                break;
            case 'CLOTHES':
                response = clothesResponse;
                break;
            case 'CLOTHES_LIST':
                response = clothesListResponse;
                break;
            case 'PLACE_TO_BUY':
                response = placeToBuyResponse;
                break;
            case 'HOW_TO_DELIVER':
                response = howToDeliverResponse;
                break;
            case 'DELIVERING_AND_PAYMENT':
                response = deliveringAndPaymentResponse;
                break;
            case 'DISCOUNT':
                response = discountResponse;
                break;
            case 'CERTIFICATES':
                response = certificatesResponse;
                break;
            case 'HUMAN_AGENT':
                let requestBody = {
                    name: "Ирина",
                    profile_picture_url: "https://scontent-frt3-1.xx.fbcdn.net/v/t39.30808-6/252397487_404851784643484_3679721484420889658_n.jpg?_nc_cat=102&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=t84SuebmO-gAX-qjV7L&tn=N3Hqf7fIDfNfDeMZ&_nc_ht=scontent-frt3-1.xx&oh=00_AT_Crkqzp1Ng5K2WyBcKUrM5kp_08m3MTsUWXw4_sEECsA&oe=6205127F"
                };
                GraphApi.setPersona(requestBody);
                response = humanAgentResponse;
                break;
            case 'HUMAN_ORDER':
                response = humanOrderResponse;
                break;
            case 'HUMAN_PRICE':
                response = humanPriceResponse;
                break;
            case 'HUMAN_OTHER':
                response = humanOtherResponse;
                break;
            case 'BACK':
                response = backResponse;
                break;
        }

        return response;
    }

    handlePrivateReply(type, object_id) {
        let requestBody = {
            recipient: {
                [type]: object_id
            },
            message: "тест",
            tag: "HUMAN_AGENT"
        };

        GraphApi.callSendAPI(requestBody);
    }

    sendMessage(response, delay = 0) {
        if ("delay" in response) {
            delay = response["delay"];
            delete response["delay"];
        }

        let requestBody = {
            recipient: {
                id: this.senderIgsid
            },
            message: response
        };

        if (this.persona_id) {
            console.log(this.persona_id)
            requestBody = {
                recipient: {
                    id: this.senderIgsid
                },
                message: response,
                persona_id: this.persona_id
            }
        }

        setTimeout(() => GraphApi.callSendAPI(requestBody), delay);
    }
};
