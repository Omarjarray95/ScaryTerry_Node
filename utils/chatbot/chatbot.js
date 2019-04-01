'use strict'
const dialogflow = require('dialogflow');
const structjson = require('./structjson')
const config = require('../config/keys');
const sessionClient = new dialogflow.SessionsClient();
const sessionPath = sessionClient.sessionPath(config.googleProjectID, config.dialogFlowSessionID);
module.exports = {
    textQuery: async function(text, parameters = {}) {
        // The text query request.
        let self = module.exports;
        const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    // The query to send to the dialogflow agent
                    text: text,
                    // The language used by the client (en-US)
                    languageCode: config.dialogFlowSessionLanguageCode,
                },
            },
            queryParams: {
                payload: {
                    data: parameters
                }
            }
        };
        // Send request and log result
        let responses = await sessionClient.detectIntent(request);
        console.log('Detected intent');
        responses = await self.handleAction(responses);
        return responses;
    },
    eventQuery: async function(event, parameters = {}) {
        // The text query request.
        let self = module.exports;
        const request = {
            session: sessionPath,
            queryInput: {
                event: {
                    // The query to send to the dialogflow agent
                    name: event,
                    parameters: structjson.jsonToStructProto(parameters),
                    // The language used by the client (en-US)
                    languageCode: config.dialogFlowSessionLanguageCode,
                }
            }
        };
        // Send request and log result
        let responses = await sessionClient.detectIntent(request);
        console.log('Detected intent');
        responses = await self.handleAction(responses);
        return responses;
    },
    handleAction: (responses) => {
        return responses;
    }
}