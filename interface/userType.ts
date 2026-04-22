export type TRole = "super-admin" | "admin";

export interface User {
  uid: string;
  name: string;
  email: string;
  img: string | null;
  phone: number;
  role: TRole;
  created_at: string;
  updated_at: string;
}
