import { consumerInit } from "./consumerInIt.js";
import kafkaInit from "./kafkaAdmin.js";
import producerInit from "./producerInIt.js";

async function startKafka() {
    (async () => {
        console.log("Initializing Kafka...");
        await kafkaInit();
        console.log("Kafka initialization done.");
    })();
    
    (async () => {
        console.log("Initializing Consumer...");
        await consumerInit();
        console.log("Consumer initialized.");
    })();

    (async () => {
        console.log("Initializing Producer...");
        await producerInit();
        console.log("Producer initialized.");
    })();
}

export default startKafka;