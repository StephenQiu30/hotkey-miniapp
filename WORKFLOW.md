# WORKFLOW.md — HotKey 工作区调度说明

本文件只描述根工作区的跨仓路由。具体执行时应进入对应子项目，并读取该子项目自己的 `WORKFLOW.md` 和 `AGENTS.md`。

## 路由规则

1. 后端、数据库、OpenAPI、采集、队列、AI 摘要、榜单、通知、搜索等任务进入 `hotkey-server/`。
2. Web 工作台、Next.js 页面、Web 生成客户端、浏览器验收等任务进入 `hotkey-web/`。
3. 小程序、Taro 页面、微信小程序构建、端侧登录和提醒入口等任务进入 `hotkey-miniapp/`。
4. 跨仓任务按 `server -> web -> miniapp -> 回归` 执行。

## 根目录约束

根目录只做工作区索引，不提交业务实现代码。以下内容必须放入子项目目录：

1. Go 工程文件：`go.mod`、`cmd/`、`internal/`、`migrations/`。
2. 前端工程文件：`package.json`、`src/`、`app/`、`config/`、`project.config.json`。
3. 子项目测试：`tests/`、`__pycache__/` 以外的测试源文件。
4. 子项目文档：产品、工程、验收文档应归属对应项目。

## GitHub 发布

本地工作区可以用子目录拆分方式发布到对应 GitHub 仓库：

```bash
git subtree split --prefix=hotkey-server -b publish/hotkey-server
git subtree split --prefix=hotkey-web -b publish/hotkey-web
git subtree split --prefix=hotkey-miniapp -b publish/hotkey-miniapp
```

发布前必须确认目标仓库和分支，避免把一个子项目推到另一个仓库。
