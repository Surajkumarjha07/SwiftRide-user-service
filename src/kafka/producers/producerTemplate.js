import { producer } from "../producerInIt.js";

async function sendProducerMessage(topic, value) {
    try {        
        await producer.send({
            topic,
            messages: [{ value: JSON.stringify(value) }]
        })
    } catch (error) {
        console.log(`error in sending ${topic}: ${error}`);
    }
}

export default sendProducerMessage;
