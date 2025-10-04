# 超星学习通粘贴注入器

本项目是基于 TamperMonkey 编写的，适用于超星学习通等使用 UEditor 作为编辑器的网页。用途是解除编辑器的禁止粘贴。

## 原理

1. 使用 window API 禁用网页的弹窗显示
2. 通过监听器和选择器，聚焦在目标编辑器内，直接操作编辑器的 iframe 的 DOM 结构来完成内容的注入

## 目录结构
```plaintext
├─ script
│  └─ build-userjs.js   # 构建脚本
├─ src
│  └─ main.ts           # 源代码
├─ package.json         # 项目信息
└─ tsconfig.json        # ts 配置
```

## 使用方法

1. 使用`npm install`或者`pnpm install`来获取依赖
2. 使用`npm run build`或者`pnpm run build`来进行构建
3. 开启浏览器的扩展管理中的开发者模式
4. 将构建出来的脚本粘贴到 TamperMonkey 中，然后刷新页面即可生效

## 未解决的问题

- [ ] 无法通过 UEditor 自身的 API 或者键盘模拟输入向光标位置注入文字，导致文字只能在结尾追加

## Pull Request

希望有大佬能解决以上的问题，并给我提出 PR 感激不尽！

## 开源协议

本项目基于 MIT 开源。
