import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: "user-service",
    brokers: ["192.168.43.33:9092"]
})

export default kafka;