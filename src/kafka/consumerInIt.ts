import kafka from "./kafkaClient.js"

const ride_confirmed_consumer = kafka.consumer({groupId: "ride-confirmed-group"});
const ride_fare_consumer = kafka .consumer({groupId: "fetched-fare-group"});
const ride_completed_consumer = kafka.consumer({groupId: "ride_completed_notify_group"});
const payment_requested_consumer = kafka.consumer({groupId: "payment_requested_group"});
const user_location_update_consumer = kafka.consumer({groupId: "user_location_update_group"}); 

async function consumerInit() {
    await Promise.all([
        ride_confirmed_consumer.connect(),
        ride_fare_consumer.connect(),
        ride_completed_consumer.connect(),
        payment_requested_consumer.connect(),
        user_location_update_consumer.connect()
    ])
}

export { consumerInit, ride_confirmed_consumer, ride_fare_consumer, ride_completed_consumer, payment_requested_consumer, user_location_update_consumer };