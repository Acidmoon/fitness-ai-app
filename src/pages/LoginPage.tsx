import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { z } from "zod";

import { login } from "../services/auth-api";
import { setAccessToken } from "../services/auth-storage";
import type { LoginFormValues } from "../types/auth";
import { extractApiErrorMessage } from "../utils/error";

const loginSchema = z.object({
  username: z.string().min(1, "请输入用户名"),
  password: z.string().min(1, "请输入密码"),
});

interface Props {
  onLoginSuccess: () => void;
  onNavigateRegister: () => void;
}

export function LoginPage({ onLoginSuccess, onNavigateRegister }: Props) {
  const [submitError, setSubmitError] = useState("");
  const {
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  async function onSubmit(values: LoginFormValues) {
    try {
      setSubmitError("");
      const data = await login(values);
      await setAccessToken(data.access_token);
      onLoginSuccess();
    } catch (error) {
      setSubmitError(extractApiErrorMessage(error, "登录失败，请稍后重试"));
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fitness AI</Text>
      <Text style={styles.subtitle}>校园训练数据面板</Text>

      <View style={styles.form}>
        <Text style={styles.label}>用户名</Text>
        <TextInput
          style={styles.input}
          placeholder="请输入用户名"
          autoCapitalize="none"
          onChangeText={(text) => setValue("username", text)}
        />
        {errors.username ? (
          <Text style={styles.fieldError}>{errors.username.message}</Text>
        ) : null}

        <Text style={styles.label}>密码</Text>
        <TextInput
          style={styles.input}
          placeholder="请输入密码"
          secureTextEntry
          onChangeText={(text) => setValue("password", text)}
        />
        {errors.password ? (
          <Text style={styles.fieldError}>{errors.password.message}</Text>
        ) : null}

        {submitError ? (
          <Text style={styles.formError}>{submitError}</Text>
        ) : null}

        <Pressable
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
          onPress={() => handleSubmit(onSubmit)()}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>
            {isSubmitting ? "登录中..." : "登录"}
          </Text>
        </Pressable>

        <Pressable onPress={onNavigateRegister}>
          <Text style={styles.switchText}>还没有账号？去注册</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    color: "#1a1a2e",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#6c757d",
    marginTop: 8,
    marginBottom: 32,
  },
  form: {
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#495057",
  },
  input: {
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  fieldError: {
    fontSize: 12,
    color: "#dc3545",
    marginTop: -8,
  },
  formError: {
    fontSize: 13,
    color: "#dc3545",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#1a1a2e",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  switchText: {
    textAlign: "center",
    color: "#1a1a2e",
    fontSize: 14,
    marginTop: 16,
  },
});
