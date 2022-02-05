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
    backResponse
} = require("./services/const");

module.exports = class Receive {
    constructor(user, webhookEvent) {
        this.user = user;
        this.webhookEvent = webhookEvent;
    }

    handleMessage() {
        let event = this.webhookEvent;

        let responses;

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
            `Received text from user '${this.user.name}' (${this.user.igsid}):\n`,
            this.webhookEvent.message.text
        );

        let response;

        if (this.webhookEvent.message.text === '+') {
            response = this.handlePayload("BACK")
        }

        if (this.webhookEvent.message.quick_reply) {
            response = this.handlePayload(receivedMessage.quick_reply.payload)
        }

        return response;
        // let message = this.webhookEvent.message.text.trim().toLowerCase();
        //
        // let response;
        //
        // if (message.includes("start over") || message.includes("get started")) {
        //     response = Response.genNuxMessage(this.user);
        // } else if (Number(message)) {
        //     // Assume numeric input ("123") to be an order number
        //     response = Order.handlePayload("ORDER_NUMBER");
        // } else if (message.includes("#")) {
        //     // Input with # is treated as a suggestion
        //     response = Survey.handlePayload("CSAT_SUGGESTION");
        // } else if (message.includes(i18n.__("care.help").toLowerCase())) {
        //     let care = new Care(this.user, this.webhookEvent);
        //     response = care.handlePayload("CARE_HELP");
        // } else {
        //     response = [
        //         Response.genText(
        //             i18n.__("fallback.any", {
        //                 message: this.webhookEvent.message.text
        //             })
        //         ),
        //         Response.genText(i18n.__("get_started.guidance")),
        //         Response.genQuickReply(i18n.__("get_started.help"), [
        //             {
        //                 title: i18n.__("menu.suggestion"),
        //                 payload: "CURATION"
        //             },
        //             {
        //                 title: i18n.__("menu.help"),
        //                 payload: "CARE_HELP"
        //             },
        //             {
        //                 title: i18n.__("menu.start_over"),
        //                 payload: "GET_STARTED"
        //             }
        //         ])
        //     ];
        // }
        //
        // return response;
    }

    handleAttachmentMessage() {
        let response;

        // Get the attachment
        let attachment = this.webhookEvent.message.attachments[0];
        console.log("Received attachment:", `${attachment} for ${this.user.igsid}`);

        response = Response.genQuickReply(i18n.__("fallback.attachment"), [
            {
                title: i18n.__("menu.help"),
                payload: "CARE_HELP"
            },
            {
                title: i18n.__("menu.start_over"),
                payload: "GET_STARTED"
            }
        ]);

        return response;
    }

    handleQuickReply() {
        let payload = this.webhookEvent.message.quick_reply.payload;

        return this.handlePayload(payload);
    }

    handlePostback() {
        let payload = this.webhookEvent.message.quick_reply.payload;

        return this.handlePayload(payload);
    }

    handleReferral() {
        let payload = this.webhookEvent.referral.ref.toUpperCase();

        return this.handlePayload(payload);
    }

    handlePayload(payload) {
        console.log(`Received Payload: ${payload} for user ${this.user.igsid}`);

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
                response = humanAgentResponse;
                break;
            case 'BACK':
                response = backResponse;
                break;
        }

        return response;
    }

    handlePrivateReply(type, object_id) {
        // NOTE: For production, private replies must be sent by a human agent.
        // This code is for illustrative purposes only.

        let requestBody = {
            recipient: {
                [type]: object_id
            },
            message: Response.genText(i18n.__("private_reply.post")),
            tag: "HUMAN_AGENT"
        };

        GraphApi.callSendApi(requestBody);
    }

    sendMessage(response, delay = 0) {
        if ("delay" in response) {
            delay = response["delay"];
            delete response["delay"];
        }

        let requestBody = {
            recipient: {
                id: this.user.igsid
            },
            message: response
        };

        setTimeout(() => GraphApi.callSendAPI(requestBody), delay);
    }
};
