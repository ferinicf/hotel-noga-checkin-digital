import React, { useState, useCallback, useEffect } from 'react';
import { AppStep, GuestData, Language } from './types';
import Header from './components/Header';
import Welcome from './components/Welcome';
import IdCapture from './components/IdCapture';
import RegistrationForm from './components/RegistrationForm';
import RulesGrid from './components/RulesGrid';
import SignaturePad from './components/SignaturePad';
import Confirmation from './components/Confirmation';
import HistoryView from './components/HistoryView';
import GuestReceipt from './components/GuestReceipt';
import { Settings, Loader2, Download, X } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { translations } from './translations';

const STORAGE_KEY = 'noga_guest_history';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>('welcome');
  const [currentLanguage, setCurrentLanguage] = useState<Language>('es');
  const [isExtracting, setIsExtracting] = useState(false);
  const [history, setHistory] = useState<GuestData[]>([]);
  const [receiptData, setReceiptData] = useState<GuestData | null>(null);
  const [guestData, setGuestData] = useState<GuestData>({
    firstName: '',
    lastName: '',
    email: '',
    cellphone: '',
    nationality: '',
    birthday: '',
    checkInDate: new Date().toISOString().split('T')[0],
    checkOutDate: '',
  });

  const t = translations[currentLanguage];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view');
    const guestId = params.get('id');

    const saved = localStorage.getItem(STORAGE_KEY);
    let loadedHistory: GuestData[] = [];
    if (saved) {
      try { 
        loadedHistory = JSON.parse(saved);
        setHistory(loadedHistory); 
      } catch (e) { console.error(e); }
    }

    if (view === 'receipt' && guestId) {
      const found = loadedHistory.find(g => g.id === guestId);
      if (found) {
        setReceiptData(found);
      }
    }
  }, []);

  const extractDataFromId = async (base64Image: string) => {
    setIsExtracting(true);
    setCurrentStep('registration');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const imagePart = {
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Image.split(',')[1],
        },
      };

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { 
          parts: [
            imagePart, 
            { text: "Extract the following information from this ID card: first name, last name, nationality, and birth date. Formatting: birthday must be YYYY-MM-DD. Return ONLY a valid JSON object. No markdown, no explanations." }
          ] 
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              firstName: { type: Type.STRING },
              lastName: { type: Type.STRING },
              nationality: { type: Type.STRING },
              birthday: { type: Type.STRING, description: "YYYY-MM-DD" },
            },
            required: ["firstName", "lastName", "nationality", "birthday"]
          },
        },
      });

      const text = response.text;
      // Limpiar posibles etiquetas markdown si la IA las incluye
      const jsonStr = text.includes('```') ? text.match(/\{[\s\S]*\}/)?.[0] || text : text;
      const extracted = JSON.parse(jsonStr);
      
      setGuestData(prev => ({
        ...prev,
        ...extracted,
        idPhoto: base64Image
      }));
    } catch (error) {
      console.error("AI Extraction failed:", error);
      setGuestData(prev => ({ ...prev, idPhoto: base64Image }));
    } finally {
      setIsExtracting(false);
    }
  };

  const handleUpdateGuest = useCallback((newData: Partial<GuestData>) => {
    setGuestData(prev => ({ ...prev, ...newData }));
  }, []);

  const saveToHistory = (finalData: GuestData) => {
    let updatedHistory;
    let finalWithId = { ...finalData };
    
    if (finalData.id) {
      updatedHistory = history.map(item => item.id === finalData.id ? finalData : item);
    } else {
      finalWithId.id = crypto.randomUUID();
      updatedHistory = [finalWithId, ...history];
    }
    
    setGuestData(finalWithId);
    setHistory(updatedHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  };

  const handleDeleteGuest = (id: string) => {
    if (window.confirm(currentLanguage === 'es' ? '¿Estás seguro de que deseas eliminar este registro?' : 'Are you sure you want to delete this record?')) {
      const updatedHistory = history.filter(item => item.id !== id);
      setHistory(updatedHistory);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    }
  };

  const handleEditGuest = (guest: GuestData) => {
    setGuestData(guest);
    setCurrentStep('registration');
  };

  const goToStep = (step: AppStep) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentStep(step);
  };

  const resetForm = () => {
    setGuestData({
      firstName: '',
      lastName: '',
      email: '',
      cellphone: '',
      nationality: '',
      birthday: '',
      checkInDate: new Date().toISOString().split('T')[0],
      checkOutDate: '',
    });
    if (window.location.search) {
      window.history.replaceState({}, '', window.location.pathname);
    }
    setReceiptData(null);
    goToStep('welcome');
  };

  if (receiptData) {
    return (
      <div className="min-h-screen bg-gray-200/50 p-4 md:p-8 flex flex-col items-center">
        <div className="max-w-4xl w-full space-y-6">
          <div className="flex justify-between items-center no-print bg-white/80 backdrop-blur-md p-4 rounded-3xl shadow-lg border border-white sticky top-4 z-[100]">
             <button 
               onClick={resetForm} 
               className="flex items-center gap-2 bg-noga-deepteal text-white px-6 py-3 rounded-2xl font-bold uppercase text-xs shadow-md transition-transform active:scale-95"
             >
               <X className="w-4 h-4" /> Cerrar
             </button>
             <button 
               onClick={() => window.print()} 
               className="flex items-center gap-2 bg-noga-brown text-white px-8 py-3 rounded-2xl font-bold uppercase text-xs shadow-xl transition-transform active:scale-95"
             >
               <Download className="w-4 h-4" /> Guardar PDF
             </button>
          </div>
          <GuestReceipt data={receiptData} lang={currentLanguage} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white relative w-full">
      <Header />
      
      <main className="flex-1 p-4 md:p-12 pb-32 w-full mx-auto">
        {isExtracting && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-md z-[100] flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-12 h-12 text-noga-brown animate-spin" />
            <p className="text-noga-deepteal font-bold uppercase tracking-widest text-base">{t.scanning}</p>
            <p className="text-sm text-noga-midteal">{t.scanningSub}</p>
          </div>
        )}

        <div className="w-full h-full">
          {currentStep === 'welcome' && (
            <Welcome 
              onStart={() => goToStep('id-capture')} 
              lang={currentLanguage} 
              onLangChange={setCurrentLanguage} 
            />
          )}

          {currentStep === 'id-capture' && (
            <IdCapture 
              onCapture={extractDataFromId} 
              onBack={() => goToStep('welcome')} 
              lang={currentLanguage}
            />
          )}

          {currentStep === 'registration' && (
            <RegistrationForm 
              data={guestData} 
              onChange={handleUpdateGuest} 
              onNext={() => goToStep('rules')} 
              lang={currentLanguage}
            />
          )}

          {currentStep === 'rules' && (
            <RulesGrid 
              onNext={() => goToStep('signature')} 
              onBack={() => goToStep('registration')}
              lang={currentLanguage}
            />
          )}

          {currentStep === 'signature' && (
            <SignaturePad 
              data={guestData}
              onComplete={(signature) => {
                const finalData = { 
                  ...guestData,
                  signature, 
                  acceptedAt: new Date().toLocaleString() 
                };
                saveToHistory(finalData);
                goToStep('confirmation');
              }}
              onBack={() => goToStep('rules')}
              lang={currentLanguage}
            />
          )}

          {currentStep === 'confirmation' && (
            <Confirmation data={guestData} onReset={resetForm} lang={currentLanguage} />
          )}

          {currentStep === 'history' && (
            <HistoryView 
              history={history} 
              onBack={() => goToStep('welcome')} 
              lang={currentLanguage} 
              onEdit={handleEditGuest}
              onDelete={handleDeleteGuest}
            />
          )}
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t p-4 px-6 md:px-12 flex justify-between items-center z-50 no-print shadow-inner">
        <div className="flex flex-col">
          <p className="text-[12px] text-noga-deepteal font-bold uppercase tracking-tight">Hotel Noga</p>
          <p className="text-[10px] text-noga-midteal">Comunidad y Convivencia</p>
        </div>
        <button 
          onClick={() => goToStep('history')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-noga-midteal/30 text-noga-deepteal hover:bg-noga-lightblue transition-colors"
        >
          <Settings className="w-4 h-4" />
          <span className="text-[12px] font-bold uppercase">Registros</span>
        </button>
      </footer>
    </div>
  );
};

export default App;
