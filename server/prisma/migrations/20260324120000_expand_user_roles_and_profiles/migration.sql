DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = 'UserStatus'
  ) THEN
    CREATE TYPE "UserStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_enum e ON e.enumtypid = t.oid
    WHERE t.typname = 'Role'
      AND e.enumlabel = 'INSTRUCTOR'
  ) THEN
    ALTER TYPE "Role" RENAME TO "Role_old";
    CREATE TYPE "Role" AS ENUM ('ADMIN', 'LECTURER', 'STUDENT', 'DEAN', 'HOD');

    ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
    ALTER TABLE "User"
      ALTER COLUMN "role" TYPE "Role"
      USING (
        CASE
          WHEN "role"::text = 'INSTRUCTOR' THEN 'LECTURER'
          ELSE "role"::text
        END
      )::"Role";
    ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'STUDENT';

    DROP TYPE "Role_old";
  END IF;
END $$;

ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "phoneNumber" TEXT,
  ADD COLUMN IF NOT EXISTS "status" "UserStatus",
  ADD COLUMN IF NOT EXISTS "registrationNumber" TEXT,
  ADD COLUMN IF NOT EXISTS "staffId" TEXT,
  ADD COLUMN IF NOT EXISTS "faculty" TEXT,
  ADD COLUMN IF NOT EXISTS "department" TEXT;

UPDATE "User"
SET "status" = 'APPROVED'
WHERE "status" IS NULL;

ALTER TABLE "User"
  ALTER COLUMN "status" SET DEFAULT 'PENDING',
  ALTER COLUMN "status" SET NOT NULL,
  ALTER COLUMN "password" DROP NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "User_phoneNumber_key" ON "User"("phoneNumber");

ALTER TABLE "Exam"
  ADD COLUMN IF NOT EXISTS "faculty" TEXT,
  ADD COLUMN IF NOT EXISTS "department" TEXT;
