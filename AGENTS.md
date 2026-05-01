# 项目速读笔记

## 项目定位

这是一个中文白癜风问答知识库页面，面向患者与家属，用于解释白癜风的基础认知、诊断检查、治疗管理、日常护理、生活心理支持和就诊准备。页面内容是健康科普和就诊沟通辅助，不能替代皮肤科医生面诊、检查和治疗建议。

当前实现是一个单页 Next.js 应用，主体页面为 `src/app/page.tsx`，样式集中在 `src/app/globals.css`。仓库根目录还有一个旧版静态页面 `vitiligo-qa-knowledge-base.html`，看起来是当前 React/Next 页面迁移前的完整 HTML 版本，可作为内容和视觉参考。

## 技术栈

- Next.js，App Router。
- React 客户端组件，`src/app/page.tsx` 顶部使用 `"use client"`，因为页面包含搜索、筛选、展开折叠、轮播、留言提交等交互状态。
- TypeScript，`tsconfig.json` 开启 `strict`，路径别名 `@/*` 指向 `./src/*`。
- Tailwind CSS v4 的 PostCSS 插件已配置，但当前样式主要是手写 CSS 变量和类名，不是 Tailwind utility 为主。
- ESLint 使用 `eslint-config-next/core-web-vitals` 和 `eslint-config-next/typescript`。

## 常用命令

- 安装依赖：`npm install`
- 本地开发：`npm run dev`
- 生产构建：`npm run build`
- 启动构建产物：`npm run start`
- 代码检查：`npm run lint`

`next-dev.log` 显示开发服务器曾以 `next dev --turbopack --hostname 127.0.0.1` 运行，地址为 `http://127.0.0.1:3000`。`next.config.ts` 中配置了：

- `allowedDevOrigins: ["127.0.0.1"]`
- `turbopack.root = process.cwd()`

## 目录和文件职责

- `src/app/layout.tsx`：全局根布局，设置 `lang="zh-CN"`，导入全局样式，并定义页面 metadata。
- `src/app/page.tsx`：主页面和全部交互逻辑。包含数据、组件、SVG 插图、筛选搜索、轮播和留言表单。
- `src/app/globals.css`：全局视觉系统和响应式布局。定义颜色、字体、卡片、轮播、问答、留言、路径模块和移动端断点。
- `vitiligo-qa-knowledge-base.html`：旧版静态 HTML 页面，内容和样式与当前页面高度相关，可用于核对迁移遗漏或还原视觉细节。
- `package.json`：项目名为 `vitiligo-qa-knowledge-base`，版本 `1.0.0`，依赖使用 `latest`。
- `.gitignore`：忽略 `node_modules/`、`.next/`、日志、环境文件、构建产物、编辑器文件等。

## 页面结构

`Home` 默认导出按以下顺序渲染：

1. `Header`：顶部粘性导航，锚点跳转到常见问题、患者留言、就诊流程、参考来源。
2. `Hero`：首屏标题、说明、行动按钮和三条核心事实。
3. 重要提示 `notice`：强调页面不能替代医生建议。
4. `KnowledgeCarousel`：四张科普轮播，主题包括诊断检查、治疗管理、日常护理、患者误区。
5. `QaSection`：可搜索、可按分类筛选、可展开折叠的常见问答。
6. `PathwaySection`：从发现白斑到管理方案的四步路径。
7. `PatientMessages`：患者留言轮播、预览列表和本地表单提交。
8. `Footer`：项目名、资料更新时间和医疗免责声明。

## 核心数据模型

`src/app/page.tsx` 中的主要类型和数据：

- `Filter`：问答分类，取值为 `all`、`basics`、`diagnosis`、`treatment`、`care`、`life`。
- `QaItem`：问答条目，包含 `id`、`category`、`keywords`、`question`、`paragraphs`、可选 `bullets`、`tags`。
- `PatientMessage`：留言条目，包含 `id`、`name`、`meta`、`message`。
- `filters`：分类按钮文案。
- `qaItems`：问答知识库内容。目前覆盖白癜风是什么、传染/遗传、常见症状、诊断、鉴别诊断、治疗方式、治疗预期、防晒、饮食、心理压力、何时就医。
- `quickNotes`：就诊前可记录事项。
- `pathway`：四步就诊/管理路径。
- `initialMessages`：默认患者留言。
- `slides`：科普轮播内容和对应 SVG 视觉。

## 交互逻辑

- 搜索：`QaSection` 使用 `query` 状态，`normalizeText` 做小写和 trim。搜索命中范围包括问题、段落、项目符号和 `keywords`。
- 高亮：`HighlightedText` 只高亮每段文本中的第一个匹配位置；如果未来要高亮所有匹配，需要改这里。
- 分类筛选：`activeFilter` 与搜索条件一起过滤 `qaItems`。
- 问答展开：`openItems` 是 `Set<string>`，默认展开 `what-is-vitiligo`。
- 知识轮播：`KnowledgeCarousel` 每 5200ms 自动切换，鼠标悬停、聚焦或系统减少动效时暂停。
- 留言轮播：`PatientMessages` 每 4800ms 自动切换，支持上一条/下一条、点选预览。
- 留言提交：只保存在当前 React state 中，不持久化、不发送到后端；刷新页面会丢失。

## 视觉和样式约定

- 主要色彩变量在 `:root`：绿色系主色 `--primary/#087f6f`，深绿色 `--primary-dark/#075f55`，橙色强调 `--accent/#d9863d`，浅背景 `--bg/#f6f8f7`。
- 页面使用中文字体栈：`"Noto Sans SC", "Microsoft YaHei", "PingFang SC", sans-serif`。
- 最大内容宽度 `--max: 1180px`，卡片圆角 `--radius: 8px`。
- 当前页面是较完整的医疗科普单页，避免引入不必要的新框架或复杂状态管理。
- 响应式断点主要在 `940px` 和 `620px`，涉及 hero、内容网格、留言表单、路径卡片和轮播视觉。
- 页面内 SVG 插图直接写在 React 组件中：`DiagnosisSvg`、`TreatmentSvg`、`CareSvg`、`MisconceptionSvg`。

## 医疗内容注意事项

- 页面引用了 AAD、Mayo Clinic、NIAMS 等公开资料链接，显示在 `source-card`。
- 修改医学内容时要保持谨慎措辞，避免承诺“根治”、诊断结论或替代医生建议。
- 新增问答时应补齐 `keywords` 和 `tags`，这样搜索与分类体验才完整。
- 涉及治疗、药物、副作用、儿童、孕期、合并自身免疫病等内容时，建议明确“需医生评估”。
- 用户留言区域提示不要填写身份证号、电话、住址等隐私信息；如果未来接入后端，需要增加真实的隐私保护、审核和数据存储策略。

## 维护建议

- 如果只是改内容，优先修改 `qaItems`、`slides`、`quickNotes`、`pathway` 或 `initialMessages`，不要先拆组件。
- 如果交互继续增多，再考虑把数据迁移到独立文件，例如 `src/data/...`，把组件拆到 `src/components/...`。
- `vitiligo-qa-knowledge-base.html` 是有价值的旧版参考，但 Next 页面才是运行入口；不要让两个版本长期分叉承载不同事实。
- 当前 `AGENTS.md` 创建时，工作区已有未提交修改：`src/app/globals.css` 和 `src/app/page.tsx`，以及未跟踪的 `AGENTS.md`。这些修改不要无故回退。
