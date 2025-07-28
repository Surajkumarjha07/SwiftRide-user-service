import { consumerInit } from "./consumerInIt.js";
import fareFetched from "./consumers/fareFetched.consumer.js";
import rideCompleted from "./consumers/rideCompleted.consumer.js";
import rideConfirmed from "./consumers/rideConfirmed.consumer.js";
import userLocationUpdate from "./consumers/locationUpdate.consumer.js";
import kafkaInit from "./kafkaAdmin.js";
import { producerInit } from "./producerInIt.js";

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

    await rideConfirmed();
    await fareFetched();
    await rideCompleted();
    await userLocationUpdate();

}

export default startKafka;