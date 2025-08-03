-- CreateTable
CREATE TABLE "public"."EmojiRoles" (
    "id" SERIAL NOT NULL,
    "messageId" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "EmojiRoles_pkey" PRIMARY KEY ("id")
);
