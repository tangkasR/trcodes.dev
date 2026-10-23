import {
  Award,
  Boxes,
  Briefcase,
  ContactRound,
  FolderGit2,
  GraduationCap,
  KeyRound,
  LayoutDashboard,
  ScrollText,
  ShieldAlert,
  ShieldCheck,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/* Domain constants                                                            */
/* -------------------------------------------------------------------------- */

export const ACTIONS = ["read", "add", "edit", "delete"] as const;
export type Action = (typeof ACTIONS)[number];
export type PermissionMap = Record<string, Action[]>;

export const ACTION_COLUMN = {
  read: "isRead",
  add: "isAdd",
  edit: "isEdit",
  delete: "isDelete",
} as const;

export const ROLE_SUPER_ADMIN = "Super Admin";
export const ROLE_DEFAULT = "User";

export const FEATURES = [
  { key: "user", name: "User", desc: "Kelola user" },
  { key: "role", name: "Role", desc: "Kelola role" },
  { key: "feature", name: "Feature", desc: "Kelola feature" },
  { key: "role-permission", name: "Role Permission", desc: "Kelola izin role" },
  { key: "profile", name: "Profile", desc: "Kelola profile" },
  { key: "contact-link", name: "Kontak", desc: "Kelola kontak" },
  { key: "education", name: "Pendidikan", desc: "Kelola data pendidikan" },
  { key: "certification", name: "Sertifikasi", desc: "Kelola data sertifikasi" },
  { key: "experience", name: "Pengalaman", desc: "Kelola data pengalaman kerja" },
  { key: "project", name: "Proyek", desc: "Kelola data proyek portofolio" },
  { key: "chapter", name: "Bab Proyek", desc: "Kelola bab dan konten proyek" },
  { key: "login-attempt", name: "Log Percobaan Login", desc: "Pantau riwayat percobaan login" },
  { key: "audit-log", name: "Audit Log", desc: "Lihat jejak aktivitas keamanan" },
] as const;

export type FeatureKey = (typeof FEATURES)[number]["key"];

export const SESSION_COOKIE = "session";
export const MFA_CHALLENGE_COOKIE = "mfa_challenge";
export const MFA_SETUP_COOKIE = "mfa_setup";

export const ACTION_LABEL: Record<Action, string> = {
  read: "Read",
  add: "Add",
  edit: "Edit",
  delete: "Delete",
};

export const SYSTEM_FEATURE_KEYS: readonly string[] = FEATURES.map((f) => f.key);

// ["read","edit"], true → { isRead: true, isEdit: true }
export function actionsToColumns(actions: readonly Action[], value: boolean) {
  return Object.fromEntries(actions.map((a) => [ACTION_COLUMN[a], value])) as Partial<
    Record<(typeof ACTION_COLUMN)[Action], boolean>
  >;
}

// Role yang dipakai langsung oleh kode: tidak boleh dihapus atau diganti namanya
export const PROTECTED_ROLE_NAMES: readonly string[] = [
  ROLE_SUPER_ADMIN,
  ROLE_DEFAULT,
];

// ["read","edit"] → { isRead: true, isAdd: false, isEdit: true, isDelete: false }
export function actionsToFlags(granted: readonly Action[]) {
  return {
    isRead: granted.includes("read"),
    isAdd: granted.includes("add"),
    isEdit: granted.includes("edit"),
    isDelete: granted.includes("delete"),
  };
}

/* -------------------------------------------------------------------------- */
/* Dashboard navigation                                                        */
/* -------------------------------------------------------------------------- */

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  feature?: FeatureKey; // kosong = semua user yang login boleh melihat
};

export const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: "Utama",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      {
        label: "Keamanan Akun",
        href: "/dashboard/security",
        icon: KeyRound,
      },
    ],
  },
  {
    label: "Manajemen",
    items: [
      { label: "Akun Pengguna", href: "/dashboard/users", icon: Users, feature: "user" },
      {
        label: "Hak Akses",
        href: "/dashboard/roles",
        icon: ShieldCheck,
        feature: "role",
      },
      { label: "Fitur", href: "/dashboard/features", icon: Boxes, feature: "feature" },
      {
        label: "Informasi Pribadi",
        href: "/dashboard/profile",
        icon: User,
        feature: "profile",
      },
      {
        label: "Kontak",
        href: "/dashboard/contact-links",
        icon: ContactRound,
        feature: "contact-link",
      },
      {
        label: "Proyek",
        href: "/dashboard/projects",
        icon: FolderGit2,
        feature: "project",
      },
      {
        label: "Pengalaman",
        href: "/dashboard/experiences",
        icon: Briefcase,
        feature: "experience",
      },
      {
        label: "Pendidikan",
        href: "/dashboard/educations",
        icon: GraduationCap,
        feature: "education",
      },
      {
        label: "Sertifikasi",
        href: "/dashboard/certifications",
        icon: Award,
        feature: "certification",
      },
      {
        label: "Log Login",
        href: "/dashboard/login-attempts",
        icon: ShieldAlert,
        feature: "login-attempt",
      },
      {
        label: "Audit Log",
        href: "/dashboard/audit-logs",
        icon: ScrollText,
        feature: "audit-log",
      },
    ],
  },
];
