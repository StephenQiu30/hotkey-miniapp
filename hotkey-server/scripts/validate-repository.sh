#!/usr/bin/env bash
set -euo pipefail

# HotKey Server 仓库验证脚本

required_files=(
  "README.md"
  "CLAUDE.md"
  "CLAUDE.local.md"
  "WORKFLOW.md"
  ".env.example"
  ".gitignore"
  "docs/README.md"
  "docs/TEMPLATE.md"
  "docs/prd"
  "docs/plans"
  "docs/design"
  "docs/acceptance"
  "docs/operations"
  ".claude/agents/pm.md"
  ".claude/agents/explorer.md"
  ".claude/agents/builder.md"
  ".claude/agents/tester.md"
  ".claude/agents/reporter.md"
  ".claude/skills/commit/SKILL.md"
  ".claude/skills/pull/SKILL.md"
  ".claude/skills/push/SKILL.md"
  ".claude/skills/land/SKILL.md"
  ".github/pull_request_template.md"
)

echo "🔍 验证 hotkey-server 仓库结构..."

# 检查必需文件是否存在
for file in "${required_files[@]}"; do
  if [ -e "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file 不存在"
    exit 1
  fi
done

# 检查 WORKFLOW.md 内容
echo ""
echo "🔍 验证 WORKFLOW.md 内容..."
if grep -q "tracker:" WORKFLOW.md; then
  echo "✅ 包含 tracker 配置"
else
  echo "❌ 缺少 tracker 配置"
  exit 1
fi

if grep -q "## Claude Workpad" WORKFLOW.md || grep -q "## Codex Workpad" WORKFLOW.md; then
  echo "✅ 包含 Workpad 模板"
else
  echo "❌ 缺少 Workpad 模板"
  exit 1
fi

if grep -q "Human Review" WORKFLOW.md; then
  echo "✅ 包含 Human Review 状态"
else
  echo "❌ 缺少 Human Review 状态"
  exit 1
fi

# 检查 Go 项目结构
echo ""
echo "🔍 检查 Go 项目结构..."
if [ -f "go.mod" ]; then
  echo "✅ go.mod 存在"
else
  echo "⚠️  go.mod 不存在"
fi

if [ -d "cmd/server" ]; then
  echo "✅ cmd/server 目录存在"
else
  echo "⚠️  cmd/server 目录不存在"
fi

if [ -d "internal" ]; then
  echo "✅ internal 目录存在"
else
  echo "⚠️  internal 目录不存在"
fi

echo ""
echo "✅ hotkey-server 仓库验证通过！"
