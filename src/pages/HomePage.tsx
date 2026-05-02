import { StyleSheet, Text, View } from "react-native";

export function HomePage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>训练驾驶舱</Text>
      <Text style={styles.subtitle}>后续在此展示训练概览、近期记录和统计摘要</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a2e",
  },
  subtitle: {
    fontSize: 14,
    color: "#6c757d",
    marginTop: 8,
  },
});
