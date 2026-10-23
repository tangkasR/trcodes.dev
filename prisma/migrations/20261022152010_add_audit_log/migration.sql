-- DropIndex
DROP INDEX "login_attempts_email_created_at_idx";

-- CreateTable
CREATE TABLE "audit_logs" (
    "uuid" UUID NOT NULL,
    "actor_uuid" UUID,
    "actor_name" VARCHAR(100),
    "actor_email" VARCHAR(191),
    "action" VARCHAR(60) NOT NULL,
    "target_type" VARCHAR(50),
    "target_uuid" VARCHAR(64),
    "detail" VARCHAR(1000),
    "ip" VARCHAR(64),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE INDEX "audit_logs_actor_uuid_created_at_idx" ON "audit_logs"("actor_uuid", "created_at");

-- CreateIndex
CREATE INDEX "audit_logs_action_created_at_idx" ON "audit_logs"("action", "created_at");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");

-- CreateIndex
CREATE INDEX "login_attempts_email_ip_created_at_idx" ON "login_attempts"("email", "ip", "created_at");

-- Seed feature audit-log untuk database yang sudah berjalan (seed ulang tidak wajib)
INSERT INTO "features" (
    "uuid",
    "key",
    "name",
    "desc",
    "available_actions",
    "created_at",
    "updated_at"
)
VALUES (
    gen_random_uuid(),
    'audit-log',
    'Audit Log',
    'Lihat jejak aktivitas keamanan',
    ARRAY['read', 'add', 'edit', 'delete']::text[],
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT ("key") DO NOTHING;

-- Beri izin read kepada Super Admin yang sudah ada
INSERT INTO "role_permissions" (
    "uuid",
    "role_uuid",
    "feature_uuid",
    "is_read",
    "is_add",
    "is_edit",
    "is_delete",
    "created_at",
    "updated_at"
)
SELECT
    gen_random_uuid(),
    r."uuid",
    f."uuid",
    true,
    false,
    false,
    false,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM "roles" r
CROSS JOIN "features" f
WHERE r."name" = 'Super Admin'
  AND f."key" = 'audit-log'
ON CONFLICT ("role_uuid", "feature_uuid") DO NOTHING;
