-- CreateEnum
CREATE TYPE "NotificationName" AS ENUM ('POST', 'COMMENT');

-- CreateTable
CREATE TABLE "comment" (
    "idx" SERIAL NOT NULL,
    "post_idx" INTEGER NOT NULL,
    "author_idx" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "comment_pkey" PRIMARY KEY ("idx")
);

-- CreateTable
CREATE TABLE "notification" (
    "idx" SERIAL NOT NULL,
    "issuer_idx" INTEGER NOT NULL,
    "subscriber_idx" INTEGER NOT NULL,
    "entity_type_idx" INTEGER NOT NULL,
    "entity_idx" INTEGER NOT NULL,
    "read_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "notification_pkey" PRIMARY KEY ("idx")
);

-- CreateTable
CREATE TABLE "notification_type" (
    "idx" SERIAL NOT NULL,
    "name" "NotificationName" NOT NULL,

    CONSTRAINT "notification_type_pkey" PRIMARY KEY ("idx")
);

-- CreateTable
CREATE TABLE "post" (
    "idx" SERIAL NOT NULL,
    "author_idx" INTEGER NOT NULL,
    "title" VARCHAR NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "post_pkey" PRIMARY KEY ("idx")
);

-- CreateTable
CREATE TABLE "post_image" (
    "idx" SERIAL NOT NULL,
    "post_idx" SERIAL NOT NULL,
    "path" TEXT NOT NULL,

    CONSTRAINT "post_image_pkey" PRIMARY KEY ("idx")
);

-- CreateTable
CREATE TABLE "user" (
    "idx" SERIAL NOT NULL,
    "email" VARCHAR NOT NULL,
    "password" CHAR(60) NOT NULL,
    "name" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "user_pkey" PRIMARY KEY ("idx")
);

-- CreateIndex
CREATE UNIQUE INDEX "unique_email_deleted_at" ON "user"("email", "deleted_at");

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "fk_post_to_comment" FOREIGN KEY ("post_idx") REFERENCES "post"("idx") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "fk_user_to_comment" FOREIGN KEY ("author_idx") REFERENCES "user"("idx") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "fk_notification_type_to_notification" FOREIGN KEY ("entity_type_idx") REFERENCES "notification_type"("idx") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "fk_user_to_notification" FOREIGN KEY ("issuer_idx") REFERENCES "user"("idx") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "fk_user_to_notification1" FOREIGN KEY ("subscriber_idx") REFERENCES "user"("idx") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "fk_user_to_post" FOREIGN KEY ("author_idx") REFERENCES "user"("idx") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "post_image" ADD CONSTRAINT "fk_post_to_post_image" FOREIGN KEY ("post_idx") REFERENCES "post"("idx") ON DELETE NO ACTION ON UPDATE NO ACTION;
