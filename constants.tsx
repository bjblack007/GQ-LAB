
import { LibraryItem, VitalityRecord, Medal, ReminderConfig } from './types';

export const MEDALS: Medal[] = [
  { id: 'm1', name: '晨曦初露', icon: 'Sun', unlocked: true, desc: '连续7天完成晨启仪式' },
  { id: 'm2', name: '经络行者', icon: 'Activity', unlocked: true, desc: '掌握3套以上功法' },
  { id: 'm3', name: '元气满满', icon: 'Zap', unlocked: false, desc: '元气值突破5000点' },
  { id: 'm4', name: '百日筑基', icon: 'Shield', unlocked: false, desc: '累计修行达到100天' },
];

export const DEFAULT_REMINDERS: ReminderConfig[] = [
  { id: 'ritual-1', label: '晨启仪式', time: '07:30', enabled: true, type: 'ritual' },
  { id: 'ritual-2', label: '午养仪式', time: '12:00', enabled: true, type: 'ritual' },
  { id: 'ritual-3', label: '晚收仪式', time: '21:30', enabled: true, type: 'ritual' },
  { id: 'break-1', label: '工间扩胸', time: '10:00', enabled: true, type: 'break' },
  { id: 'break-2', label: '极泉按揉', time: '11:00', enabled: true, type: 'break' },
  { id: 'break-3', label: '饮水润燥', time: '14:00', enabled: true, type: 'break' },
  { id: 'break-4', label: '眺望养目', time: '15:30', enabled: true, type: 'break' },
  { id: 'break-5', label: '转颈松肩', time: '17:00', enabled: true, type: 'break' },
];

export const VITALITY_LEVELS = [
  { min: 0, label: '养生萌新' },
  { min: 500, label: '养生新手' },
  { min: 2000, label: '元气学徒' },
  { min: 5000, label: '修身行者' },
  { min: 10000, label: '观气宗师' },
];

export const MOCK_VITALITY_HISTORY: VitalityRecord[] = [
  { id: 'v1', type: 'earn', title: '晨间仪式打卡', amount: 20, date: '01-15', category: 'daily', timestamp: Date.now() },
  { id: 'v2', type: 'earn', title: '完成八段锦', amount: 30, date: '01-15', category: 'exercise', timestamp: Date.now() },
  { id: 'v4', type: 'spend', title: '兑换养生茶包', amount: 200, date: '01-12', category: 'mall', timestamp: Date.now() },
];

export const CULTIVATION_LIBRARY: LibraryItem[] = [
  // 饮食调理
  { 
    id: 'diet-1', title: '体质食疗方案', desc: '根据您的体质定制的每日食谱。', category: 'diet', element: 'earth',
    content: ['早餐：小米山药粥', '午餐：清炒时蔬配糙米饭', '晚餐：茯苓芡实汤', '忌：生冷油腻'],
    meridians: ['脾经', '胃经'], acupoints: ['中脘', '足三里'], scheduledTime: '07:00 - 19:00'
  },
  { 
    id: 'diet-2', title: '节气饮食建议', desc: '顺应四时，因时而食。', category: 'diet', element: 'wood',
    content: ['春季多食辛甘发散之品', '夏季清淡祛暑', '秋季滋阴润燥', '冬季温补肾阳'],
    meridians: ['肝经', '肺经'], acupoints: ['太冲', '太渊'], scheduledTime: 'Seasonal'
  },
  { 
    id: 'diet-3', title: '办公室茶饮推荐', desc: '针对久坐办公人群的调理茶。', category: 'diet', element: 'fire',
    content: ['明目茶：枸杞+菊花', '理气茶：玫瑰+陈皮', '祛湿茶：赤小豆+芡实'],
    meridians: ['心经', '小肠经'], acupoints: ['内关', '神门'], scheduledTime: '10:00 - 16:00'
  },
  // 运动养生
  { 
    id: 'move-1', title: '职场八段锦', desc: '传统功法，调理全身气血。', category: 'kungfu', element: 'metal',
    content: ['双手托天理三焦', '左右开弓似射雕', '调理脾胃须单举', '五劳七伤往后瞧'],
    meridians: ['三焦经', '肺经'], acupoints: ['膻中', '合谷'], scheduledTime: '08:00 - 09:00'
  },
  { 
    id: 'move-2', title: '工间微运动方案', desc: '3分钟缓解颈肩腰椎压力。', category: 'kungfu', element: 'water',
    content: ['颈部米字操', '肩部环绕运动', '腰部侧向拉伸'],
    meridians: ['膀胱经', '胆经'], acupoints: ['风池', '肩井'], scheduledTime: '10:00 - 17:00'
  },
  { 
    id: 'move-3', title: '经络拍打操', desc: '通过拍打经络，疏通气血。', category: 'kungfu', element: 'fire',
    content: ['拍打心包经', '拍打胆经', '按揉足三里'],
    meridians: ['心包经', '胆经'], acupoints: ['内关', '环跳'], scheduledTime: '15:00 - 16:00'
  },
  // 作息调理
  { 
    id: 'routine-1', title: '个性化作息时间表', desc: '科学规划起居，顺应生物钟。', category: 'routine', element: 'earth',
    content: ['07:00 起床', '12:00 午休', '22:30 准备入睡'],
    meridians: ['大肠经', '心经'], acupoints: ['天枢', '神门'], scheduledTime: 'Daily'
  },
  { 
    id: 'routine-2', title: '子午流注养生提醒', desc: '根据经络运行时间进行养生。', category: 'routine', element: 'wood',
    content: ['子时（23-1点）胆经当令，宜熟睡', '午时（11-13点）心经当令，宜小憩'],
    meridians: ['胆经', '心经'], acupoints: ['环跳', '极泉'], scheduledTime: 'Hourly'
  },
  { 
    id: 'routine-3', title: '睡眠质量改善方案', desc: '助眠技巧，告别失眠。', category: 'routine', element: 'water',
    content: ['睡前温水泡脚', '按揉涌泉穴', '远离电子设备'],
    meridians: ['肾经', '心经'], acupoints: ['涌泉', '照海'], scheduledTime: '21:00 - 23:00'
  },
  // 情志调节
  { 
    id: 'emotion-1', title: '音乐疗愈', desc: '以乐代药，调理五脏情绪。', category: 'emotion', element: 'fire',
    content: ['角音入肝', '徵音入心', '宫音入脾', '商音入肺', '羽音入肾'],
    meridians: ['五脏经络'], acupoints: ['百会'], scheduledTime: 'Anytime'
  },
  { 
    id: 'emotion-2', title: '办公室冥想指导', desc: '快速静心，提升专注力。', category: 'emotion', element: 'metal',
    content: ['深呼吸练习', '正念观察', '身体扫描'],
    meridians: ['肺经', '心经'], acupoints: ['中府', '内关'], scheduledTime: '12:00 - 14:00'
  },
  { 
    id: 'emotion-3', title: '压力疏导方法', desc: '有效应对职场压力。', category: 'emotion', element: 'wood',
    content: ['腹式呼吸', '积极暗示', '适度运动'],
    meridians: ['肝经'], acupoints: ['期门'], scheduledTime: 'Anytime'
  }
];

export const SURVEY_SECTIONS = [
  {
    title: '健康症状',
    desc: '请勾选适用项',
    questions: [
      { id: 'q1', text: '颈部与肩部问题', type: 'multi', options: ['长期久坐，颈部僵硬', '肩膀酸痛，活动受限', '经常感觉头晕或耳鸣', '无明显不适'] },
      { id: 'q2', text: '腰背部问题', type: 'multi', options: ['腰酸背痛，长时间坐着加重', '站立或弯腰时疼痛加剧', '腿部麻木或放射性疼痛（如坐骨神经痛）', '无明显不适'] },
      { id: 'q3', text: '手腕与手臂问题', type: 'multi', options: ['长时间使用电脑后手腕酸痛', '感觉手指麻木或刺痛', '手臂无力，提重物时吃力', '无明显不适'] },
      { id: 'q4', text: '疲劳与精神状态', type: 'multi', options: ['经常感到疲劳，精力不足', '头晕、头痛，注意力不集中', '晚上失眠，白天嗜睡', '精神状态良好'] },
      { id: 'q5', text: '消化系统问题', type: 'multi', options: ['腹胀、嗳气或反酸', '饭后感觉沉重，消化不良', '便秘或腹泻', '消化系统正常'] }
    ]
  },
  {
    title: '生活习惯',
    desc: '日常行为习惯',
    questions: [
      { id: 'q6', text: '每天久坐时间（小时）', type: 'input', placeholder: '输入小时数（包括工作和通勤）' },
      { id: 'q7', text: '是否定期运动？', type: 'single', options: ['是', '否'] },
      { id: 'q7_1', text: '主要运动方式', type: 'single', options: ['散步', '瑜伽', '健身', '无/不运动', '其他'] },
      { id: 'q8', text: '饮水习惯', type: 'single', options: ['每天饮水不足8杯', '每天饮水8杯以上'] },
      { id: 'q9', text: '饮食偏好', type: 'single', options: ['偏爱高热量、高脂肪食物', '偏爱清淡饮食', '经常在外就餐'] },
      { id: 'q10', text: '睡眠质量', type: 'single', options: ['睡眠时间不足6小时', '睡眠时间6-8小时，但易醒', '睡眠充足且深度良好'] }
    ]
  },
  {
    title: '压力与情绪',
    desc: '心理健康状态',
    questions: [
      { id: 'q11', text: '感觉工作压力大的频率', type: 'single', options: ['经常感到压力大', '偶尔有压力', '基本没有压力'] },
      { id: 'q12', text: '处理压力的方式', type: 'multi', options: ['通过运动释放', '与朋友或家人倾诉', '通过加班解决工作问题', '其他'] },
      { id: 'q13', text: '情绪状态', type: 'single', options: ['经常感到焦虑、易怒', '偶尔情绪波动较大', '情绪稳定，心态平和'] }
    ]
  },
  {
    title: '健康目标',
    desc: '您的期望',
    questions: [
      { id: 'q14', text: '请勾选适用项', type: 'multi', options: ['改善颈椎与肩部不适', '缓解腰背部疼痛', '提升精神状态与精力', '改善消化系统健康', '降低工作压力与焦虑'] }
    ]
  }
];

export const SOLAR_TERMS = [
  { name: '立春', date: '02-04', season: '春' },
  { name: '雨水', date: '02-19', season: '春' },
  { name: '惊蛰', date: '03-05', season: '春' },
  { name: '春分', date: '03-20', season: '春' },
  { name: '清明', date: '04-04', season: '春' },
  { name: '谷雨', date: '04-19', season: '春' },
  { name: '立夏', date: '05-05', season: '夏' },
  { name: '小满', date: '05-21', season: '夏' },
  { name: '芒种', date: '06-05', season: '夏' },
  { name: '夏至', date: '06-21', season: '夏' },
  { name: '小暑', date: '07-07', season: '夏' },
  { name: '大暑', date: '07-22', season: '夏' },
  { name: '立秋', date: '08-07', season: '秋' },
  { name: '处暑', date: '08-23', season: '秋' },
  { name: '白露', date: '09-07', season: '秋' },
  { name: '秋分', date: '09-22', season: '秋' },
  { name: '寒露', date: '10-08', season: '秋' },
  { name: '霜降', date: '10-23', season: '秋' },
  { name: '立冬', date: '11-07', season: '冬' },
  { name: '小雪', date: '11-22', season: '冬' },
  { name: '大雪', date: '12-07', season: '冬' },
  { name: '冬至', date: '12-21', season: '冬' },
  { name: '小寒', date: '01-05', season: '冬' },
  { name: '大寒', date: '01-20', season: '冬' },
];

export const TREND_DATA = [
  { name: '1月', score: 65 },
  { name: '2月', score: 72 },
  { name: '3月', score: 78 },
  { name: '4月', score: 82 },
  { name: '5月', score: 85 },
  { name: '6月', score: 88 },
];
