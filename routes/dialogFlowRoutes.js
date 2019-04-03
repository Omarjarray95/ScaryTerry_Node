const chatbot = require('../utils/chatbot/chatbot');
const Impediment = require('../models/Impediment');
const structjson = require('../utils/chatbot/structjson');
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
//Sending text to Dialogflow and returning answer.
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

//Calling an event from Dialogflow and returning the answer.
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

//Fulfillments landing on scrummy's backend.
router.post('/fulfillments', async (req, res) => {
    const agent = new WebhookClient({
        request: req,
        response: res
    });
    let intentMap = new Map();
    intentMap.set('scaryterry.impediment - no impediments found - shorter name', saveImpediment);
    intentMap.set('scaryterry.impediment - no impediments found - save', saveImpediment);
    intentMap.set('scaryterry.impediment', impedimentinput);
    agent.handleRequest(intentMap);
});


//When user tells Dialogflow to save impediment.
async function saveImpediment(agent){
    var name=agent.parameters['name'];
    if(name.length>15)
    {
       await agent.add("Try to shorten the impediment's name.");
       agent.setFollowupEvent(' shorterimpedimentname');

    }
    else
    {
        agent.add("Saved perfectly.")
    }
    
}






//Impediment Handling for chatbot fulfillment
async function impedimentinput(agent) {
    var result = null;
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
    if (result.length) {
        answer = ("* " + result[0].content + " * , could this be your problem ?")
        if (result[0].solution != null) {
            const context = {
                "name": 'impediments_found',
                'lifespan': 4,
                'parameters': {
                    'problem': result[0].content,
                    'have_solution': 'yes',
                    'solution': result[0].solution
                }
            };
        } else {
            const context = {
                "name": 'impediments_found',
                'lifespan': 4,
                'parameters': {
                    'problem': result[0].content,
                    'have_solution': 'no'
                }
            };
        }


        agent.context.set(context);

    } else {
        const context = {
            "name": 'impediments_found',
            'lifespan': 4,
            'parameters': {
                'problem':  agent.parameters['problem']
            }
        };
        agent.context.set(context);
        answer = ("Can't find your problem in my Database. ");
        agent.setFollowupEvent('noimpedimentsfound')
        agent.context.delete('scaryterryimpediment-followup');

    }
    agent.add(answer);

}

module.exports = router;