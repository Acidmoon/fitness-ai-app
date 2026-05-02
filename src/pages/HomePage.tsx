import { useQuery } from "@tanstack/react-query";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { getStatsSummary, getWeeklyStats } from "../services/stats-api";

export function HomePage() {
  const summaryQuery = useQuery({
    queryKey: ["stats", "summary"],
    queryFn: getStatsSummary,
  });
  const weeklyQuery = useQuery({
    queryKey: ["stats", "weekly"],
    queryFn: getWeeklyStats,
  });

  if (summaryQuery.isLoading || weeklyQuery.isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1a1a2e" />
        <Text style={styles.loadingText}>加载中...</Text>
      </View>
    );
  }

  if (summaryQuery.isError || weeklyQuery.isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>数据加载失败</Text>
      </View>
    );
  }

  const summary = summaryQuery.data!;
  const weekly = weeklyQuery.data ?? [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>训练驾驶舱</Text>

      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>
            {summary.exercise_stats.total_sessions}
          </Text>
          <Text style={styles.metricLabel}>总训练次数</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>
            {summary.exercise_stats.total_repetitions}
          </Text>
          <Text style={styles.metricLabel}>总重复次数</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>
            {summary.exercise_stats.average_score.toFixed(1)}
          </Text>
          <Text style={styles.metricLabel}>平均得分</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>
            {summary.exercise_stats.best_score.toFixed(1)}
          </Text>
          <Text style={styles.metricLabel}>最高得分</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>最近 7 天趋势</Text>
        {weekly.length === 0 ? (
          <Text style={styles.emptyText}>暂无训练数据</Text>
        ) : (
          weekly.map((day) => (
            <View key={day.date} style={styles.trendRow}>
              <Text style={styles.trendDate}>{day.date}</Text>
              <View style={styles.trendBarContainer}>
                <View
                  style={[
                    styles.trendBar,
                    {
                      width: `${Math.min(100, (day.sessions / 5) * 100)}%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.trendValue}>{day.sessions} 次</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6c757d",
  },
  errorText: {
    fontSize: 15,
    color: "#dc3545",
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a2e",
    marginBottom: 16,
  },
  metricsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 24,
  },
  metricCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  metricValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a2e",
  },
  metricLabel: {
    fontSize: 12,
    color: "#6c757d",
    marginTop: 4,
  },
  section: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a2e",
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: "#6c757d",
    textAlign: "center",
    paddingVertical: 16,
  },
  trendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  trendDate: {
    width: 80,
    fontSize: 12,
    color: "#495057",
  },
  trendBarContainer: {
    flex: 1,
    height: 20,
    backgroundColor: "#e9ecef",
    borderRadius: 4,
    marginHorizontal: 8,
    overflow: "hidden",
  },
  trendBar: {
    height: "100%",
    backgroundColor: "#1a1a2e",
    borderRadius: 4,
    minWidth: 4,
  },
  trendValue: {
    width: 40,
    fontSize: 12,
    color: "#495057",
    textAlign: "right",
  },
});
