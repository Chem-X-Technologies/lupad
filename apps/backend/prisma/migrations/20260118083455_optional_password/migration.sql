-- CreateEnum
CREATE TYPE "AuthMethod" AS ENUM ('OTP', 'PASSWORD');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "authMethod" "AuthMethod" NOT NULL DEFAULT 'OTP',
ADD COLUMN     "password" TEXT;
