import kafka from "./kafkaClient";

const producer = kafka.producer();

async function producerInit() {
    await producer.connect();
    
}

producerInit();