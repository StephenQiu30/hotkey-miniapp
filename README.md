# HotKey 工作区

本目录用于统一整理 HotKey 三个业务子项目：

1. `hotkey-server`：后端服务与 OpenAPI 契约事实源。
2. `hotkey-web`：Next.js Web 创作者工作台。
3. `hotkey-miniapp`：Taro 跨端小程序。

根目录不再承载业务代码，只作为本地工作区和跨仓协作入口。业务实现、测试、构建和提交说明都应放在对应子项目目录中。

## 协作顺序

默认跨仓执行顺序：

```text
server -> web -> miniapp -> 回归
```

后端接口变化先在 `hotkey-server` 稳定 OpenAPI，再由 `hotkey-web` 和 `hotkey-miniapp` 使用 `@umijs/openapi` 生成客户端。

## 目录说明

| 目录 | 用途 |
| --- | --- |
| `hotkey-server/` | Go 后端服务、迁移、OpenAPI、后端验收测试 |
| `hotkey-web/` | Next.js Web 前端、Web 客户端生成、工作台 UI |
| `hotkey-miniapp/` | Taro 小程序、端侧客户端生成、小程序主链路 |

## 常用入口

```bash
cd hotkey-server
go test ./...

cd ../hotkey-web
npm test
npm run build

cd ../hotkey-miniapp
npm test
npm run build:weapp
```

实际可用命令以各子项目 `package.json`、`Makefile` 和 `README.md` 为准。
