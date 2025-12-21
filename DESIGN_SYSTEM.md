# MathMaster Design System

本设计规范旨在确保应用具有高度的**易读性**、**一致性**和**美观性**。核心原则是：**数学公式必须清晰可见，布局要有呼吸感**。

## 1. 色彩体系 (Color Palette)

基于 Tailwind CSS 的 Slate (中性色) 和 Primary (品牌色) 系列。

- **Primary (Blue/Indigo)**: 用于强调、链接、图标和主按钮。
  - 主色: `text-primary-600` / `bg-primary-600`
  - 浅色背景: `bg-primary-50`
- **Text (Slate)**:
  - 主要文字: `text-slate-800` (用于标题、正文强调)
  - 次要文字: `text-slate-600` (用于普通正文)
  - 辅助文字: `text-slate-500` (用于注释，**禁止用于重要公式**)
- **Functional**:
  - Emerald (绿色): 定义、定理、正确示范。
  - Amber (琥珀色): 警示、易错点、技巧。
  - Purple (紫色): 核心概念、推导过程。

## 2. 排版与字号 (Typography)

**原则：宁大勿小。**

- **卡片标题 (H4)**: `text-lg font-bold text-slate-800`
- **小节标题 (H5)**: `text-base font-bold text-slate-700`
- **正文 (Body)**: `text-sm text-slate-600 leading-relaxed` (行高宽松)
- **数学公式 (Math)**:
  - **核心公式**: 必须使用 `block` 模式，字号至少 `text-xl`，推荐 `text-2xl`。
  - **行内公式**: `text-sm` 或 `text-base`。**绝对禁止**在重要推导中使用 `text-xs`。
  - **注释/角标**: 最低 `text-xs`，且对比度要高。

## 3. 组件规范 (Components)

### 内容容器 (Content Card)
```jsx
<div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
  {/* Content */}
</div>
```
*   **Padding**: 统一使用 `p-6` (移动端可 `p-4`)。
*   **Border**: `border-slate-200`，保持轻量。
*   **Shadow**: `shadow-sm`，保持扁平化。

### 重点公式卡片 (Formula Card)
```jsx
<div className="bg-white border-l-4 border-primary-500 shadow-sm border-y border-r border-slate-200 rounded-r-xl p-5 text-center my-4">
  {/* Formula */}
</div>
```
*   左侧加粗边框强调。
*   背景色可使用极淡的品牌色 (如 `bg-blue-50/20`)。

### 警示卡片 (Warning Card)
```jsx
<div className="flex items-start gap-3 bg-amber-50 p-4 rounded-xl border border-amber-100 text-amber-900 text-sm mt-4">
  {/* Icon & Content */}
</div>
```

## 4. 布局原则 (Layout)

- **间距 (Spacing)**: 模块间距 `space-y-6`。
- **网格 (Grid)**: 
  - 避免由 `grid-cols-3` 直接在移动端挤压成一团，应使用 `grid-cols-1 md:grid-cols-3`。
- **对齐**: 图标与标题文字垂直居中对齐 (`flex items-center`)。

## 5. 常见反模式 (Bad Practices)

- ❌ **错误**: `text-xs` 用于整段解释或公式推导。
  - *修正*: 使用 `text-sm`，如果是次要信息，使用颜色区分 (`text-slate-500`) 而不是缩小字号。
- ❌ **错误**: 公式紧贴边框。
  - *修正*: 给予公式卡片足够的 `py-4` 或 `my-2`。
- ❌ **错误**: 浅灰色背景上的浅灰色文字。
  - *修正*: 确保对比度，背景色深时文字要反白，背景色浅时文字要深 (`text-slate-700`+)。
