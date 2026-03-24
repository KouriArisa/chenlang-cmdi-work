<!-- 备注：对应培训阶段 2（项目初始化与环境配置），关联设计文档第 4 节“技术选型”。 -->

# 环境搭建文档

## 1. 运行要求

- Node.js `>= 22`
- npm `>= 10`
- 现代浏览器，支持 ES Modules 和 Canvas

当前项目不依赖额外第三方包安装，克隆后即可执行构建与测试命令。

## 2. 本地开发命令

```bash
npm run dev
npm run build
npm test
./scripts/start.sh
```

## 3. 本地目录说明

- `src/client`：前端页面与游戏逻辑
- `src/server`：后端 API 与静态资源服务
- `data`：本地排行榜数据
- `dist`：构建产物目录

## 4. VS Code 建议

项目已提供 [.vscode/settings.json](/Users/kouriarisa/code_space/26ai-demo-project/.vscode/settings.json)，默认启用：

- 保存时格式化
- 统一换行符
- 隐藏 `dist` 与 `data` 搜索噪音
