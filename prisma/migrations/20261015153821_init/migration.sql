-- CreateTable
CREATE TABLE "roles" (
    "uuid" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "desc" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "features" (
    "uuid" UUID NOT NULL,
    "key" VARCHAR(100) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "desc" VARCHAR(255),
    "available_actions" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "features_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "uuid" UUID NOT NULL,
    "role_uuid" UUID NOT NULL,
    "feature_uuid" UUID NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "is_add" BOOLEAN NOT NULL DEFAULT false,
    "is_edit" BOOLEAN NOT NULL DEFAULT false,
    "is_delete" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "users" (
    "uuid" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(191) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role_uuid" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "login_attempts" (
    "uuid" UUID NOT NULL,
    "email" VARCHAR(191) NOT NULL,
    "ip" VARCHAR(64) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "login_attempts_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "features_key_key" ON "features"("key");

-- CreateIndex
CREATE INDEX "role_permissions_feature_uuid_idx" ON "role_permissions"("feature_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_role_uuid_feature_uuid_key" ON "role_permissions"("role_uuid", "feature_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_uuid_idx" ON "users"("role_uuid");

-- CreateIndex
CREATE INDEX "login_attempts_email_created_at_idx" ON "login_attempts"("email", "created_at");

-- CreateIndex
CREATE INDEX "login_attempts_ip_created_at_idx" ON "login_attempts"("ip", "created_at");

-- CreateIndex
CREATE INDEX "login_attempts_created_at_idx" ON "login_attempts"("created_at");

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_uuid_fkey" FOREIGN KEY ("role_uuid") REFERENCES "roles"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_feature_uuid_fkey" FOREIGN KEY ("feature_uuid") REFERENCES "features"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_uuid_fkey" FOREIGN KEY ("role_uuid") REFERENCES "roles"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
