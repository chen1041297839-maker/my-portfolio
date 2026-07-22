---
name: Xinyu Chen Portfolio
description: 感知系统主义——用系统精度与跨媒介感知讲述体验设计实践
colors:
  spatial-black: "#0C0B10"
  deep-surface: "#111016"
  lifted-surface: "#1B1820"
  cold-white: "#F4F0F7"
  quiet-ink: "#AAA4B0"
  structural-line: "#302B36"
  perception-violet: "#875CFF"
  signal-orange: "#FF6433"
typography:
  display:
    fontFamily: "PingFang SC, HarmonyOS Sans SC, Microsoft YaHei, sans-serif"
    fontSize: "clamp(3.4rem, 6.1vw, 6rem)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "PingFang SC, HarmonyOS Sans SC, Microsoft YaHei, sans-serif"
    fontSize: "clamp(2.7rem, 5vw, 5rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.04em"
  title:
    fontFamily: "PingFang SC, HarmonyOS Sans SC, Microsoft YaHei, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: "PingFang SC, HarmonyOS Sans SC, Microsoft YaHei, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "Barlow Semi Condensed, PingFang SC, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.08em"
rounded:
  precise: "8px"
  surface: "14px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "24px"
  lg: "48px"
  section: "clamp(6rem, 11vw, 10rem)"
components:
  button-contact:
    backgroundColor: "{colors.signal-orange}"
    textColor: "{colors.spatial-black}"
    rounded: "{rounded.pill}"
    padding: "10px 16px"
  button-ghost:
    backgroundColor: "{colors.spatial-black}"
    textColor: "{colors.cold-white}"
    rounded: "{rounded.pill}"
    padding: "10px 16px"
  filter-selected:
    backgroundColor: "{colors.perception-violet}"
    textColor: "{colors.cold-white}"
    rounded: "{rounded.pill}"
    padding: "8px 13px"
  project-surface:
    backgroundColor: "{colors.deep-surface}"
    textColor: "{colors.cold-white}"
    rounded: "{rounded.surface}"
    padding: "24px"
---

# Design System: Xinyu Chen Portfolio

## Overview

**Creative North Star: "感知系统主义 / Perceptual Systemism"**

这是一个高艺术指导的空间叙事型作品集：像一场由复杂产品、游戏空间与数字媒介共同构成的数字展览，同时保持产品设计所需的信息精度。系统结构、状态与可信度提供骨架；光、时间、空间、声音暗示与项目专属材质提供感知层。

当前代码中的空间黑、感知紫与信号橙是可继续验证的基础令牌，但当前首页构图不是最终设计。下一轮属于明确的 departure：保留项目数据、内容层级和交互可用性，重新设计画面、节奏、精选项目与共享元素转场。

**Key Characteristics:**

- 真实项目画面主导，而非装饰性背景或卡片皮肤。
- 商业项目具备产品精度，跨媒介项目具备独立视觉气候。
- 构图不对称但可读，页面密度在强画面、紧凑证据与留白之间变化。
- 动效表达结构、反馈和感知变化，不统一套用淡入与视差。
- 普通办公显示器和移动端仍能清晰、快速地理解内容。

## Colors

采用 Full Palette 策略：空间黑与冷白建立舞台，感知紫表达空间与叙事，信号橙只标记行为、变化和重要入口。项目详情可以临时引入项目专属色，但退出后回到个人品牌色域。

### Primary

- **感知紫 / Perception Violet**：用于空间层、叙事转折、精选状态和跨媒介连接。它不是通用霓虹，不得铺满所有表面。

### Secondary

- **信号橙 / Signal Orange**：用于主要行动、光点、状态变化和少量记忆锚点。它的稀缺性构成力量。

### Neutral

- **空间黑 / Spatial Black**：全站基础环境，具有轻微紫色倾向，禁止替换为纯黑。
- **深层表面 / Deep Surface**：承载需要与背景分层的项目画面和空间对象。
- **冷白 / Cold White**：主要文字与关键信息，保持高可读性。
- **静默文字 / Quiet Ink**：辅助说明和非关键元数据；正文不能为了“高级”而降低到不可读。
- **结构线 / Structural Line**：用于真正需要表达结构关系的分隔，不作为每个容器的默认边框。

**The Signal Scarcity Rule.** 信号橙在任一视口中不超过约 8%，仅用于行动或状态改变。

**The Project Climate Rule.** 项目专属颜色只能在对应项目进入焦点或详情页时释放，首页不能同时展示十四套颜色。

## Typography

**Display Font:** PingFang SC / HarmonyOS Sans SC / Microsoft YaHei（中文）与 Barlow Semi Condensed（英文导视）  
**Body Font:** PingFang SC / HarmonyOS Sans SC / Microsoft YaHei（英文回退至系统无衬线）  
**System Accent Font:** Rajdhani（仅用于项目编号、状态与转场标记）

**Character:** 字体需要兼具机械精度和中文可读性。中文采用平台原生的现代无衬线字体栈，以更舒展的字面和较轻字重承载宣言；Barlow Semi Condensed 提供空间导视与机械标识感；Rajdhani 只为编号和动态状态增加有限的游戏系统气质。通过尺度、字重与空间关系建立表现力，不借助渐变文字、夸张字距或杂志式衬线体制造“设计感”。

### Hierarchy

- **Display**（700，最大 96px，1.02）：仅用于首屏宣言和极少数章节转折；必须平衡换行。
- **Headline**（700，最大 80px，1.05）：用于项目章节和能力主张。
- **Title**（600，24px，1.2）：用于项目名称和关键判断。
- **Body**（400，15–18px，1.65–1.8）：用于案例叙事，行宽控制在 65–75ch。
- **Label**（500，11px，0.08em）：用于短状态、平台和真实元数据；不得在每个板块重复出现。

**The Solid Type Rule.** 所有文字使用实色；渐变文字、描边大字和低对比灰色正文一律禁止。

**The Two-Scale Rule.** 一个画面最多拥有一个主导大尺度和一个精密小尺度，避免五六个接近的字号争夺注意力。

## Elevation

系统采用材质分层与空间遮挡，而不是宽泛阴影。默认表面保持平，深度来自画面比例、裁切、透明材质、局部光线和前后关系；只有悬浮导航、项目进入焦点和共享元素转场允许出现轻微抬升。玻璃只在需要表达真实空间层级时出现。

### Shadow Vocabulary

- **焦点微光**（无边框，最大 8px 模糊）：仅作为 hover/focus 的短暂响应，不与 1px 装饰边框叠加。
- **空间环境光**（大面积径向光，不附着卡片）：用于首屏和项目转场，必须由当前项目或交互状态驱动。

**The Flat-By-Default Rule.** 所有表面静止时保持平；阴影是状态，不是皮肤。

**The One Glass Plane Rule.** 同一视口最多存在一个明显玻璃层；如果每张卡片都像玻璃，说明空间关系已经失效。

## Components

### Buttons

- **Shape:** 联系按钮可以使用完整胶囊；其他按钮保持 8–14px 精确圆角或无容器文字操作。
- **Primary:** 信号橙背景、空间黑文字，内部留白紧凑，承担联系或明确行动。
- **Hover / Focus:** 使用颜色、短距离位移与清晰焦点环；禁止弹跳、弹性和夸张放大。
- **Secondary / Ghost:** 透明或空间黑背景、冷白文字；边框只用于表达可点击边界。

### Chips

- **Style:** 仅用于分类、角色和状态，不用于装饰。未选中状态使用结构线与静默文字；选中状态使用感知紫。
- **State:** 筛选必须同时通过文字和状态表达，不能只依赖颜色。

### Cards / Containers

- **Corner Style:** 项目容器上限 14px；大画面可以无圆角或使用与构图一致的裁切。
- **Background:** 深层表面或真实项目图片；禁止把所有项目放进相同黑色玻璃卡片。
- **Shadow Strategy:** 默认无阴影；焦点态遵循 Elevation 规则。
- **Border:** 只在结构需要时使用结构线，禁止边框和宽阴影同时装饰。
- **Internal Padding:** 根据内容密度使用 24–48px，不允许嵌套卡片制造层级。

### Inputs / Fields

- **Style:** 当前首页没有持久表单；未来联系表单使用深层表面、冷白文字、8px 圆角和明确标签。
- **Focus:** 使用信号橙或感知紫焦点环，不能仅改变 placeholder 颜色。
- **Error / Disabled:** 错误需同时包含文字说明与图形状态；禁用状态保持可读。

### Navigation

导航服务快速定位和联系。桌面端保持轻薄、稳定，不承担视觉表演；移动端只保留身份、项目入口和联系动作。玻璃材质只有在页面滚动产生真实内容遮挡时启用。

### Spatial Project Transition

点击精选项目后，封面、标题与项目色从原位置连续展开为详情页首屏。返回时恢复空间关系。移动端与减少动态模式使用短交叉淡化，不复制桌面 3D 变换。

## Do's and Don'ts

### Do:

- **Do** 让 Hologrow WebApp、Hologrow 官网和小红书项目首先证明复杂产品、AI 交互与真实落地能力。
- **Do** 让真实项目图片占据主要画面，并为不同项目设计独立的色彩、材质和运动气候。
- **Do** 在 390px、768px、1280px 和宽屏环境检查标题换行、长图、导航和共享元素转场。
- **Do** 保证正文对比度至少 4.5:1，并为键盘焦点和 `prefers-reduced-motion` 提供完整方案。
- **Do** 通过不对称构图、尺度差和滚动节奏建立设计感，而不是增加更多装饰。

### Don't:

- **Don't** 复刻当前网站的首页构图；它是需要被替换的视觉实现，不是身份锁。
- **Don't** 制作普通 SaaS Bento 首页、统一玻璃卡片墙、随机极光背景或装饰性数据增长。
- **Don't** 照搬 Apple Vision Pro、Linear、Vercel 或 Spencer Gabor 的品牌语言。
- **Don't** 使用渐变文字、编辑杂志式衬线体、终端美学、重复的小号全大写板块标题或无意义编号。
- **Don't** 在卡片上同时使用 1px 边框和 16px 以上的宽泛阴影；卡片圆角不得超过 16px。
- **Don't** 使用所有项目相同尺寸、相同卡片或相同视觉气候。
- **Don't** 用“全栈设计师”“多边形设计师”或软件工具墙替代清晰职业定位。
- **Don't** 让任何内容只有动画触发后才可见，或让视觉效果破坏阅读、性能和移动端体验。
