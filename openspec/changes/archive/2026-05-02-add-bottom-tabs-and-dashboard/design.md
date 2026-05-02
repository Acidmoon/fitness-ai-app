# Design: 移动端底部标签导航 + 仪表盘首页

## 导航结构变更

### 当前
```
Stack.Navigator
  ├── Login / Register (未登录)
  └── Home (已登录)
```

### 目标
```
App.tsx (isLoggedIn 状态提升)
  ├── [未登录] Stack.Navigator
  │     ├── Login
  │     └── Register
  └── [已登录] BottomTab.Navigator
        ├── 仪表盘 (Dashboard)  → HomePage 重写
        ├── 训练记录 (Records)  → RecordsPage 占位
        └── 个人中心 (Profile)  → ProfilePage 占位 + 注销
```

`App.tsx` 持有 `isLoggedIn` 状态，根据该状态条件渲染两套导航器。注销时清除状态回到登录页。

## 仪表盘数据流

```
HomePage → useQuery → stats-api.ts → GET /api/stats/summary
                                    → GET /api/stats/weekly
```

展示内容：
- 顶部指标区：总训练次数、总重复次数、平均分、最高分（4 个指标卡）
- 近期趋势列表：最近 7 天每日训练次数

## 类型定义

从 Web 前端 `Fitness-ai-frontend/src/types/stats.ts` 和 `user.ts` 平移，保持接口一致。

## 不变更

- 后端零改动
- 不引入新 npm 依赖
- Records/Profile 标签页仅占位
- 不添加测试（后续 change 统一补）
