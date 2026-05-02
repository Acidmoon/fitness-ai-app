# Proposal: 移动端底部标签导航 + 仪表盘首页

## 动机

Fitness-ai-app 当前只有登录/注册页面和一个空白占位 HomePage。用户登录后看到一片空白，无法感受到产品价值。`@react-navigation/bottom-tabs` 和 `@tanstack/react-query` 已安装但未使用。

需要建立 App 的主体导航框架，并让首页展示真实的训练统计数据，验证端到端链路畅通。

## 方案

1. 将导航结构从纯 Stack 改为 Stack（登录/注册）+ BottomTab（已登录后）
2. BottomTab 包含三个标签：仪表盘、训练记录（占位）、个人中心（占位）
3. 仪表盘用 React Query 调 `/api/stats/summary` + `/api/stats/weekly`
4. 添加注销按钮，清除 token 后回到登录页
5. 新增 stats-api、user-api 服务和对应类型定义

## 影响范围

- `src/navigation/AppNavigator.tsx` — 导航结构重写
- `src/pages/HomePage.tsx` — 重写为仪表盘
- `src/pages/RecordsPage.tsx` — 新建占位
- `src/pages/ProfilePage.tsx` — 新建占位 + 注销
- `src/services/stats-api.ts` — 新建
- `src/services/user-api.ts` — 新建
- `src/types/stats.ts` — 新建
- `src/types/user.ts` — 新建
- `App.tsx` — 添加 onLogout 回调
