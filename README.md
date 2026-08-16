# 365 前台 · Juan365 可点原型

GitHub：https://github.com/huasabrina8-dotcom/365-frontend-prototype

对照测试站 [gogame-test.sldaops.com](https://gogame-test.sldaops.com/) 的前台路由与交互，按项目库里 Juan365 浅色橙壳还原的一套 **PC + H5** 可点原型。

数据只存在浏览器 `localStorage`（`juan365_frontend_v1`），**不产生真实资金、不对接正式数仓**。

## 怎么看

```bash
cd /Users/Admin/Projects/365-frontend-prototype
python3 -m http.server 8770
```

| 入口 | 地址 |
|------|------|
| 目录 | http://localhost:8770/ |
| PC 大厅 | http://localhost:8770/c-end/ |
| H5 | http://localhost:8770/h5/ |
| 需求 | [docs/365前台-开发测试宣讲需求.md](docs/365前台-开发测试宣讲需求.md) |

## 覆盖页面

大厅 / 游戏分类 / 厂商 / 搜索 / 登录注册 / 合规弹窗 / 优惠 / 活动详情 / VIP / 代理 / 分享 / 每日任务 / 我的收益 / 返水 / 幸运转盘 / 红包雨 / 抽奖 / 账户 / 消息 / 流水 / 限额 / 改密改绑 / 充值提现 / 绑卡 / KYC / 关于与合规页 / 维护 / IP 限制。

## 演示数据

会员 `wjfytn329022` · 手机 `0969****3098` · ID `1000888` · 现金 ₱ 110,102.00 · 奖金 ₱ 1,424.00 · PVIP · 邀请码 `37BRX7HM`。

底部 **预览** 条：未登录 / 已登录 / 合规弹窗 / 掉线 Alert / 骨架屏。

## 视觉

对齐线上主题色 `#f26839` / `#fa9d1a`，并参考仓库内 `qq-lottery-prototype/c-end`、`qq-pet-vip-prototype/c-end` 的大厅壳（顶栏 + 侧栏瓷片 + 底栏 / 浮标）。
