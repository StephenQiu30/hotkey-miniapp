# CLAUDE.local.md — HotKey

本文件记录 HotKey 工作区内的 Claude 局部配置，与 `CLAUDE.md` 的长期规则区分。

## 本地约定

1. 根目录只做多项目索引和调度，不直接运行业务服务。
2. 进入子项目后优先阅读该目录下的 `CLAUDE.md`、`AGENTS.md` 和 `WORKFLOW.md`。
3. 根目录角色配置放在 `.claude/agents/`。
4. 子项目可复用流程放在各自的 `.claude/skills/`。
5. 工作流默认使用 Claude runner：`claude --dangerously-skip-permissions`。

## 子项目验证入口

1. `hotkey-server`：`go test ./...`，必要时运行 `python3 -m unittest discover -s tests`。
2. `hotkey-web`：`npm run typecheck`、`npm run build`、`python3 -m unittest discover -s tests`。
3. `hotkey-miniapp`：`npm run typecheck`、`npm run build:weapp`、`python3 -m unittest discover -s tests`。
