
import React, { useState, useEffect } from 'react';
import { Trophy, Heart, MessageCircle, Send, User, TreePine, Flame, Mountain, Shield, Droplets, MessageSquare, Sparkles, X, Info, FileText, Activity } from 'lucide-react';
import { LangKey } from '../App';
import { TabType } from '../types';

interface Message { 
    id: string; 
    author: string; 
    role: string; 
    content: string; 
    likes: number; 
    comments: number; 
    time: string; 
    avatar?: string;
    hasReport?: boolean;
}

interface Props { 
    lang: LangKey; 
    onNavigate?: (tab: TabType, sub?: string) => void;
}

const Community: React.FC<Props> = ({ lang, onNavigate }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [showRules, setShowRules] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  useEffect(() => {
    setMessages([
      { id: '1', author: '李长庚', role: '金行修者', content: '今日练习八段锦，感觉到膻中穴有一股热气流过。', likes: 24, comments: 5, time: '10:15', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200' },
      { id: '2', author: '沐晚晴', role: '木行修者', content: '刚完成了体质测评，结果很有意思，分享给大家看看。', likes: 18, comments: 2, time: '10:32', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200', hasReport: true },
    ]);
  }, []);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const msg: Message = { id: Date.now().toString(), author: '我', role: '观气学徒', content: inputText, likes: 0, comments: 0, time: '刚刚' };
    setMessages([msg, ...messages]);
    setInputText('');
  };

  // Unified color for all icons as requested
  const ICON_COLOR = "var(--accent)";

  const pavilions = [
    { id: 'wood', label: '木灵', icon: TreePine },
    { id: 'fire', label: '炎曦', icon: Flame },
    { id: 'earth', label: '厚德', icon: Mountain },
    { id: 'metal', label: '金声', icon: Shield },
    { id: 'water', label: '沉影', icon: Droplets },
  ];

  return (
    <div className="flex flex-col h-full animate-zen relative">
      <div className="flex-1 overflow-y-auto no-scrollbar p-8 pt-24 pb-40 space-y-12">
        <h2 className="text-4xl font-normal tracking-tighter px-2 reveal-gradient-text">修身广场</h2>

        {/* 专题系列 */}
        <section className="space-y-5 px-2">
           <h3 className="text-[9px] font-black opacity-40 uppercase tracking-[0.5em] text-[var(--accent)]">专题系列</h3>
           
           <div className="flex overflow-x-auto no-scrollbar gap-4 pb-4">
             {/* 挑战赛 */}
             <div className="min-w-[280px] glass-card p-8 bg-gradient-to-br from-[var(--accent)]/10 to-transparent relative overflow-hidden border-[var(--border-color)] group hover:scale-[1.01] transition-transform shrink-0">
                <div className="relative z-10 space-y-4">
                   <Trophy size={24} className="text-[var(--accent)]" />
                   <h4 className="text-xl font-bold">百日筑基挑战赛</h4>
                   <button onClick={() => setShowRules(true)} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest bg-[var(--text-main)] text-[var(--color-bg)] px-6 py-2.5 rounded-full hover:shadow-lg transition-all">
                      进入专题交流 <MessageCircle size={12}/>
                   </button>
                </div>
                <Sparkles className="absolute -right-6 -bottom-6 text-[var(--accent)] opacity-20 w-48 h-48 animate-pulse" />
             </div>

             {/* 21天习惯养成计划 */}
             <div className="min-w-[280px] glass-card p-8 bg-gradient-to-br from-emerald-500/10 to-transparent relative overflow-hidden border-[var(--border-color)] group hover:scale-[1.01] transition-transform shrink-0">
                <div className="relative z-10 space-y-4">
                   <Activity size={24} className="text-emerald-400" />
                   <h4 className="text-xl font-bold">21天习惯养成计划</h4>
                   <button onClick={() => setActiveGroup('21天习惯养成')} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest bg-[var(--text-main)] text-[var(--color-bg)] px-6 py-2.5 rounded-full hover:shadow-lg transition-all">
                      进入专题交流 <MessageCircle size={12}/>
                   </button>
                </div>
                <TreePine className="absolute -right-6 -bottom-6 text-emerald-400 opacity-20 w-48 h-48" />
             </div>

             {/* 特殊症状专题 */}
             <div className="min-w-[280px] glass-card p-8 bg-gradient-to-br from-indigo-500/10 to-transparent relative overflow-hidden border-[var(--border-color)] group hover:scale-[1.01] transition-transform shrink-0">
                <div className="relative z-10 space-y-4">
                   <Heart size={24} className="text-indigo-400" />
                   <h4 className="text-xl font-bold">特殊症状专题</h4>
                   <p className="text-xs opacity-60">鼻炎 · 失眠 · 减肥</p>
                   <button onClick={() => setActiveGroup('特殊症状')} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest bg-[var(--text-main)] text-[var(--color-bg)] px-6 py-2.5 rounded-full hover:shadow-lg transition-all">
                      进入专题交流 <MessageCircle size={12}/>
                   </button>
                </div>
                <Droplets className="absolute -right-6 -bottom-6 text-indigo-400 opacity-20 w-48 h-48" />
             </div>
           </div>
        </section>

        {/* 五行小组 - 统一图标颜色 */}
        <section className="space-y-5 px-2">
           <h3 className="text-[9px] font-black opacity-40 uppercase tracking-[0.5em] text-[var(--accent)]">五行小组</h3>
           <div className="grid grid-cols-5 gap-4">
              {pavilions.map(p => (
                <button key={p.id} onClick={() => setActiveGroup(p.label)} className="flex flex-col items-center gap-3 transition-all active:scale-95 group">
                  <div className={`w-full aspect-square glass-card rounded-[1.8rem] flex items-center justify-center border-white/10 group-hover:bg-white/10 transition-colors shadow-lg shadow-black/10`}>
                     <p.icon size={20} color={ICON_COLOR} className="opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                  </div>
                  <span className="text-[8px] font-black uppercase opacity-60 group-hover:opacity-100 transition-opacity">{p.label}</span>
                </button>
              ))}
           </div>
        </section>

        {/* 实时讨论流 */}
        <section className="space-y-6">
           <div className="flex items-center gap-2 px-2 opacity-40">
              <MessageSquare size={14} className="text-[var(--accent)]"/>
              <h3 className="text-[9px] font-black uppercase tracking-[0.5em] text-[var(--accent)]">实时交流</h3>
           </div>
           
           {/* Chat Module Container */}
           <div className="glass-card p-1 border-[var(--border-color)] min-h-[400px] flex flex-col bg-white/[0.02]">
             {/* Messages Area */}
             <div className="flex-1 p-6 space-y-6">
               {messages.map(msg => (
                 <div key={msg.id} className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-colors">
                    <div className="flex items-center gap-4 mb-4">
                       <div className="w-10 h-10 glass-card rounded-full flex items-center justify-center overflow-hidden border-white/10">
                          {msg.avatar ? <img src={msg.avatar} className="w-full h-full object-cover" /> : <User size={18} />}
                       </div>
                       <div>
                         <h4 className="text-sm font-bold text-[var(--text-main)]">{msg.author}</h4>
                         <p className="text-[8px] font-bold opacity-40 uppercase tracking-wide">{msg.role} · {msg.time}</p>
                       </div>
                    </div>
                    <p className="text-sm leading-relaxed opacity-80 font-light pl-1">{msg.content}</p>
                    
                    {msg.hasReport && (
                      <div 
                          onClick={() => onNavigate?.('constitution', 'report')}
                          className="mt-4 p-4 rounded-2xl bg-[var(--accent)]/10 border border-[var(--accent)]/10 flex items-center gap-4 cursor-pointer hover:bg-[var(--accent)]/20 transition-colors group"
                      >
                          <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
                              <FileText size={20} />
                          </div>
                          <div className="flex-1">
                              <p className="text-xs font-bold text-[var(--text-main)]">先天禀赋辨识报告</p>
                              <p className="text-[9px] opacity-50 uppercase tracking-widest mt-0.5 group-hover:text-[var(--accent)] transition-colors">查看详情</p>
                          </div>
                      </div>
                    )}
                 </div>
               ))}
             </div>

             {/* Integrated Chat Input */}
             <div className="p-4 pt-2">
                <div className="glass-card p-1.5 rounded-full flex items-center gap-2 border-white/10 bg-black/20 shadow-inner">
                   <input 
                     type="text" value={inputText} onChange={e => setInputText(e.target.value)}
                     placeholder={activeGroup ? `在${activeGroup}小组发言...` : "分享修行感悟..."} 
                     className="flex-1 bg-transparent px-6 py-4 text-sm outline-none font-light placeholder:text-[var(--text-main)]/20 text-[var(--text-main)]" 
                   />
                   <button onClick={handleSend} className="p-4 bg-[var(--accent)] text-black rounded-full transition-all active:scale-90 hover:scale-105">
                      <Send size={18} strokeWidth={2.5} />
                   </button>
                </div>
             </div>
           </div>
        </section>
      </div>

      {/* 规则详情弹窗 */}
      {showRules && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-3xl flex items-center justify-center p-8 animate-in fade-in">
           <div className="glass-card w-full max-w-md p-10 space-y-8 animate-in zoom-in-95 border-white/10 shadow-2xl bg-[#1a1a2e]">
              <div className="flex justify-between items-center">
                 <h3 className="text-2xl font-normal tracking-tighter text-white">挑战规则</h3>
                 <button onClick={() => setShowRules(false)} className="p-2 glass-card !rounded-full hover:bg-white/10 transition-colors"><X size={18} className="text-white"/></button>
              </div>
              <ul className="space-y-4 text-sm opacity-70 leading-relaxed font-light text-gray-300">
                 <li>• 连续100天完成每日晨启、午养、晚收仪式。</li>
                 <li>• 每日元气值增长不少于50点。</li>
                 <li>• 每周至少产出一条深度觉察日记。</li>
                 <li>• 达成后将解锁“百日筑基”金质勋章及专属礼包。</li>
              </ul>
              <button onClick={() => setShowRules(false)} className="w-full py-5 bg-[var(--accent)] text-black rounded-full font-bold uppercase tracking-widest text-[10px] hover:shadow-lg transition-all">我已阅读</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default Community;
