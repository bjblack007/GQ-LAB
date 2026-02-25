
import React, { useEffect, useState, useMemo } from 'react';
import { CloudRain } from 'lucide-react';

interface Props {
  onComplete: () => void;
  user?: any;
}

const Splash: React.FC<Props> = ({ onComplete, user }) => {
  const [time, setTime] = useState(new Date());
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const stages = [
      setTimeout(() => setStage(1), 200), 
      setTimeout(() => setStage(2), 750), 
      setTimeout(() => setStage(3), 1300), 
    ];

    const autoTransition = setTimeout(onComplete, 5800);

    return () => {
      clearInterval(timer);
      stages.forEach(s => clearTimeout(s));
      clearTimeout(autoTransition);
    };
  }, [onComplete]);

  const clockHands = useMemo(() => {
    const hours = time.getHours() % 12;
    const minutes = time.getMinutes();
    const hDeg = (hours + minutes / 60) * 30;
    const mDeg = minutes * 6;
    return { hDeg, mDeg };
  }, [time]);

  const weather = {
    temp: '21°',
    condition: 'Breezy',
    icon: <CloudRain className="text-accent opacity-60" size={12} />
  };

  const firstName = user?.name?.split(' ')[0] || 'Zen';

  return (
    <div 
      className="fixed inset-0 z-[2000] flex flex-col items-center justify-center overflow-hidden cursor-pointer"
      onClick={onComplete}
    >
      <div className="relative z-10 flex flex-col items-start gap-4 max-w-[260px] w-full px-8 py-10 scale-90 md:scale-95 transition-all duration-1000">
        
        <div className={`flex items-center gap-3 transition-all duration-1000 ease-out ${stage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="glass-panel p-2 rounded-[1.5rem] flex flex-col items-center justify-center min-w-[50px] shadow-sm border-white/20">
            <div className="mb-0.5">{weather.icon}</div>
            <span className="text-xs font-bold leading-none tabular-nums">{weather.temp}</span>
            <span className="text-[6px] font-black opacity-30 uppercase tracking-widest mt-1">{weather.condition}</span>
          </div>

          <div className="w-10 h-10 border border-current opacity-15 rounded-full relative flex items-center justify-center bg-white/5 backdrop-blur-md shadow-inner">
            <div 
              className="absolute w-px h-2.5 bg-current rounded-full origin-bottom"
              style={{ transform: `rotate(${clockHands.hDeg}deg) translateY(-50%)`, top: '32%' }}
            ></div>
            <div 
              className="absolute w-px h-3.5 bg-current rounded-full origin-bottom"
              style={{ transform: `rotate(${clockHands.mDeg}deg) translateY(-50%)`, top: '22%' }}
            ></div>
            <div className="w-0.5 h-0.5 bg-accent rounded-full z-10"></div>
          </div>
        </div>

        <div className="space-y-0">
          {stage >= 2 && (
            <h1 className="text-2xl md:text-3xl font-normal tracking-tight animate-gradient-text">
              Hey {firstName},
            </h1>
          )}
          {stage >= 3 && (
            <h2 className="text-2xl md:text-3xl font-normal tracking-tight animate-gradient-text" style={{ animationDelay: '0.45s' }}>
              Welcome back!
            </h2>
          )}
        </div>
      </div>

      <div className={`absolute bottom-16 text-[7px] font-black uppercase tracking-[0.5em] transition-opacity duration-1000 ${stage >= 3 ? 'opacity-20' : 'opacity-0'} animate-pulse`}>
        Tap to explore
      </div>
    </div>
  );
};

export default Splash;
