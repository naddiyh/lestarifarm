import type { TRole } from "@/interface/userType";

export interface TLoginFrom {
  email: string;
  password: string;
  role: TRole;
}
