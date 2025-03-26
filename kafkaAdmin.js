import kafka from "./kafkaClient";

async function kafkaInit() {
    const admin = kafka.admin();
    console.log("Admin connecting...");
    admin.connect();
    console.log("Admin connected...");
    
    await admin.createTopics({
        topics: [{
            topic: "user-ride-request",
            numPartitions: 1
        }]
    })

    console.log("Topics created!");
    
    await admin.disconnect();
}

kafkaInit();

