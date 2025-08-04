/*
  Warnings:

  - You are about to drop the column `emote` on the `EmojiRoles` table. All the data in the column will be lost.
  - Added the required column `emoteName` to the `EmojiRoles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."EmojiRoles" DROP COLUMN "emote",
ADD COLUMN     "emoteName" TEXT NOT NULL;
