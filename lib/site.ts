/**
 * 站点全局配置（唯一数据源）
 * 姓名、职位、联系方式、社交链接、导航选项卡都在这里维护。
 * 新增页面选项卡：在 navPages 数组加一项，再在 app/ 下新建对应 page.tsx 即可。
 */

export const site = {
  /** 中文名（全站统一用字） */
  nameZh: "蒋泽华",
  /** 拼音名（用于英文标题 / SEO） */
  nameEn: "Jiang Zehua",
  /** 求职定位 */
  role: "嵌入式软件工程师（MCU 方向）",
  /** 一句话定位 */
  tagline: "从原理图、底层驱动、FPGA 逻辑到 LVGL/Qt 界面的全链路交付能力",
  /** 现居 */
  location: "浙江 · 杭州",
  /** 求职状态（导航栏状态灯文案） */
  status: "在职看机会 · Open to opportunities",
  /** 联系方式 */
  email: "909969231@qq.com",
  phone: "19294554827",
  /** 域名（SEO / canonical 用） */
  url: "https://zehuajiang.com",
} as const;

/** 导航选项卡注册表：顺序即展示顺序 */
export const navPages = [
  { href: "/", label: "首页", en: "Home" },
  { href: "/projects", label: "项目", en: "Projects" },
  { href: "/agents", label: "智能体", en: "Agents" },
  { href: "/resume", label: "简历", en: "Resume" },
  { href: "/about", label: "关于", en: "About" },
] as const;
