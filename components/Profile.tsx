
import React, { useState, useEffect, useRef } from 'react';
import { 
  Award, LogOut, Clock, User, Palette, Languages, Activity, Sun, Zap, Bell, ChevronRight, X, TrendingUp, Shield, Settings, Camera, MessageSquare, PenTool, Share2, Upload, Trash2, Check, RefreshCw, Edit2
} from 'lucide-react';
import { ThemeKey, LangKey } from '../App';
import { TabType, Medal, ReminderConfig, CustomThemeConfig } from '../types';
import { VITALITY_LEVELS, MEDALS } from '../constants';

interface Props {
  user: any;
  onUpdateUser: (user: any) => void;
  onLogout: () => void;
  theme: ThemeKey;
  setTheme: (theme: ThemeKey) => void;
  lang: LangKey;
  setLang: (lang: LangKey) => void;
  onNavigate: (tab: TabType, sub?: string) => void;
  customTheme: CustomThemeConfig;
  onUpdateCustomTheme: (config: CustomThemeConfig) => void;
  reminders: ReminderConfig[];
  onUpdateReminders: (reminders: ReminderConfig[]) => void;
}

const DEFAULT_THEME_CONFIG: CustomThemeConfig = {
  bgColor: '#1a1a1a',
  accentColor: '#fdd95f',
  textColor: '#ffffff',
  glassColor: 'rgba(255, 255, 255, 0.1)',
  bgImage: null
};

const Profile: React.FC<Props> = ({ 
  user, onUpdateUser, onLogout, theme, setTheme, lang, setLang, onNavigate, 
  customTheme, onUpdateCustomTheme, reminders, onUpdateReminders 
}) => {
  const [points, setPoints] = useState(2480);
  const [showRemindersModal, setShowRemindersModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileFileInputRef = useRef<HTMLInputElement>(null);

  // Local state for editing to prevent constant re-renders
  const [editingReminders, setEditingReminders] = useState<ReminderConfig[]>([]);
  const [editingTheme, setEditingTheme] = useState<CustomThemeConfig>(customTheme);
  const [editingProfile, setEditingProfile] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    avatar: user?.avatar || ''
  });

  useEffect(() => {
    const savedPoints = localStorage.getItem('guan_qi_points');
    if (savedPoints) setPoints(parseInt(savedPoints));
  }, []);

  useEffect(() => {
    if (showEditProfileModal) {
      setEditingProfile({
        name: user?.name || '',
        bio: user?.bio || '',
        avatar: user?.avatar || ''
      });
    }
  }, [showEditProfileModal, user]);

  // Sync editing state when modals open
  useEffect(() => {
    if (showRemindersModal) setEditingReminders(reminders);
  }, [showRemindersModal, reminders]);

  useEffect(() => {
    if (showThemeModal) setEditingTheme(customTheme);
  }, [showThemeModal, customTheme]);

  const saveReminders = () => {
    onUpdateReminders(editingReminders);
    setShowRemindersModal(false);
  };

  const saveTheme = () => {
    onUpdateCustomTheme(editingTheme);
    setShowThemeModal(false);
  };

  const resetTheme = () => {
    setEditingTheme(DEFAULT_THEME_CONFIG);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingTheme(prev => ({ ...prev, bgImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingProfile(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = () => {
    const updatedUser = { ...user, ...editingProfile };
    
    // Update in localStorage
    const users = JSON.parse(localStorage.getItem('guan_qi_users') || '{}');
    if (updatedUser.email && users[updatedUser.email]) {
      users[updatedUser.email] = updatedUser;
      localStorage.setItem('guan_qi_users', JSON.stringify(users));
    }
    
    onUpdateUser(updatedUser);
    setShowEditProfileModal(false);
  };

  const currentLevel = VITALITY_LEVELS.slice().reverse().find(l => points >= l.min) || VITALITY_LEVELS[0];

  // Updated presets based on the provided color palettes
  const themePresets = [
    { name: 'Chestnut', label: '栗色红', bg: '#60281E', accent: '#F6D0AC', text: '#F6D0AC', glass: 'rgba(246, 208, 172, 0.1)' },
    { name: 'Prada', label: '普拉达蓝', bg: '#0175CC', accent: '#FF8836', text: '#FCF2D9', glass: 'rgba(252, 242, 217, 0.15)' },
    { name: 'Napoleon', label: '拿破仑黄', bg: '#2C436F', accent: '#FDD95F', text: '#EAF0E2', glass: 'rgba(234, 240, 226, 0.1)' },
    { name: 'Rose', label: '酡红', bg: '#312520', accent: '#DB3023', text: '#E8DFE0', glass: 'rgba(232, 223, 224, 0.1)' },
    { name: 'Sapphire', label: '宝蓝', bg: '#4B5CC4', accent: '#F6F9DC', text: '#EDF7EF', glass: 'rgba(237, 247, 239, 0.15)' },
  ];

  return (
    <div className="p-8 space-y-8 pt-20 pb-48 animate-in fade-in duration-700">
      
      {/* 沉浸式页眉：个人信息卡片 */}
      <section className="glass-card p-10 flex flex-col gap-6 relative overflow-hidden bg-gradient-to-br from-white/5 to-transparent border-white/5 shadow-2xl">
        <div className="flex justify-between items-start relative z-10">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/20 shadow-2xl">
              <img src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"} alt="avatar" className="w-full h-full object-cover" />
            </div>
            <button 
              onClick={() => setShowEditProfileModal(true)}
              className="absolute bottom-0 right-0 w-8 h-8 bg-white text-black rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all border border-black/5"
            >
              <Edit2 size={14} />
            </button>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="px-4 py-1.5 bg-white text-black rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl">
              {currentLevel.label}
            </div>
            <p className="text-[10px] font-black opacity-20 uppercase tracking-widest">ID: {user?.id || 'GZ-2025'}</p>
          </div>
        </div>

        <div className="space-y-1 relative z-10">
          <h2 className="text-4xl font-normal tracking-tighter">{user?.name}</h2>
          <p className="text-[10px] font-black opacity-60 uppercase tracking-widest">{user?.role} · 观气初阶</p>
          {user?.bio && (
            <p className="text-sm opacity-80 mt-2">{user.bio}</p>
          )}
        </div>
      </section>

      {/* 发表动态：发帖分享入口 */}
      <section 
        className="glass-card p-6 flex items-center gap-4 border-white/5 shadow-soft active:scale-95 transition-all cursor-pointer bg-white/[0.03] hover:bg-white/[0.05]"
        onClick={() => onNavigate('community')}
      >
        <div className="w-12 h-12 glass-card !rounded-2xl flex items-center justify-center text-[var(--accent)] shadow-inner">
          <Share2 size={20} />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold opacity-80">{lang === 'zh' ? '发帖分享' : 'Post & Share'}</h4>
          <p className="text-[10px] opacity-30">{lang === 'zh' ? '记录并同步今日修行心得' : 'Log and sync your insights'}</p>
        </div>
        <ChevronRight size={16} className="opacity-10" />
      </section>

      {/* 修行统计 */}
      <section className="grid grid-cols-3 gap-4">
         {[
           { val: '45', label: '时长', icon: Clock },
           { val: '3', label: '功法', icon: Activity },
           { val: points.toLocaleString(), label: '元气', icon: Zap }
         ].map((s, i) => (
           <div key={i} className="glass-card p-5 rounded-[2.2rem] flex flex-col items-center gap-2 border-white/5 shadow-soft transition-all hover:bg-white/[0.05]">
              <s.icon size={14} className="opacity-20" />
              <span className="text-xl font-normal tabular-nums">{s.val}</span>
              <span className="text-[7px] font-black opacity-30 uppercase tracking-widest">{s.label}</span>
           </div>
         ))}
      </section>

      {/* 系统设置 */}
      <section className="space-y-4">
         <div className="flex items-center gap-2 px-2">
            <Settings size={14} className="opacity-30" />
            <h3 className="text-[10px] font-black opacity-30 tracking-[0.4em] uppercase">{lang === 'zh' ? '系统设置' : 'Settings'}</h3>
         </div>
         <div className="grid grid-cols-1 gap-3">
            <div className="glass-card p-5 !rounded-3xl flex items-center justify-between border-white/5 shadow-soft transition-all active:scale-98 cursor-pointer" onClick={() => setShowThemeModal(true)}>
               <div className="flex items-center gap-4">
                  <Palette size={18} className="opacity-40"/>
                  <span className="text-sm font-bold opacity-80">{lang === 'zh' ? '视觉主题 & 设色' : 'Theme & Color'}</span>
               </div>
               <span className="text-[10px] font-black opacity-40 uppercase">{theme === 'custom' ? 'Custom' : theme}</span>
            </div>
            
            <div className="glass-card p-5 !rounded-3xl flex items-center justify-between border-white/5 shadow-soft transition-all active:scale-98 cursor-pointer" onClick={() => setShowRemindersModal(true)}>
               <div className="flex items-center gap-4">
                  <Bell size={18} className="opacity-40"/>
                  <span className="text-sm font-bold opacity-80">{lang === 'zh' ? '提醒 & 工间节奏' : 'Notifications & Rhythm'}</span>
               </div>
               <ChevronRight size={16} className="opacity-10"/>
            </div>

            <div className="glass-card p-5 !rounded-3xl flex items-center justify-between border-white/5 shadow-soft transition-all active:scale-98 cursor-pointer" onClick={() => onNavigate('constitution')}>
               <div className="flex items-center gap-4">
                  <Shield size={18} className="opacity-40"/>
                  <span className="text-sm font-bold opacity-80">{lang === 'zh' ? '隐私与安全' : 'Privacy'}</span>
               </div>
               <ChevronRight size={16} className="opacity-10"/>
            </div>
         </div>
      </section>

      <button onClick={onLogout} className="w-full py-8 text-[10px] font-black opacity-20 tracking-[0.6em] uppercase hover:text-rose-500 transition-all flex items-center justify-center gap-4 active:scale-95">
        <LogOut size={16} /> {lang === 'zh' ? '解除连接' : 'Disconnect'}
      </button>

      {/* Reminders Modal */}
      {showRemindersModal && (
        <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-3xl flex items-end justify-center px-4 pb-24 animate-in fade-in">
          <div className="glass-card w-full max-w-md rounded-[3rem] p-8 space-y-6 animate-in slide-in-from-bottom border-white/10 shadow-2xl h-[70vh] flex flex-col">
             <div className="flex justify-between items-center shrink-0">
                <h3 className="text-2xl font-normal tracking-tighter">修行时辰</h3>
                <button onClick={() => setShowRemindersModal(false)} className="p-2 glass-card !rounded-full"><X size={20}/></button>
             </div>
             
             <div className="flex-1 overflow-y-auto space-y-6 no-scrollbar">
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black opacity-30 uppercase tracking-widest">Rituals (Fixed)</h4>
                  {editingReminders.filter(r => r.type === 'ritual').map(r => (
                    <div key={r.id} className="flex items-center justify-between p-5 glass-card !rounded-3xl border-white/5 bg-white/[0.02]">
                       <span className="text-sm font-bold">{r.label}</span>
                       <input 
                        type="time" 
                        value={r.time} 
                        onChange={(e) => setEditingReminders(prev => prev.map(rem => rem.id === r.id ? { ...rem, time: e.target.value } : rem))} 
                        className="bg-transparent border-none outline-none font-black tracking-widest text-sm text-right" 
                       />
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <h4 className="text-[10px] font-black opacity-30 uppercase tracking-widest">Work Breaks (Custom)</h4>
                  {editingReminders.filter(r => r.type === 'break').map(r => (
                    <div key={r.id} className="flex flex-col gap-3 p-5 glass-card !rounded-3xl border-white/5 bg-white/[0.02]">
                       <div className="flex items-center justify-between border-b border-white/5 pb-2">
                         <input 
                           type="text" 
                           value={r.label} 
                           onChange={(e) => setEditingReminders(prev => prev.map(rem => rem.id === r.id ? { ...rem, label: e.target.value } : rem))}
                           className="bg-transparent outline-none font-bold text-sm w-full"
                         />
                         <div className="flex gap-2">
                           <input 
                            type="time" 
                            value={r.time} 
                            onChange={(e) => setEditingReminders(prev => prev.map(rem => rem.id === r.id ? { ...rem, time: e.target.value } : rem))} 
                            className="bg-transparent border-none outline-none font-black tracking-widest text-sm text-right" 
                           />
                         </div>
                       </div>
                       <div className="flex justify-between items-center">
                          <span className="text-[9px] opacity-40 uppercase tracking-widest">Enabled</span>
                          <button 
                             onClick={() => setEditingReminders(prev => prev.map(rem => rem.id === r.id ? { ...rem, enabled: !rem.enabled } : rem))}
                             className={`w-10 h-5 rounded-full transition-colors relative ${r.enabled ? 'bg-[var(--accent)]' : 'bg-white/10'}`}
                          >
                             <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform ${r.enabled ? 'left-6' : 'left-1'}`}></div>
                          </button>
                       </div>
                    </div>
                  ))}
                </div>
             </div>

             <button onClick={saveReminders} className="w-full py-5 rounded-full bg-[var(--text-main)] text-[var(--color-bg)] font-bold uppercase tracking-widest text-[10px] shadow-2xl active:scale-95 shrink-0">
                保存配置
             </button>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-3xl flex items-end justify-center px-4 pb-24 animate-in fade-in">
          <div className="glass-card w-full max-w-md rounded-[3rem] p-8 space-y-6 animate-in slide-in-from-bottom border-white/10 shadow-2xl flex flex-col">
             <div className="flex justify-between items-center shrink-0">
                <h3 className="text-2xl font-normal tracking-tighter">Edit Profile</h3>
                <button onClick={() => setShowEditProfileModal(false)} className="p-2 glass-card !rounded-full"><X size={20}/></button>
             </div>

             <div className="flex-1 overflow-y-auto space-y-6 no-scrollbar">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-white/20">
                    <img src={editingProfile.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"} alt="avatar" className="w-full h-full object-cover" />
                    <div 
                      className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
                      onClick={() => profileFileInputRef.current?.click()}
                    >
                      <Camera size={24} className="text-white" />
                    </div>
                  </div>
                  <input type="file" ref={profileFileInputRef} accept="image/*" className="hidden" onChange={handleProfileImageUpload} />
                  <span className="text-xs opacity-60">Tap to change avatar</span>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black opacity-40 uppercase tracking-widest">Username</label>
                    <input 
                      type="text" 
                      value={editingProfile.name}
                      onChange={(e) => setEditingProfile({...editingProfile, name: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-white/30 transition-colors"
                      placeholder="Enter your username"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black opacity-40 uppercase tracking-widest">Bio</label>
                    <textarea 
                      value={editingProfile.bio}
                      onChange={(e) => setEditingProfile({...editingProfile, bio: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-white/30 transition-colors resize-none h-24"
                      placeholder="Write a short bio about yourself"
                    />
                  </div>
                </div>
             </div>

             <button onClick={saveProfile} className="w-full py-5 rounded-full bg-[var(--text-main)] text-[var(--color-bg)] font-bold uppercase tracking-widest text-[10px] shadow-2xl active:scale-95 shrink-0 transition-transform">
                Save Profile
             </button>
          </div>
        </div>
      )}

      {/* Theme Studio Modal */}
      {showThemeModal && (
        <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-3xl flex items-end justify-center px-4 pb-24 animate-in fade-in">
          <div className="glass-card w-full max-w-md rounded-[3rem] p-8 space-y-6 animate-in slide-in-from-bottom border-white/10 shadow-2xl h-[75vh] flex flex-col">
             <div className="flex justify-between items-center shrink-0">
                <h3 className="text-2xl font-normal tracking-tighter">视觉主题 · Studio</h3>
                <div className="flex gap-2">
                    <button onClick={resetTheme} className="p-2 glass-card !rounded-full hover:bg-white/10 transition-colors group" title="Reset to Default">
                        <RefreshCw size={18} className="text-white/60 group-hover:text-white" />
                    </button>
                    <button onClick={() => setShowThemeModal(false)} className="p-2 glass-card !rounded-full"><X size={20}/></button>
                </div>
             </div>

             <div className="flex-1 overflow-y-auto space-y-8 no-scrollbar">
                
                {/* Background Image */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black opacity-30 uppercase tracking-widest">Background Layer</h4>
                  <div 
                    className="w-full h-48 rounded-[2rem] border border-dashed border-white/10 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/5 transition-all overflow-hidden relative group"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {editingTheme.bgImage ? (
                       <>
                         <img src={editingTheme.bgImage} className="absolute inset-0 w-full h-full object-cover opacity-80 transition-opacity group-hover:opacity-40" />
                         <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <span className="px-4 py-2 bg-black/60 rounded-full text-xs font-bold backdrop-blur-md">Change</span>
                         </div>
                       </>
                    ) : (
                       <div className="flex flex-col items-center gap-2 opacity-40">
                          <Camera size={28} strokeWidth={1.5} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Upload Image</span>
                       </div>
                    )}
                    <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </div>
                  {editingTheme.bgImage && (
                    <button onClick={() => setEditingTheme(prev => ({ ...prev, bgImage: null }))} className="text-[10px] text-red-400 flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity pl-2">
                       <Trash2 size={12} /> Remove custom background
                    </button>
                  )}
                </div>

                {/* Color Pickers */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black opacity-30 uppercase tracking-widest">System Palette</h4>
                  <div className="grid grid-cols-1 gap-3">
                     {[
                       { key: 'bgColor', label: 'Canvas Background', desc: 'Main app background color' },
                       { key: 'accentColor', label: 'Primary Accent', desc: 'Highlights, buttons, active states' },
                       { key: 'textColor', label: 'Primary Text', desc: 'Main content readability' },
                       { key: 'glassColor', label: 'Glass Tint', desc: 'Card background opacity' }
                     ].map(item => (
                       <div key={item.key} className="glass-card p-4 rounded-[1.5rem] flex items-center gap-5 border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors group">
                          <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-white/10 shadow-lg shrink-0 group-hover:scale-105 transition-transform">
                             <div className="absolute inset-0" style={{ backgroundColor: (editingTheme as any)[item.key] }}></div>
                             <input 
                              type="color" 
                              value={(editingTheme as any)[item.key]} 
                              onChange={(e) => setEditingTheme(prev => ({ ...prev, [item.key]: e.target.value }))}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                             />
                          </div>
                          <div className="flex-1 min-w-0">
                             <div className="flex justify-between items-center mb-0.5">
                                <span className="text-sm font-bold opacity-90">{item.label}</span>
                                <span className="text-[10px] font-mono opacity-40 uppercase bg-white/5 px-2 py-0.5 rounded text-right">
                                    {(editingTheme as any)[item.key]}
                                </span>
                             </div>
                             <p className="text-[10px] opacity-40 leading-tight">{item.desc}</p>
                          </div>
                       </div>
                     ))}
                  </div>
                </div>

                {/* Presets - Updated with specific color palettes */}
                <div className="space-y-4">
                   <h4 className="text-[10px] font-black opacity-30 uppercase tracking-widest">Curated Collections</h4>
                   <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                      {themePresets.map(preset => (
                         <button 
                          key={preset.name}
                          onClick={() => setEditingTheme(prev => ({ ...prev, bgColor: preset.bg, accentColor: preset.accent, textColor: preset.text, glassColor: preset.glass, bgImage: null }))}
                          className="flex-shrink-0 px-5 py-4 rounded-3xl glass-card flex flex-col items-center gap-3 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors min-w-[80px]"
                         >
                            <div className="flex -space-x-1.5">
                               <div className="w-4 h-4 rounded-full border border-white/10" style={{ background: preset.bg }}></div>
                               <div className="w-4 h-4 rounded-full border border-white/10" style={{ background: preset.accent }}></div>
                            </div>
                            <span className="text-[9px] font-bold uppercase tracking-wide opacity-80">{preset.label}</span>
                         </button>
                      ))}
                   </div>
                </div>

             </div>

             <button onClick={saveTheme} className="w-full py-5 rounded-full bg-[var(--text-main)] text-[var(--color-bg)] font-bold uppercase tracking-widest text-[10px] shadow-2xl active:scale-95 shrink-0 transition-transform">
                Apply Theme Configuration
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
