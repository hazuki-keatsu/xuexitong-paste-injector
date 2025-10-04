# 超星学习通粘贴注入器

本项目是基于 TamperMonkey 编写的，适用于超星学习通等使用 UEditor 作为编辑器的网页。用途是解除编辑器的禁止粘贴。

## 原理

1. 使用 window API 禁用网页的弹窗显示
2. 通过监听器和选择器，聚焦在目标编辑器内，直接操作编辑器的 iframe 的 DOM 结构来完成内容的注入
3. （追加）最新版的原理是使用了浏览器自带的 Selection API 实现了对光标处的内容插入，同时保留原有的 DOM 结构修改的方法，向下兼容。

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

1. 下载并安装 [TamperMonkey](https://www.tampermonkey.net/) 插件
2. 开启浏览器的扩展管理中的开发者模式
3. 单击 Release 中的 `xuexitong-paste-injector.user.js` 脚本触发插件的自动导入功能，将脚本导入到 TamperMonkey 中（同样的，你也可以手动导入）
4. 刷新页面脚本即可生效

## 构建方法

1. 使用`npm install`或者`pnpm install`来获取依赖
2. 使用`npm run build`或者`pnpm run build`来进行构建

## 开源协议

本项目基于 MIT 开源。
