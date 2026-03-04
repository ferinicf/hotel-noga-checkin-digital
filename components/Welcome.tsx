import React from 'react';
import { ArrowRight, CheckCircle2, Globe } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface WelcomeProps {
  onStart: () => void;
  lang: Language;
  onLangChange: (lang: Language) => void;
}

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
];

const Welcome: React.FC<WelcomeProps> = ({ onStart, lang, onLangChange }) => {
  const t = translations[lang];

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in duration-700">
      <div className="w-24 h-24 bg-noga-brown rounded-full flex items-center justify-center mb-6 shadow-lg">
        <CheckCircle2 className="w-12 h-12 text-noga-lightblue" />
      </div>
      
      <h2 className="text-4xl font-bold text-noga-deepteal mb-3">{t.welcome}</h2>
      <p className="text-xl text-noga-deepteal/70 mb-10 max-w-lg mx-auto">
        {t.welcomeSub}
      </p>

      {/* Language Selector */}
      <div className="w-full max-w-2xl mb-12 bg-noga-lightblue/20 p-8 rounded-[40px] border border-noga-midteal/30">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Globe className="w-5 h-5 text-noga-brown" />
          <span className="text-[12px] font-bold uppercase tracking-widest text-noga-brown">{t.langSelect}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => onLangChange(l.code)}
              className={`flex items-center justify-center gap-3 px-5 py-4 rounded-2xl border-2 transition-all ${
                lang === l.code
                  ? 'bg-noga-deepteal border-noga-deepteal text-white shadow-md scale-105'
                  : 'bg-white border-noga-midteal/20 text-noga-deepteal hover:border-noga-midteal hover:bg-noga-lightblue/30'
              }`}
            >
              <span className="text-2xl">{l.flag}</span>
              <span className="text-sm font-bold">{l.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      <button 
        onClick={onStart}
        className="group flex items-center gap-4 bg-noga-deepteal text-white px-12 py-6 rounded-full font-bold hover:bg-noga-brown transition-all shadow-xl active:scale-95 text-xl"
      >
        {t.startBtn}
        <ArrowRight className="w-7 h-7 group-hover:translate-x-1 transition-transform" />
      </button>

      <div className="mt-12 grid grid-cols-2 gap-6 w-full max-w-lg">
        <div className="bg-white p-6 rounded-[30px] border border-noga-midteal/30">
          <p className="text-3xl font-bold text-noga-brown">3 pm</p>
          <p className="text-[12px] text-noga-deepteal font-bold uppercase">Check-in</p>
        </div>
        <div className="bg-white p-6 rounded-[30px] border border-noga-midteal/30">
          <p className="text-3xl font-bold text-noga-brown">11 am</p>
          <p className="text-[12px] text-noga-deepteal font-bold uppercase">Check-out</p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
