import { useQuery } from "@tanstack/react-query";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { getProfile } from "../services/user-api";

interface Props {
  onLogout: () => void;
}

export function ProfilePage({ onLogout }: Props) {
  const profileQuery = useQuery({
    queryKey: ["user", "profile"],
    queryFn: getProfile,
  });

  return (
    <View style={styles.container}>
      {profileQuery.isLoading ? (
        <ActivityIndicator size="large" color="#1a1a2e" />
      ) : profileQuery.isError ? (
        <Text style={styles.errorText}>加载失败</Text>
      ) : (
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profileQuery.data!.username.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.username}>{profileQuery.data!.username}</Text>
          <Text style={styles.email}>{profileQuery.data!.email}</Text>
        </View>
      )}

      <Pressable style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutText}>退出登录</Text>
      </Pressable>
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
    gap: 24,
  },
  errorText: {
    fontSize: 15,
    color: "#dc3545",
  },
  profileCard: {
    alignItems: "center",
    gap: 8,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#1a1a2e",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
  },
  username: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1a1a2e",
  },
  email: {
    fontSize: 14,
    color: "#6c757d",
  },
  logoutButton: {
    backgroundColor: "#dc3545",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 48,
  },
  logoutText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
