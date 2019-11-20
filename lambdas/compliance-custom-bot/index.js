exports.handler = (event, context, callback) => {

		const dictionary = ["sheet", "poop"]

		const isAGoodWord = (word) => {
			// this is over simple
			return !dictionary.includes(word);
		}

		const isCompliance = (utterance) => {
			utteranceWords = utterance.split(' ');
			return utteranceWords.every(isAGoodWord)
		}	

    const done = (err, res) => callback(null, {
        statusCode: err ? '400' : '200',
        body: err ? err.message : JSON.stringify(res),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    
    switch (event.httpMethod) {
        case 'DELETE':
            
            break;
        case 'GET':
            
            break;
        case 'POST':
        		parsedBody = JSON.parse(event.body)
            const utterance = parsedBody.utterance;
            if (isCompliance(utterance)) {
            	const response = {
							  "type": "prompt",
							  "content": "Good Visitor"
							}
            	done(null, response)
            }
            else{
            	const response = {
								"type": "prompt",
								"content": "Hey, watch your language!"
							}
							done(null, response)
            }
            break;
        case 'PUT':
            
            break;
        default:
            done(new Error(`Unsupported method "${event.httpMethod}"`));
    }
};
