import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Landing() {
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);
  
  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(() => {
      navigate('/home');
    }, 800);
  };

  return (
    <div className={`fixed inset-0 bg-black overflow-hidden transition-opacity duration-700 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
      {/* Content - perfectly centered */}
      <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ${isExiting ? 'scale-110 opacity-0' : 'scale-100 opacity-100'}`}>
        {/* Logo container with glow */}
        <div className="relative mb-10 flex items-center justify-center">
          {/* Glow effects */}
          <div className="absolute w-[200px] h-[200px] bg-fuchsia-500/20 rounded-full blur-[60px] animate-pulse" />
          
          {/* Logo */}
          <img 
            src="/IMG_8862.png" 
            alt="AMOR Logo" 
            className="relative z-10 object-contain drop-shadow-[0_0_25px_rgba(236,72,153,0.4)]"
            style={{ maxHeight: '180px', maxWidth: '350px' }}
          />
        </div>
        
        {/* Visit Button */}
        <button 
          onClick={handleEnter}
          className="relative z-10 border border-white/30 text-white hover:bg-white hover:text-black px-10 py-4 text-sm tracking-[0.3em] uppercase font-medium transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
        > 
          Visit AMOR
        </button>
      </div>
      
      {/* Bottom text - absolutely positioned */}
      <div 
        className={`text-center text-neutral-500 text-xs tracking-[0.3em] uppercase transition-opacity duration-500 ${isExiting ? 'opacity-0' : 'opacity-100'}`}
        style={{ position: 'absolute', bottom: '32px', left: 0, right: 0 }}
      >
        © 2025 AMOR · Luxury Fashion
      </div>
    </div>
  );
}