import kafka from "./kafkaClient.js"

const ride_confirmed_consumer = kafka.consumer({groupId: "ride-confirmed-group"});

async function consumerInit() {
    await Promise.all([
        ride_confirmed_consumer.connect()
    ])
}

export { consumerInit, ride_confirmed_consumer };