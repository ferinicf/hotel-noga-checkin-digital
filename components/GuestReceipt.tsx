
import React from 'react';
import { GuestData, Language } from '../types';
import { HOTEL_NOGA_RULES } from '../constants';
import { translations } from '../translations';
import { ShieldCheck, Calendar, MapPin, User, FileText, CheckCircle2 } from 'lucide-react';

interface GuestReceiptProps {
  data: GuestData;
  lang: Language;
}

const GuestReceipt: React.FC<GuestReceiptProps> = ({ data, lang }) => {
  const t = translations[lang];

  return (
    <div className="bg-white shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] max-w-4xl mx-auto my-4 md:my-10 print:shadow-none print:m-0 border-t-[12px] border-noga-deepteal rounded-t-3xl overflow-hidden">
      
      {/* Cabecera del Documento Legal */}
      <div className="p-10 border-b border-noga-lightblue/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gray-50/50">
        <div>
          <h1 className="text-5xl font-light italic mb-2" style={{ fontFamily: 'serif' }}>
            Hotel <span className="font-bold text-noga-brown not-italic">Noga</span>
          </h1>
          <div className="flex items-center gap-2 text-noga-deepteal">
            <ShieldCheck className="w-5 h-5" />
            <p className="text-[12px] font-bold uppercase tracking-[0.3em]">Certificado de Registro y Aceptación</p>
          </div>
        </div>
        <div className="text-right border-l-2 border-noga-brown/20 pl-6">
          <p className="text-[10px] text-noga-midteal font-bold uppercase mb-1">Folio de Registro</p>
          <p className="text-sm font-bold text-noga-deepteal uppercase tracking-widest">#{data.id?.substring(0, 8).toUpperCase()}</p>
          <div className="flex items-center justify-end gap-2 mt-2 text-noga-brown">
            <Calendar className="w-3 h-3" />
            <p className="text-[11px] font-bold">{data.acceptedAt}</p>
          </div>
        </div>
      </div>

      <div className="p-10 space-y-12">
        
        {/* Información del Huésped e Identificación */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-noga-brown/10 pb-2">
              <User className="w-4 h-4 text-noga-brown" />
              <h3 className="text-[12px] font-bold text-noga-brown uppercase tracking-widest">Detalles del Huésped</h3>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-noga-midteal font-bold uppercase">{t.firstName}</p>
                  <p className="text-lg font-bold text-noga-deepteal">{data.firstName}</p>
                </div>
                <div>
                  <p className="text-[10px] text-noga-midteal font-bold uppercase">{t.lastName}</p>
                  <p className="text-lg font-bold text-noga-deepteal">{data.lastName}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-noga-midteal font-bold uppercase">{t.nationality}</p>
                  <p className="text-base font-bold text-noga-deepteal">{data.nationality}</p>
                </div>
                <div>
                  <p className="text-[10px] text-noga-midteal font-bold uppercase">{t.cellphone}</p>
                  <p className="text-base font-bold text-noga-deepteal">{data.cellphone}</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-noga-midteal font-bold uppercase">{t.email}</p>
                <p className="text-base font-medium text-noga-deepteal">{data.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 border-b border-noga-brown/10 pb-2 pt-4">
              <MapPin className="w-4 h-4 text-noga-brown" />
              <h3 className="text-[12px] font-bold text-noga-brown uppercase tracking-widest">Periodo de Estancia</h3>
            </div>
            <div className="flex gap-10">
              <div>
                <p className="text-[10px] text-noga-midteal font-bold uppercase">{t.checkIn}</p>
                <p className="text-base font-bold text-noga-deepteal">{data.checkInDate}</p>
              </div>
              <div>
                <p className="text-[10px] text-noga-midteal font-bold uppercase">{t.checkOut}</p>
                <p className="text-base font-bold text-noga-deepteal">{data.checkOutDate}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[11px] font-bold text-noga-brown uppercase tracking-widest text-center italic">Documento de Identificación Adjunto</h4>
            <div className="bg-gray-100 rounded-[40px] p-4 border-2 border-dashed border-gray-300 flex items-center justify-center min-h-[300px] shadow-inner overflow-hidden">
              {data.idPhoto ? (
                <img src={data.idPhoto} alt="ID Photo" className="w-full h-full object-contain rounded-3xl" />
              ) : (
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No disponible</p>
              )}
            </div>
          </div>
        </div>

        {/* Reglamento Detallado */}
        <div className="space-y-8 bg-gray-50 p-10 rounded-[50px] border border-gray-100">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-noga-deepteal uppercase tracking-widest">Reglamento de Convivencia</h3>
            <p className="text-[10px] text-noga-midteal font-bold uppercase">Aceptado formalmente por el huésped</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
            {HOTEL_NOGA_RULES.map((rule) => (
              <div key={rule.id} className="flex gap-4 items-start p-4 bg-white rounded-3xl border border-noga-midteal/10 shadow-sm">
                <div className={`p-3 rounded-2xl bg-noga-lightblue/20 ${rule.color.replace('text-', 'text-noga-')}`}>
                  {React.cloneElement(rule.icon as React.ReactElement<any>, { size: 20 })}
                </div>
                <div>
                  <h5 className="text-[11px] font-bold text-noga-brown uppercase tracking-wider mb-1">{rule.title[lang]}</h5>
                  <p className="text-[12px] leading-relaxed text-noga-deepteal/80 font-medium">{rule.description[lang]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Penalidades */}
        <div className="bg-noga-brown/5 p-10 rounded-[50px] border-2 border-noga-brown/10">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-5 h-5 text-noga-brown" />
            <h3 className="text-[14px] font-bold text-noga-brown uppercase tracking-widest">{t.penaltiesTitle}</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-[12px] text-noga-deepteal font-bold">
            <div className="flex justify-between border-b border-noga-brown/20 pb-2">
              <span>{t.extraCleaning}</span>
              <span className="text-noga-brown">1,000 MXN</span>
            </div>
            <div className="flex justify-between border-b border-noga-brown/20 pb-2">
              <span>{t.sheets} (Reemplazo)</span>
              <span className="text-noga-brown">2,500 MXN</span>
            </div>
            <div className="flex justify-between border-b border-noga-brown/20 pb-2">
              <span>{t.towels} (Extravío)</span>
              <span className="text-noga-brown">350 MXN</span>
            </div>
            <div className="flex justify-between border-b border-noga-brown/20 pb-2">
              <span>{t.facial} (Toalla)</span>
              <span className="text-noga-brown">100 MXN</span>
            </div>
            <div className="flex justify-between border-b border-noga-brown/20 pb-2">
              <span>{t.key} (Pérdida)</span>
              <span className="text-noga-brown">200 MXN</span>
            </div>
            <div className="flex justify-between border-b border-noga-brown/20 pb-2">
              <span>Otros Daños</span>
              <span className="text-noga-brown italic">Valuación</span>
            </div>
          </div>
        </div>

        {/* Firma y Declaración Final */}
        <div className="pt-10 border-t-2 border-noga-deepteal/10 flex flex-col md:flex-row items-end justify-between gap-12">
          <div className="flex-1 space-y-6">
            <p className="text-[13px] leading-relaxed text-noga-deepteal font-bold italic opacity-80">
              "Declaro bajo protesta de decir verdad que toda la información proporcionada es correcta y que he sido informado de todas las normas de convivencia del Hotel Noga. Me comprometo a respetarlas plenamente, aceptando las penalidades descritas en caso de incumplimiento o daño a la propiedad."
            </p>
            <div className="flex items-center gap-6 pt-4">
              <div className="text-center">
                <p className="text-[10px] text-noga-midteal font-bold uppercase mb-2">Sello Digital</p>
                <div className="w-16 h-16 bg-noga-lightblue/20 rounded-2xl flex items-center justify-center">
                  <ShieldCheck className="w-10 h-10 text-noga-deepteal opacity-20" />
                </div>
              </div>
              <div>
                <p className="text-[10px] text-noga-midteal font-bold uppercase">Validación por</p>
                <p className="text-sm font-bold text-noga-deepteal">SISTEMA DIGITAL NOGA</p>
                <p className="text-[10px] text-noga-brown font-bold uppercase mt-1">NOGA COMMUNITY v1.5</p>
              </div>
            </div>
          </div>

          <div className="w-full md:w-80 space-y-4">
            <p className="text-[11px] font-bold text-noga-brown uppercase tracking-widest text-center">Firma del Huésped</p>
            <div className="bg-noga-lightblue/5 rounded-[40px] p-8 border-2 border-noga-midteal/20 flex items-center justify-center h-52 relative overflow-hidden shadow-sm">
              <div className="absolute inset-0 border-4 border-white pointer-events-none rounded-[38px]"></div>
              {data.signature ? (
                <img src={data.signature} alt="Guest Signature" className="max-h-32 w-auto grayscale mix-blend-multiply" />
              ) : (
                <p className="text-xs text-noga-midteal/40 italic">Firma no registrada</p>
              )}
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-noga-deepteal uppercase">{data.firstName} {data.lastName}</p>
              <p className="text-[10px] text-noga-midteal font-bold">{data.acceptedAt}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer del Documento */}
      <div className="bg-noga-deepteal p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-noga-lightblue/40">
           <CheckCircle2 className="w-8 h-8" />
           <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Documento Validado y Almacenado Seguramente</p>
        </div>
        <p className="text-[10px] text-noga-lightblue/40 font-bold uppercase tracking-[0.5em]">Hotel Noga - Registro Digital © {new Date().getFullYear()}</p>
      </div>
    </div>
  );
};

export default GuestReceipt;
