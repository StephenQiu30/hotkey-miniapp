# AGENTS.md

本文件用于存放 `hotkey-miniapp` 的项目开发规范。通用规则同步自 `hotkey-server/AGENTS.md`，端侧规则只补充 Taro 小程序特有约束。

## HotKey 跨仓通用规范

hotkey-server 是跨仓库 AGENTS.md 主规范源。通用工程规范、OpenAPI 契约规范、TDD/验收规范、Git/PR 规范和跨仓协作顺序必须先在 `hotkey-server` 维护，再同步到本文件。

跨仓默认执行顺序为：`server -> web -> miniapp -> 回归`。

### 仓库职责

1. `hotkey-server`：FastAPI 后端，负责账号、热点、榜单、AI 摘要、选题生成、收藏关注、通知、搜索、数据源采集和 OpenAPI 输出。
2. `hotkey-web`：Next.js Web 创作者工作台，通过后端 OpenAPI 生成客户端。
3. `hotkey-miniapp`：Taro 跨端小程序，通过后端 OpenAPI 生成客户端。

### OpenAPI 契约规则

1. `hotkey-server` 的 Swagger/OpenAPI 是 OpenAPI 契约事实源。
2. 小程序不得手写后端 API 类型，必须通过 `@umijs/openapi` 从后端 OpenAPI 文档生成客户端。
3. 生成客户端默认放入 `src/services/`，生成命令和输出差异必须进入 PR 说明。
4. 接口字段、状态码、错误结构或鉴权方式变更时，先等 server 契约稳定，再更新小程序客户端。

### P0 范围边界

1. P0 小程序只做轻量端：平台登录、热点榜单、热点详情、AI 摘要、收藏关注和提醒入口。
2. P0 小程序不承载复杂配置后台、深度数据分析、多租户、计费、复杂 RBAC、向量库或企业舆情工作流。
3. 每个阶段必须有 PO 审查 issue 和验收 issue，未完成审查与验收前不得关闭对应 milestone。

## 小程序端技术规范

1. 小程序技术栈为 `Taro + React + TypeScript`。
2. 优先验证微信小程序构建，预留支付宝、抖音等跨端能力。
3. 平台差异只在必要位置使用条件编译或平台文件，业务层避免大面积分叉。
4. 数据请求必须通过 `@umijs/openapi` 生成的客户端入口，鉴权和平台登录适配在小程序仓内封装。
5. 页面状态必须覆盖加载态、空态、错误态和登录失效态。

## TDD 与验收

1. 新增功能优先走红绿重构：先写失败测试，再写最小实现，最后重构。
2. 小程序 PR 必须说明生成客户端是否变化，以及对应 server OpenAPI 来源。
3. 验收证据至少包含测试命令、构建结果和微信小程序主链路验证结果。
