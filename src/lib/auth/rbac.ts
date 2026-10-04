export type Role = "STUDENT" | "TEACHER" | "ADMIN";

export type Permission =
  // Student permissions
  | "test.read"
  | "test.attempt"
  | "answer.create"
  | "answer.update"
  | "result.read_own"
  | "analytics.read_own"
  | "profile.read"
  | "profile.update"
  // Teacher permissions
  | "question.create"
  | "question.read"
  | "question.update"
  | "question.upload"
  | "question.review"
  | "test.create"
  | "test.update"
  | "test.schedule"
  | "analytics.read"
  // Admin permissions
  | "user.create"
  | "user.read"
  | "user.update"
  | "user.suspend"
  | "role.manage"
  | "permission.manage"
  | "exam.create"
  | "exam.update"
  | "exam.delete"
  | "section.create"
  | "section.update"
  | "section.delete"
  | "question.approve"
  | "question.reject"
  | "question.delete"
  | "test.publish"
  | "test.unpublish"
  | "test.delete"
  | "analytics.global"
  | "settings.manage"
  | "audit.read";

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  STUDENT: [
    "test.read",
    "test.attempt",
    "answer.create",
    "answer.update",
    "result.read_own",
    "analytics.read_own",
    "profile.read",
    "profile.update",
  ],
  TEACHER: [
    "test.read",
    "test.attempt",
    "answer.create",
    "answer.update",
    "result.read_own",
    "analytics.read_own",
    "profile.read",
    "profile.update",
    "question.create",
    "question.read",
    "question.update",
    "question.upload",
    "question.review",
    "test.create",
    "test.update",
    "test.schedule",
    "analytics.read",
  ],
  ADMIN: [
    "test.read",
    "test.attempt",
    "answer.create",
    "answer.update",
    "result.read_own",
    "analytics.read_own",
    "profile.read",
    "profile.update",
    "question.create",
    "question.read",
    "question.update",
    "question.upload",
    "question.review",
    "test.create",
    "test.update",
    "test.schedule",
    "analytics.read",
    "user.create",
    "user.read",
    "user.update",
    "user.suspend",
    "role.manage",
    "permission.manage",
    "exam.create",
    "exam.update",
    "exam.delete",
    "section.create",
    "section.update",
    "section.delete",
    "question.approve",
    "question.reject",
    "question.delete",
    "test.publish",
    "test.unpublish",
    "test.delete",
    "analytics.global",
    "settings.manage",
    "audit.read",
  ],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  if (role === "ADMIN") return true;
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
