-- CreateEnum
CREATE TYPE "isInRide" AS ENUM ('IN_RIDE', 'NOT_IN_RIDE');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "longitude" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "in_ride" "isInRide" NOT NULL DEFAULT 'NOT_IN_RIDE',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_userId_key" ON "users"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
