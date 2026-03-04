
import React, { useState } from 'react';
import { GuestData, Language } from '../types';
import { translations } from '../translations';
import { 
  Search, ChevronDown, ChevronUp, Mail, Share2, 
  ArrowLeft, Download, Trash2, Edit, FileSpreadsheet, Calendar, FileText
} from 'lucide-react';
import GuestReceipt from './GuestReceipt';

interface HistoryViewProps {
  history: GuestData[];
  onBack: () => void;
  lang: Language;
  onEdit: (guest: GuestData) => void;
  onDelete: (id: string) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, onBack, lang, onEdit, onDelete }) => {
  const t = translations[lang];
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredHistory = history.filter(guest => 
    `${guest.firstName} ${guest.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleShareWhatsApp = (guest: GuestData) => {
    const text = `Registro Hotel Noga - Huésped: ${guest.firstName} ${guest.lastName}. Registrado el: ${guest.acceptedAt}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleSendEmail = (guest: GuestData) => {
    const subject = `Registro Hotel Noga - ${guest.firstName} ${guest.lastName}`;
    const body = `Resumen de Registro:\nNombre: ${guest.firstName} ${guest.lastName}\nEmail: ${guest.email}\nCheck-in: ${guest.checkInDate}\nCheck-out: ${guest.checkOutDate}\nFirmado el: ${guest.acceptedAt}`;
    window.location.href = `mailto:${guest.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleExportCSV = () => {
    let dataToExport = history;
    if (startDate || endDate) {
      dataToExport = history.filter(guest => {
        if (!guest.acceptedAt) return false;
        const guestDate = new Date(guest.acceptedAt).getTime();
        const start = startDate ? new Date(startDate).getTime() : 0;
        const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : Infinity;
        return guestDate >= start && guestDate <= end;
      });
    }

    if (dataToExport.length === 0) return;

    const headers = ["Nombre", "Apellido", "Email", "Celular", "Nacionalidad", "Check-In", "Check-Out", "Fecha Registro"];
    const csvContent = [
      headers.join(","),
      ...dataToExport.map(g => [g.firstName, g.lastName, g.email, g.cellphone, g.nationality, g.checkInDate, g.checkOutDate, g.acceptedAt].map(v => `"${v}"`).join(","))
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `registros_noga_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="py-6 space-y-6 w-full max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4 no-print">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 hover:bg-noga-lightblue rounded-full transition-colors">
            <ArrowLeft className="w-8 h-8 text-noga-deepteal" />
          </button>
          <div>
            <h2 className="text-3xl font-bold text-noga-deepteal">{t.historyTitle}</h2>
            <p className="text-sm text-noga-midteal uppercase font-bold tracking-widest">Admin Panel</p>
          </div>
        </div>

        <div className="bg-noga-lightblue/20 p-4 rounded-3xl border border-noga-midteal/20 flex flex-wrap items-end gap-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-noga-brown uppercase tracking-widest flex items-center gap-1"><Calendar className="w-3 h-3" /> {lang === 'es' ? 'Desde' : 'From'}</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-white border border-noga-midteal/20 rounded-xl px-3 py-2 text-sm font-bold text-noga-deepteal outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-noga-brown uppercase tracking-widest flex items-center gap-1"><Calendar className="w-3 h-3" /> {lang === 'es' ? 'Hasta' : 'To'}</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-white border border-noga-midteal/20 rounded-xl px-3 py-2 text-sm font-bold text-noga-deepteal outline-none" />
          </div>
          <button onClick={handleExportCSV} className="flex items-center gap-2 bg-noga-deepteal text-white px-5 py-2.5 rounded-xl text-sm font-bold uppercase hover:bg-noga-brown shadow-md">
            <FileSpreadsheet className="w-4 h-4" /> EXCEL
          </button>
        </div>
      </div>

      <div className="relative no-print">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-noga-midteal" />
        <input 
          type="text" 
          placeholder={lang === 'es' ? "Buscar por nombre o email..." : "Search by name or email..."}
          className="w-full pl-12 pr-4 py-5 bg-white border border-noga-midteal/20 rounded-2xl outline-none focus:border-noga-brown transition-colors text-base font-medium shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 no-print">
             <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
             <p className="text-noga-midteal font-bold text-lg">{lang === 'es' ? "No hay resultados" : "No records found"}</p>
          </div>
        ) : (
          filteredHistory.map((guest) => (
            <div key={guest.id} className="bg-white border border-noga-midteal/10 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all print:border-none print:shadow-none print:m-0">
              <button 
                onClick={() => setExpandedId(expandedId === guest.id ? null : guest.id || null)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-noga-lightblue/5 transition-colors no-print"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-noga-deepteal text-white rounded-2xl flex items-center justify-center font-bold text-xl">
                    {guest.firstName[0]}{guest.lastName[0]}
                  </div>
                  <div>
                    <p className="font-bold text-noga-deepteal text-lg">{guest.firstName} {guest.lastName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[12px] bg-noga-brown/10 text-noga-brown px-2 py-0.5 rounded-full font-bold uppercase">{guest.nationality}</span>
                      <p className="text-[12px] text-noga-midteal font-bold">{guest.acceptedAt}</p>
                    </div>
                  </div>
                </div>
                {expandedId === guest.id ? <ChevronUp className="w-6 h-6 text-noga-midteal" /> : <ChevronDown className="w-6 h-6 text-noga-midteal" />}
              </button>

              {(expandedId === guest.id || window.matchMedia('print').matches) && (
                <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-300">
                  <div className="no-print mb-8">
                     <div className="flex flex-wrap gap-3 py-4 border-b border-noga-lightblue/30 mb-6">
                        <button onClick={() => handleSendEmail(guest)} className="flex-1 flex items-center justify-center gap-2 py-3 bg-noga-deepteal/5 text-noga-deepteal rounded-xl text-xs font-bold uppercase hover:bg-noga-deepteal hover:text-white transition-all"><Mail size={16}/> Email</button>
                        <button onClick={() => handleShareWhatsApp(guest)} className="flex-1 flex items-center justify-center gap-2 py-3 bg-noga-deepteal/5 text-noga-deepteal rounded-xl text-xs font-bold uppercase hover:bg-noga-deepteal hover:text-white transition-all"><Share2 size={16}/> WhatsApp</button>
                        <button onClick={() => onEdit(guest)} className="flex-1 flex items-center justify-center gap-2 py-3 bg-noga-brown/5 text-noga-brown rounded-xl text-xs font-bold uppercase hover:bg-noga-brown hover:text-white transition-all"><Edit size={16}/> Editar</button>
                        <button onClick={() => guest.id && onDelete(guest.id)} className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-50 text-red-500 rounded-xl text-xs font-bold uppercase hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16}/> Eliminar</button>
                        <button onClick={() => window.print()} className="flex-1 flex items-center justify-center gap-2 py-3 bg-noga-brown text-white rounded-xl text-xs font-bold uppercase hover:bg-noga-deepteal transition-all shadow-md"><Download size={16}/> PDF</button>
                     </div>
                  </div>
                  
                  {/* Reutilizamos el componente GuestReceipt para mostrar el documento oficial */}
                  <GuestReceipt data={guest} lang={lang} />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryView;
