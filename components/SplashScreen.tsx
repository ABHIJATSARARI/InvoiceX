import React, { useEffect, useState } from 'react';
import { Layers, Zap, Database, ShieldCheck, Globe } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing Protocol...');

  useEffect(() => {
    const totalTime = 8000; // 8 seconds
    const intervalTime = 50;
    const steps = totalTime / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const percent = Math.min(100, (currentStep / steps) * 100);
      setProgress(percent);

      // Status text sequence
      if (percent < 20) setStatusText('Establishing Secure Connection...');
      else if (percent < 40) setStatusText('Syncing with QIE Blockchain Node...');
      else if (percent < 60) setStatusText('Loading Gemini AI Risk Engine...');
      else if (percent < 80) setStatusText('Fetching Real-time Forex Oracles...');
      else if (percent < 95) setStatusText('Verifying Smart Contracts...');
      else setStatusText('Launch Sequence Initiated...');

      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(onComplete, 500); // Slight delay at 100%
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] bg-gray-950 flex flex-col items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-gray-950 to-gray-950"></div>
      
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-10" 
           style={{ 
             backgroundImage: 'linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)', 
             backgroundSize: '40px 40px',
             transform: 'perspective(500px) rotateX(60deg) translateY(-100px) scale(1.5)'
           }}>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Main Logo Container */}
        <div className="relative mb-12">
            {/* Pulsing Rings */}
            <div className="absolute inset-0 rounded-full border-2 border-indigo-500/30 animate-[ping_3s_ease-in-out_infinite]"></div>
            <div className="absolute -inset-4 rounded-full border border-indigo-500/20 animate-[ping_4s_ease-in-out_infinite_delay-1s]"></div>
            
            {/* Central Icon */}
            <div className="relative w-24 h-24 bg-gray-900 rounded-2xl flex items-center justify-center border border-indigo-500/50 shadow-[0_0_50px_rgba(99,102,241,0.5)] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20"></div>
                {/* Scanning Line Effect */}
                <div className="absolute top-0 left-0 w-full h-1 bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,1)] animate-[scan_2s_linear_infinite]"></div>
                
                <span className="text-4xl font-black text-white tracking-tighter z-10">IX</span>
            </div>
            
            {/* Orbiting Elements */}
            <div className="absolute top-1/2 left-1/2 w-40 h-40 border border-indigo-500/20 rounded-full -translate-x-1/2 -translate-y-1/2 animate-[spin_10s_linear_infinite]">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1.5 w-3 h-3 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,1)]"></div>
            </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-white tracking-widest mb-2 animate-pulse">
          INVOICEX
        </h1>
        <p className="text-indigo-400/80 text-sm tracking-[0.3em] uppercase mb-12">Decentralized Financing Protocol</p>

        {/* Protocol Steps Icons (Fade in sequentially) */}
        <div className="flex space-x-8 mb-12">
            <div className={`transition-all duration-700 ${progress > 20 ? 'opacity-100 translate-y-0 text-emerald-400' : 'opacity-20 translate-y-2 text-gray-500'}`}>
                <Globe className="w-6 h-6 mx-auto mb-2" />
                <div className="h-1 w-1 bg-current rounded-full mx-auto"></div>
            </div>
            <div className={`transition-all duration-700 delay-100 ${progress > 40 ? 'opacity-100 translate-y-0 text-blue-400' : 'opacity-20 translate-y-2 text-gray-500'}`}>
                <Database className="w-6 h-6 mx-auto mb-2" />
                <div className="h-1 w-1 bg-current rounded-full mx-auto"></div>
            </div>
            <div className={`transition-all duration-700 delay-200 ${progress > 60 ? 'opacity-100 translate-y-0 text-purple-400' : 'opacity-20 translate-y-2 text-gray-500'}`}>
                <Zap className="w-6 h-6 mx-auto mb-2" />
                <div className="h-1 w-1 bg-current rounded-full mx-auto"></div>
            </div>
            <div className={`transition-all duration-700 delay-300 ${progress > 80 ? 'opacity-100 translate-y-0 text-indigo-400' : 'opacity-20 translate-y-2 text-gray-500'}`}>
                <ShieldCheck className="w-6 h-6 mx-auto mb-2" />
                <div className="h-1 w-1 bg-current rounded-full mx-auto"></div>
            </div>
        </div>

        {/* Progress Bar & Text */}
        <div className="w-64">
           <div className="flex justify-between text-xs text-indigo-300 font-mono mb-2">
               <span>{statusText}</span>
               <span>{Math.floor(progress)}%</span>
           </div>
           <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
               <div 
                 className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)] transition-all duration-100 ease-out"
                 style={{ width: `${progress}%` }}
               ></div>
           </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-8 text-gray-600 text-[10px] tracking-widest font-mono">
          POWERED BY QIE BLOCKCHAIN • GEMINI AI • V1.0.4
      </div>
      
      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};