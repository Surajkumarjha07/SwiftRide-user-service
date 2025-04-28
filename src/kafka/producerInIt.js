import { Partitioners } from "kafkajs";
import kafka from "./kafkaClient.js";

export const producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner
});

async function producerInit() {
    await producer.connect();
}

export default producerInit;