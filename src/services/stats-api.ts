import { http } from "./http";
import type { StatsSummary, WeeklyStat } from "../types/stats";

export async function getStatsSummary(): Promise<StatsSummary> {
  const { data } = await http.get<StatsSummary>("/api/stats/summary");
  return data;
}

export async function getWeeklyStats(): Promise<WeeklyStat[]> {
  const { data } = await http.get<WeeklyStat[]>("/api/stats/weekly");
  return data;
}
