import { consumerInit } from "./consumerInIt.js";
import fareFetched from "./consumers/fareFetched.js";
import rideCompleted from "./consumers/rideCompletedConsumer.js";
import rideConfirmed from "./consumers/rideConfirmedConsumer.js";
import userLocationUpdate from "./consumers/userLocationUpdate.js";
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