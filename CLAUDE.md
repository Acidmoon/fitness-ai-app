# CLAUDE.md

## 项目概览

Fitness-ai-app 是 Fitness-ai 的 React Native (Expo) 移动端，对应后端仓库 `D:\Fitness-ai-backend`。

- **框架**: Expo SDK 54 + React Native 0.81 + TypeScript 5.9
- **后端 API**: FastAPI 运行在可配置的服务器地址上
- **目标平台**: Android（当前阶段）

## 开发命令

```bash
npx expo start           # 启动 Expo 开发服务器
npx expo start --android  # 启动并连接 Android
npx expo start --web      # Web 预览
npx tsc --noEmit           # TypeScript 类型检查
```

## 后端 API 参照

后端仓库路径 `D:\Fitness-ai-backend`，API 端点文档见 `http://<host>:8000/docs`。

关键端点前缀：
- `/api/auth` — 登录/注册
- `/api/exercise` — 运动记录与动作库
- `/api/stats` — 数据统计
- `/api/video` — 视频上传/删除/访问
- `/api/user` — 用户资料/密码/注销
- `/api/ai` — 姿态分析与动作评分

## 架构约定

- 页面组件放 `src/pages/`，导航栈定义放 `src/navigation/`
- API 调用封装放 `src/services/`，与后端对应的 TS 类型放 `src/types/`
- 通用 UI 组件放 `src/components/`
- 认证 Token 存储使用 `expo-secure-store`（生产）或 AsyncStorage（开发）

## 代码风格

- TypeScript 严格模式
- 组件 PascalCase，工具函数 camelCase
- API service 风格沿用 Web 前端 `src/services/` 的 axios 封装模式
