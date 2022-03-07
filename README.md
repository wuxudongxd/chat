## 简介
![GitHub](https://img.shields.io/github/license/wuxudongxd/chat?style=flat-square)

![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB&color=282c34)
![TypeScript](https://shields.io/badge/TypeScript-3178C6?logo=TypeScript&logoColor=FFF&style=flat-square)
![Tailwind_CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=flat-square&logo=nestjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=flat-square&logo=Prisma&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=flat-square&logo=socket.io&badgeColor=010101)

**本项目是出于学习目的构建的即时通讯（IM）程序。**

项目实现了基于 Web 平台的实时聊天室，支持新建、搜索群聊，群聊和私聊的信息实时发送获取，并支持emoji、图片发送预览等特性。


## 相关技术

**项目管理**
* 使用 pnpm 建立Monorepo，管理依赖
* 全部采用TypeScript进行编写

**前端**
* react+hooks
* react-query 服务端缓存、乐观更新
* react-router 切换路由
* tailwindcss 完成样式
* vitejs 完成开发编译

**服务端**
* nestjs 作为后端服务
* sqlite 数据库
* prisma 作为数据库ORM
* webSocket 通信

**部署**
* docker-compose 完成部署

## 效果预览

**新建群聊：**

![message](./docs/image/message.webp)


**emoji、图片支持：**

![image-support](./docs/image/image-support.webp)