import { consumerInit } from "./consumerInIt.js";
import fareFetched from "./consumers/fareFetched.consumer.js";
import rideCompleted from "./consumers/rideCompleted.consumer.js";
import rideConfirmed from "./consumers/rideConfirmed.consumer.js";
import userLocationUpdate from "./consumers/locationUpdate.consumer.js";
import kafkaInit from "./kafkaAdmin.js";
import { producerInit } from "./producerInIt.js";

const MAX_RETRIES = 5;
const RETRY_DELAY = 5000;

async function startKafka() {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            console.log("Initializing Kafka...");
            await kafkaInit();
            console.log("Kafka initialization done.");

            console.log("Initializing Consumer...");
            await consumerInit();
            console.log("Consumer initialized.");

            console.log("Initializing Producer...");
            await producerInit();
            console.log("Producer initialized.");

            await rideConfirmed();
            await fareFetched();
            await rideCompleted();
            await userLocationUpdate();

            console.log("Kafka started successfully.");
            return;
        } catch (error) {
            console.error(
                `Kafka startup failed (${attempt}/${MAX_RETRIES})`,
                error
            );

            if (attempt === MAX_RETRIES) {
                console.error("Maximum retry attempts reached.");
                throw error;
            }

            console.log(`Retrying in ${RETRY_DELAY / 1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        }
    }
}

export default startKafka;