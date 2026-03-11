
import React, { useState, useEffect } from 'react';
import { GuestData, Language } from '../types';
import { translations } from '../translations';

interface RegistrationFormProps {
  data: GuestData;
  onChange: (data: Partial<GuestData>) => void;
  onNext: () => void;
  lang: Language;
}

const COUNTRY_CODES = [
  { name: 'México', code: '+52', flag: '🇲🇽' },
  { name: 'USA', code: '+1', flag: '🇺🇸' },
  { name: 'Colombia', code: '+57', flag: '🇨🇴' },
  { name: 'España', code: '+34', flag: '🇪🇸' },
  { name: 'Argentina', code: '+54', flag: '🇦🇷' },
  { name: 'Chile', code: '+56', flag: '🇨🇱' },
  { name: 'Perú', code: '+51', flag: '🇵🇪' },
  { name: 'Canadá', code: '+1', flag: '🇨🇦' },
  { name: 'Reino Unido', code: '+44', flag: '🇬🇧' },
  { name: 'Francia', code: '+33', flag: '🇫🇷' },
  { name: 'Alemania', code: '+49', flag: '🇩🇪' },
  { name: 'Italia', code: '+39', flag: '🇮🇹' },
  { name: 'Brasil', code: '+55', flag: '🇧🇷' },
];

const RegistrationForm: React.FC<RegistrationFormProps> = ({ data, onChange, onNext, lang }) => {
  const t = translations[lang];
  const [selectedLada, setSelectedLada] = useState(COUNTRY_CODES[0].code);
  const [phoneNumber, setPhoneNumber] = useState('');

  // Sincronizar lada y teléfono cuando los datos del padre cambian
  useEffect(() => {
    if (data.cellphone) {
      const parts = data.cellphone.split(' ');
      if (parts.length >= 2) {
        setSelectedLada(parts[0]);
        setPhoneNumber(parts.slice(1).join(''));
      } else {
        setPhoneNumber(data.cellphone);
      }
    }
  }, [data.cellphone]);

  useEffect(() => {
    const fullPhone = phoneNumber ? `${selectedLada} ${phoneNumber}` : '';
    if (fullPhone && fullPhone !== data.cellphone) {
      onChange({ cellphone: fullPhone });
    }
  }, [selectedLada, phoneNumber, data.cellphone, onChange]);

  const inputClass = "w-full border-b-2 border-noga-midteal/30 py-3 px-1 focus:border-noga-brown outline-none transition-colors text-base font-medium text-noga-deepteal bg-transparent";
  const labelClass = "text-[12px] font-bold text-noga-brown uppercase tracking-wider mb-2 block";

  return (
    <form onSubmit={(e) => { e.preventDefault(); onNext(); }} className="space-y-10 py-8 max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="bg-noga-brown/5 p-6 rounded-[30px] border border-noga-brown/10 mb-6 flex items-center gap-5">
        <div className="w-12 h-12 bg-noga-brown/20 rounded-full flex items-center justify-center text-noga-brown font-bold text-lg">✓</div>
        <p className="text-[12px] text-noga-deepteal font-bold">{t.formNotice}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <label className={labelClass}>{t.firstName}</label>
          <input required type="text" value={data.firstName} onChange={e => onChange({ firstName: e.target.value })} className={inputClass} placeholder="Ej. Juan" />
        </div>
        <div>
          <label className={labelClass}>{t.lastName}</label>
          <input required type="text" value={data.lastName} onChange={e => onChange({ lastName: e.target.value })} className={inputClass} placeholder="Ej. Pérez" />
        </div>
      </div>

      <div>
        <label className={labelClass}>{t.email}</label>
        <input 
          required 
          type="email" 
          value={data.email || ''} 
          onChange={e => onChange({ email: e.target.value })} 
          className={inputClass} 
          placeholder="ejemplo@email.com" 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <label className={labelClass}>{t.cellphone}</label>
          <div className="flex gap-4">
            <select 
              value={selectedLada} 
              onChange={e => setSelectedLada(e.target.value)}
              className="border-b-2 border-noga-midteal/30 bg-transparent text-noga-deepteal font-bold py-3 outline-none focus:border-noga-brown"
            >
              {COUNTRY_CODES.map(country => (
                <option key={country.name + country.code} value={country.code}>
                  {country.flag} {country.code}
                </option>
              ))}
            </select>
            <input required type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, ''))} className={inputClass} placeholder="555-123-4567" />
          </div>
        </div>
        <div>
          <label className={labelClass}>{t.nationality}</label>
          <input required type="text" value={data.nationality} onChange={e => onChange({ nationality: e.target.value })} className={inputClass} placeholder="Ej. Mexicana" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <label className={labelClass}>{t.birthday}</label>
          <input required type="date" value={data.birthday} onChange={e => onChange({ birthday: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{t.checkIn}</label>
          <input required type="date" value={data.checkInDate || ''} onChange={e => onChange({ checkInDate: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{t.checkOut}</label>
          <input required type="date" value={data.checkOutDate || ''} onChange={e => onChange({ checkOutDate: e.target.value })} className={inputClass} />
        </div>
      </div>

      <button type="submit" className="w-full bg-noga-deepteal text-white py-6 rounded-2xl font-bold hover:bg-noga-brown transition-all shadow-xl active:scale-95 text-xl uppercase tracking-widest mt-6">
        {t.nextBtn || (lang === 'es' ? 'CONTINUAR' : 'CONTINUE')}
      </button>
    </form>
  );
};

export default RegistrationForm;
