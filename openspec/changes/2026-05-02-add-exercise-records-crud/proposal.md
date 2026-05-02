# Proposal: 移动端训练记录 CRUD

## 动机

用户登录后需要增删改查训练记录，这是产品的核心操作入口，也是后续视频上传、AI 分析的前置依赖。当前 RecordsPage 只是一个空白占位符。

## 方案

1. 新建 `exercise-api.ts` 封装运动相关 API（getExercises、getRecords、createRecord、updateRecord、deleteRecord、getRecordDetail）
2. 新建 `src/types/exercise.ts` 类型定义
3. 重写 `RecordsPage`：筛选器 + 记录列表 + 创建/编辑表单
4. 表单以底部弹窗（Modal）呈现，适配移动端
5. 筛选器实时生效（下拉选择动作、日期范围），无需手动点"应用"
6. 删除操作需确认，使用 `Alert.alert`

## 影响范围

| 文件 | 动作 |
|------|------|
| `src/types/exercise.ts` | 新建：Exercise, ExerciseRecord, ExerciseRecordFormValues |
| `src/services/exercise-api.ts` | 新建：6 个 API 函数 |
| `src/pages/RecordsPage.tsx` | 重写：完整 CRUD 页面 |
| 其他 | 不变 |

## 不变更

- 不做批量删除（移动端交互复杂，后续再加）
- 不引入新 npm 依赖
- 后端零改动
