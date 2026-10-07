━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 项目：HPCS-550 高精度光谱分析仪智能探头
 英文名：HPCS-550 Smart Spectrometer Probe
 本文件夹：public/projects/hpcs-550-probe/
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

把照片按下面的名字放进本文件夹（jpg 格式）：

  photo-1.jpg   实物整机/样机成品 (Hardware Prototype)
  photo-2.jpg   原理图 / PCB Layout (Altium Designer)
  photo-3.jpg   示波器 / 逻辑分析仪实测波形 (Waveform)
  photo-4.jpg   上位机 / 屏显 UI (Qt / LVGL Interface)

说明：
- 网站构建时自动检测文件是否存在：有图自动展示并可全屏放大，没图显示骨架占位
- photo-1.jpg 存在时会自动成为项目卡片封面
- 图注文字在 lib/projects.ts 本项目 artifacts[].caption 里修改
- 修改/放图后需要 push 触发 Vercel 重新部署才会生效
