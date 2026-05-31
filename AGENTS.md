# AGENTS.md

本仓库根目录是 HotKey 多项目工作区索引，不承载具体业务实现代码。

## 工作区边界

1. `hotkey-server`：HotKey 后端仓库，负责后端 API、OpenAPI 契约和数据处理。
2. `hotkey-web`：HotKey Web 创作者工作台，负责 Next.js 前端体验。
3. `hotkey-miniapp`：HotKey Taro 小程序，负责轻量端体验。

根目录只保留跨仓说明、调度入口和子项目目录。不要在根目录新增 `cmd/`、`internal/`、`src/`、`migrations/`、`package.json` 或 `go.mod` 等业务工程文件。

## 跨仓协作规则

1. 默认执行顺序为 `server -> web -> miniapp -> 回归`。
2. `hotkey-server` 的 Swagger/OpenAPI 是契约事实源。
3. `hotkey-web` 和 `hotkey-miniapp` 不手写后端 API 类型，必须通过 `@umijs/openapi` 从后端 OpenAPI 生成客户端。
4. 变更涉及接口字段、状态码、错误结构或鉴权方式时，先稳定 server 契约，再更新 Web 和小程序客户端。
5. 保持清理任务和功能任务分离，保留无关用户改动。
6. 提交信息使用中文。

## 子项目规范

进入具体子项目后，优先阅读对应目录内的规范文件：

1. `hotkey-server/AGENTS.md`
2. `hotkey-web/AGENTS.md`
3. `hotkey-miniapp/AGENTS.md`

具体技术栈、测试命令、构建命令和 PR 验收标准以子项目文件为准。
