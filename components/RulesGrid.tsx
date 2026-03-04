import React from 'react';
import { HOTEL_NOGA_RULES } from '../constants';
import { Language } from '../types';
import { translations } from '../translations';

interface RulesGridProps {
  onNext: () => void;
  onBack: () => void;
  lang: Language;
}

const RulesGrid: React.FC<RulesGridProps> = ({ onNext, onBack, lang }) => {
  const t = translations[lang];

  return (
    <div className="py-6 space-y-10 w-full animate-in fade-in duration-500">
      <div className="text-center space-y-3">
        <h3 className="text-3xl font-bold text-noga-deepteal uppercase tracking-wide">{t.rulesTitle}</h3>
        <p className="text-base text-noga-deepteal/60 font-medium">{t.rulesSub}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
        {HOTEL_NOGA_RULES.map((rule) => (
          <div key={rule.id} className="bg-white border-2 border-noga-lightblue rounded-[30px] p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
            <div className={`mb-4 p-5 rounded-full bg-noga-lightblue/50 ${rule.color.replace('text-', 'text-noga-')}`}>
              {rule.icon}
            </div>
            <h4 className="text-[12px] font-bold text-noga-brown uppercase tracking-wider mb-2">{rule.title[lang]}</h4>
            <p className="text-sm font-bold text-noga-deepteal mb-3 line-clamp-1">{rule.subtitle[lang]}</p>
            <div className="space-y-2">
              <p className="text-[12px] leading-snug text-noga-deepteal/80 font-medium">{rule.description[lang]}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-noga-brown/10 p-8 rounded-[40px] border-2 border-noga-brown/20 space-y-6 w-full">
        <div className="max-w-4xl mx-auto space-y-5">
          <p className="text-sm text-noga-brown font-bold text-center uppercase tracking-widest">
            {t.penaltiesTitle}
          </p>
          
          <div className="pt-6 border-t border-noga-brown/20">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-3 text-[12px] text-noga-deepteal/80 font-bold">
              <ul className="space-y-2 list-disc pl-5">
                <li>{t.extraCleaning}: <span className="font-bold text-noga-brown">1000 MXN</span></li>
                <li className="list-none -ml-5 mt-3 font-bold text-noga-brown uppercase">{t.replacement}:</li>
                <li>{t.sheets}: <span className="font-bold text-noga-brown">2500 MXN</span></li>
              </ul>
              <ul className="space-y-2 list-disc pl-5">
                <li>{t.towels}: <span className="font-bold text-noga-brown">350 MXN</span></li>
                <li>{t.facial}: <span className="font-bold text-noga-brown">100 MXN</span></li>
                <li>{t.key}: <span className="font-bold text-noga-brown">200 MXN</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-5 no-print w-full pt-6">
        <button 
          onClick={onBack}
          className="flex-1 border-2 border-noga-midteal/30 text-noga-deepteal py-6 rounded-2xl font-bold hover:bg-noga-lightblue transition-all active:scale-95 text-base uppercase tracking-widest"
        >
          {t.back}
        </button>
        <button 
          onClick={onNext}
          className="flex-[2] bg-noga-deepteal text-white py-6 rounded-2xl font-bold hover:bg-noga-brown transition-all shadow-lg active:scale-95 text-base uppercase tracking-widest"
        >
          {t.acceptSign}
        </button>
      </div>
    </div>
  );
};

export default RulesGrid;
