// src/index.ts
import express2 from "express";
import dotenv3 from "dotenv";
import cookieParser from "cookie-parser";

// src/routes/actions.routes.ts
import express from "express";

// src/config/database.ts
import { PrismaClient } from "@prisma/client";
var prisma = new PrismaClient();
var database_default = prisma;

// src/services/actions.services/deleteUser.service.ts
import bcrypt from "bcrypt";
async function deleteUser({ userEmail, password }) {
  try {
    const user = await database_default.users.findFirst({ where: { email: userEmail } });
    if (!user) {
      throw new Error("User doesn't exist!");
    }
    let passwordMatched;
    if (user) {
      passwordMatched = await bcrypt.compare(password, user.password);
    }
    if (!passwordMatched) {
      throw new Error("Incorrect password!");
    }
    const deletedUser = await database_default.users.delete({ where: { email: userEmail } });
    return deletedUser;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
  }
}
var deleteUser_service_default = deleteUser;

// src/services/actions.services/logInUser.service.ts
import bcrypt2 from "bcrypt";
import jwt from "jsonwebtoken";
async function logInUser({ email, password }) {
  try {
    const user = await database_default.users.findFirst({ where: { email } });
    let passwordMatched;
    if (user) {
      passwordMatched = await bcrypt2.compare(password, user.password);
    }
    if (!user || !passwordMatched) {
      throw new Error("Incorrect email or password!");
    }
    const token = jwt.sign(
      {
        userId: user.userId,
        userEmail: email,
        userName: user.name,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return token;
  } catch (error) {
    if (error instanceof Error) {
      console.log("LogIn service error: ", error.message);
      throw error;
    }
  }
}
var logInUser_service_default = logInUser;

// src/services/actions.services/signUpUser.service.ts
import bcrypt3 from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
async function signUpUser({ email, name, password, role }) {
  try {
    const existingUser = await database_default.users.findFirst({ where: { email } });
    if (existingUser) {
      throw new Error("Email already exists!");
    }
    const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklomnopqrstuvwxyz_-@#$&";
    let userId = "";
    for (let i = 0; i < 15; i++) {
      let pos = Math.floor(Math.random() * alpha.length);
      userId = userId + alpha[pos];
    }
    const saltRounds = 10;
    const salt = await bcrypt3.genSalt(saltRounds);
    const hashedPassword = await bcrypt3.hash(password, salt);
    const user = await database_default.users.create({ data: { email, name, password: hashedPassword, role, userId } });
    return user;
  } catch (error) {
    if (error instanceof Error) {
      console.log("SignUp service error: ", error.message);
      throw error;
    }
  }
}
var signUpUser_service_default = signUpUser;

// src/services/actions.services/updateUser.service.ts
import bcrypt4 from "bcrypt";
async function updateUser({ newEmail, newName, newPassword, oldPassword, userEmail }) {
  try {
    const user = await database_default.users.findFirst({
      where: { email: userEmail }
    });
    let passwordMatched;
    if (user && oldPassword) {
      passwordMatched = await bcrypt4.compare(oldPassword, user.password);
    }
    if (!passwordMatched || !user) {
      throw new Error("Incorrect Email or Password!");
    }
    let updateData = {};
    if (newPassword) {
      const saltRounds = 10;
      const salt = await bcrypt4.genSalt(saltRounds);
      updateData.password = await bcrypt4.hash(newPassword, salt);
    }
    if (newEmail) {
      updateData.email = newEmail;
    }
    if (newName) {
      updateData.name = newName;
    }
    const updatedUser = await database_default.users.update({
      where: { email: userEmail },
      data: updateData
    });
    return updatedUser;
  } catch (error) {
    if (error instanceof Error) {
      console.log("Update service error: ", error.message);
      throw error;
    }
  }
}
var updateUser_service_default = updateUser;

// src/services/actions.services/index.service.ts
var userService = { signUpUser: signUpUser_service_default, logInUser: logInUser_service_default, updateUser: updateUser_service_default, deleteUser: deleteUser_service_default };

// src/controllers/actions.controllers/signUp.controller.ts
async function handleSignUp(req, res) {
  const { email, name, password, role } = req.body;
  if (!email || !name || !password || !role) {
    res.status(400).json({
      message: "Enter required details!"
    });
    return;
  }
  try {
    const user = await userService.signUpUser({ email, name, password, role });
    res.status(201).json({
      message: "User created!",
      user
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        message: error.message || "Internal server error!"
      });
      return;
    }
  }
}
var signUp_controller_default = handleSignUp;

// src/controllers/actions.controllers/logIn.controller.ts
async function handleLogIn(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        message: "Enter required details!"
      });
      return;
    }
    const token = await userService.logInUser({ email, password });
    res.cookie("authToken", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 60 * 60 * 1e3,
      path: "/"
    });
    res.status(200).json({
      message: "User Logged In!",
      token
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        message: error.message || "Internal server error!"
      });
      return;
    }
  }
}
var logIn_controller_default = handleLogIn;

// src/controllers/actions.controllers/update.controller.ts
async function handleUpdateUserInfo(req, res) {
  try {
    const { newEmail, newName, newPassword, oldPassword } = req.body;
    const { userEmail } = req.user;
    if (!userEmail) {
      return res.status(403).json({
        message: "email not available or token expired!"
      });
    }
    if (!newEmail && !newName && !newPassword) {
      return res.status(400).json({
        message: "atleast one field is required to update account."
      });
    }
    const updatedUser = await userService.updateUser({ newEmail: newEmail.trim(), newName: newName.trim(), newPassword: newPassword.trim(), oldPassword, userEmail });
    res.status(200).json({
      message: "User updated!",
      updatedUser
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        message: error.message || "Internal server error!"
      });
      return;
    }
  }
}
var update_controller_default = handleUpdateUserInfo;

// src/middlewares/userAuth.middleware.ts
import jwt2 from "jsonwebtoken";
import dotenv2 from "dotenv";
dotenv2.config();
async function authenticate(req, res, next) {
  let token = req.cookies.authToken || req.headers["authorization"]?.split("Bearer ")[1];
  if (!token) {
    return res.status(404).json({ message: "token not available" });
  }
  try {
    const verified = jwt2.verify(token, process.env.JWT_SECRET);
    if (verified) {
      req.user = verified;
      next();
    }
  } catch (error) {
    return res.status(403).json({ message: "Forbidden: Invalid or expired token" });
  }
}
var userAuth_middleware_default = authenticate;

// src/controllers/actions.controllers/delete.controller.ts
async function handleDeleteUser(req, res) {
  try {
    const { password } = req.body;
    const { userEmail } = req.user;
    if (!password || !userEmail) {
      res.status(400).json({
        message: "Enter all credentials!"
      });
      return;
    }
    const deletedUser = await userService.deleteUser({ userEmail, password });
    res.status(200).json({
      message: "User deleted!",
      deletedUser
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        message: error.message || "Internal server error!"
      });
      return;
    }
  }
}
var delete_controller_default = handleDeleteUser;

// src/controllers/actions.controllers/logout.controller.ts
async function handleLogOut(req, res) {
  try {
    return res.clearCookie("authToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/"
    }).status(200).json({
      message: "Logout successful!"
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        message: error.message || "Internal server error!"
      });
      return;
    }
  }
}
var logout_controller_default = handleLogOut;

// src/routes/actions.routes.ts
var router = express.Router();
router.post("/sign-up", signUp_controller_default);
router.post("/log-in", logIn_controller_default);
router.put("/update-user", userAuth_middleware_default, update_controller_default);
router.delete("/delete-user", userAuth_middleware_default, delete_controller_default);
router.post("/logout", logout_controller_default);
var actions_routes_default = router;

// src/routes/rides.routes.ts
import { Router } from "express";

// src/config/redis.ts
import { Redis } from "ioredis";
var redis = new Redis();
var redis_default = redis;

// src/kafka/producerInIt.ts
import { Partitioners } from "kafkajs";

// src/kafka/kafkaClient.ts
import { Kafka, logLevel } from "kafkajs";
var kafka = new Kafka({
  clientId: "user-service",
  brokers: ["localhost:9092"],
  connectionTimeout: 1e4,
  requestTimeout: 3e4,
  retry: {
    initialRetryTime: 2e3,
    retries: 10
  },
  logLevel: logLevel.ERROR
});
var kafkaClient_default = kafka;

// src/kafka/producerInIt.ts
var producer = kafkaClient_default.producer({
  createPartitioner: Partitioners.LegacyPartitioner
});
async function producerInit() {
  await producer.connect();
}

// src/kafka/producers/producerTemplate.ts
async function sendProducerMessage(topic, value) {
  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(value) }]
    });
    console.log(`${topic} sent`);
  } catch (error) {
    console.log(`error in sending ${topic}: ${error}`);
  }
}
var producerTemplate_default = sendProducerMessage;

// src/services/rides.services/captainNotAssigned.service.ts
async function captainNotAssignedService(userId) {
  try {
    const rideData = await redis_default.hgetall(`rideData:${userId}`);
    const { rideId } = rideData;
    if (!Object.keys(rideData).includes("captainId")) {
      await producerTemplate_default("no-captain-assigned", { rideData });
      await redis_default.del(`rideData:${userId}`);
      await redis_default.del(`ride:${rideId}`);
      return false;
    }
    return true;
  } catch (error) {
    throw new Error("Error in captain-not-assigned service: " + error.message);
  }
}
var captainNotAssigned_service_default = captainNotAssignedService;

// src/services/rides.services/confirmRide.service.ts
async function confirmRide(userId, fare, vehicle) {
  try {
    const rideData = await redis_default.hgetall(`rideData:${userId}`);
    rideData.fare = fare;
    rideData.vehicle = vehicle;
    await redis_default.hset(`rideData:${userId}`, rideData);
    await producerTemplate_default("ride-request", { rideData });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Ride request error: ", error.message);
    }
  }
}
var confirmRide_service_default = confirmRide;

// src/services/rides.services/rideCancel.service.ts
import { isInRide } from "@prisma/client";
async function rideCancel(userId) {
  try {
    const rideData = await redis_default.hgetall(`rideData:${userId}`);
    await database_default.users.updateMany({
      where: { userId, in_ride: isInRide.IN_RIDE },
      data: {
        in_ride: isInRide.NOT_IN_RIDE
      }
    });
    await producerTemplate_default("ride-cancelled", { rideData });
    await redis_default.del(`rideData:${userId}`);
  } catch (error) {
    if (error instanceof Error) {
      console.log("Ride cancel service error: ", error.message);
    }
  }
}
var rideCancel_service_default = rideCancel;

// src/services/rides.services/rideRequest.service.ts
async function rideRequest({ userId, location, destination }) {
  try {
    await producerTemplate_default("calculate-fare", { userId, location, destination });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error in confirm-ride service: ${error.message}`);
    }
  }
}
var rideRequest_service_default = rideRequest;

// src/services/rides.services/index.service.ts
var rideService = { rideRequest: rideRequest_service_default, rideCancel: rideCancel_service_default, confirmRide: confirmRide_service_default, captainNotAssignedService: captainNotAssigned_service_default };

// src/controllers/rides.controllers/rideRequest.controller.ts
async function handleRideRequest(req, res) {
  try {
    const { location, destination } = req.body;
    const { userId } = req.user;
    if (!userId) {
      res.status(404).json({
        message: "user not defined!"
      });
      return;
    }
    if (!location || !destination) {
      res.status(400).json({
        message: "locationCoordinates and destinationCoordinates are required!"
      });
      return;
    }
    await rideService.rideRequest({ userId, location, destination });
    res.status(200).json({
      message: "ride request sent successfully!"
    });
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({
      message: "Internal server error!"
    });
  }
}
var rideRequest_controller_default = handleRideRequest;

// src/controllers/rides.controllers/rideCancellation.controller.ts
async function handleRideCancellation(req, res) {
  try {
    const { userId } = req.user;
    if (!userId) {
      res.status(400).json({
        message: "token inavalid!"
      });
      return;
    }
    await rideService.rideCancel(userId);
    res.status(200).json({
      message: "ride cancellation successfull!"
    });
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({
      message: "Internal server error!"
    });
  }
}
var rideCancellation_controller_default = handleRideCancellation;

// src/controllers/rides.controllers/confirmRide.controller.ts
async function handleConfirmRide(req, res) {
  try {
    const { userId } = req.user;
    const { fare, vehicle } = req.body;
    if (!userId) throw new Error("user not authorized!");
    await rideService.confirmRide(userId, fare, vehicle);
    res.status(200).json({
      message: "ride confirmation request sent successfully!"
    });
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({
      message: "Internal server error!"
    });
  }
}
var confirmRide_controller_default = handleConfirmRide;

// src/controllers/rides.controllers/payment.controller.ts
async function handlePaymentDone(req, res) {
  try {
    const { userId } = req.user;
    const { fare, payment_id, orderId, order, rideId, captainId } = req.body;
    console.log("order: " + orderId);
    await producerTemplate_default("payment-done", { fare, payment_id, orderId, order, userId, rideId, captainId });
    await producerTemplate_default("payment-processed-notify-captain", { fare, payment_id, orderId, order, userId, rideId, captainId });
    res.status(200).json({
      message: "payment processed!"
    });
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({
      message: "Internal server error!"
    });
  }
}
var payment_controller_default = handlePaymentDone;

// src/controllers/rides.controllers/captainNotAssigned.controller.ts
async function handleCaptainNotAssigned(req, res) {
  try {
    const { userId } = req.user;
    const captainAssigned = await rideService.captainNotAssignedService(userId);
    if (!captainAssigned) {
      return res.status(204).json({
        message: "captain not assigned"
      });
    }
    return res.status(200).json({
      message: "captain assigned"
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}
var captainNotAssigned_controller_default = handleCaptainNotAssigned;

// src/controllers/rides.controllers/unConfirmedRide.controller.ts
async function handleUnconfirmedRide(req, res) {
  try {
    const { userId } = req.user;
    if (!userId) {
      return res.status(400).json({
        message: "Unauthorized Acsess!"
      });
    }
    await redis_default.del(`rideData:${userId}`);
    res.status(200).json({
      message: "ride data cleaned up!"
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}
var unConfirmedRide_controller_default = handleUnconfirmedRide;

// src/routes/rides.routes.ts
var router2 = Router();
router2.post("/ride-request", userAuth_middleware_default, rideRequest_controller_default);
router2.post("/cancel-ride", userAuth_middleware_default, rideCancellation_controller_default);
router2.post("/confirm-ride", userAuth_middleware_default, confirmRide_controller_default);
router2.post("/captain-not-assigned", userAuth_middleware_default, captainNotAssigned_controller_default);
router2.post("/payment", userAuth_middleware_default, payment_controller_default);
router2.post("/process-unconfirmed-ride", userAuth_middleware_default, unConfirmedRide_controller_default);
var rides_routes_default = router2;

// src/kafka/consumerInIt.ts
var ride_confirmed_consumer = kafkaClient_default.consumer({ groupId: "ride-confirmed-group" });
var ride_fare_consumer = kafkaClient_default.consumer({ groupId: "fetched-fare-group" });
var ride_completed_consumer = kafkaClient_default.consumer({ groupId: "ride_completed_notify_group" });
var payment_requested_consumer = kafkaClient_default.consumer({ groupId: "payment_requested_group" });
var user_location_update_consumer = kafkaClient_default.consumer({ groupId: "user_location_update_group" });
async function consumerInit() {
  await Promise.all([
    ride_confirmed_consumer.connect(),
    ride_fare_consumer.connect(),
    ride_completed_consumer.connect(),
    payment_requested_consumer.connect(),
    user_location_update_consumer.connect()
  ]);
}

// src/kafka/handlers/fareFetched.handler.ts
async function fareFetchedHandler({ message }) {
  try {
    const { rideId, userId, pickUpLocation, destination, locationCoordinates, destinationCoordinates, fareDetails } = JSON.parse(message.value.toString());
    await redis_default.hset(`rideData:${userId}`, {
      rideId,
      userId,
      pickUpLocation,
      destination,
      pickUpLocation_latitude: locationCoordinates.latitude,
      pickUpLocation_longitude: locationCoordinates.longitude,
      destination_latitude: destinationCoordinates.latitude,
      destination_longitude: destinationCoordinates.longitude
    });
    console.log("fare: ", fareDetails);
    await producerTemplate_default("show-fare", { rideId, userId, pickUpLocation, destination, locationCoordinates, destinationCoordinates, fareDetails });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error in fare fetching handler: ${error.message}`);
    }
  }
}
var fareFetched_handler_default = fareFetchedHandler;

// src/kafka/consumers/fareFetched.consumer.ts
async function fareFetched() {
  try {
    await ride_fare_consumer.subscribe({ topic: "fare-fetched", fromBeginning: true });
    await ride_fare_consumer.run({
      eachMessage: fareFetched_handler_default
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error in getting ride-fare! ${error.message}`);
    }
  }
}
var fareFetched_consumer_default = fareFetched;

// src/kafka/handlers/rideCompleted.handler.ts
import { isInRide as isInRide2 } from "@prisma/client";
async function rideCompletedHandler({ message }) {
  const { userId, rideId, captainId } = JSON.parse(message.value.toString());
  await database_default.users.update({
    where: {
      userId
    },
    data: {
      in_ride: isInRide2.NOT_IN_RIDE
    }
  });
  console.log(`${captainId} completed ${rideId}`);
  await redis_default.del(`rideData:${userId}`);
}
var rideCompleted_handler_default = rideCompletedHandler;

// src/kafka/consumers/rideCompleted.consumer.ts
async function rideCompleted() {
  try {
    await ride_completed_consumer.subscribe({ topic: "ride-completed-notify-user", fromBeginning: true });
    await ride_completed_consumer.run({
      eachMessage: rideCompleted_handler_default
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error in getting ride-completed notification: ` + error.message);
    }
  }
}
var rideCompleted_consumer_default = rideCompleted;

// src/kafka/handlers/rideConfirmed.handler.ts
import { isInRide as isInRide3 } from "@prisma/client";
async function rideConfirmedHandler({ message }) {
  try {
    const { captainId, rideData } = JSON.parse(message.value.toString());
    const { userId } = rideData;
    console.log("capId: " + captainId);
    if (userId) {
      await database_default.users.update({
        where: {
          userId
        },
        data: {
          in_ride: isInRide3.IN_RIDE
        }
      });
    }
    console.log(`ride confirmed by ${captainId} for ${rideData.rideId}`);
    await producerTemplate_default("ride-confirmed-notify-user", { rideData });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error in ride-confirm handler ${error.message}`);
    }
  }
}
var rideConfirmed_handler_default = rideConfirmedHandler;

// src/kafka/consumers/rideConfirmed.consumer.ts
async function rideConfirmed() {
  try {
    await ride_confirmed_consumer.subscribe({ topic: "ride-confirmed", fromBeginning: true });
    await ride_confirmed_consumer.run({
      eachMessage: rideConfirmed_handler_default
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error in getting confirmation! ${error.message}`);
    }
  }
}
var rideConfirmed_consumer_default = rideConfirmed;

// src/userLocationMap.ts
var userLocationMap = /* @__PURE__ */ new Map();
var userLocationMap_default = userLocationMap;

// src/kafka/handlers/userLocationUpdate.handler.ts
async function userLocationUpdateHandler({ message }) {
  try {
    const { userId, coordinates } = JSON.parse(message.value.toString());
    const user_redis_coord = await redis_default.hgetall(`user-location-updates:${userId}`);
    const latitudeChanged = Number(user_redis_coord.latitude) !== coordinates.latitude;
    const longitudeChanged = Number(user_redis_coord.longitude) !== coordinates.longitude;
    if (!latitudeChanged && !longitudeChanged) return;
    await redis_default.hset(`user-location-updates:${userId}`, coordinates);
    await redis_default.expire(`user-location-updates:${userId}`, 3600);
    userLocationMap_default.set(userId, coordinates);
  } catch (error) {
    throw new Error("Error in user-location-update handler: " + error.message);
  }
}
var userLocationUpdate_handler_default = userLocationUpdateHandler;

// src/kafka/consumers/locationUpdate.consumer.ts
async function userLocationUpdate() {
  try {
    await user_location_update_consumer.subscribe({ topic: "user-location-update", fromBeginning: true });
    await user_location_update_consumer.run({
      eachMessage: userLocationUpdate_handler_default
    });
  } catch (error) {
    throw new Error("Error in user-location-update consumer: " + error.message);
  }
}
var locationUpdate_consumer_default = userLocationUpdate;

// src/kafka/kafkaAdmin.ts
async function kafkaInit() {
  const admin = kafkaClient_default.admin();
  console.log("Admin connecting...");
  await admin.connect();
  console.log("Admin connected...");
  const topics = ["fare-fetched", "ride-completed-notify-user", "ride-confirmed", "user-location-update"];
  const existingTopics = await admin.listTopics();
  const topicsToCreate = topics.filter((t) => !existingTopics.includes(t));
  if (topicsToCreate.length > 0) {
    await admin.createTopics({
      topics: topicsToCreate.map((t) => ({ topic: t, numPartitions: 1 }))
    });
  }
  console.log("Topics created!");
  await admin.disconnect();
}
var kafkaAdmin_default = kafkaInit;

// src/kafka/index.kafka.ts
async function startKafka() {
  (async () => {
    console.log("Initializing Kafka...");
    await kafkaAdmin_default();
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
  await rideConfirmed_consumer_default();
  await fareFetched_consumer_default();
  await rideCompleted_consumer_default();
  await locationUpdate_consumer_default();
}
var index_kafka_default = startKafka;

// src/utils/bulkUpdate.ts
import _ from "lodash";

// src/utils/bulknsertDB.ts
async function bulkInsertDB(chunks) {
  for (const chunk of chunks) {
    const ids = chunk.map(([userId, coordinates]) => `'${userId}'`).join(", ");
    const latitudeCases = chunk.map(([userId, coordinates]) => `WHEN '${userId}' THEN ${coordinates.latitude}`).join(" ");
    const longitudeCases = chunk.map(([userId, coordinates]) => `WHEN '${userId}' THEN ${coordinates.longitude}`).join(" ");
    const query = `
            UPDATE users 
            SET
            latitude = CASE userId ${latitudeCases} END,
            longitude = CASE userId ${longitudeCases} END
            WHERE userId IN (${ids});
        `;
    await database_default.$executeRawUnsafe(query);
  }
}
var bulknsertDB_default = bulkInsertDB;

// src/utils/bulkUpdate.ts
async function bulkUpdateLocation() {
  try {
    let buffer;
    setInterval(async () => {
      buffer = Array.from(userLocationMap_default.entries());
      if (buffer.length === 0) return;
      const chunks = _.chunk(buffer, 10);
      try {
        await bulknsertDB_default(chunks);
        userLocationMap_default.clear();
      } catch (error) {
        throw new Error("Error in bulk inserting database: " + error.message);
      }
    }, 60 * 1e3);
  } catch (error) {
    throw new Error("Error in bulk updating databse: " + error.message);
  }
}
var bulkUpdate_default = bulkUpdateLocation;

// src/index.ts
dotenv3.config();
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: true }));
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Hello! Suraj, I am user-service");
});
app.use("/actions", actions_routes_default);
app.use("/rides", rides_routes_default);
index_kafka_default();
bulkUpdate_default();
app.listen(Number(process.env.PORT), "0.0.0.0", () => {
  console.log("User service is running!");
});
