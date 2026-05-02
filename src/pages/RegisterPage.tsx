import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { z } from "zod";

import { register as registerUser } from "../services/auth-api";
import type { RegisterFormValues } from "../types/auth";
import { extractApiErrorMessage } from "../utils/error";

const registerSchema = z.object({
  username: z
    .string()
    .min(3, "用户名长度至少 3 位")
    .max(50, "用户名长度不能超过 50 位")
    .regex(/^[a-zA-Z0-9_]+$/, "用户名只能包含字母、数字和下划线")
    .refine((value) => !/^\d+$/.test(value), "用户名不能为纯数字"),
  email: z.string().email("请输入有效邮箱"),
  password: z
    .string()
    .min(8, "密码至少 8 位")
    .refine((value) => /[A-Za-z]/.test(value), "密码必须包含字母")
    .refine((value) => /\d/.test(value), "密码必须包含数字"),
});

interface Props {
  onNavigateLogin: () => void;
}

export function RegisterPage({ onNavigateLogin }: Props) {
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const {
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: "", email: "", password: "" },
  });

  async function onSubmit(values: RegisterFormValues) {
    try {
      setSubmitError("");
      setSubmitSuccess("");
      await registerUser(values);
      setSubmitSuccess("注册成功，请登录。");
    } catch (error) {
      setSubmitError(extractApiErrorMessage(error, "注册失败，请稍后重试"));
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>注册</Text>
      <Text style={styles.subtitle}>创建你的训练档案</Text>

      <View style={styles.form}>
        <Text style={styles.label}>用户名</Text>
        <TextInput
          style={styles.input}
          placeholder="3-50 位，字母数字下划线"
          autoCapitalize="none"
          onChangeText={(text) => setValue("username", text)}
        />
        {errors.username ? (
          <Text style={styles.fieldError}>{errors.username.message}</Text>
        ) : null}

        <Text style={styles.label}>邮箱</Text>
        <TextInput
          style={styles.input}
          placeholder="请输入邮箱"
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={(text) => setValue("email", text)}
        />
        {errors.email ? (
          <Text style={styles.fieldError}>{errors.email.message}</Text>
        ) : null}

        <Text style={styles.label}>密码</Text>
        <TextInput
          style={styles.input}
          placeholder="至少 8 位，包含字母和数字"
          secureTextEntry
          onChangeText={(text) => setValue("password", text)}
        />
        {errors.password ? (
          <Text style={styles.fieldError}>{errors.password.message}</Text>
        ) : null}

        {submitError ? (
          <Text style={styles.formError}>{submitError}</Text>
        ) : null}
        {submitSuccess ? (
          <Text style={styles.formSuccess}>{submitSuccess}</Text>
        ) : null}

        <Pressable
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
          onPress={() => handleSubmit(onSubmit)()}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>
            {isSubmitting ? "注册中..." : "注册"}
          </Text>
        </Pressable>

        <Pressable onPress={onNavigateLogin}>
          <Text style={styles.switchText}>已有账号？去登录</Text>
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
  formSuccess: {
    fontSize: 13,
    color: "#28a745",
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
