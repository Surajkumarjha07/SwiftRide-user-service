// src/index.ts
import express2 from "express";
import dotenv3 from "dotenv";
import cookieParser from "cookie-parser";

// src/routes/userRoutes.ts
import express from "express";

// src/config/database.ts
import { PrismaClient } from "@prisma/client";
var prisma = new PrismaClient();
var database_default = prisma;

// src/services/userServices/deleteUserService.ts
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
      console.log("Delete service error: ", error.message);
      throw error;
    }
  }
}
var deleteUserService_default = deleteUser;

// src/services/userServices/logInUserService.ts
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
    const token = jwt.sign({ userEmail: email, userName: user.name, userId: user.userId, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return token;
  } catch (error) {
    if (error instanceof Error) {
      console.log("LogIn service error: ", error.message);
      throw error;
    }
  }
}
var logInUserService_default = logInUser;

// src/services/userServices/signUpUserService.ts
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
var signUpUserService_default = signUpUser;

// src/services/userServices/updateUserService.ts
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
var updateUserService_default = updateUser;

// src/services/userServices/index.ts
var userService = { signUpUser: signUpUserService_default, logInUser: logInUserService_default, updateUser: updateUserService_default, deleteUser: deleteUserService_default };

// src/controllers/users/signUp.ts
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
var signUp_default = handleSignUp;

// src/controllers/users/logIn.ts
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
var logIn_default = handleLogIn;

// src/controllers/users/update.ts
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
var update_default = handleUpdateUserInfo;

// src/middlewares/userAuth.ts
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
var userAuth_default = authenticate;

// src/controllers/users/delete.ts
async function handleDeleteUser(req, res) {
  try {
    const { password } = req.body;
    const { userEmail } = req.user;
    const deletedUser = await userService.deleteUser({ userEmail, password });
    res.status(200).json({
      message: "User deleted!",
      deletedUser
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
var delete_default = handleDeleteUser;

// src/controllers/users/logout.ts
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
var logout_default = handleLogOut;

// src/routes/userRoutes.ts
var router = express.Router();
router.post("/sign-up", signUp_default);
router.post("/log-in", logIn_default);
router.put("/update-user", userAuth_default, update_default);
router.delete("/delete-user", userAuth_default, delete_default);
router.post("/logout", logout_default);
var userRoutes_default = router;

// src/routes/rideRoutes.ts
import { Router } from "express";

// src/services/rideServices/confirmRideService.ts
import { isInRide } from "@prisma/client";

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

// src/config/redis.ts
import { Redis } from "ioredis";
var redis = new Redis();
var redis_default = redis;

// src/services/rideServices/confirmRideService.ts
async function confirmRide(userId, fare, vehicle) {
  try {
    await database_default.users.update({
      where: {
        userId
      },
      data: {
        in_ride: isInRide.IN_RIDE
      }
    });
    const rideData = await redis_default.hgetall(`rideData:${userId}`);
    rideData.fare = fare;
    rideData.vehicle = vehicle;
    await redis_default.hmset(`rideData:${userId}`, rideData);
    await producerTemplate_default("ride-request", { rideData });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Ride request error: ", error.message);
    }
  }
}
var confirmRideService_default = confirmRide;

// src/services/rideServices/rideCancelService.ts
import { isInRide as isInRide2 } from "@prisma/client";
async function rideCancel(userId) {
  try {
    const rideData = await redis_default.hgetall(`rideData:${userId}`);
    await database_default.users.updateMany({
      where: { userId, in_ride: isInRide2.IN_RIDE },
      data: {
        in_ride: isInRide2.NOT_IN_RIDE
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
var rideCancelService_default = rideCancel;

// src/services/rideServices/rideRequestService.ts
async function rideRequest({ userId, location, destination }) {
  try {
    await producerTemplate_default("calculate-fare", { userId, location, destination });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error in confirm-ride service: ${error.message}`);
    }
  }
}
var rideRequestService_default = rideRequest;

// src/services/rideServices/index.ts
var rideService = { rideRequest: rideRequestService_default, rideCancel: rideCancelService_default, confirmRide: confirmRideService_default };

// src/controllers/rides/rideRequest.ts
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
var rideRequest_default = handleRideRequest;

// src/controllers/rides/rideCancellation.ts
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
    console.log("error in ride cancellation!");
  }
}
var rideCancellation_default = handleRideCancellation;

// src/controllers/rides/confirmRide.ts
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
    if (error instanceof Error) {
      throw new Error(`Error in confirming ride: ${error.message}`);
    }
  }
}
var confirmRide_default = handleConfirmRide;

// src/controllers/rides/payment.ts
async function handlePaymentDone(req, res) {
  try {
    const { fare, payment_id, orderId, order, userId, rideId, captainId } = req.body;
    console.log("order: " + orderId);
    await producerTemplate_default("payment-done", { fare, payment_id, orderId, order, userId, rideId, captainId });
    res.status(200).json({
      message: "payment processed!"
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error in payment controller: ${error.message}`);
    }
  }
}
var payment_default = handlePaymentDone;

// src/routes/rideRoutes.ts
var router2 = Router();
router2.post("/ride-request", userAuth_default, rideRequest_default);
router2.post("/cancel-ride", userAuth_default, rideCancellation_default);
router2.post("/confirm-ride", userAuth_default, confirmRide_default);
router2.post("/payment", payment_default);
var rideRoutes_default = router2;

// src/kafka/consumerInIt.ts
var ride_confirmed_consumer = kafkaClient_default.consumer({ groupId: "ride-confirmed-group" });
var ride_fare_consumer = kafkaClient_default.consumer({ groupId: "fetched-fare-group" });
var ride_completed_consumer = kafkaClient_default.consumer({ groupId: "ride_completed_notify_group" });
var payment_requested_consumer = kafkaClient_default.consumer({ groupId: "payment_requested_group" });
async function consumerInit() {
  await Promise.all([
    ride_confirmed_consumer.connect(),
    ride_fare_consumer.connect(),
    ride_completed_consumer.connect(),
    payment_requested_consumer.connect()
  ]);
}

// src/kafka/handlers/fareFetchedHandler.ts
async function fareFetchedHandler({ message }) {
  try {
    const { rideId, userId, pickUpLocation, destination, locationCoordinates, destinationCoordinates, fare } = JSON.parse(message.value.toString());
    await redis_default.hmset(`rideData:${userId}`, {
      rideId,
      userId,
      pickUpLocation,
      destination,
      pickUpLocation_latitude: locationCoordinates.latitude,
      pickUpLocation_longitude: locationCoordinates.longitude,
      destination_latitude: destinationCoordinates.latitude,
      destination_longitude: destinationCoordinates.longitude
    });
    console.log("fare: ", fare);
    await producerTemplate_default("show-fare", { rideId, userId, pickUpLocation, destination, locationCoordinates, destinationCoordinates, fare });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error in fare fetching handler: ${error.message}`);
    }
  }
}
var fareFetchedHandler_default = fareFetchedHandler;

// src/kafka/consumers/fareFetched.ts
async function fareFetched() {
  try {
    await ride_fare_consumer.subscribe({ topic: "fare-fetched", fromBeginning: true });
    await ride_fare_consumer.run({
      eachMessage: fareFetchedHandler_default
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error in getting ride-fare! ${error.message}`);
    }
  }
}
var fareFetched_default = fareFetched;

// src/kafka/handlers/paymentRequestedHandler.ts
async function handlePaymentRequested({ message }) {
  try {
    const { rideData, captainId } = JSON.parse(message.value.toString());
    console.log("payment data: " + rideData);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error in payment-requested handler: ${error.message}`);
    }
  }
}
var paymentRequestedHandler_default = handlePaymentRequested;

// src/kafka/consumers/paymentRequestedConsumer.ts
async function paymentRequested() {
  try {
    await payment_requested_consumer.subscribe({ topic: "payment-requested", fromBeginning: true });
    await payment_requested_consumer.run({
      eachMessage: paymentRequestedHandler_default
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error in payment-request consumer: ${error.message}`);
    }
  }
}
var paymentRequestedConsumer_default = paymentRequested;

// src/kafka/handlers/rideCompletedHandler.ts
import { isInRide as isInRide3 } from "@prisma/client";
async function rideCompletedHandler({ message }) {
  const { userId, rideId, captainId } = JSON.parse(message.value.toString());
  await database_default.users.update({
    where: {
      userId
    },
    data: {
      in_ride: isInRide3.NOT_IN_RIDE
    }
  });
  console.log(`${captainId} completed ${rideId}`);
  await redis_default.del(`rideData:${userId}`);
}
var rideCompletedHandler_default = rideCompletedHandler;

// src/kafka/consumers/rideCompletedConsumer.ts
async function rideCompleted() {
  try {
    await ride_completed_consumer.subscribe({ topic: "ride-completed-notify-user", fromBeginning: true });
    await ride_completed_consumer.run({
      eachMessage: rideCompletedHandler_default
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error in getting ride-completed notification: ` + error.message);
    }
  }
}
var rideCompletedConsumer_default = rideCompleted;

// src/kafka/handlers/rideConfirmedHandler.ts
import { isInRide as isInRide4 } from "@prisma/client";
async function rideConfirmedHandler({ message }) {
  try {
    const { captainId, rideData } = JSON.parse(message.value.toString());
    const { userId } = rideData;
    console.log("capId: " + captainId);
    console.log("rd: " + Object.keys(rideData));
    if (userId) {
      await database_default.users.update({
        where: {
          userId
        },
        data: {
          in_ride: isInRide4.IN_RIDE
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
var rideConfirmedHandler_default = rideConfirmedHandler;

// src/kafka/consumers/rideConfirmedConsumer.ts
async function rideConfirmed() {
  try {
    await ride_confirmed_consumer.subscribe({ topic: "ride-confirmed", fromBeginning: true });
    await ride_confirmed_consumer.run({
      eachMessage: rideConfirmedHandler_default
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error in getting confirmation! ${error.message}`);
    }
  }
}
var rideConfirmedConsumer_default = rideConfirmed;

// src/kafka/kafkaAdmin.ts
async function kafkaInit() {
  const admin = kafkaClient_default.admin();
  console.log("Admin connecting...");
  await admin.connect();
  console.log("Admin connected...");
  const topics = ["ride-request"];
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

// src/kafka/index.ts
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
  await rideConfirmedConsumer_default();
  await fareFetched_default();
  await rideCompletedConsumer_default();
  await paymentRequestedConsumer_default();
}
var kafka_default = startKafka;

// src/index.ts
dotenv3.config();
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: true }));
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Hello! Suraj, I am user-service");
});
app.use("/actions", userRoutes_default);
app.use("/rides", rideRoutes_default);
kafka_default();
app.listen(Number(process.env.PORT), "0.0.0.0", () => {
  console.log("User service is running!");
});
