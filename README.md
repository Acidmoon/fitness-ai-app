# Fitness AI — React Native App

Fitness AI 移动端，基于 Expo + React Native，对应后端 [Fitness-ai-backend](https://github.com/Acidmoon/Fitness-ai-backend)。

## 技术栈

| 层 | 技术 | 说明 |
|------|------|------|
| 框架 | Expo SDK 54 + React Native 0.81 | 跨平台移动端 |
| 语言 | TypeScript 5.9 | 严格模式 |
| 导航 | @react-navigation/native | 栈导航 + 底部标签 |
| HTTP | Axios | Bearer token 拦截器 |
| 状态 | @tanstack/react-query | 服务端状态管理 |
| 表单 | react-hook-form + zod | 客户端校验 |
| 安全存储 | expo-secure-store | JWT token 持久化 |

## 项目结构

```
Fitness-ai-app/
├── App.tsx                     # 应用入口，QueryClient + 导航
├── src/
│   ├── components/             # 通用 UI 组件
│   ├── navigation/
│   │   └── AppNavigator.tsx    # 栈导航定义（登录/注册/主页）
│   ├── pages/
│   │   ├── LoginPage.tsx       # 登录
│   │   ├── RegisterPage.tsx    # 注册
│   │   └── HomePage.tsx        # 主页
│   ├── services/
│   │   ├── http.ts             # Axios 实例 + 拦截器
│   │   ├── auth-api.ts         # 认证 API 调用
│   │   └── auth-storage.ts     # SecureStore token 读写
│   ├── types/
│   │   └── auth.ts             # 认证相关类型
│   └── utils/
│       └── error.ts            # API 错误消息提取
├── assets/                     # 图标、启动画面
├── app.json                    # Expo 配置
├── tsconfig.json
├── package.json
└── .env.example                # 环境变量模板
```

## 后端 API

后端为 FastAPI 服务，接口文档见 `http://<host>:8000/docs`。

| 模块 | 前缀 | 认证 |
|------|------|------|
| 认证 | `/api/auth` | 无 |
| 运动记录 | `/api/exercise` | JWT |
| 统计 | `/api/stats` | JWT |
| 视频 | `/api/video` | JWT |
| 用户 | `/api/user` | JWT |
| AI | `/api/ai` | JWT |

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env`：
```
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:8000
```

- `10.0.2.2` 是 Android 模拟器访问宿主机的特殊地址
- 真机调试时替换为电脑的局域网 IP

### 3. 启动开发服务

```bash
npx expo start
```

然后按 `a` 启动 Android 模拟器，或扫描二维码用 Expo Go 真机预览。

### 4. 构建生产包

```bash
# 本地构建 Android APK
npx eas build --platform android --profile preview
```

## 开发命令

```bash
npx expo start              # 开发服务器
npx expo start --android    # 直连 Android
npx tsc --noEmit            # TypeScript 类型检查
```

## 当前进度

- [x] Expo 工程初始化 + TypeScript
- [x] 导航框架（栈导航）
- [x] 登录 / 注册页面 + Token 持久化
- [x] Axios 拦截器（Bearer + 401 清除）
- [x] 错误处理（兼容 FastAPI 422 格式）
- [ ] 主页：训练仪表盘
- [ ] 训练记录 CRUD
- [ ] 统计页面
- [ ] 视频管理
- [ ] AI 姿态分析与评分
