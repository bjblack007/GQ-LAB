
import React, { useState } from 'react';
import { ArrowRight, Lock, AtSign, User } from 'lucide-react';

interface Props {
  onLogin: (user: any) => void;
}

const Auth: React.FC<Props> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', username: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password || (!isLogin && !formData.username)) {
      setError('Please fill in all fields');
      return;
    }

    const users = JSON.parse(localStorage.getItem('guan_qi_users') || '{}');

    if (isLogin) {
      const user = users[formData.email];
      if (user && user.password === formData.password) {
        onLogin(user);
      } else {
        setError('Invalid email or password');
      }
    } else {
      if (users[formData.email]) {
        setError('Email already exists');
      } else {
        const newUser = {
          email: formData.email,
          password: formData.password,
          name: formData.username,
          role: '观气学徒',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
          id: 'GZ-' + Math.floor(Math.random() * 10000),
          bio: 'A new journey begins.'
        };
        users[formData.email] = newUser;
        localStorage.setItem('guan_qi_users', JSON.stringify(users));
        onLogin(newUser);
      }
    }
  };

  const handleWeChatLogin = () => {
    onLogin({
      name: '企业微信用户',
      role: '观气学徒',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      id: 'GZ-WX888'
    });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-transparent flex items-center justify-center font-sans text-[var(--text-main)] p-4 sm:p-0">
      {/* Main Glass Card - responsive padding and dimensions */}
      <div className="w-full max-w-[400px] sm:max-w-[440px] bg-[var(--glass-fill)] backdrop-filter backdrop-blur-2xl border border-[var(--border-color)] rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] relative z-10 flex flex-col justify-between min-h-[520px] sm:min-h-[600px] transform transition-all hover:scale-[1.005] sm:hover:scale-[1.01] duration-500">
        
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center mb-8 sm:mb-14 px-1">
             <span className="text-base sm:text-lg font-normal tracking-wide opacity-80">Guan Qi Lab</span>
             <button 
               onClick={() => { setIsLogin(!isLogin); setError(''); }} 
               className="text-base sm:text-lg font-normal hover:opacity-60 transition-opacity"
             >
               {isLogin ? 'Sign up' : 'Log in'}
             </button>
          </div>

          {/* Title & Social */}
          <div className="flex justify-between items-end mb-8 sm:mb-10 px-1">
             <h1 className="text-[2.5rem] sm:text-[3.2rem] leading-none font-normal tracking-tight">{isLogin ? 'Log in' : 'Sign up'}</h1>
             <button 
               onClick={handleWeChatLogin}
               className="h-9 sm:h-10 px-4 sm:px-5 rounded-full border border-[var(--text-main)]/10 flex items-center gap-2 hover:bg-[var(--text-main)] hover:text-[var(--color-bg)] transition-all text-[10px] sm:text-xs font-medium bg-white/5 group whitespace-nowrap"
             >
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-[var(--text-main)] text-[var(--color-bg)] rounded-full flex items-center justify-center text-[8px] sm:text-[10px] font-bold group-hover:bg-[var(--color-bg)] group-hover:text-[var(--text-main)] transition-colors">企</div>
                企业微信快捷登录
             </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 flex-1">
             {error && <p className="text-red-500 text-sm px-2">{error}</p>}
             
             {!isLogin && (
               <div className="relative group">
                  <div className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 opacity-40 group-focus-within:opacity-100 transition-opacity">
                     <User size={18} className="sm:w-5 sm:h-5" strokeWidth={2} />
                  </div>
                  <input 
                   type="text" 
                   placeholder="username"
                   className="w-full bg-[var(--card-inner)] hover:bg-white/10 focus:bg-white/10 border border-transparent focus:border-[var(--border-color)] rounded-[1.5rem] sm:rounded-[2rem] h-[3.8rem] sm:h-[4.5rem] pl-14 sm:pl-16 pr-6 outline-none text-base sm:text-lg placeholder-[var(--text-main)]/30 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                   value={formData.username}
                   onChange={e => setFormData({...formData, username: e.target.value})}
                  />
               </div>
             )}

             {/* Email Input */}
             <div className="relative group">
                <div className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 opacity-40 group-focus-within:opacity-100 transition-opacity">
                   <AtSign size={18} className="sm:w-5 sm:h-5" strokeWidth={2} />
                </div>
                <input 
                 type="email" 
                 placeholder="e-mail address"
                 className="w-full bg-[var(--card-inner)] hover:bg-white/10 focus:bg-white/10 border border-transparent focus:border-[var(--border-color)] rounded-[1.5rem] sm:rounded-[2rem] h-[3.8rem] sm:h-[4.5rem] pl-14 sm:pl-16 pr-6 outline-none text-base sm:text-lg placeholder-[var(--text-main)]/30 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                 value={formData.email}
                 onChange={e => setFormData({...formData, email: e.target.value})}
                />
             </div>

             {/* Password Input */}
             <div className="relative group">
                <div className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 opacity-40 group-focus-within:opacity-100 transition-opacity">
                   <Lock size={18} className="sm:w-5 sm:h-5" strokeWidth={2} />
                </div>
                <input 
                 type="password" 
                 placeholder="password"
                 className="w-full bg-[var(--card-inner)] hover:bg-white/10 focus:bg-white/10 border border-transparent focus:border-[var(--border-color)] rounded-[1.5rem] sm:rounded-[2rem] h-[3.8rem] sm:h-[4.5rem] pl-14 sm:pl-16 pr-24 sm:pr-28 outline-none text-base sm:text-lg placeholder-[var(--text-main)]/30 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                 value={formData.password}
                 onChange={e => setFormData({...formData, password: e.target.value})}
                />
                {isLogin && (
                  <button type="button" className="absolute right-6 sm:right-8 top-1/2 -translate-y-1/2 text-xs sm:text-sm font-normal opacity-50 hover:opacity-100 transition-opacity">
                     I forgot
                  </button>
                )}
             </div>
          </form>

          {/* Footer Section */}
          <div className="space-y-6 sm:space-y-10 mt-6 sm:mt-8">
            <div className="flex items-end justify-between gap-4 pl-1">
                <p className="text-[9px] sm:text-[10px] leading-relaxed opacity-40 max-w-[160px] sm:max-w-[180px] font-medium tracking-wide">
                    For use by adults only (18+). Keep out of reach of children.
                    <br/>
                    In case of imbalance contact our <span className="underline decoration-1 underline-offset-2 cursor-pointer hover:opacity-100">hotline</span>.
                </p>

                <button 
                    onClick={handleSubmit}
                    className="w-[3.8rem] h-[3.8rem] sm:w-24 sm:h-[4.5rem] bg-[var(--text-main)] text-[var(--color-bg)] rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl hover:shadow-2xl shrink-0"
                >
                    <ArrowRight size={20} className="sm:w-6 sm:h-6" strokeWidth={1.5} />
                </button>
            </div>

            <div className="text-center">
                <p className="text-[9px] sm:text-xs opacity-50 font-medium tracking-wide">Guanqi Lab - Awaken Your Inner Vitality</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
