👤 User Service

This User Service is an internal backend service of SwiftRide (Ride-Sharing Platform), which is responsible for managing user information, creating ride requests, and other user related tasks.

-----------------------------------------------------------------------------------------------------------------------------------------------

🚀 Features

✅ User Profile Management (Create, Update, Delete)  
✅ User Authentication (JWT-based or OAuth)  
✅ Ride request, cancellation, payment's request  

-----------------------------------------------------------------------------------------------------------------------------------------------

🛠 Technologies Used

✅ Node.js  
✅ Express  
✅ TypeScript  
✅ MySQL  
✅ Kafka  
✅ Docker  
✅ Redis  
✅ Prisma ORM  

-----------------------------------------------------------------------------------------------------------------------------------------------

📦 Installation

✅ Prerequisites

Ensure you have the following installed ->    
Node.js (for JavaScript/TypeScript backend)  
Express  

Required Packages ->  
bcrypt  
jsonwebtoken  
dotenv  
prisma  
nodemon  
ioredis  
kafkajs  
lodash  
tsup (for TypeScript)  
typescript (for TypeScript)  
concurrently (for TypeScript)  

Database ->  
MySQL 

Ensure you have the following tools running in your local machine ->  
Confluent Kafka Docker Image  
Redis Docker Image  

-----------------------------------------------------------------------------------------------------------------------------------------------

📌 Steps to Run

1️⃣ Clone the repository

git clone https://github.com/Surajkumarjha07/SwiftRide-user-service.git

2️⃣ Install Dependencies

npm install

3️⃣ Set Up Environment Variables
Create a .env file and configure the following variables:

DATABASE_URL=your-database-url
PORT=your-port-number
JWT_SECRET=your-jwt-secret

4️⃣ Run the Application

nodemon index.js

🚀 Your User Service is now up and running! 🎉

