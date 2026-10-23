-- CreateEnum
CREATE TYPE "PublishStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "ContactPlatform" AS ENUM ('EMAIL', 'WHATSAPP', 'INSTAGRAM', 'GITHUB', 'LINKEDIN');

-- CreateTable
CREATE TABLE "profiles" (
    "uuid" UUID NOT NULL,
    "key" VARCHAR(20) NOT NULL DEFAULT 'main',
    "full_name" VARCHAR(100) NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "brand" VARCHAR(50) NOT NULL,
    "content_name" VARCHAR(100) NOT NULL,
    "tagline" VARCHAR(150) NOT NULL,
    "intro" VARCHAR(600) NOT NULL,
    "bio" TEXT,
    "photo_url" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "contact_links" (
    "uuid" UUID NOT NULL,
    "platform" "ContactPlatform" NOT NULL,
    "display_text" VARCHAR(150) NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_links_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "projects" (
    "uuid" UUID NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "short" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "features" TEXT[],
    "stack" TEXT[],
    "demo_image_url" VARCHAR(500),
    "demo_video_url" VARCHAR(500),
    "chapters_heading" VARCHAR(150),
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "chapters" (
    "uuid" UUID NOT NULL,
    "project_uuid" UUID NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "icon" VARCHAR(50) NOT NULL,
    "definition" TEXT NOT NULL,
    "application" TEXT NOT NULL,
    "teaser" TEXT,
    "cover_url" VARCHAR(500),
    "cover_alt" VARCHAR(255),
    "content" JSONB NOT NULL DEFAULT '[]',
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chapters_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "experiences" (
    "uuid" UUID NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "organization" VARCHAR(150) NOT NULL,
    "role" VARCHAR(150) NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "summary" VARCHAR(500) NOT NULL,
    "duties" TEXT[],
    "results" TEXT[],
    "stack" TEXT[],
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "experiences_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "certifications" (
    "uuid" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "issuer" VARCHAR(150) NOT NULL,
    "year" INTEGER NOT NULL,
    "credential_url" VARCHAR(500),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "certifications_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "educations" (
    "uuid" UUID NOT NULL,
    "school" VARCHAR(200) NOT NULL,
    "major" VARCHAR(150) NOT NULL,
    "start_year" INTEGER NOT NULL,
    "end_year" INTEGER,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "educations_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_key_key" ON "profiles"("key");

-- CreateIndex
CREATE UNIQUE INDEX "contact_links_platform_key" ON "contact_links"("platform");

-- CreateIndex
CREATE UNIQUE INDEX "projects_slug_key" ON "projects"("slug");

-- CreateIndex
CREATE INDEX "projects_status_sort_order_idx" ON "projects"("status", "sort_order");

-- CreateIndex
CREATE INDEX "chapters_project_uuid_status_sort_order_idx" ON "chapters"("project_uuid", "status", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "chapters_project_uuid_slug_key" ON "chapters"("project_uuid", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "experiences_slug_key" ON "experiences"("slug");

-- CreateIndex
CREATE INDEX "experiences_is_visible_start_date_idx" ON "experiences"("is_visible", "start_date");

-- CreateIndex
CREATE INDEX "certifications_is_visible_year_idx" ON "certifications"("is_visible", "year");

-- AddForeignKey
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_project_uuid_fkey" FOREIGN KEY ("project_uuid") REFERENCES "projects"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
