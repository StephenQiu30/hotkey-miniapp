# CLAUDE.local.md — hotkey-miniapp 局部项目规范

本文件用于记录放在 hotkey-miniapp 项目中的局部规范性配置。

## 使用边界

1. `CLAUDE.md` 应存放长期稳定的全局规则、角色协作原则和交付格式
2. `CLAUDE.local.md` 则负责**当前项目特有的规范、路径、命令、环境约束和临时协作约定**
3. 当两者冲突时，**应优先确认项目上下文，并以更具体、更贴近当前项目的规则为准**

## 当前项目规范

### 技术栈
- Taro 4 + React 18
- 微信小程序

### 项目结构
```
hotkey-miniapp/
├── src/
│   └── pages/
│       └── index/      # 单页面小程序
├── config/             # Taro 配置
├── package.json        # 依赖配置
└── tsconfig.json       # TypeScript 配置
```

### 常用命令
```bash
npx taro build --type weapp            # 构建微信小程序
npx taro build --type weapp --watch    # 开发模式带监听
npx tsc --noEmit                       # 类型检查
npx openapi2ts                         # 重新生成 API 客户端
python3 -m unittest discover -s tests  # 治理/契约测试
```

### API 客户端生成
- 从 `hotkey-server` 的 OpenAPI 规范生成
- 使用 `@umijs/openapi` 工具
- 生成路径：`src/services/hotkey/hotkey-server/`
- **绝不手写后端 API 类型**

### 角色配置
角色配置存放于 `.claude/agents/` 目录

### 可复用流程
可复用流程存放于 `.claude/skills/` 目录
