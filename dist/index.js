// src/index.ts
import express2 from "express";
import dotenv3 from "dotenv";
import cookieParser from "cookie-parser";

// src/routes/userRoutes.ts
import express from "express";

// src/prisma/prismaClient.ts
import { PrismaClient } from "@prisma/client";
var prisma = new PrismaClient();
var prismaClient_default = prisma;

// src/services/userServices/deleteUserService.ts
import bcrypt from "bcrypt";
async function deleteUser({ email, password }) {
  try {
    const user = await prismaClient_default.users.findFirst({ where: { email } });
    let passwordMatched;
    if (user) {
      passwordMatched = await bcrypt.compare(password, user.password);
    }
    if (!user || !passwordMatched) {
      throw new Error("Incorrect email or password!");
    }
    const deletedUser = await prismaClient_default.users.delete({ where: { email } });
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
    const user = await prismaClient_default.users.findFirst({ where: { email } });
    let passwordMatched;
    if (user) {
      passwordMatched = await bcrypt2.compare(password, user.password);
    }
    if (!user || !passwordMatched) {
      throw new Error("Incorrect email or password!");
    }
    const token = jwt.sign({ email, name: user.name, id: user.userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
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
    const existingUser = await prismaClient_default.users.findFirst({ where: { email } });
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
    const user = await prismaClient_default.users.create({ data: { email, name, password: hashedPassword, role, userId } });
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
async function updateUser({ newEmail, newName, newPassword, newRole, oldPassword, email }) {
  try {
    const user = await prismaClient_default.users.findFirst({
      where: { email }
    });
    let passwordMatched;
    if (user) {
      passwordMatched = await bcrypt4.compare(oldPassword, user.password);
    }
    if (!passwordMatched || !user) {
      throw new Error("Incorrect Email or Password!");
    }
    const saltRounds = 10;
    const salt = await bcrypt4.genSalt(saltRounds);
    const hashedPassword = await bcrypt4.hash(newPassword, salt);
    const updatedUser = await prismaClient_default.users.update({
      where: { email },
      data: { email: newEmail, name: newName, password: hashedPassword, role: newRole }
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
    const { newEmail, newName, newPassword, newRole, oldPassword } = req.body;
    const { email } = req.user;
    const updatedUser = await userService.updateUser({ newEmail, newName, newPassword, newRole, oldPassword, email });
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
  let token = req.cookies.authtoken || req.headers["authorization"]?.split("Bearer ")[1];
  if (!token) {
    res.status(404).json({ message: "token not available" });
    return;
  }
  try {
    const verified = jwt2.verify(token, process.env.JWT_SECRET);
    if (verified) {
      req.user = verified;
      next();
    }
  } catch (error) {
    res.status(403).json({ message: "Forbidden: Invalid or expired token" });
  }
}
var userAuth_default = authenticate;

// src/controllers/users/delete.ts
async function handleDeleteUser(req, res) {
  try {
    const { password } = req.body;
    const { email } = req.user;
    const deletedUser = await userService.deleteUser({ email, password });
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

// src/routes/userRoutes.ts
var router = express.Router();
router.post("/sign-up", signUp_default);
router.post("/log-in", logIn_default);
router.put("/update-user", userAuth_default, update_default);
router.delete("/delete-user", userAuth_default, delete_default);
var userRoutes_default = router;

// src/routes/rideRoutes.ts
import { Router } from "express";

// src/services/rideServices/rideCancelService.ts
import { isInRide } from "@prisma/client";

// src/redis/redisClient.ts
import { Redis } from "ioredis";
var redisClient = new Redis();
var redisClient_default = redisClient;

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
  } catch (error) {
    console.log(`error in sending ${topic}: ${error}`);
  }
}
var producerTemplate_default = sendProducerMessage;

// src/services/rideServices/rideCancelService.ts
async function rideCancel(id) {
  try {
    const rideData = await redisClient_default.hgetall(`userRide:${id}`);
    await prismaClient_default.users.updateMany({
      where: { userId: id, in_ride: isInRide.IN_RIDE },
      data: {
        in_ride: isInRide.NOT_IN_RIDE
      }
    });
    await producerTemplate_default("ride-cancelled", rideData);
  } catch (error) {
    if (error instanceof Error) {
      console.log("Ride cancel service error: ", error.message);
    }
  }
}
var rideCancelService_default = rideCancel;

// src/services/rideServices/rideRequestService.ts
import { isInRide as isInRide2 } from "@prisma/client";
async function rideRequest({ id, location, destination }) {
  try {
    const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklomnopqrstuvwxyz_-@#$&";
    let rideId = "";
    for (let i = 0; i < 30; i++) {
      let pos = Math.floor(Math.random() * alpha.length);
      rideId = rideId + alpha[pos];
    }
    await prismaClient_default.users.update({
      where: {
        userId: id
      },
      data: {
        in_ride: isInRide2.IN_RIDE
      }
    });
    await producerTemplate_default("ride-request", { rideId, userId: id, pickUpLocation: location, destination, price: 200 });
    await redisClient_default.hmset(`userRide:${id}`, { rideId, userId: id, pickUpLocation: location, destination, price: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Ride request error: ", error.message);
    }
  }
}
var rideRequestService_default = rideRequest;

// src/services/rideServices/index.ts
var rideService = { rideRequest: rideRequestService_default, rideCancel: rideCancelService_default };

// src/controllers/rides/rideRequest.ts
async function handleRideRequest(req, res) {
  try {
    const { location, destination } = req.body;
    const { id } = req.user;
    if (!id) {
      res.status(404).json({
        message: "user not defined!"
      });
      return;
    }
    if (!location || !destination) {
      res.status(400).json({
        message: "location and destination are required!"
      });
      return;
    }
    await rideService.rideRequest({ id, location, destination });
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
    const { id } = req.user;
    if (!id) {
      res.status(400).json({
        message: "token inavalid!"
      });
      return;
    }
    await rideService.rideCancel(id);
    res.status(200).json({
      message: "ride cancellation successfull!"
    });
  } catch (error) {
    console.log("error in ride cancellation!");
  }
}
var rideCancellation_default = handleRideCancellation;

// src/routes/rideRoutes.ts
var router2 = Router();
router2.post("/ride-request", userAuth_default, rideRequest_default);
router2.post("/cancel-ride", userAuth_default, rideCancellation_default);
var rideRoutes_default = router2;

// src/kafka/consumerInIt.ts
var ride_confirmed_consumer = kafkaClient_default.consumer({ groupId: "ride-confirmed-group" });
async function consumerInit() {
  await Promise.all([
    ride_confirmed_consumer.connect()
  ]);
}

// src/kafka/handlers/rideConfirmedHandler.ts
import { isInRide as isInRide3 } from "@prisma/client";
async function rideConfirmedHandler({ message }) {
  try {
    const { id, rideData } = JSON.parse(message.value.toString());
    await prismaClient_default.users.update({
      where: { userId: id },
      data: {
        in_ride: isInRide3.IN_RIDE
      }
    });
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
