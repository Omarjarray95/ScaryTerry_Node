const chatbot = require('../utils/chatbot/chatbot');
const Impediment = require('../models/Impediment');
var result = null;
var express = require('express');
const {
    WebhookClient
} = require('dialogflow-fulfillment')
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

router.post('/fulfillments', async (req, res) => {
    const agent = new WebhookClient({
        request: req,
        response: res
    });
    let intentMap = new Map();
    intentMap.set('scaryterry.impediment', impedimentinput);
    agent.handleRequest(intentMap);
});

async function impedimentinput(agent) {
    await Impediment.find({
            $text: {
                $search: agent.parameters['problem']
            },
        }, {
            score: {
                $meta: "textScore"
            }
        }).sort({
            score: {
                $meta: "textScore"
            }
        })
        .then(imps => result = imps)
        .catch(e => console.log(e));
    console.log(result);
    if (result.length) {
        answer = ("* " + result[0].content + " * , could this be your problem ?")
    } else {
        //console.log("the result is "+result)
        answer = ("Can't find your problem, can you be more specific ? ");

    }

    agent.add(answer);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = router;