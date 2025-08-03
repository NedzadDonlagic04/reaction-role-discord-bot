/*
  Warnings:

  - You are about to drop the column `emoji` on the `EmojiRoles` table. All the data in the column will be lost.
  - Added the required column `emote` to the `EmojiRoles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."EmojiRoles" DROP COLUMN "emoji",
ADD COLUMN     "emote" TEXT NOT NULL;
