---
tracker:
  kind: linear
  project_slug: "$SYMPHONY_LINEAR_PROJECT_SLUG"
  active_states:
    - Todo
    - In Progress
    - Merging
    - Rework
  terminal_states:
    - Closed
    - Cancelled
    - Canceled
    - Duplicate
    - Blocked
    - Done
polling:
  interval_ms: 5000
server:
  host: "0.0.0.0"
workspace:
  root: "$SYMPHONY_WORKSPACE_ROOT"
hooks:
  after_create: |
    git clone --depth 1 "$SOURCE_REPO_URL" .
agent:
  max_concurrent_agents: 4
  max_turns: 20
claude:
  command: claude --dangerously-skip-permissions
---

# WORKFLOW.md — HotKey Claude 工作区调度说明

本文件描述 HotKey 根工作区的 Claude 调度入口和跨仓路由。具体执行时应进入对应子项目，并读取该子项目自己的 `WORKFLOW.md`、`CLAUDE.md` 和 `AGENTS.md`。

This workflow runs Claude by default. Use the `claude:` configuration key, `.claude/` paths, and the `## Claude Workpad` marker throughout this workflow.

## Claude 执行规则

1. 这是无人值守编排会话，不要求人工执行后续动作。
2. 只有缺少必要权限、secret、外部服务或工具时才停止，并在 `## Claude Workpad` 记录阻塞原因。
3. 每个 Linear ticket 只维护一个 `## Claude Workpad` 评论作为计划、验收、验证和交付事实源。
4. 先确认 ticket 状态和当前代码事实，再计划、实现和验证。
5. 功能或行为变更默认 test-first；文档、清理、CI 和删除无用代码可用可执行验证替代红灯测试。

## 路由规则

1. 后端、数据库、OpenAPI、采集、队列、AI 摘要、榜单、通知、搜索等任务进入 `hotkey-server/`。
2. Web 工作台、Next.js 页面、Web 生成客户端、浏览器验收等任务进入 `hotkey-web/`。
3. 小程序、Taro 页面、微信小程序构建、端侧登录和提醒入口等任务进入 `hotkey-miniapp/`。
4. 跨仓任务按 `server -> web -> miniapp -> 回归` 执行。

## 角色配置

根目录提供 Claude 角色说明：

1. `.claude/agents/explorer.md`
2. `.claude/agents/pm.md`
3. `.claude/agents/builder.md`
4. `.claude/agents/tester.md`
5. `.claude/agents/reporter.md`

复杂任务按 `Explorer -> PM -> Builder -> Tester -> Reporter` 收口。

## 根目录约束

根目录只做工作区索引，不提交业务实现代码。以下内容必须放入子项目目录：

1. Go 工程文件：`go.mod`、`cmd/`、`internal/`、`migrations/`。
2. 前端工程文件：`package.json`、`src/`、`app/`、`config/`、`project.config.json`。
3. 子项目测试：`tests/`、`__pycache__/` 以外的测试源文件。
4. 子项目文档：产品、工程、验收文档应归属对应项目。

## GitHub 发布

本地工作区如需从聚合目录发布到对应 GitHub 仓库，必须先确认目标仓库和分支，避免把一个子项目推到另一个仓库。可使用子目录拆分方式：

```bash
git subtree split --prefix=hotkey-server -b publish/hotkey-server
git subtree split --prefix=hotkey-web -b publish/hotkey-web
git subtree split --prefix=hotkey-miniapp -b publish/hotkey-miniapp
```

发布、PR 创建和合并前必须检查 GitHub 远端、PR 状态、CI、冲突和目标分支最新状态。
