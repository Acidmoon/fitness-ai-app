import { http } from "./http";
import type {
  Exercise,
  ExerciseRecord,
  ExerciseRecordFormValues,
} from "../types/exercise";

interface RecordQueryParams {
  exerciseId?: number;
  startDate?: string;
  endDate?: string;
}

export async function getExercises(): Promise<Exercise[]> {
  const { data } = await http.get<Exercise[]>("/api/exercise/exercises");
  return data;
}

export async function getRecords(
  params: RecordQueryParams = {},
): Promise<ExerciseRecord[]> {
  const { data } = await http.get<ExerciseRecord[]>("/api/exercise/records", {
    params: {
      exercise_id: params.exerciseId,
      start_date: params.startDate,
      end_date: params.endDate,
    },
  });
  return data;
}

export async function getRecordDetail(
  recordId: number,
): Promise<ExerciseRecord> {
  const { data } = await http.get<ExerciseRecord>(
    `/api/exercise/records/${recordId}`,
  );
  return data;
}

export async function createRecord(
  values: ExerciseRecordFormValues,
): Promise<ExerciseRecord> {
  const { data } = await http.post<ExerciseRecord>(
    "/api/exercise/records",
    values,
  );
  return data;
}

export async function updateRecord(
  recordId: number,
  values: Partial<ExerciseRecordFormValues>,
): Promise<ExerciseRecord> {
  const { data } = await http.put<ExerciseRecord>(
    `/api/exercise/records/${recordId}`,
    values,
  );
  return data;
}

export async function deleteRecord(
  recordId: number,
): Promise<{ message: string }> {
  const { data } = await http.delete<{ message: string }>(
    `/api/exercise/records/${recordId}`,
  );
  return data;
}
