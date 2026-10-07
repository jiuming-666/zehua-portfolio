/**
 * 工具箱数据注册表（与 lib/projects.ts 同一套范式）
 * 新增工具 = 加一个对象（available: true）+ 对应的计算器组件，目录自动更新。
 */

export type Tool = {
  id: string;
  name: string;
  en: string;
  desc: string;
  /** true = 可点击使用；false = 开发中占位 */
  available: boolean;
};

export const tools: Tool[] = [
  {
    id: "voltage-divider",
    name: "分压电阻计算器",
    en: "Voltage Divider",
    desc: "经典分压计算 & LDO 反馈电阻设计，支持 E24 标称值自动配对与误差分析",
    available: true,
  },
  {
    id: "adc-convert",
    name: "ADC 电压换算器",
    en: "ADC Converter",
    desc: "ADC 码值 ↔ 电压双向换算，分辨率与参考电压可调",
    available: true,
  },
  {
    id: "hex-ascii",
    name: "Hex / ASCII 互转工具",
    en: "Hex & ASCII Converter",
    desc: "文本与十六进制双向实时互转，支持转义字符、C 数组格式与字节统计",
    available: true,
  },
  {
    id: "float-hex",
    name: "IEEE-754 浮点转换器",
    en: "Float & Hex Converter",
    desc: "4 字节 HEX ↔ 单精度浮点互转，支持大小端序切换，串口与工业总线数据解析必备",
    available: true,
  },
];
