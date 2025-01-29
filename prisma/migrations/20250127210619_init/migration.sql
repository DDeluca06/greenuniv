-- CreateTable
CREATE TABLE "Courses" (
    "CourseID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "CourseName" TEXT NOT NULL,
    "CourseCode" TEXT NOT NULL,
    "Credits" INTEGER NOT NULL,
    "Department" TEXT NOT NULL,
    "Schedule" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Enrollments" (
    "EnrollmentID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "StudentID" INTEGER NOT NULL,
    "CourseID" INTEGER NOT NULL,
    "EnrollmentDate" DATETIME DEFAULT CURRENT_DATE,
    "Grade" TEXT,
    CONSTRAINT "Enrollments_StudentID_fkey" FOREIGN KEY ("StudentID") REFERENCES "Students" ("StudentID") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "Enrollments_CourseID_fkey" FOREIGN KEY ("CourseID") REFERENCES "Courses" ("CourseID") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "Fees" (
    "FeeID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "StudentID" INTEGER NOT NULL,
    "FeeDescription" TEXT NOT NULL,
    "Amount" REAL NOT NULL,
    "DueDate" DATETIME NOT NULL,
    "PaidStatus" TEXT DEFAULT 'Unpaid',
    CONSTRAINT "Fees_StudentID_fkey" FOREIGN KEY ("StudentID") REFERENCES "Students" ("StudentID") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "Payments" (
    "PaymentID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "StudentID" INTEGER NOT NULL,
    "FeeID" INTEGER NOT NULL,
    "PaymentDate" DATETIME DEFAULT CURRENT_DATE,
    "AmountPaid" REAL NOT NULL,
    "PaymentMethod" TEXT,
    CONSTRAINT "Payments_StudentID_fkey" FOREIGN KEY ("StudentID") REFERENCES "Students" ("StudentID") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "Payments_FeeID_fkey" FOREIGN KEY ("FeeID") REFERENCES "Fees" ("FeeID") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "Students" (
    "StudentID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FirstName" TEXT NOT NULL,
    "LastName" TEXT NOT NULL,
    "DateOfBirth" DATETIME,
    "Email" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "PhoneNumber" TEXT,
    "Address" TEXT,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "EnrollmentStatus" TEXT DEFAULT 'Active',
    "RegistrationDate" DATETIME DEFAULT CURRENT_DATE
);

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_Courses_1" ON "Courses"("CourseCode");
Pragma writable_schema=0;

-- CreateIndex
CREATE INDEX "idx_student_enrollments" ON "Enrollments"("StudentID");

-- CreateIndex
CREATE INDEX "idx_course_enrollments" ON "Enrollments"("CourseID");

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_Enrollments_1" ON "Enrollments"("StudentID", "CourseID");
Pragma writable_schema=0;

-- CreateIndex
CREATE INDEX "idx_student_fees" ON "Fees"("StudentID");

-- CreateIndex
CREATE INDEX "idx_student_payments" ON "Payments"("StudentID");

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_Students_1" ON "Students"("Email");
Pragma writable_schema=0;
