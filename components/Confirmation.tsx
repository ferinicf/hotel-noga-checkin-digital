
import React from 'react';
import { GuestData, Language } from '../types';
import { Mail, Share2, CheckCircle2, PlusCircle, ExternalLink } from 'lucide-react';
import { translations } from '../translations';

interface ConfirmationProps {
  data: GuestData;
  onReset: () => void;
  lang: Language;
}

const Confirmation: React.FC<ConfirmationProps> = ({ data, onReset, lang }) => {
  const t = translations[lang];
  const receiptUrl = `${window.location.origin}${window.location.pathname}?view=receipt&id=${data.id}`;
  
  const handleShareWhatsApp = () => {
    const text = `Registro Hotel Noga - Huésped: ${data.firstName} ${data.lastName}. Normas y Registro: ${receiptUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleSendEmail = () => {
    const subject = "Registro Hotel Noga - " + data.firstName;
    const body = `Hola ${data.firstName},\n\nGracias por registrarte.\nPuedes consultar las normas y tu certificado firmado en el siguiente enlace:\n\n${receiptUrl}\n\n¡Disfruta tu estancia!`;
    window.location.href = `mailto:${data.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleOpenReceipt = () => {
    window.open(receiptUrl, '_blank');
  };

  return (
    <div className="py-10 space-y-12 animate-in fade-in zoom-in duration-700 max-w-4xl mx-auto flex flex-col items-center">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-28 h-28 bg-noga-deepteal text-white rounded-full mb-4 shadow-2xl ring-8 ring-noga-lightblue">
          <CheckCircle2 className="w-16 h-16" />
        </div>
        <h2 className="text-5xl font-bold text-noga-deepteal">{t.confTitle}</h2>
        <p className="text-xl text-noga-deepteal/60 font-medium max-w-lg mx-auto">{t.confSub}</p>
      </div>

      <div className="w-full bg-noga-lightblue/10 p-10 rounded-[50px] border-2 border-noga-midteal/20 shadow-inner flex flex-col items-center gap-8">
        
        {/* Resumen y Acciones */}
        <div className="w-full max-w-2xl space-y-8">
          <div className="bg-white p-10 rounded-[45px] shadow-xl border-2 border-noga-deepteal/10 flex flex-col items-center text-center space-y-4">
            <div className="bg-noga-deepteal text-white px-6 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg mb-2">
              REGISTRO EXITOSO
            </div>
            <div>
              <p className="text-[12px] font-bold text-noga-brown uppercase tracking-widest mb-1">Huésped</p>
              <p className="text-3xl font-bold text-noga-deepteal">{data.firstName} {data.lastName}</p>
              <p className="text-sm text-noga-midteal font-bold mt-2 uppercase tracking-wider">{data.nationality} • {data.acceptedAt}</p>
            </div>
            <div className="pt-4 w-full">
              <button 
                onClick={handleOpenReceipt}
                className="w-full flex items-center justify-center gap-3 bg-noga-deepteal text-white py-5 rounded-3xl font-bold hover:bg-noga-brown transition-all shadow-lg active:scale-95 text-sm uppercase tracking-widest"
              >
                <ExternalLink className="w-5 h-5" /> 
                Ver Documento Digital
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick={handleSendEmail}
              className="flex items-center justify-center gap-3 p-6 bg-white rounded-3xl border-2 border-noga-midteal/20 text-noga-deepteal hover:bg-noga-lightblue transition-all shadow-md font-bold text-xs uppercase tracking-widest"
            >
              <Mail className="w-5 h-5 text-noga-brown" /> Enviar por Email
            </button>
            <button 
              onClick={handleShareWhatsApp}
              className="flex items-center justify-center gap-3 p-6 bg-white rounded-3xl border-2 border-noga-midteal/20 text-noga-deepteal hover:bg-noga-lightblue transition-all shadow-md font-bold text-xs uppercase tracking-widest"
            >
              <Share2 className="w-5 h-5 text-noga-brown" /> Compartir WhatsApp
            </button>
          </div>
        </div>
      </div>
      
      <button 
        onClick={onReset}
        className="flex items-center gap-4 bg-noga-brown text-white px-12 py-6 rounded-full font-bold hover:bg-noga-deepteal transition-all shadow-2xl active:scale-95 text-xl uppercase tracking-widest"
      >
        <PlusCircle className="w-7 h-7" /> 
        {t.newReg}
      </button>

      <p className="text-[10px] text-noga-midteal font-bold uppercase tracking-[0.5em] opacity-30">Hotel Noga Digital Check-in Security System</p>
    </div>
  );
};

export default Confirmation;
