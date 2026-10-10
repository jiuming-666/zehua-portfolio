━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 项目：光谱仪光色校准上位机
 英文名：Spectrometer Colorimetric Calibration Host App
 本文件夹：public/projects/spectrometer-host/
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

本项目共 4 个槽位，把 UI 截图按下面的名字放进本文件夹（jpg 格式）：

  photo-1.jpg   光谱测量页（实时曲线 + 色温/照度结果）——存在时自动作为项目卡片封面
  photo-2.jpg   频闪页
  photo-3.jpg   设备控制页
  photo-4.jpg   升级页

说明：
- 网站构建时自动检测文件是否存在：有图自动展示并可全屏放大，没图显示骨架占位
- 图注文字在 lib/projects.ts 本项目 artifacts[].caption 里修改
- 修改/放图后需要 push 触发 Vercel 重新部署才会生效
- ★ 注意：截图里不要带真实公司名、型号、序列号等敏感信息