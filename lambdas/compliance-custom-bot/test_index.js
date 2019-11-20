const omniGuideEventGood = `{
    "engagement_id": "$engagement_id",
    "message_id": "$message_id",
    "message_created_at": "2019-07-25T05:46:15+0000",
    "utterance": "I want suggestion!",
    "visitor_attributes": {
      "policy_number": "P123456789",
      "customer_number": "C00000123"
    }
}`

const event = {
	body: omniGuideEventGood,
	httpMethod: "POST"
}

const bot = require('./index.js')

const callback = (p, res) => {
	console.log(res)
}

bot.handler(event,{}, callback);

const omniGuideEventBad = `{
    "engagement_id": "$engagement_id",
    "message_id": "$message_id",
    "message_created_at": "2019-07-25T05:46:15+0000",
    "utterance": "poop",
    "visitor_attributes": {
      "policy_number": "P123456789",
      "customer_number": "C00000123"
    }
}`

const badEvent = {
	body: omniGuideEventBad,
	httpMethod: "POST"
}

bot.handler(badEvent, {}, callback);
