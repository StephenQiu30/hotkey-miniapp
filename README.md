# hotkey-miniapp

`hotkey-miniapp` 是 HotKey 内容创作者热点选题工具的 Taro 跨端小程序。

本仓不维护后端 API 契约事实源。后端接口以 `hotkey-server` 的 Swagger/OpenAPI 为准，小程序端必须通过 `@umijs/openapi` 生成 API 客户端。

## P0 职责

1. Taro 平台登录并换取后端会话。
2. 热点榜单与热点详情。
3. AI 快速理解热点展示。
4. 收藏和关注。
5. 提醒入口与订阅消息能力预留。

## 技术栈

- Taro + React + TypeScript
- `@umijs/openapi`
- 优先微信小程序构建，预留支付宝、抖音等端

## 跨仓协作顺序

默认顺序：

```text
server -> web -> miniapp -> 回归
```

小程序端只有在 `hotkey-server` 的 OpenAPI 契约稳定后，才生成客户端并接入页面。

## 规范文件

- [AGENTS.md](./AGENTS.md)：小程序仓规范，通用部分同步自 `hotkey-server`。

## M0 验证

运行仓库治理基线测试：

```bash
python3 -m unittest discover -s tests -p 'test_repository_governance.py'
```

该测试用于确认本仓声明了 Taro 跨端小程序职责、`@umijs/openapi` 生成客户端规则和跨仓协作顺序。
