export type UserRole = "student" | "instructor";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}