import { StyleSheet, Text, View } from "react-native";

export function RecordsPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>训练记录</Text>
      <Text style={styles.subtitle}>后续在此管理训练记录</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1a1a2e",
  },
  subtitle: {
    fontSize: 14,
    color: "#6c757d",
    marginTop: 8,
  },
});
