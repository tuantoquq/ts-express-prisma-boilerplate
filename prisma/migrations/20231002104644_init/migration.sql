-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('EMAIL_VERIFICATION', 'PASSWORD_RESET', 'ACCESS', 'REFRESH');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "is_email_verified" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "type" "TokenType" NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
