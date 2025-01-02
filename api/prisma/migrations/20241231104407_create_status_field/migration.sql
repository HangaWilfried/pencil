-- CreateEnum
CREATE TYPE "Status" AS ENUM ('DRAFT', 'PUBLISH');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'DRAFT';
