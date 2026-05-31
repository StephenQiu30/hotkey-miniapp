# CLAUDE.md — HotKey

本文件为 Claude Code 提供在 HotKey 多项目工作区中工作的长期规范。

## 工作区边界

HotKey 当前由三个子项目组成：

1. `hotkey-server`：后端 API、数据库、采集、AI 摘要、榜单、通知、搜索和 OpenAPI 契约事实源。
2. `hotkey-web`：Next.js Web 创作者工作台，通过后端 OpenAPI 生成客户端。
3. `hotkey-miniapp`：Taro 小程序轻量端，通过后端 OpenAPI 生成客户端。

根目录只做跨仓路由、Claude 工作流说明和协作规范，不承载业务实现。不要在根目录新增 `cmd/`、`internal/`、`src/`、`migrations/`、`package.json` 或 `go.mod` 等子项目工程文件。

## Claude 工作流原则

1. 复杂任务优先以 Linear ticket 为执行单位，而不是一次聊天会话。
2. 默认执行顺序为 `server -> web -> miniapp -> 回归`。
3. `CLAUDE.md` 记录长期稳定的 Claude 行为准则；`CLAUDE.local.md` 记录本项目局部配置；`WORKFLOW.md` 记录 runner 可读取的调度契约。
4. 每个 ticket 只维护一个持久评论作为事实源，标题使用 `## Claude Workpad`。
5. Claude 应先收集事实、制定验收方式，再修改代码或文档。
6. 只有缺少必要权限、secret、外部服务或工具时才进入阻塞；普通实现困难不作为阻塞理由。

## Test-First 与提交规范

1. 功能或行为变更优先走红绿重构：先写失败测试，再实现最小代码，最后在测试保护下重构。
2. 允许的提交类型固定为 `test:`、`docs:`、`impl:`、`feat:`、`chore:`、`refactor:`。
3. 功能分支默认提交顺序为 `test:` -> `impl:`/`feat:` -> `refactor:` -> `docs:`/`chore:`。
4. 文档、清理、CI、删除无用代码等非功能变更可不强制 test-first，但必须说明验证方式。
5. 提交信息使用中文，提交前确认工作区只包含本次任务相关文件。

## 角色协作

角色配置放在 `.claude/agents/`：

1. `Explorer`：事实收集、文件定位、依赖梳理。
2. `PM`：需求拆解、范围控制、验收标准定义。
3. `Builder`：最小实现、文档或代码修改。
4. `Tester`：测试、lint、构建和回归验证。
5. `Reporter`：交付说明、验证证据和风险整理。

复杂任务按 `Explorer -> PM -> Builder -> Tester -> Reporter` 执行；简单任务可合并为 `PM -> Builder -> Tester`。

## OpenAPI 契约

1. `hotkey-server` 的 Swagger/OpenAPI 是契约事实源。
2. `hotkey-web` 和 `hotkey-miniapp` 不手写后端 API 类型，必须通过 `@umijs/openapi` 从后端 OpenAPI 文档生成客户端。
3. 接口字段、状态码、错误结构或鉴权方式变更时，先稳定 server 契约，再更新 Web 和小程序客户端。

## 交付要求

每次任务完成时，交付说明至少包含：

1. 修改了什么。
2. 如何验证。
3. 是否有未验证内容或残余风险。
4. 涉及的关键文件。
5. Git 提交状态和 PR 状态。
