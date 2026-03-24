# Sprite Frontend

数字生命 (Digital Being) 的 Web 前端界面。

## 技术栈

- **React 18** + TypeScript
- **Vite** - 快速构建工具
- **TanStack Query** - 数据获取与缓存
- **Zustand** - 轻量状态管理
- **Tailwind CSS** + **shadcn/ui** - 现代 UI
- **Recharts** - 数据可视化
- **React Router v6** - 路由管理

## 页面

| 路由 | 描述 |
|------|------|
| `/chat` | 聊天界面 - 与 Sprite 对话 |
| `/dashboard` | 仪表盘 - 认知、记忆、进化、情绪概览 |
| `/emotions` | 情绪分析 - 主人情绪历史与模式 |
| `/devices` | 设备管理 - 多设备状态与协调 |
| `/health` | 系统健康 - 服务器与传感器状态 |
| `/settings` | 设置 - 偏好配置与备份 |

## 开发

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build
```

## 目录结构

```
src/
├── api/           # API 客户端与 WebSocket
├── components/    # UI 组件 (ui/, layout/, charts/)
├── features/      # 功能模块 (chat/, dashboard/, ...)
├── hooks/         # 自定义 Hooks
├── pages/         # 路由页面
├── stores/        # Zustand 状态管理
├── types/         # TypeScript 类型定义
└── lib/           # 工具函数
```

## 环境变量

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_WS_BASE_URL=ws://localhost:8080
```

## 后端依赖

此前端需要 Sprite 后端服务运行在 port 8080。

后端项目: [sprite-be](https://github.com/lingfeng-xiao/sprite-be)
