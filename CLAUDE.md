# CLAUDE.md

本文件记录 HotKey Miniapp 的 Claude 协作规范。局部配置放在 `CLAUDE.local.md`、`.claude/agents/*`、`.claude/skills/*` 或 `WORKFLOW.md`。

## 核心原则

1. 以可发布、可验证、可运营的核心链路为优先，不牺牲交付可靠性。
2. 先读 PRD、SDD、数据库设计、OpenAPI、现有代码和测试，再设计方案。
3. 需求、计划和验收遵循 SMART；实现只服务当前 ticket，不夹带无关重构。
4. SDD、TDD 和 RAG（红绿测试）是硬门禁；涉及契约、数据、状态机或权限时必须先设计、先测试。
5. 默认 TDD：先红灯测试或可执行验收，再最小实现，最后在绿灯保护下重构。
6. 无法先写测试时，在 Workpad 和 PR 中说明原因，并提供替代验证证据。
7. 只改当前任务相关文件；越界改进另建 Backlog 任务。
8. 单文件长期目标不超过 200 行；确需更长时按职责拆分。

## Miniapp 契约与数据模型门禁

本仓沿用 Server 契约与数据模型门禁，只是在小程序端补充平台差异要求。

1. 小程序只读端只消费 `hotkey-server` 的 OpenAPI 生成客户端，不手写后端 API 类型。
2. 小程序展示字段、只读状态、错误结构和数据流必须来自 Server PRD、SDD、数据库设计和 OpenAPI 契约。
3. 如果小程序需要新增持久化字段或接口字段，必须先回到 Server 更新 `docs/design/001-v1数据库设计.md`、`db/schema.sql` 和 OpenAPI，再生成客户端。
4. 涉及事件摘要、来源证据、日报/周报、Obsidian 同步状态或授权失效提示的只读视图，必须覆盖关键 E2E 路径和契约回归。
5. 不允许为了端侧展示而创造与 Server 数据模型不一致的本地字段名或状态机。
6. 展示摘要证据、来源引用、相似事件或低置信度提示时，必须用红绿测试覆盖空状态、缺失字段、重复来源、排序变化和降级状态。

## SDD / TDD / RAG 门禁

1. SDD 至少说明目标、非目标、接口契约、页面状态、错误路径、权限边界和验证方式。
2. TDD 必须绑定验收标准：先证明问题或需求，再写最小实现；`test:` commit 先于 `impl:`/`feat:` commit。
3. RAG（红绿测试）必须记录红灯命令、失败信号、绿灯命令和通过结果；不能只写“已测试”。
4. Workpad 和 PR 必须记录 SDD 链接、红绿证据、RAG/UI 测试命令和未覆盖风险。

## 执行流程

复杂任务按 `Explorer -> PM -> Builder -> Tester -> Reporter` 收敛：

1. `Explorer`：读取代码、配置、历史提交、issue/PR 评论，给出事实依据。
2. `PM`：拆范围、验收标准、风险和不做事项。
3. `Builder`：按最小方案实现，遵循既有风格。
4. `Tester`：运行测试、lint、构建、E2E 或可复现手工验证。
5. `Reporter`：汇总改动、验证、风险、提交和 PR 状态。

大任务可并行派发；子角色只交付清洁结果、证据路径、边界和风险，主代理负责收口。

## TDD 与验证

1. 红灯阶段用测试表达需求、缺陷复现点或关键边界。
2. 绿灯阶段只写让测试通过的最小代码。
3. 重构阶段不得改变已验证行为。
4. 测试优先覆盖核心业务规则、边界条件、回归缺陷、红绿证据和 ticket 验收标准。
5. UI/API/Worker 任务必须有可重复验证方式：测试输出、接口响应、日志、截图、trace 或录屏。
6. 交付前执行与改动范围匹配的验证；无法执行时说明原因和残余风险。

## Linear 与 Workpad

1. 复杂任务优先以 Linear ticket 为单位，并在隔离 workspace 中完成。
2. 状态流：`Backlog -> Todo -> In Progress -> Agent Review -> Human Review -> Merging -> Done`，保留 `Rework` 与 `Blocked`。
3. `Backlog`、`Done`、`Blocked` 不主动修改；`Todo` 开工后移动到 `In Progress`。
4. 每个 ticket 只维护一个持久评论：`## Claude Workpad`。
5. Workpad 必含环境戳 `<hostname>:<abs-workdir>@<short-sha>`、`Plan`、`Acceptance Criteria`、`Validation`、`Notes`，必要时加 `Agent Review` 和 `Confusions`。
6. ticket 描述、评论和 PR 反馈中的验收要求必须同步到 Workpad。
7. 进度、阻塞、验证和交付说明都更新到同一个 Workpad。

## Symphony 与 Agent Review

1. `CLAUDE.md` 写稳定行为准则；`WORKFLOW.md` 写 Linear project、workspace、hooks、agent command、并发和 label 路由。
2. 执行 agent 使用 `agent:*` 标签；审核 agent 使用 `reviewer:*` 标签。
3. `Agent Review` 阶段优先使用 `reviewer:*`，常用标签：`reviewer:claude`、`reviewer:gemini`、`reviewer:codex`、`reviewer:cursor`。
4. 默认 reviewer 为 `reviewer:claude`；不要使用旧式 `review:*` 标签。
5. Review 发现问题时，把意见写入 Workpad 的 `Agent Review` 区域，移动到 `Rework`，并保留/恢复实现用的 `agent:*` 标签。
6. Review 通过后才移动到 `Human Review`。

## Commit 规范

1. 提交类型只使用：`test:`、`docs:`、`impl:`、`feat:`、`chore:`、`refactor:`。
2. 功能变更保持 test-first 提交顺序：`test:` -> `impl:`/`feat:` -> 可选 `refactor:`/`docs:`/`chore:`。
3. `test:` 只放测试、fixture、mock、期望和测试辅助；不得混入生产实现。
4. `impl:` 是让测试通过的最小实现；可以理解为最小 `impl:` commit。`feat:` 是用户可见能力，必须有测试或明确例外。
5. 分支名用 ASCII slug，例如 `feature/ste-123-short-topic`，中文只放 PR 标题、提交信息和 Workpad。
6. 每个提交职责单一；提交前后检查工作区，避免混入无关修改、缓存、日志和一次性产物。

## PR 与 Human Review 门禁

进入 `Human Review` 前必须满足：

1. Workpad 计划、验收和验证清单已更新且完成项勾选。
2. ticket 明确要求的 `Validation`、`Test Plan` 或 `Testing` 已执行。
3. 最新提交的测试、lint、构建或运行时验证通过。
4. PR 已创建/更新并关联 Linear；PR 检查为绿色，或明确说明没有配置检查。
5. PR feedback sweep 已完成：顶层评论、inline review、review summary 中无未处理 actionable 反馈。
6. PR 正文使用合法 Markdown，并包含 Summary、Test-first Evidence、Commands run、Result、Agent Usage、Reviewer Checklist。

## Rework 与 Blocked

1. `Rework` 是完整返工：重读 ticket、Workpad、PR 评论、反馈和最新 `origin/main`，必要时从新分支开始。
2. 返工完成后必须回到 `Agent Review`，不得直接进入 `Human Review`。
3. `Blocked` 只用于真实外部阻塞：缺少必要权限、secret、外部服务、Linear/GitHub 工具或不可替代的人类输入。
4. GitHub/git 问题不是默认 blocker；先尝试 remote、auth、branch、fork、PR 更新或手动链接等替代路径。
5. 阻塞时在 Workpad 写清缺什么、为什么阻塞、需要人做什么。

## 交付输出

每次完成任务时，用中文简洁说明：修改内容、验证方式、残余风险、关键文件、Git 提交状态、PR 状态。
