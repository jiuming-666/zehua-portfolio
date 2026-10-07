# Zehua Jiang — Personal Portfolio & Engineering Hub

个人作品集与品牌门户网站：以实物原型、高清工程影像与研发数据为核心，展示硬件创新与全栈工程能力。

**线上地址**：[zehuajiang.com](https://zehuajiang.com)

## 技术栈

- [Next.js 15](https://nextjs.org/)（App Router / TypeScript）
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

## 本地开发

```bash
npm install
npm run dev     # 开发模式  http://localhost:3000
npm run build   # 生产构建
npm run start   # 运行生产版本
```

## 目录结构

```
app/                        # 路由（每个选项卡一个页面）
  page.tsx                  #   / 首页（Landing）
  projects/page.tsx         #   /projects 项目档案（含分类筛选）
  resume/page.tsx           #   /resume 在线简历
  about/page.tsx            #   /about 关于我（经历时间线+技能）
  layout.tsx                #   全局布局（Navbar/Footer 共享）
  sitemap.ts / robots.ts    #   SEO
components/
  layout/                   # Navbar / Footer（全局）
  common/                   # PageHeader / Reveal（通用件）
  home/                     # Hero / QuickNav
  projects/                 # ProjectsSection / DeepDiveModal / ArtifactsLightbox
  resume/                   # ResumeView
  about/                    # ExperienceTimeline / Skills / Philosophy
lib/
  site.ts                   # 站点唯一配置源（姓名/联系方式/导航注册表）
  projects.ts               # 项目数据（加项目 = 复制对象改文字）
  resume.ts                 # 简历结构化数据
  artifacts.ts              # 工程实拍构建时检测
public/
  projects/<id>/            # 工程实拍图（photo-1~4.jpg）
  resume.pdf                # 简历 PDF
```

## 特性

- 深色工业风 UI，Bento Grid 项目陈列，响应式布局（桌面 / 移动端）
- 项目 Deep Dive 弹窗：多角度实拍、研发过程、关键规格数据
- 滚动驱动微动效，平滑锚点导航
- 内置 SEO：metadata / Open Graph / sitemap / robots

## 联系

- 邮箱：909969231@qq.com
- 电话：19294554827（浙江 杭州）
- GitHub：[@jiuming-666](https://github.com/jiuming-666)
