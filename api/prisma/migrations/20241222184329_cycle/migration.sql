/*
  Warnings:

  - Added the required column `code` to the `Cycle` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cycle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT
);
INSERT INTO "new_Cycle" ("description", "id", "name") SELECT "description", "id", "name" FROM "Cycle";
DROP TABLE "Cycle";
ALTER TABLE "new_Cycle" RENAME TO "Cycle";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
