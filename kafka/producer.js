import { Partitioners } from "kafkajs";
import kafka from "./kafkaClient.js";

const producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner
});

async function producerInit() {
    await producer.connect();
}

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

export default { producerInit, sendProducerMessage };