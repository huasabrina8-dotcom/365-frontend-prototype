# Agent instructions — 365 前台

This folder is the **Juan365 C-end hall** prototype (PC + H5), restored from https://gogame-test.sldaops.com/. It is **not** 萌宠乐园, **not** 抽奖后台, **not** 管理后台.

**需求文档规范：** 按 [`docs/产品文档规范要求.md`](./docs/产品文档规范要求.md) 六段结构编写。

- C-end visual: Juan365 **light** (white / light gray + orange `#f26839` / `#fa9d1a` Deposit / Sign Up).
- Shared state: `localStorage` key `juan365_frontend_v1` in `c-end/js/store.js`. H5 reads the same store.
- Demo member stays `wjfytn329022` across pages. Do not write `会员账户 A`.
- Push to GitHub **only** when the user says **定稿**.

| Page | Path |
|------|------|
| PC SPA | `c-end/index.html#/home` |
| H5 SPA | `h5/index.html#/home` |

Bottom **预览** bar: 未登录 / 已登录 / 合规弹窗 / 掉线 Alert / 骨架屏.
