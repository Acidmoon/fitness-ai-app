import { http } from "./http";
import type { UserProfile } from "../types/user";

export async function getProfile(): Promise<UserProfile> {
  const { data } = await http.get<UserProfile>("/api/user/profile");
  return data;
}
