const chatbot = require('../utils/chatbot/chatbot')
var express = require('express');
var router = express.Router();

    router.get('/', (req, res) => {
        res.send({
            'hello': 'there'
        });
    });

    router.post('/api/df_text_query', async (req, res) => {

        let responses = await chatbot.textQuery(req.body.text, req.body.parameters);
        let result = responses[0].queryResult;
        console.log(`  Query: ${result.queryText}`);
        console.log(`  Response: ${result.fulfillmentText}`);
        if (result.intent) {
            console.log(`  Intent: ${result.intent.displayName}`);
        } else {
            console.log(`  No intent matched.`);
        }



        res.send(result);
    });

    router.post('/api/df_event_query', async (req, res) => {
        let responses = await chatbot.eventQuery(req.body.event, req.body.parameters);
        let result = responses[0].queryResult;
        console.log(`  Query: ${result.queryText}`);
        console.log(`  Response: ${result.fulfillmentText}`);
        if (result.intent) {
            console.log(`  Intent: ${result.intent.displayName}`);
        } else {
            console.log(`  No intent matched.`);
        }


        res.send(result);
    });



module.exports = router;