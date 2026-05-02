import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { z } from "zod";

import {
  createRecord,
  deleteRecord,
  getExercises,
  getRecords,
  updateRecord,
} from "../services/exercise-api";
import type {
  Exercise,
  ExerciseRecord,
  ExerciseRecordFormValues,
} from "../types/exercise";
import { extractApiErrorMessage } from "../utils/error";

const recordSchema = z.object({
  exercise_id: z.number().int().positive("请选择动作"),
  score: z.coerce.number().min(0, "分数不能小于 0").max(100, "分数不能大于 100"),
  count: z.coerce.number().int().min(0, "次数不能小于 0"),
  duration: z.coerce.number().int().min(0, "时长不能小于 0"),
  heart_rate_avg: z
    .union([z.coerce.number().min(0), z.nan()])
    .optional(),
  feedback: z.string().optional(),
});

function formatRecordTime(value: string) {
  return new Date(value).toLocaleString("zh-CN", { hour12: false });
}

function toOptionalNumber(value: number | null | undefined): number | null | undefined {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return null;
  }
  return value;
}

export function RecordsPage() {
  const queryClient = useQueryClient();
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | undefined>();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pageMessage, setPageMessage] = useState("");
  const [pageError, setPageError] = useState("");
  const [formError, setFormError] = useState("");
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ExerciseRecord | null>(null);
  const [exercisePickerOpen, setExercisePickerOpen] = useState(false);

  const exercisesQuery = useQuery({
    queryKey: ["exercise", "catalog"],
    queryFn: getExercises,
  });

  const recordsQuery = useQuery({
    queryKey: ["exercise", "records", selectedExerciseId, startDate, endDate],
    queryFn: () =>
      getRecords({
        exerciseId: selectedExerciseId,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      }),
  });

  // zod v4 coerce types are not fully compatible with @hookform/resolvers typing,
  // but the runtime resolution is correct.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<any>({
    resolver: zodResolver(recordSchema),
    defaultValues: {
      exercise_id: 0,
      score: 80,
      count: 10,
      duration: 60,
      heart_rate_avg: undefined as number | undefined,
      feedback: "",
    },
  });
  const {
    handleSubmit,
    setValue,
    reset: resetForm,
    formState: { errors, isSubmitting },
  } = form;

  const exercises = exercisesQuery.data ?? [];

  function getExerciseName(id: number) {
    return exercises.find((e) => e.id === id)?.name ?? `动作 ${id}`;
  }

  const createMutation = useMutation({
    mutationFn: createRecord,
    onSuccess: async () => {
      setFormError("");
      setPageMessage("记录创建成功。");
      closeFormModal();
      await queryClient.invalidateQueries({ queryKey: ["exercise", "records"] });
    },
    onError: (error) => {
      setFormError(extractApiErrorMessage(error, "创建记录失败"));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      recordId,
      values,
    }: {
      recordId: number;
      values: Partial<ExerciseRecordFormValues>;
    }) => updateRecord(recordId, values),
    onSuccess: async () => {
      setFormError("");
      setPageMessage("记录更新成功。");
      closeFormModal();
      await queryClient.invalidateQueries({ queryKey: ["exercise", "records"] });
    },
    onError: (error) => {
      setFormError(extractApiErrorMessage(error, "更新记录失败"));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRecord,
    onSuccess: async (_, recordId) => {
      setPageError("");
      setPageMessage("记录删除成功。");
      await queryClient.invalidateQueries({ queryKey: ["exercise", "records"] });
    },
    onError: (error) => {
      setPageMessage("");
      setPageError(extractApiErrorMessage(error, "删除记录失败"));
    },
  });

  function closeFormModal() {
    setFormModalOpen(false);
    setEditingRecord(null);
    setFormError("");
  }

  function openCreateModal() {
    setEditingRecord(null);
    setFormError("");
    const firstExercise = exercises[0];
    resetForm({
      exercise_id: firstExercise?.id ?? 0,
      score: 80,
      count: 10,
      duration: 60,
      heart_rate_avg: undefined,
      feedback: "",
    });
    setFormModalOpen(true);
  }

  function openEditModal(record: ExerciseRecord) {
    setEditingRecord(record);
    setFormError("");
    resetForm({
      exercise_id: record.exercise_id,
      score: record.score,
      count: record.count,
      duration: record.duration,
      heart_rate_avg: record.heart_rate_avg ?? undefined,
      feedback: record.feedback ?? "",
    });
    setFormModalOpen(true);
  }

  function handleDelete(recordId: number) {
    Alert.alert("确认删除", "确定要删除这条训练记录吗？", [
      { text: "取消", style: "cancel" },
      {
        text: "删除",
        style: "destructive",
        onPress: () => deleteMutation.mutate(recordId),
      },
    ]);
  }

  function onFormSubmit(values: Record<string, unknown>) {
    const payload = {
      exercise_id: Number(values.exercise_id),
      score: Number(values.score),
      count: Number(values.count),
      duration: Number(values.duration),
      heart_rate_avg: toOptionalNumber(values.heart_rate_avg as number | null | undefined),
      feedback: (typeof values.feedback === "string" ? values.feedback.trim() : undefined),
    };

    if (editingRecord) {
      updateMutation.mutate({ recordId: editingRecord.id, values: payload });
    } else {
      createMutation.mutate(payload as ExerciseRecordFormValues);
    }
  }

  function selectExercise(exercise: Exercise) {
    setValue("exercise_id", exercise.id);
    setExercisePickerOpen(false);
  }

  const isMutating = createMutation.isPending || updateMutation.isPending;

  const records = recordsQuery.data ?? [];
  const selectedExercise = exercises.find((e) => e.id === selectedExerciseId);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.pageTitle}>训练记录</Text>

        {/* Filters */}
        <View style={styles.filterRow}>
          <Pressable
            style={styles.filterSelect}
            onPress={() => setExercisePickerOpen(true)}
          >
            <Text
              style={[
                styles.filterSelectText,
                !selectedExercise && styles.filterPlaceholder,
              ]}
            >
              {selectedExercise ? selectedExercise.name : "全部动作"}
            </Text>
            <Text style={styles.filterArrow}>▼</Text>
          </Pressable>
          <TextInput
            style={styles.dateInput}
            placeholder="开始日期"
            placeholderTextColor="#adb5bd"
            value={startDate}
            onChangeText={setStartDate}
          />
          <TextInput
            style={styles.dateInput}
            placeholder="结束日期"
            placeholderTextColor="#adb5bd"
            value={endDate}
            onChangeText={setEndDate}
          />
        </View>

        {/* Messages */}
        {pageError ? <Text style={styles.errorText}>{pageError}</Text> : null}
        {pageMessage ? (
          <Text style={styles.successText}>{pageMessage}</Text>
        ) : null}

        {/* Record list */}
        {recordsQuery.isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#1a1a2e" />
          </View>
        ) : recordsQuery.isError ? (
          <View style={styles.center}>
            <Text style={styles.errorText}>训练记录加载失败</Text>
          </View>
        ) : records.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.emptyText}>
              {selectedExerciseId || startDate || endDate
                ? "当前筛选条件下没有匹配的训练记录"
                : "还没有训练记录，点击下方按钮创建"}
            </Text>
          </View>
        ) : (
          records.map((record) => (
            <View key={record.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>
                  {getExerciseName(record.exercise_id)}
                </Text>
                <Text style={styles.cardDate}>
                  {formatRecordTime(record.created_at)}
                </Text>
              </View>
              <View style={styles.cardMetrics}>
                <View style={styles.metric}>
                  <Text style={styles.metricValue}>{record.score}</Text>
                  <Text style={styles.metricLabel}>分</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricValue}>{record.count}</Text>
                  <Text style={styles.metricLabel}>次</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricValue}>{record.duration}</Text>
                  <Text style={styles.metricLabel}>秒</Text>
                </View>
                <View style={styles.videoBadge}>
                  <Text style={styles.videoBadgeText}>
                    {record.video_url ? "有视频" : "无视频"}
                  </Text>
                </View>
              </View>
              {record.feedback ? (
                <Text style={styles.feedback} numberOfLines={2}>
                  {record.feedback}
                </Text>
              ) : null}
              <View style={styles.cardActions}>
                <Pressable
                  style={styles.actionButton}
                  onPress={() => openEditModal(record)}
                >
                  <Text style={styles.actionButtonText}>编辑</Text>
                </Pressable>
                <Pressable
                  style={styles.deleteButton}
                  onPress={() => handleDelete(record.id)}
                >
                  <Text style={styles.deleteButtonText}>删除</Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* FAB */}
      <Pressable style={styles.fab} onPress={openCreateModal}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>

      {/* Exercise picker modal */}
      <Modal
        visible={exercisePickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setExercisePickerOpen(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setExercisePickerOpen(false)}
        >
          <View style={styles.pickerSheet}>
            <Text style={styles.pickerTitle}>选择动作</Text>
            <Pressable
              style={styles.pickerOption}
              onPress={() => {
                setSelectedExerciseId(undefined);
                setExercisePickerOpen(false);
              }}
            >
              <Text style={styles.pickerOptionText}>全部动作</Text>
            </Pressable>
            {exercises.map((ex) => (
              <Pressable
                key={ex.id}
                style={styles.pickerOption}
                onPress={() => {
                  setSelectedExerciseId(ex.id);
                  setExercisePickerOpen(false);
                }}
              >
                <Text style={styles.pickerOptionText}>{ex.name}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* Form modal */}
      <Modal
        visible={formModalOpen}
        animationType="slide"
        onRequestClose={closeFormModal}
      >
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.modalHeader}>
            <Pressable onPress={closeFormModal}>
              <Text style={styles.modalClose}>关闭</Text>
            </Pressable>
            <Text style={styles.modalTitle}>
              {editingRecord ? "编辑训练记录" : "新增训练记录"}
            </Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView contentContainerStyle={styles.formContent}>
            {/* Exercise picker */}
            <Text style={styles.fieldLabel}>动作</Text>
            <Pressable
              style={styles.formSelect}
              onPress={() => setExercisePickerOpen(true)}
            >
              <Text style={styles.formSelectText}>
                {getExerciseName(
                  editingRecord ? editingRecord.exercise_id : 0,
                ) || "请选择动作"}
              </Text>
            </Pressable>
            {errors.exercise_id ? (
              <Text style={styles.fieldError}>{String(errors.exercise_id.message)}</Text>
            ) : null}

            <Text style={styles.fieldLabel}>评分 (0-100)</Text>
            <TextInput
              style={styles.formInput}
              keyboardType="decimal-pad"
              onChangeText={(text) =>
                setValue("score", parseFloat(text) || 0)
              }
            />
            {errors.score ? (
              <Text style={styles.fieldError}>{String(errors.score.message)}</Text>
            ) : null}

            <Text style={styles.fieldLabel}>次数</Text>
            <TextInput
              style={styles.formInput}
              keyboardType="number-pad"
              onChangeText={(text) =>
                setValue("count", parseInt(text, 10) || 0)
              }
            />
            {errors.count ? (
              <Text style={styles.fieldError}>{String(errors.count.message)}</Text>
            ) : null}

            <Text style={styles.fieldLabel}>时长（秒）</Text>
            <TextInput
              style={styles.formInput}
              keyboardType="number-pad"
              onChangeText={(text) =>
                setValue("duration", parseInt(text, 10) || 0)
              }
            />
            {errors.duration ? (
              <Text style={styles.fieldError}>{String(errors.duration.message)}</Text>
            ) : null}

            <Text style={styles.fieldLabel}>平均心率（选填）</Text>
            <TextInput
              style={styles.formInput}
              keyboardType="number-pad"
              placeholder="留空则不记录"
              placeholderTextColor="#adb5bd"
              onChangeText={(text) =>
                setValue(
                  "heart_rate_avg",
                  text ? parseFloat(text) : undefined,
                )
              }
            />

            <Text style={styles.fieldLabel}>备注（选填）</Text>
            <TextInput
              style={[styles.formInput, styles.formTextArea]}
              multiline
              numberOfLines={4}
              onChangeText={(text) => setValue("feedback", text)}
            />

            {formError ? (
              <Text style={styles.formError}>{formError}</Text>
            ) : null}

            <Pressable
              style={[
                styles.submitButton,
                isMutating && styles.submitButtonDisabled,
              ]}
              onPress={() => handleSubmit(onFormSubmit)()}
              disabled={isMutating}
            >
              <Text style={styles.submitButtonText}>
                {isMutating ? "提交中..." : editingRecord ? "更新记录" : "创建记录"}
              </Text>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a2e",
    marginBottom: 16,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  filterSelect: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  filterSelectText: {
    fontSize: 14,
    color: "#1a1a2e",
    flex: 1,
  },
  filterPlaceholder: {
    color: "#adb5bd",
  },
  filterArrow: {
    fontSize: 10,
    color: "#6c757d",
    marginLeft: 4,
  },
  dateInput: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 13,
    borderWidth: 1,
    borderColor: "#dee2e6",
    color: "#1a1a2e",
  },
  center: {
    paddingVertical: 48,
    alignItems: "center",
  },
  errorText: {
    fontSize: 14,
    color: "#dc3545",
    textAlign: "center",
  },
  successText: {
    fontSize: 14,
    color: "#28a745",
    textAlign: "center",
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: "#6c757d",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a2e",
  },
  cardDate: {
    fontSize: 12,
    color: "#6c757d",
  },
  cardMetrics: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
  },
  metric: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 2,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a2e",
  },
  metricLabel: {
    fontSize: 12,
    color: "#6c757d",
  },
  videoBadge: {
    backgroundColor: "#e9ecef",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: "center",
  },
  videoBadgeText: {
    fontSize: 11,
    color: "#495057",
  },
  feedback: {
    fontSize: 13,
    color: "#6c757d",
    marginBottom: 10,
  },
  cardActions: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "flex-end",
    borderTopWidth: 1,
    borderTopColor: "#f1f3f5",
    paddingTop: 10,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#f1f3f5",
  },
  actionButtonText: {
    fontSize: 13,
    color: "#1a1a2e",
    fontWeight: "500",
  },
  deleteButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#fff5f5",
  },
  deleteButtonText: {
    fontSize: 13,
    color: "#dc3545",
    fontWeight: "500",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#1a1a2e",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  fabText: {
    fontSize: 28,
    color: "#ffffff",
    lineHeight: 30,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  pickerSheet: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    maxHeight: 400,
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a2e",
    marginBottom: 12,
    textAlign: "center",
  },
  pickerOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f3f5",
  },
  pickerOptionText: {
    fontSize: 15,
    color: "#1a1a2e",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#dee2e6",
  },
  modalClose: {
    fontSize: 15,
    color: "#1a1a2e",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a2e",
  },
  formContent: {
    padding: 20,
    paddingBottom: 40,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#495057",
    marginBottom: 6,
    marginTop: 12,
  },
  formInput: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#dee2e6",
    color: "#1a1a2e",
  },
  formTextArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  formSelect: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  formSelectText: {
    fontSize: 16,
    color: "#1a1a2e",
  },
  fieldError: {
    fontSize: 12,
    color: "#dc3545",
    marginTop: 4,
  },
  formError: {
    fontSize: 13,
    color: "#dc3545",
    textAlign: "center",
    marginTop: 16,
  },
  submitButton: {
    backgroundColor: "#1a1a2e",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 24,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
