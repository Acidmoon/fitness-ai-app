# Design: 移动端训练记录 CRUD

## 页面结构

```
RecordsPage
├── 筛选区
│   ├── 动作选择器 (Select/Modal)
│   ├── 开始日期 (DatePicker)
│   └── 结束日期 (DatePicker)
├── 记录列表
│   ├── Loading / Error / Empty 状态
│   └── RecordCard[]
│       ├── 动作名 + 日期
│       ├── 指标行：分数 / 次数 / 时长
│       ├── 视频状态标签
│       └── 操作按钮：详情 → / 编辑 / 删除
└── FAB "新增记录"
    └── 打开底部 Modal 表单
```

## 创建/编辑表单 (Modal)

全屏 Modal，包含字段：
- 动作选择（picker，从 exercises 列表）
- 评分 (0-100)
- 次数 (≥0)
- 时长 (秒, ≥0)
- 平均心率 (选填, 20-260)
- 备注 (选填, ≤2000 字)

Zod 校验与 Web 前端一致。

## 筛选逻辑

Action 选择器和日期输入改变时直接更新 React Query key，实现自动重新获取，无需手动点"应用"按钮。与 Web 前端的"提交筛选"不同，移动端更自然。

## 删除确认

使用 React Native `Alert.alert` 弹出确认对话框，替代 Web 的 `window.confirm`。

## API 对接

所有端点与 Web 前端一致：

| 函数 | 方法 | 端点 |
|------|------|------|
| getExercises | GET | /api/exercise/exercises |
| getRecords | GET | /api/exercise/records?exercise_id=&start_date=&end_date= |
| createRecord | POST | /api/exercise/records |
| updateRecord | PUT | /api/exercise/records/{id} |
| deleteRecord | DELETE | /api/exercise/records/{id} |

## 不变更

- 不做批量删除（后续 change）
- 不引入第三方 UI 库（用 React Native 原生组件 + StyleSheet）
- 后端零改动
