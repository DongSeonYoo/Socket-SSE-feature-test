/*
  Warnings:

  - You are about to drop the column `entity_type_idx` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the column `issuer_idx` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the column `read_at` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the column `subscriber_idx` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the `notification_type` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `entityType` to the `notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiver_idx` to the `notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender_idx` to the `notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "NotificationName" ADD VALUE 'REPLY';

-- DropForeignKey
ALTER TABLE "notification" DROP CONSTRAINT "fk_notification_type_to_notification";

-- DropForeignKey
ALTER TABLE "notification" DROP CONSTRAINT "fk_user_to_notification";

-- DropForeignKey
ALTER TABLE "notification" DROP CONSTRAINT "fk_user_to_notification1";

-- AlterTable
ALTER TABLE "notification" DROP COLUMN "entity_type_idx",
DROP COLUMN "issuer_idx",
DROP COLUMN "read_at",
DROP COLUMN "subscriber_idx",
ADD COLUMN     "entityType" "NotificationName" NOT NULL,
ADD COLUMN     "readed_at" TIMESTAMPTZ(6),
ADD COLUMN     "receiver_idx" INTEGER NOT NULL,
ADD COLUMN     "sender_idx" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "post_image" ALTER COLUMN "post_idx" DROP DEFAULT;
DROP SEQUENCE "post_image_post_idx_seq";

-- DropTable
DROP TABLE "notification_type";

-- CreateTable
CREATE TABLE "reply" (
    "idx" SERIAL NOT NULL,
    "comment_idx" INTEGER NOT NULL,
    "author_idx" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reply_pkey" PRIMARY KEY ("idx")
);

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "fk_user_to_notification" FOREIGN KEY ("sender_idx") REFERENCES "user"("idx") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "fk_user_to_notification1" FOREIGN KEY ("receiver_idx") REFERENCES "user"("idx") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reply" ADD CONSTRAINT "fk_comment_to_reply" FOREIGN KEY ("comment_idx") REFERENCES "comment"("idx") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reply" ADD CONSTRAINT "fk_user_to_reply" FOREIGN KEY ("author_idx") REFERENCES "user"("idx") ON DELETE NO ACTION ON UPDATE NO ACTION;
