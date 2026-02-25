import React, { useState, useEffect } from 'react';
import { X, Save, Activity, Moon, Clock, BedDouble, Brain, PenTool, CheckCircle2, Calendar, Upload, Play, Pause, RotateCcw, ChevronRight, Music } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, Dot } from 'recharts';
import { LangKey } from '../App';

interface Props {
  onClose: () => void;
  lang: LangKey;
}

type SleepField = 'bedtime' | 'waketime' | 'quality' | 'dreams';
type TabType = 'record' | 'goal' | 'stats' | 'alarm' | 'aid';

const SleepModule: React.FC<Props> = ({ onClose, lang }) => {
  const [activeTab, setActiveTab] = useState<TabType>('record');
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [isSaving, setIsSaving] = useState(false);
  const [hasDataDays, setHasDataDays] = useState<number[]>([]);
  const [records, setRecords] = useState<Record<SleepField, string>>({
    bedtime: '',
    waketime: '',
    quality: '',
    dreams: ''
  });

  // Goal State
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [bedtimeHours, setBedtimeHours] = useState(22);
  const [waketimeHours, setWaketimeHours] = useState(6);
  const [isDragging, setIsDragging] = useState<'bed' | 'wake' | null>(null);
  const dialRef = React.useRef<HTMLDivElement>(null);

  // Alarm State
  const [reminder, setReminder] = useState('21:30');

  // Aid State
  const [isPlaying, setIsPlaying] = useState(false);

  const [wakePhase, setWakePhase] = useState('15');

  const wakePhases = [
    { label: lang === 'zh' ? '10分钟' : '10 mins', value: '10', activity: lang === 'zh' ? '建议：在床上做简单的伸展，深呼吸。' : 'Suggestion: Simple stretching in bed, deep breathing.' },
    { label: lang === 'zh' ? '15分钟' : '15 mins', value: '15', activity: lang === 'zh' ? '建议：喝一杯温水，拉开窗帘感受自然光。' : 'Suggestion: Drink warm water, open curtains for natural light.' },
    { label: lang === 'zh' ? '20分钟' : '20 mins', value: '20', activity: lang === 'zh' ? '建议：进行短时间的晨间瑜伽或冥想。' : 'Suggestion: Short morning yoga or meditation.' },
    { label: lang === 'zh' ? '30分钟' : '30 mins', value: '30', activity: lang === 'zh' ? '建议：洗漱，准备并享用健康的早餐。' : 'Suggestion: Wash up, prepare and enjoy a healthy breakfast.' },
  ];

  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  useEffect(() => {
    const saved = localStorage.getItem(`guan_qi_sleep_day_${selectedDay}`);
    if (saved) {
      setRecords(JSON.parse(saved));
    } else {
      setRecords({ bedtime: '', waketime: '', quality: '', dreams: '' });
    }
    
    const recorded = days.filter(d => localStorage.getItem(`guan_qi_sleep_day_${d}`));
    setHasDataDays(recorded);
  }, [selectedDay]);

  const handleSave = () => {
    setIsSaving(true);
    localStorage.setItem(`guan_qi_sleep_day_${selectedDay}`, JSON.stringify(records));
    setTimeout(() => {
      setIsSaving(false);
      setHasDataDays(prev => Array.from(new Set([...prev, selectedDay])));
    }, 1200);
  };

  const formatHours = (h: number) => {
    const hrs = Math.floor(h);
    const mins = Math.round((h - hrs) * 60);
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const calculateTimeFromEvent = (clientX: number, clientY: number) => {
    if (!dialRef.current) return 0;
    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = clientX - centerX;
    const y = clientY - centerY;
    let angle = Math.atan2(y, x) * (180 / Math.PI);
    angle = angle + 90;
    if (angle < 0) angle += 360;
    
    let hours = (angle / 360) * 24;
    hours = Math.round(hours * 4) / 4; // snap to 15 mins
    if (hours === 24) hours = 0;
    return hours;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const hours = calculateTimeFromEvent(e.clientX, e.clientY);
    if (isDragging === 'bed') {
      setBedtimeHours(hours);
    } else {
      setWaketimeHours(hours);
    }
  };

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    if (startAngle === endAngle) return "";
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    let largeArcFlag = "0";
    let diff = endAngle - startAngle;
    if (diff < 0) diff += 360;
    if (diff > 180) largeArcFlag = "1";

    return [
        "M", start.x, start.y, 
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
  };

  const toggleDay = (index: number) => {
    if (selectedDays.includes(index)) {
      setSelectedDays(selectedDays.filter(d => d !== index));
    } else {
      setSelectedDays([...selectedDays, index].sort());
    }
  };

  const sleepFields = [
    { id: 'bedtime', label: lang === 'zh' ? '入睡时间' : 'Bedtime', en: 'Time to Sleep', icon: Moon },
    { id: 'waketime', label: lang === 'zh' ? '醒来时间' : 'Wake Time', en: 'Time to Wake', icon: Clock },
    { id: 'quality', label: lang === 'zh' ? '睡眠质量' : 'Quality', en: 'Restfulness', icon: BedDouble },
    { id: 'dreams', label: lang === 'zh' ? '梦境记录' : 'Dreams', en: 'Dreamscape', icon: Brain },
  ];

  const bedtimeData = [
    { day: '三\n2/18', time: 22.2 },
    { day: '四\n2/19', time: 22.8 },
    { day: '五\n2/20', time: 24.4 },
    { day: '六\n2/21', time: 25.8 },
    { day: '日\n2/22', time: 22.6 },
    { day: '一\n2/23', time: 22.2 },
    { day: '二\n2/24', time: 22.4 },
  ];

  const waketimeData = [
    { day: '三\n2/18', time: 4.8 },
    { day: '四\n2/19', time: 4.9 },
    { day: '五\n2/20', time: 5.5 },
    { day: '六\n2/21', time: 5.6 },
    { day: '日\n2/22', time: 4.1 },
    { day: '一\n2/23', time: 4.5 },
    { day: '二\n2/24', time: 5.8 },
  ];

  const formatTimeAxis = (val: number) => {
    if (val >= 24) {
      const h = Math.floor(val - 24);
      const m = Math.round((val - 24 - h) * 60);
      return `0${h}:${m === 0 ? '00' : m}`;
    }
    const h = Math.floor(val);
    const m = Math.round((val - h) * 60);
    return `${h}:${m === 0 ? '00' : m}`;
  };

  const reminders = [
    { label: '22:00 - 就寝时', value: '22:00', activity: '建议：直接入睡，保持卧室黑暗安静。' },
    { label: '21:45 - 15分钟前', value: '21:45', activity: '建议：简单洗漱，进行3分钟深呼吸。' },
    { label: '21:30 - 30分钟前', value: '21:30', activity: '建议：睡前冥想，听轻柔的助眠音乐。' },
    { label: '21:15 - 45分钟前', value: '21:15', activity: '建议：温水泡脚，放松腿部肌肉。' },
    { label: '21:00 - 1小时前', value: '21:00', activity: '建议：放下手机，阅读纸质书籍。' },
    { label: '无提醒', value: 'none', activity: '自由安排睡前时间。' },
  ];

  const renderRecord = () => (
    <div className="flex-1 px-6 py-6 space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
      {/* 微缩智能日历选择器 */}
      <section className="glass-card p-8 shadow-xl space-y-8 bg-indigo-500/5 border-none">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="h-14 border-l-4 border-indigo-400 pl-6 flex flex-col justify-center">
               <h1 className="text-5xl font-light tabular-nums tracking-tighter leading-none">
                 {selectedDay < 10 ? `0${selectedDay}` : selectedDay}
               </h1>
               <span className="text-[9px] font-black opacity-30 uppercase tracking-[0.4em] mt-2">Selected Node</span>
            </div>
          </div>
          
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-3 px-8 h-14 bg-[var(--text-main)] text-[var(--color-bg)] rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-2xl disabled:opacity-50"
          >
            {isSaving ? <Activity size={16} className="animate-spin" /> : <Save size={16} />}
            <span>{isSaving ? 'Synchronizing' : 'Seal Entry'}</span>
          </button>
        </div>

        {/* 10x3 网格 - 空间优化 */}
        <div className="grid grid-cols-10 gap-2.5">
          {days.map(d => {
            const isSelected = selectedDay === d;
            const hasData = hasDataDays.includes(d);
            return (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                className={`group relative aspect-square flex items-center justify-center rounded-xl text-[10px] font-bold transition-all duration-500 ${
                  isSelected 
                  ? 'bg-[var(--text-main)] text-[var(--color-bg)] scale-110 z-10 shadow-xl' 
                  : 'bg-white/5 opacity-40 hover:opacity-100 hover:bg-white/10'
                }`}
              >
                {d}
                {hasData && !isSelected && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-indigo-400"></div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* 睡眠记录区域 */}
      <div className="space-y-8">
        <div className="flex items-center justify-between px-2">
           <div className="flex items-center gap-3 opacity-30">
              <PenTool size={14} />
              <span className="text-[10px] font-black uppercase tracking-[0.6em]">Sleep Flow</span>
           </div>
           <span className="text-[9px] font-bold opacity-15 uppercase tracking-widest italic">Rest & Restore</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sleepFields.map(field => (
            <div key={field.id} className="glass-card p-8 flex flex-col bg-[var(--card-inner)] shadow-inner group transition-all min-h-[180px] border-none">
               <div className="flex justify-between items-start mb-5">
                 <div className="space-y-1">
                   <h5 className="text-xs font-bold uppercase tracking-widest">{field.label}</h5>
                   <p className="text-[8px] opacity-30 uppercase tracking-[0.2em]">{field.en}</p>
                 </div>
                 {records[field.id as SleepField].length > 0 && <CheckCircle2 size={12} className="text-indigo-400 opacity-50" />}
               </div>
               <textarea 
                 className="w-full flex-1 bg-transparent outline-none text-sm font-light resize-none placeholder-[var(--text-main)]/10 leading-relaxed" 
                 placeholder="Tap to record..."
                 value={records[field.id as SleepField]}
                 onChange={e => setRecords({...records, [field.id as SleepField]: e.target.value})}
               />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderGoal = () => {
    let duration = waketimeHours - bedtimeHours;
    if (duration < 0) duration += 24;
    const bedAngle = (bedtimeHours / 24) * 360;
    const wakeAngle = (waketimeHours / 24) * 360;
    const isOverLimit = duration > 10;
    const accentColor = isOverLimit ? '#f43f5e' : '#A7D8D8';

    return (
      <div className="flex-1 px-6 py-6 space-y-10 animate-in slide-in-from-right-8 duration-300 pb-20">
        <div className="space-y-6">
          <h3 className="text-xl font-bold">{lang === 'zh' ? '选择日期' : 'Select Days'}</h3>
          <div className="flex justify-between">
            {weekDays.map((day, i) => (
              <button
                key={i}
                onClick={() => toggleDay(i)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  selectedDays.includes(i) 
                    ? 'bg-[#A7D8D8] text-black' 
                    : 'bg-[var(--glass-fill)] opacity-50'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3 opacity-30">
            <Moon size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.6em]">Sleep Flow</span>
          </div>
          <h3 className="text-xl font-bold">{lang === 'zh' ? '选择时段' : 'Select Time'}</h3>
          
          <div className="flex justify-between items-center px-4">
            <div className="text-left">
              <div className="flex items-center gap-2 mb-1">
                <Moon size={16} />
                <span className={`text-2xl font-bold ${isOverLimit ? 'text-rose-500' : ''}`}>{formatHours(bedtimeHours)}</span>
              </div>
              <div className="text-xs opacity-50">{lang === 'zh' ? '就寝时间' : 'Bedtime'}</div>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end gap-2 mb-1">
                <Clock size={16} />
                <span className={`text-2xl font-bold ${isOverLimit ? 'text-rose-500' : ''}`}>{formatHours(waketimeHours)}</span>
              </div>
              <div className="text-xs opacity-50">{lang === 'zh' ? '唤醒时间' : 'Wake up'}</div>
            </div>
          </div>

          <div 
            ref={dialRef}
            className="relative w-full aspect-square max-w-[320px] mx-auto mt-8 touch-none select-none"
            onPointerMove={handlePointerMove}
            onPointerUp={() => setIsDragging(null)}
            onPointerLeave={() => setIsDragging(null)}
          >
            <svg viewBox="0 0 320 320" className="w-full h-full overflow-visible">
              {/* Background track */}
              <circle cx="160" cy="160" r="120" fill="none" stroke="#2A2A2A" strokeWidth="40" />
              
              {/* Active track */}
              <path 
                d={describeArc(160, 160, 120, bedAngle, wakeAngle)} 
                fill="none" 
                stroke={accentColor} 
                strokeWidth="40" 
                strokeLinecap="round" 
              />

              {/* Inner markers */}
              {[0, 3, 6, 9, 12, 15, 18, 21].map(hour => {
                const pos = polarToCartesian(160, 160, 80, (hour / 24) * 360);
                return (
                  <text key={hour} x={pos.x} y={pos.y} fill="#666" fontSize="12" textAnchor="middle" dominantBaseline="middle">
                    {hour}
                  </text>
                );
              })}

              {/* Bedtime Handle */}
              <g 
                transform={`translate(${polarToCartesian(160, 160, 120, bedAngle).x}, ${polarToCartesian(160, 160, 120, bedAngle).y})`}
                onPointerDown={(e) => { e.stopPropagation(); setIsDragging('bed'); }}
                className="cursor-pointer"
              >
                <circle cx="0" cy="0" r="16" fill="#2A2A2A" />
                <circle cx="0" cy="0" r="12" fill="none" stroke={accentColor} strokeWidth="2" />
                <path d="M-3,-4 A6,6 0 1,0 3,-4 A4,4 0 1,1 -3,-4" fill={accentColor} transform="scale(0.8) translate(0, 1)" />
              </g>

              {/* Waketime Handle */}
              <g 
                transform={`translate(${polarToCartesian(160, 160, 120, wakeAngle).x}, ${polarToCartesian(160, 160, 120, wakeAngle).y})`}
                onPointerDown={(e) => { e.stopPropagation(); setIsDragging('wake'); }}
                className="cursor-pointer"
              >
                <circle cx="0" cy="0" r="16" fill={accentColor} />
                <circle cx="0" cy="0" r="12" fill="none" stroke="#2A2A2A" strokeWidth="2" />
                <circle cx="0" cy="0" r="6" fill="none" stroke="#2A2A2A" strokeWidth="1.5" />
                <polyline points="0,-3 0,0 2,2" fill="none" stroke="#2A2A2A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M-4,-5 L-2,-7 M4,-5 L2,-7" stroke="#2A2A2A" strokeWidth="1.5" strokeLinecap="round" />
              </g>
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className={`text-5xl font-light tracking-tighter ${isOverLimit ? 'text-rose-500' : ''}`}>{Math.floor(duration)}<span className="text-2xl">小时</span>{Math.round((duration % 1) * 60) > 0 ? `${Math.round((duration % 1) * 60)}分` : ''}</div>
              <div className="text-xs opacity-50 uppercase tracking-widest mt-2">{lang === 'zh' ? '新的睡眠目标' : 'New Sleep Goal'}</div>
              {isOverLimit && <div className="text-[10px] text-rose-500 font-bold mt-1 animate-pulse">{lang === 'zh' ? '建议睡眠不超过10小时' : 'Sleep > 10h not recommended'}</div>}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStats = () => (
    <div className="flex-1 px-6 py-6 space-y-8 animate-in slide-in-from-right-8 duration-300 pb-20">
      <div className="glass-card p-6 bg-[var(--card-inner)] rounded-3xl border-none">
        <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-4 mb-4">
          <div className="flex items-end gap-2">
            <h2 className="text-3xl font-light">{lang === 'zh' ? '星期二' : 'Tuesday'}</h2>
            <span className="text-xs opacity-50 pb-1">2月24日-25</span>
          </div>
          <Calendar size={20} className="opacity-50" />
        </div>
        
        <div className="flex justify-between mb-6">
          {weekDays.map((day, i) => (
            <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] ${i === 2 ? 'bg-[var(--accent)]/20 text-[var(--text-main)]' : 'opacity-30'}`}>
              {day}
            </div>
          ))}
          <div className="w-8 h-8 rounded-full flex items-center justify-center opacity-30">
            <Upload size={14} />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="48" cy="48" r="40" fill="none" stroke="var(--border-color)" strokeWidth="8" />
              <circle cx="48" cy="48" r="40" fill="none" stroke="#E88C68" strokeWidth="8" strokeDasharray="251" strokeDashoffset="57" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold">77<span className="text-xs">%</span></span>
              <span className="text-[8px] opacity-50">质量 &gt;</span>
            </div>
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-lg font-bold">7小时 16分钟</div>
                <div className="text-xs opacity-50">上床了 &gt;</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                <Upload size={14} className="opacity-50" />
              </div>
            </div>
            <div className="h-[1px] w-full bg-[var(--border-color)]"></div>
            <div>
              <div className="text-lg font-bold">6小时 44分钟</div>
              <div className="text-xs opacity-50">睡眠 &gt;</div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm opacity-50">{lang === 'zh' ? '上床睡觉 (演示数据)' : 'Bedtime (Demo)'}</h3>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={bedtimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-main)', opacity: 0.5 }} />
              <YAxis domain={[21, 26]} tickFormatter={formatTimeAxis} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-main)', opacity: 0.5 }} width={40} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--color-bg)', border: 'none', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', color: 'var(--text-main)' }}
                itemStyle={{ color: 'var(--text-main)' }}
                formatter={(value: number) => [formatTimeAxis(value), 'Time']}
              />
              <Line type="monotone" dataKey="time" stroke="#E88C68" strokeWidth={2} dot={{ fill: '#E88C68', strokeWidth: 2, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm opacity-50">{lang === 'zh' ? '醒来 (演示数据)' : 'Wake Time (Demo)'}</h3>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={waketimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-main)', opacity: 0.5 }} />
              <YAxis domain={[3, 8]} tickFormatter={formatTimeAxis} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-main)', opacity: 0.5 }} width={40} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--color-bg)', border: 'none', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', color: 'var(--text-main)' }}
                itemStyle={{ color: 'var(--text-main)' }}
                formatter={(value: number) => [formatTimeAxis(value), 'Time']}
              />
              <Line type="monotone" dataKey="time" stroke="#A7D8D8" strokeWidth={2} dot={{ fill: '#A7D8D8', strokeWidth: 2, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderAlarm = () => (
    <div className="flex-1 px-6 py-6 space-y-8 animate-in slide-in-from-right-8 duration-300 pb-20">
      <div className="space-y-4">
        <h3 className="text-xl font-bold">{lang === 'zh' ? '就寝时间提醒' : 'Bedtime Reminder'}</h3>
        <div className="space-y-4">
          {reminders.map((r, i) => (
            <div key={i} className="flex flex-col gap-2">
              <button 
                onClick={() => setReminder(r.value)}
                className="w-full flex items-center gap-4 transition-colors"
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${reminder === r.value ? 'bg-[var(--text-main)]' : 'bg-[var(--text-main)]/10'}`}>
                  {reminder === r.value && <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>}
                </div>
                <span className={`font-medium ${reminder === r.value ? 'text-[var(--text-main)]' : 'text-[var(--text-main)]/70'}`}>{r.label}</span>
              </button>
              {reminder === r.value && r.value !== 'none' && (
                <div className="ml-9 text-xs opacity-60 bg-[var(--glass-fill)] p-3 rounded-xl border-none animate-in slide-in-from-top-2">
                  {r.activity}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-[var(--border-color)]">
        <h3 className="text-xl font-bold">{lang === 'zh' ? '唤醒阶段设置' : 'Wake-up Phase'}</h3>
        <div className="space-y-4">
          {wakePhases.map((w, i) => (
            <div key={i} className="flex flex-col gap-2">
              <button 
                onClick={() => setWakePhase(w.value)}
                className="w-full flex items-center gap-4 transition-colors"
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${wakePhase === w.value ? 'bg-[var(--text-main)]' : 'bg-[var(--text-main)]/10'}`}>
                  {wakePhase === w.value && <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>}
                </div>
                <span className={`font-medium ${wakePhase === w.value ? 'text-[var(--text-main)]' : 'text-[var(--text-main)]/70'}`}>{w.label}</span>
              </button>
              {wakePhase === w.value && (
                <div className="ml-9 text-xs opacity-60 bg-[var(--glass-fill)] p-3 rounded-xl border-none animate-in slide-in-from-top-2">
                  {w.activity}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAid = () => (
    <div className="flex-1 px-6 py-6 space-y-8 animate-in slide-in-from-right-8 duration-300 pb-20">
      <div className="p-12 glass-panel rounded-[3rem] flex flex-col items-center gap-12 bg-indigo-500/5 border-none shadow-2xl relative overflow-hidden">
        {/* Background diffusing rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <div className={`absolute w-[200px] h-[200px] border border-indigo-500/30 rounded-full ${isPlaying ? 'animate-[ping_3s_linear_infinite]' : ''}`}></div>
          <div className={`absolute w-[280px] h-[280px] border border-indigo-500/20 rounded-full ${isPlaying ? 'animate-[ping_4s_linear_infinite_1s]' : ''}`}></div>
          <div className={`absolute w-[360px] h-[360px] border border-indigo-500/10 rounded-full ${isPlaying ? 'animate-[ping_5s_linear_infinite_2s]' : ''}`}></div>
        </div>

        <div className={`w-48 h-48 rounded-full bg-indigo-500/10 flex items-center justify-center shadow-[0_0_60px_rgba(99,102,241,0.2)] relative z-10 transition-transform duration-[10s] linear ${isPlaying ? 'animate-[spin_20s_linear_infinite]' : ''}`}>
          <img 
            src="https://picsum.photos/seed/sleep/400/400" 
            alt="Album Art" 
            className="w-full h-full rounded-full object-cover opacity-80 border-4 border-indigo-500/20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500/20 to-transparent pointer-events-none"></div>
        </div>

        <div className="text-center space-y-3 relative z-10">
          <div className="text-2xl font-bold tracking-tight">{lang === 'zh' ? '星空之梦' : 'Starry Dreams'}</div>
          <div className="text-xs opacity-40 uppercase tracking-[0.3em] font-black">{lang === 'zh' ? '深度睡眠辅助' : 'Deep Sleep Aid'}</div>
        </div>

        <div className="flex items-center gap-10 w-full justify-center relative z-10">
          <button className="p-3 opacity-30 hover:opacity-100 transition-opacity active:scale-90"><RotateCcw size={22} /></button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-20 h-20 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all"
          >
            {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
          </button>
          <button className="p-3 opacity-30 hover:opacity-100 transition-opacity active:scale-90"><ChevronRight size={22} /></button>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="text-[10px] font-black opacity-30 uppercase tracking-[0.4em] px-2">Healing Playlist</div>
        {[
          { title: lang === 'zh' ? '星空之梦' : 'Starry Dreams', time: '45:00' },
          { title: lang === 'zh' ? '林间细语' : 'Forest Whispers', time: '30:00' },
          { title: lang === 'zh' ? '深海潮汐' : 'Deep Sea Tides', time: '60:00' }
        ].map((track, i) => (
          <div key={i} className="flex items-center justify-between p-5 glass-panel rounded-2xl hover:bg-[var(--accent)]/5 cursor-pointer border-none group transition-all">
            <div className="flex items-center gap-5">
              <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/5 flex items-center justify-center text-[10px] font-black opacity-40 group-hover:bg-[var(--accent)] group-hover:text-black transition-all">{i + 1}</div>
              <span className="text-sm font-bold opacity-80">{track.title}</span>
            </div>
            <span className="text-[10px] font-black opacity-20">{track.time}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[300] bg-[var(--color-bg)] text-[var(--text-main)] flex flex-col animate-in slide-in-from-bottom-full duration-500 overflow-y-auto no-scrollbar">
      {/* Header */}
      <header className="flex flex-col gap-4 p-4 shrink-0 sticky top-0 bg-[var(--color-bg)]/80 backdrop-blur-md z-50 border-none">
        <div className="flex items-center justify-between">
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--glass-fill)] border-none">
            <X size={20} />
          </button>
          <h2 className="text-lg font-bold tracking-widest uppercase">{lang === 'zh' ? '睡眠中心' : 'Sleep Center'}</h2>
          <div className="w-10 h-10" />
        </div>
        
        <div className="flex bg-[var(--glass-fill)] rounded-full p-1 border-none overflow-x-auto no-scrollbar mx-auto w-full max-w-sm">
          {['record', 'goal', 'stats', 'alarm', 'aid'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as TabType)}
              className={`flex-1 px-3 py-2 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${activeTab === tab ? 'bg-[var(--text-main)] text-[var(--color-bg)] shadow-md' : 'opacity-50 hover:opacity-100'}`}
            >
              {lang === 'zh' ? { record: '记录', goal: '目标', stats: '统计', alarm: '闹钟', aid: '辅助' }[tab] : { record: 'Record', goal: 'Goal', stats: 'Stats', alarm: 'Alarm', aid: 'Aid' }[tab]}
            </button>
          ))}
        </div>
      </header>

      {activeTab === 'record' && renderRecord()}
      {activeTab === 'goal' && renderGoal()}
      {activeTab === 'stats' && renderStats()}
      {activeTab === 'alarm' && renderAlarm()}
      {activeTab === 'aid' && renderAid()}
    </div>
  );
};

export default SleepModule;
