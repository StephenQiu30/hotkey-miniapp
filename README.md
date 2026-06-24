# hotkey-miniapp

HotKey 是面向内容创作者的热点监控与 AI 选题助手。`hotkey-miniapp` 是它的 **Taro 跨端小程序**，让你在手机微信上随时查看热点、快速理解事件、收藏关注话题，并在路上完成轻量选题判断。

## 你在用什么

小程序聚焦移动端的高频场景，保留 Web 工作台的核心读链路：

- **微信登录**：Taro 端登录并换取后端会话
- **热点榜单**：浏览评分靠前、趋势上升的话题
- **快速理解**：查看 AI 摘要与选题灵感
- **收藏与关注**：建立个人热点清单
- **提醒入口**：预留订阅消息与通知触达能力

当前首页在 `src/pages/index`，通过 OpenAPI 生成的客户端对接后端。

## 在 HotKey 生态中的位置

```text
hotkey-server（OpenAPI 事实源）
       ↓ 生成客户端
hotkey-web ──────── 桌面端完整工作台
hotkey-miniapp（本仓）── 微信端轻量入口
```

本仓 **不维护** 后端 API 契约。所有接口类型与请求函数必须通过 `@umijs/openapi` 从 `hotkey-server` 的 OpenAPI 规范生成，禁止手写后端类型。

## 技术栈

| 类别 | 选型 |
|------|------|
| 框架 | Taro 4 + React 18 + TypeScript |
| 目标平台 | 微信小程序（优先），架构预留支付宝、抖音等端 |
| API 客户端 | `@umijs/openapi`（命名空间 `HotKeyAPI`） |

## 快速开始

### 环境要求

- Node.js 20+
- [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- 本地已克隆并可用 [`hotkey-server`](../hotkey-server)
- Python 3（治理与契约测试）

### 安装与开发

```bash
npm install

# 从 server 的 openapi.json 生成 TypeScript 客户端
npm run openapi:generate

# 编译微信小程序并监听变更
npm run dev:weapp
```

用微信开发者工具打开项目根目录下的 `dist/` 目录进行预览与调试。

### 常用命令

```bash
npm run build:weapp    # 生产构建
npm run typecheck      # TypeScript 类型检查
npm run test           # 仓库治理与契约测试
python3 -m unittest discover -s tests -p 'test_repository_governance.py'
```

## OpenAPI 客户端生成

生成配置见 [`openapi2ts.config.ts`](./openapi2ts.config.ts)：

- 规范路径：`../hotkey-server/docs/openapi.json`
- 输出目录：`src/services/hotkey/hotkey-server/`
- 请求封装：`src/utils/request.ts`

后端接口有变更时，按以下顺序操作：

1. 在 `hotkey-server` 稳定 OpenAPI 并合并到 `main`
2. 更新本仓的 `openapi.json`
3. 执行 `npm run openapi:generate`
4. 在页面中接入新接口，用微信开发者工具回归

## 目录结构

```text
src/pages/            # 小程序页面
src/components/       # 可复用组件（随功能扩展）
src/utils/            # 请求封装与工具
src/services/hotkey/  # OpenAPI 生成的 API 客户端（勿手改）
config/               # Taro 编译配置
docs/                 # PRD、设计、验收与运维文档
```

## 跨仓协作

默认开发顺序：

```text
server → web → miniapp → 回归
```

小程序通常在 Server 契约与 Web 端主流程验证后再接入，避免重复返工。平台能力（如订阅消息）需结合微信侧配置与后端通知接口一并验收。

| 仓库 | 链接 |
|------|------|
| 后端 | [hotkey-server](https://github.com/StephenQiu30/hotkey-server) |
| Web | [hotkey-web](https://github.com/StephenQiu30/hotkey-web) |
| 小程序（本仓） | [hotkey-miniapp](https://github.com/StephenQiu30/hotkey-miniapp) |

## 文档与规范

- [文档索引](./docs/README.md)
- [AGENTS.md](./AGENTS.md) — AI 协作与工程规范（通用部分同步自 server）

## 许可证

本项目为 HotKey 产品私有仓库，未经授权请勿对外分发。
