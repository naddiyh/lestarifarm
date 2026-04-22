export type TRole = "super-admin" | "admin";

export interface User {
  uid: string;
  name: string;
  email: string;
  password: string;
  img: string | null;
  phone: number;
  role: TRole;
  createdAt: string;
  updatedAt: string;
}
