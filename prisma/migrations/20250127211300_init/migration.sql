/*
  Warnings:

  - You are about to drop the column `DateOfBirth` on the `Students` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Students" (
    "StudentID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FirstName" TEXT NOT NULL,
    "LastName" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "PhoneNumber" TEXT,
    "Address" TEXT,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "EnrollmentStatus" TEXT DEFAULT 'Active',
    "RegistrationDate" DATETIME DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Students" ("Address", "Email", "EnrollmentStatus", "FirstName", "LastName", "Password", "PhoneNumber", "RegistrationDate", "StudentID", "isAdmin") SELECT "Address", "Email", "EnrollmentStatus", "FirstName", "LastName", "Password", "PhoneNumber", "RegistrationDate", "StudentID", "isAdmin" FROM "Students";
DROP TABLE "Students";
ALTER TABLE "new_Students" RENAME TO "Students";
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_Students_1" ON "Students"("Email");
Pragma writable_schema=0;
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
