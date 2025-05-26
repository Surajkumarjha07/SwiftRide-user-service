import kafka from "./kafkaClient.js"

const ride_confirmed_consumer = kafka.consumer({groupId: "ride-confirmed-group"});
const ride_fare_consumer = kafka .consumer({groupId: "fetched-fare-group"});
const ride_completed_consumer = kafka.consumer({groupId: "ride_completed_notify_group"});

async function consumerInit() {
    await Promise.all([
        ride_confirmed_consumer.connect(),
        ride_fare_consumer.connect(),
        ride_completed_consumer.connect()
    ])
}

export { consumerInit, ride_confirmed_consumer, ride_fare_consumer, ride_completed_consumer };