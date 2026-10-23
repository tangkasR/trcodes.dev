import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";
import {
  ACTIONS,
  FEATURES,
  ROLE_DEFAULT,
  ROLE_SUPER_ADMIN,
} from "../config";
import {
  CERTS,
  CONTACTS,
  EDU,
  JOBS,
  PROJECTS,
} from "./seed-data";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

function getSeedCredentials(): { email: string; password: string } {
  const adminEmail = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;

  const weakPasswords = new Set([
    "superadmin#123",
    "password#default",
    "password",
    "admin",
    "changeme",
    "change_me_min_12_karakter",
  ]);

  if (!adminEmail || !adminPassword) {
    throw new Error(
      "SEED_ADMIN_EMAIL dan SEED_ADMIN_PASSWORD wajib diisi sebelum menjalankan seed."
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminEmail)) {
    throw new Error("SEED_ADMIN_EMAIL bukan alamat email yang valid.");
  }
  if (adminPassword.length < 12) {
    throw new Error("SEED_ADMIN_PASSWORD minimal 12 karakter.");
  }
  if (weakPasswords.has(adminPassword.toLowerCase())) {
    throw new Error(
      "SEED_ADMIN_PASSWORD masih memakai password default yang lemah."
    );
  }
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ALLOW_DESTRUCTIVE_SEED !== "true"
  ) {
    throw new Error(
      "Seed bersifat destruktif. Set ALLOW_DESTRUCTIVE_SEED=true hanya jika benar-benar ingin mereset data production."
    );
  }

  return { email: adminEmail, password: adminPassword };
}

const ADMIN = getSeedCredentials();

async function main() {
  console.log("Memulai proses seeder...");

  // 0. Reset semua data di tabel yang ada secara aman berurutan sesuai FK
  console.log("Membersihkan data lama...");
  await prisma.auditLog.deleteMany();
  await prisma.mfaAttempt.deleteMany();
  await prisma.loginAttempt.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.project.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.certification.deleteMany();
  await prisma.education.deleteMany();
  await prisma.contactLink.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.rolePermission.deleteMany();
  await prisma.userSession.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();
  await prisma.feature.deleteMany();

  // 1. Seed Roles
  console.log("Seeding roles...");
  const superAdminRole = await prisma.role.create({
    data: {
      name: ROLE_SUPER_ADMIN,
      desc: "Akses penuh ke semua fitur dan modul sistem",
    },
  });

  const defaultRole = await prisma.role.create({
    data: {
      name: ROLE_DEFAULT,
      desc: "Role default untuk user pendaftaran baru",
    },
  });

  // 2. Seed Features
  console.log("Seeding features...");
  const createdFeatures = [];
  for (const f of FEATURES) {
    const feat = await prisma.feature.create({
      data: {
        key: f.key,
        name: f.name,
        desc: f.desc,
        availableActions: [...ACTIONS],
      },
    });
    createdFeatures.push(feat);
  }

  // 3. Seed Role Permissions
  console.log("Seeding role permissions...");
  for (const feat of createdFeatures) {
    // Super Admin: Akses penuh ke SEMUA fitur (read, add, edit, delete)
    await prisma.rolePermission.create({
      data: {
        roleUuid: superAdminRole.uuid,
        featureUuid: feat.uuid,
        isRead: true,
        isAdd: true,
        isEdit: true,
        isDelete: true,
      },
    });

    // Default Role (User): Izin awal false
    await prisma.rolePermission.create({
      data: {
        roleUuid: defaultRole.uuid,
        featureUuid: feat.uuid,
        isRead: false,
        isAdd: false,
        isEdit: false,
        isDelete: false,
      },
    });
  }

  // 4. Seed User Super Admin
  console.log("Seeding super admin user...");
  await prisma.user.create({
    data: {
      name: "Tangkas Risdianto",
      email: ADMIN.email,
      password: await bcrypt.hash(ADMIN.password, 12),
      roleUuid: superAdminRole.uuid,
    },
  });

  // 5. Seed Profile (key: "main")
  console.log("Seeding profile...");
  await prisma.profile.create({
    data: {
      key: "main",
      fullName: "Tangkas Risdianto",
      title: "Full Stack Developer",
      brand: "trcodes.dev",
      contentName: "ngoding suka-suka",
      tagline: "Ngoding apa saja. Menceritakan perjalanannya.",
      intro:
        "Halo, saya Tangkas Risdianto, Full Stack Developer. Di sini saya menceritakan perjalanan ngoding saya: apa yang saya buat, kenapa saya membuatnya, dan apa yang saya pelajari di tengah jalan. Bahasa apa pun, bikin apa pun, suka-suka.",
      bio: "Pengembang aplikasi web yang fokus pada performa, keamanan, dan pengalaman pengguna yang nyaman.",
      photoUrl: "https://picsum.photos/seed/tangkas-risdianto/480/600",
    },
  });

  // 6. Seed Contact Links
  console.log("Seeding contact links...");
  const platformMap: Record<string, "EMAIL" | "WHATSAPP" | "INSTAGRAM" | "GITHUB" | "LINKEDIN"> = {
    Email: "EMAIL",
    WhatsApp: "WHATSAPP",
    Instagram: "INSTAGRAM",
    GitHub: "GITHUB",
    LinkedIn: "LINKEDIN",
  };

  let contactOrder = 0;
  for (const [, name, href, text] of CONTACTS) {
    const platform = platformMap[name];
    if (platform) {
      await prisma.contactLink.create({
        data: {
          platform,
          displayText: text,
          url: href,
          sortOrder: contactOrder++,
          isVisible: true,
        },
      });
    }
  }

  // 7. Seed Education
  console.log("Seeding educations...");
  let eduOrder = 0;
  for (const item of EDU) {
    // Parser "2020-2024" atau "2017-2020"
    const [startYearStr, endYearStr] = item.years.split("-");
    const startYear = parseInt(startYearStr, 10) || 2020;
    const endYear = endYearStr ? parseInt(endYearStr, 10) : null;

    await prisma.education.create({
      data: {
        school: item.school,
        major: item.major,
        startYear,
        endYear,
        sortOrder: eduOrder++,
      },
    });
  }

  // 8. Seed Certification
  console.log("Seeding certifications...");
  let certOrder = 0;
  for (const item of CERTS) {
    await prisma.certification.create({
      data: {
        title: item.title,
        issuer: item.issuer,
        year: parseInt(item.year, 10) || 2023,
        sortOrder: certOrder++,
        isVisible: true,
      },
    });
  }

  // 9. Seed Experiences
  console.log("Seeding experiences...");
  const jobDates: Record<string, { start: Date; end: Date | null }> = {
    "ais-technology-asia": {
      start: new Date("2024-10-01"),
      end: null,
    },
    "nazma-office": {
      start: new Date("2024-01-01"),
      end: new Date("2024-01-31"),
    },
    "dicoding-indonesia": {
      start: new Date("2023-07-01"),
      end: new Date("2023-12-31"),
    },
  };

  for (const job of JOBS) {
    const dates = jobDates[job.uuid] ?? {
      start: new Date(`${job.start}-01-01`),
      end: null,
    };

    await prisma.experience.create({
      data: {
        slug: job.uuid,
        organization: job.org,
        role: job.role,
        startDate: dates.start,
        endDate: dates.end,
        summary: job.summary,
        duties: job.duties,
        results: job.results,
        stack: job.stack,
        isVisible: true,
      },
    });
  }

  // 10. Seed Projects & Chapters
  console.log("Seeding projects and chapters...");
  let projOrder = 0;
  for (const p of Object.values(PROJECTS)) {
    const createdProject = await prisma.project.create({
      data: {
        slug: p.slug,
        name: p.name,
        short: p.short,
        description: p.desc,
        features: p.can,
        stack: p.stack,
        demoImageUrl: p.demo.img ? `/${p.demo.img}.png` : null,
        demoVideoUrl: p.demo.video || null,
        chaptersHeading: p.chHead || null,
        isDefault: p.isDefault ?? false,
        status: "PUBLISHED",
        sortOrder: projOrder++,
      },
    });

    let chapOrder = 0;
    for (const c of p.chapters) {
      await prisma.chapter.create({
        data: {
          projectUuid: createdProject.uuid,
          slug: c.slug,
          title: c.title,
          icon: c.icon,
          definition: c.what,
          application: c.use,
          teaser: c.more || null,
          coverUrl: c.img ? `/${c.img}.png` : null,
          content: (c.content as unknown) ?? [],
          status: "PUBLISHED",
          sortOrder: chapOrder++,
          publishedAt: new Date(),
        },
      });
    }
  }

  console.log("=====================================");
  console.log("Seeder berhasil dijalankan sepenuhnya!");
  console.log(`Akun Super Admin : ${ADMIN.email}`);
  console.log("Password         : sesuai SEED_ADMIN_PASSWORD (tidak ditampilkan)");
  console.log("=====================================");
}

main()
  .catch((e) => {
    console.error("Gagal menjalankan seeder:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
