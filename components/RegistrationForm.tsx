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
  const [emailUser, setEmailUser] = useState('');
  const [emailDomain, setEmailDomain] = useState('');
  const [emailExt, setEmailExt] = useState('');
  const [selectedLada, setSelectedLada] = useState(COUNTRY_CODES[0].code);
  const [phoneNumber, setPhoneNumber] = useState('');

  // Sincronizar campos complejos cuando los datos del padre cambian (IA Auto-fill)
  useEffect(() => {
    if (data.email) {
      const parts = data.email.split('@');
      if (parts.length === 2) {
        setEmailUser(parts[0]);
        const domainParts = parts[1].split('.');
        if (domainParts.length >= 2) {
          setEmailDomain(domainParts[0]);
          setEmailExt(domainParts.slice(1).join('.'));
        }
      }
    }
    if (data.cellphone) {
      const parts = data.cellphone.split(' ');
      if (parts.length >= 2) {
        setSelectedLada(parts[0]);
        setPhoneNumber(parts.slice(1).join(''));
      } else {
        setPhoneNumber(data.cellphone);
      }
    }
  }, [data.email, data.cellphone]);

  // Actualizar el padre cuando el usuario escribe en los campos descompuestos
  useEffect(() => {
    const fullEmail = emailUser && emailDomain && emailExt ? `${emailUser}@${emailDomain}.${emailExt}` : '';
    if (fullEmail && fullEmail !== data.email) {
      onChange({ email: fullEmail });
    }
  }, [emailUser, emailDomain, emailExt]);

  useEffect(() => {
    const fullPhone = phoneNumber ? `${selectedLada} ${phoneNumber}` : '';
    if (fullPhone && fullPhone !== data.cellphone) {
      onChange({ cellphone: fullPhone });
    }
  }, [selectedLada, phoneNumber]);

  const inputClass = "w-full border-b-2 border-noga-midteal/30 py-3 px-1 focus:border-noga-brown outline-none transition-colors text-base font-medium text-noga-deepteal bg-transparent";
  const labelClass = "text-[12px] font-bold text-noga-brown uppercase tracking-wider mb-2 block";
  const emailPartClass = "border-b-2 border-noga-midteal/30 py-3 px-1 focus:border-noga-brown outline-none transition-colors text-base font-medium text-noga-deepteal bg-transparent text-center";

  return (
    <form onSubmit={(e) => { e.preventDefault(); onNext(); }} className="space-y-10 py-8 max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="bg-noga-brown/5 p-6 rounded-[30px] border border-noga-brown/10 mb-6 flex items-center gap-5">
        <div className="w-12 h-12 bg-noga-brown/20 rounded-full flex items-center justify-center text-noga-brown font-bold text-lg">✓</div>
        <p className="text-[12px] text-noga-deepteal font-bold">{t.formNotice}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <label className={labelClass}>{t.firstName}</label>
          <input required type="text" value={data.firstName || ''} onChange={e => onChange({ firstName: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{t.lastName}</label>
          <input required type="text" value={data.lastName || ''} onChange={e => onChange({ lastName: e.target.value })} className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>{t.email}</label>
        <div className="flex items-end gap-3">
          <input required type="text" value={emailUser} onChange={e => setEmailUser(e.target.value.replace(/[^a-zA-Z0-9._-]/g, ''))} className={`${emailPartClass} flex-1`} placeholder="usuario" />
          <span className="pb-3 text-noga-brown font-bold text-2xl">@</span>
          <input required type="text" value={emailDomain} onChange={e => setEmailDomain(e.target.value.replace(/[^a-zA-Z0-9-]/g, ''))} className={`${emailPartClass} flex-1`} placeholder="dominio" />
          <span className="pb-3 text-noga-brown font-bold text-2xl">.</span>
          <input required type="text" value={emailExt} onChange={e => setEmailExt(e.target.value.replace(/[^a-zA-Z]/g, ''))} className={`${emailPartClass} w-24`} placeholder="com" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <label className={labelClass}>{t.cellphone}</label>
          <div className="flex gap-3">
            <select value={selectedLada} onChange={e => setSelectedLada(e.target.value)} className={`${inputClass} w-40`}>
              {COUNTRY_CODES.map(country => (
                <option key={country.code} value={country.code}>{country.flag} {country.code}</option>
              ))}
            </select>
            <input required type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, ''))} className={inputClass} placeholder="12345678" />
          </div>
        </div>
        <div>
          <label className={labelClass}>{t.nationality}</label>
          <input required type="text" value={data.nationality || ''} onChange={e => onChange({ nationality: e.target.value })} className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <label className={labelClass}>{t.birthday}</label>
          <input required type="date" value={data.birthday || ''} onChange={e => onChange({ birthday: e.target.value })} className={inputClass} />
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

      <button type="submit" className="w-full bg-noga-deepteal text-white py-6 rounded-2xl font-bold hover:bg-noga-brown transition-all shadow-xl active:scale-95 text-xl uppercase tracking-widest">
        {t.continueRules}
      </button>
    </form>
  );
};

export default RegistrationForm;
