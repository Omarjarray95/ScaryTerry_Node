const chatbot = require('../utils/chatbot/chatbot');
const Impediment = require('../models/Impediment');
const structjson = require('../utils/chatbot/structjson');
const Project = require('../models/Project');
const Meeting =require('../models/Meeting')
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
    //scaryterry.impediment - yes
    intentMap.set('scaryterry.impediment - yes - yes', storeitanyway);
    //scaryterry.impediment-save? - yes
    intentMap.set('scaryterry.impediment-save? - yes', askforname);
    //scaryterry.meeting.timeleft
    intentMap.set('scaryterry.meeting.timeleft', timeleftformeeting);

    agent.handleRequest(intentMap);
});


//When user tells Dialogflow to save impediment.
async function saveImpediment(agent){
  
        agent.add("Saved perfectly.");
        //console.log(agent.context.get('impediments_found').parameters['problem']);
//ADD NEW IMPEDIMENT.
    var newImpediment = new Impediment();
    newImpediment.content = agent.context.get('impediments_found').parameters['problem'];
    newImpediment.added_at = Date.now();
    newImpediment.name = agent.parameters['name'];
    newImpediment.importance =5;
    newImpediment.save(function(err, impediment) {
        if (err) {
           
            console.log(err);
        } else {
            console.log(impediment);
        }
    });

    
}
//When user tells Dialogflow to save impediment.
async function storeitanyway(agent){

    agent.add("Stored perfectly, I will notify your team right away.");
    console.log(agent.context.get('impediments_found').parameters['problem']);


}



async function askforname(agent){
    agent.add('Some dummy text');
    agent.setFollowupEvent('reaskforimpedimentname');

}

async function timeleftformeeting(agent){
    var id='5ca2872dcd7ecd27802d8944'
    Project.find({
        $or: [{
                'developmentTeam': {
                    "$in": [id]
                }
            },
            {
                'productOwner': id
            },
            {
                'scrumMaster': id
            }
        ]
    }, function(err, projects) {
        if (err) throw err;
        Meeting.find(

            {
                $and: [{
                        time_start: {
                            $gte: Date.now()
                        }
                    },
                    {
                        'Sprint': {
                            $in: [].concat(...projects.map(x => x.sprints))
                        }
                    }
                ]
            }
                        ).sort(
            [['time_start', 1]]
        ).exec(function(err, meeting) {
            if(meeting.length)
            {
            agent.add('Next meeting in '+meeting.length)
            }
            else
            {
             agent.add('No meeting in the horizon.')
            }
        }).catch((err)=>console.log(err));

    });

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
        if (result[0].solution.length) {
            const context = {
                "name": 'impediments_found',
                'lifespan': 2,
                'parameters': {
                    'problem': result[0].content,
                    'have_solution': 'yes',
                    'solution': result[0].solution.length
                }
            };
            agent.context.set(context);

        } else {
            const context = {
                "name": 'impediments_found',
                'lifespan': 2,
                'parameters': {
                    'problem': result[0].content,
                    'have_solution': 'no'
                }
            };
            agent.context.set(context);

        }



    } else {
        const context = {
            "name": 'impediments_found',
            'lifespan': 2,
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

function getTimeLeft(date){
    var countDownDate = date.getTime();

// Update the count down every 1 second

  // Get todays date and time
  var now = new Date().getTime();

  // Find the distance between now and the count down date
  var distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
answer='';
if(days!=0){answer+=days+" days "}
if(hours!=0){answer +=hours+" hours "}
if(minutes!=0){answer +=minutes + " minutes"}
return answer;

}
module.exports = router;