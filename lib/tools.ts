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
    id: "baud-rate",
    name: "串口波特率计算器",
    en: "Baud Rate",
    desc: "STM32 USART BRR 寄存器值计算与波特率误差分析",
    available: false,
  },
  {
    id: "timer-pwm",
    name: "定时器 / PWM 计算器",
    en: "Timer & PWM",
    desc: "预分频与重装值 → 输出频率 / 占空比",
    available: false,
  },
  {
    id: "crc16",
    name: "CRC16-Modbus 计算器",
    en: "CRC Calculator",
    desc: "HEX 输入直接计算 CRC16，串口协议调试必备",
    available: false,
  },
  {
    id: "adc-convert",
    name: "ADC 电压换算器",
    en: "ADC Converter",
    desc: "ADC 码值 ↔ 电压双向换算，分辨率与参考电压可调",
    available: true,
  },
  {
    id: "rc-filter",
    name: "RC 滤波器计算器",
    en: "RC Filter",
    desc: "一阶 RC 低通截止频率 fc = 1/(2πRC)",
    available: false,
  },
];
