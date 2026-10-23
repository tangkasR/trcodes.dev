-- AlterTable
ALTER TABLE "users" ADD COLUMN     "mfa_enabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mfa_recovery_codes" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "mfa_secret" VARCHAR(255);

-- CreateTable
CREATE TABLE "mfa_attempts" (
    "uuid" UUID NOT NULL,
    "user_uuid" UUID,
    "ip" VARCHAR(64) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mfa_attempts_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE INDEX "mfa_attempts_user_uuid_created_at_idx" ON "mfa_attempts"("user_uuid", "created_at");

-- CreateIndex
CREATE INDEX "mfa_attempts_ip_created_at_idx" ON "mfa_attempts"("ip", "created_at");

-- CreateIndex
CREATE INDEX "mfa_attempts_created_at_idx" ON "mfa_attempts"("created_at");
