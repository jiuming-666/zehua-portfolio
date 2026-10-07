# Zehua Jiang — Personal Portfolio & Engineering Hub

个人作品集与品牌门户网站。React + Next.js (App Router) + Tailwind CSS + lucide-react。
线上地址：**https://zehuajiang.com**

## 本地运行

```bash
npm install
npm run dev    # http://localhost:3000
```

## 如何替换成你的真实内容（重要）

### 1. 项目照片与文案
所有项目数据集中在 **`lib/projects.ts`**：
- 把你的实物照片放进 `public/projects/<项目名>/`
- 把 `cover` / `images[].src` 改成 `/projects/<项目名>/xxx.jpg`（或你的图床 URL）
- 修改 `title / highlight / deepDive / specs / status / tags` 等字段
- `span: "wide" | "normal"` 控制该卡片在 Bento Grid 中占 2 列还是 1 列，可自由调整错落节奏

> 若使用 `images.unsplash.com` 以外的远程图床，请在 `next.config.mjs` 的
> `images.remotePatterns` 中加入对应域名。

### 2. 简历 PDF
导航栏和移动端菜单中的「完整简历 PDF」按钮指向 **`/resume.pdf`**。
把你的简历文件放到 `public/resume.pdf` 即可生效。

### 3. 联系方式与社交链接
编辑 **`components/Footer.tsx`**：替换邮箱 `hi@zehuajiang.com`，
以及 `socials` 数组中的 GitHub / Bilibili / 知乎 / LinkedIn 链接。

### 4. 技能矩阵
编辑 **`components/Skills.tsx`** 顶部的 `groups` 数组。

### 5. 绑定自定义域名 zehuajiang.com（部署时）

1. 把代码推到 GitHub，在 [vercel.com](https://vercel.com) 导入仓库，一路默认设置即可完成部署
2. Vercel 项目 → Settings → Domains → 添加 `zehuajiang.com`（建议同时加 `www.zehuajiang.com` 并 301 到裸域）
3. 到域名注册商的 DNS 管理台添加记录（Vercel 控制台会给出确切值）：
   - 裸域：`A` 记录，主机 `@`，值 `76.76.21.21`
   - www：`CNAME` 记录，主机 `www`，值 `cname.vercel-dns.com`
4. DNS 生效（几分钟到几小时）后 Vercel 自动签发 HTTPS 证书

> 域名相关的 SEO 配置（metadataBase / canonical / sitemap / robots）已在代码中
> 硬编码为 `https://zehuajiang.com`，部署后无需再改。若日后换域名，全局搜索
> `zehuajiang.com` 替换即可。

## 目录结构

```
app/            # 入口、布局、全局样式、sitemap/robots
components/     # Navbar / Hero / Projects / DeepDiveModal / Skills / Philosophy / Footer / Reveal
lib/            # projects.ts —— 项目数据（照片替换只需改这里）
public/         # 静态资源（resume.pdf、项目照片放这里）
CHANGELOG.md    # 更新日志（每次改动必须记录，见 AGENTS.md 规则）
AGENTS.md       # AI 协作规则
```
