
import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { 
  History, 
  UserPlus, 
  Settings, 
  ChevronRight,
  Loader2
} from 'lucide-react';
import Welcome from './components/Welcome';
import IdCapture from './components/IdCapture';
import RegistrationForm from './components/RegistrationForm';
import Rules from './components/Rules';
import Signature from './components/Signature';
import Confirmation from './components/Confirmation';
import HistoryView from './components/HistoryView';
import AdminLogin from './components/AdminLogin';
import { GuestData, AppStep, Language } from './types';
import { translations } from './translations';
import { supabase } from './supabaseClient';

const initialGuestData: GuestData = {
  firstName: '',
  lastName: '',
  email: '',
  cellphone: '',
  nationality: '',
  birthday: '',
  checkInDate: new Date().toISOString().split('T')[0],
  checkOutDate: '',
  idPhoto: '',
  signature: '',
  acceptedRules: false
};

function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>('welcome');
  const [guestData, setGuestData] = useState<GuestData>(initialGuestData);
  const [language, setLanguage] = useState<Language>('es');
  const [isExtracting, setIsExtracting] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const t = translations[language];

  // Auto-save to Supabase if finished
  const handleFinish = async () => {
    try {
      // 1. Upload ID Photo to Storage
      let idPhotoUrl = '';
      if (guestData.idPhoto) {
        const fileExt = 'jpg';
        const fileName = `${Date.now()}_id.${fileExt}`;
        const base64Data = guestData.idPhoto.split(',')[1];
        const blob = await fetch(`data:image/jpeg;base64,${base64Data}`).then(res => res.blob());

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('guest-documents')
          .upload(fileName, blob);

        if (uploadError) throw uploadError;
        idPhotoUrl = fileName;
      }

      // 2. Upload Signature to Storage
      let signatureUrl = '';
      if (guestData.signature) {
        const fileExt = 'png';
        const fileName = `${Date.now()}_sign.${fileExt}`;
        const base64Data = guestData.signature.split(',')[1];
        const blob = await fetch(`data:image/png;base64,${base64Data}`).then(res => res.blob());

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('guest-signatures')
          .upload(fileName, blob);

        if (uploadError) throw uploadError;
        signatureUrl = fileName;
      }

      // 3. Save Record to Database
      const { error } = await supabase.from('guests').insert([
        {
          first_name: guestData.firstName,
          last_name: guestData.lastName,
          email: guestData.email,
          cellphone: guestData.cellphone,
          nationality: guestData.nationality,
          birthday: guestData.birthday,
          check_in_date: guestData.checkInDate,
          check_out_date: guestData.checkOutDate,
          id_photo_url: idPhotoUrl,
          signature_url: signatureUrl,
          accepted_rules: guestData.acceptedRules,
          language: language
        }
      ]);

      if (error) throw error;
      setCurrentStep('confirmation');
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error al guardar el registro. Por favor intente de nuevo.');
    }
  };

  const resetApp = () => {
    setGuestData(initialGuestData);
    setCurrentStep('welcome');
  };

  const extractDataFromId = async (base64Image: string) => {
    // Usamos el API Key de entorno o el fallback proporcionado por el usuario
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyCJx1rjECSWsIUZXd2UQ1kB5E0_o7ZjzFA';

    setIsExtracting(true);
    setCurrentStep('registration');

    try {
      const ai = new GoogleGenAI(apiKey);
      const imagePart = {
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Image.split(',')[1],
        },
      };

      const prompt = `
        Analiza esta imagen de una identificación oficial (INE, Licencia, Pasaporte, etc.).
        Extrae los siguientes datos con la mayor precisión posible:
        1. Nombres (firstName): Solo los nombres, omitiendo apellidos.
        2. Apellidos (lastName): Todos los apellidos encontrados.
        3. Nacionalidad (nationality): El país de origen o nacionalidad.
        4. Fecha de Nacimiento (birthday): En formato YYYY-MM-DD.

        PAUTAS IMPORTANTES:
        - Si es un INE mexicano, el "Nombre" suele incluir apellidos en líneas separadas; sepáralos correctamente.
        - Si un dato no es legible, usa "".
        - No inventes datos.
        - Responde EXCLUSIVAMENTE con un objeto JSON válido, sin bloques de código markdown, sin explicaciones.
        
        FORMATO DE RESPUESTA:
        {"firstName": "JUAN", "lastName": "PEREZ GARCIA", "nationality": "MEXICANA", "birthday": "1990-05-15"}
      `;

      const model = ai.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
          temperature: 0.1, // Baja temperatura para mayor precisión en datos estructurados
          topP: 1,
          topK: 1,
        }
      });

      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      let text = response.text();
      
      console.log("Gemini Raw Response:", text);

      // Limpieza profunda del texto para extraer solo el JSON
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}') + 1;
      
      if (jsonStart === -1) throw new Error("No JSON found");
      
      const jsonStr = text.substring(jsonStart, jsonEnd);
      const raw = JSON.parse(jsonStr);

      const normalized = {
        firstName: raw.firstName || raw.first_name || raw.nombre || raw.nombres || '',
        lastName: raw.lastName || raw.last_name || raw.apellido || raw.apellidos || '',
        nationality: raw.nationality || raw.nacionalidad || raw.pais || '',
        birthday: raw.birthday || raw.fecha_nacimiento || raw.birth_date || ''
      };

      setGuestData(prev => ({
        ...prev,
        ...normalized,
        idPhoto: base64Image
      }));
    } catch (error) {
      console.error('Error extracting data:', error);
      setGuestData(prev => ({ ...prev, idPhoto: base64Image }));
    } finally {
      setIsExtracting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return <Welcome onStart={() => setCurrentStep('idCapture')} onLanguageChange={setLanguage} lang={language} />;
      
      case 'idCapture':
        return <IdCapture onCapture={extractDataFromId} onBack={() => setCurrentStep('welcome')} lang={language} />;
      
      case 'registration':
        return (
          <div className="relative">
            {isExtracting && (
              <div className="absolute inset-x-0 -top-4 z-10 bg-noga-brown/10 backdrop-blur-md p-4 rounded-2xl border border-noga-brown/20 animate-pulse flex items-center justify-center gap-3">
                <Loader2 className="w-5 h-5 text-noga-brown animate-spin" />
                <span className="text-sm font-bold text-noga-brown uppercase tracking-widest">{t.scanning}</span>
              </div>
            )}
            <RegistrationForm 
              data={guestData} 
              onChange={(data) => setGuestData(prev => ({ ...prev, ...data }))} 
              onNext={() => setCurrentStep('rules')}
              lang={language}
            />
          </div>
        );
      
      case 'rules':
        return <Rules onAccept={() => setCurrentStep('signature')} onBack={() => setCurrentStep('registration')} lang={language} />;
      
      case 'signature':
        return (
          <Signature 
            onSign={(sig) => {
              setGuestData(prev => ({ ...prev, signature: sig, acceptedRules: true }));
              handleFinish();
            }} 
            onBack={() => setCurrentStep('rules')} 
            lang={language} 
          />
        );
      
      case 'confirmation':
        return <Confirmation data={guestData} onNew={resetApp} lang={language} />;
      
      case 'login':
        return (
          <AdminLogin 
            onLogin={() => {
              setIsAdminAuthenticated(true);
              setCurrentStep('history');
            }} 
            onBack={resetApp}
            lang={language}
          />
        );

      case 'history':
        return isAdminAuthenticated ? (
          <HistoryView onBack={resetApp} lang={language} />
        ) : (
          <AdminLogin 
            onLogin={() => {
              setIsAdminAuthenticated(true);
              setCurrentStep('history');
            }} 
            onBack={resetApp}
            lang={language}
          />
        );
      
      default:
        return <Welcome onStart={() => setCurrentStep('idCapture')} onLanguageChange={setLanguage} lang={language} />;
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-noga-deepteal flex flex-col">
      {/* Header */}
      <header className="bg-noga-deepteal text-white py-8 px-6 shadow-2xl relative overflow-hidden">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center relative z-10 gap-6">
          <div className="flex flex-col items-center md:items-start">
            <h1 className="text-4xl md:text-5xl font-serif tracking-tight flex items-baseline gap-2">
              Hotel <span className="text-noga-lightblue italic font-normal">Noga</span>
            </h1>
            <div className="h-1 w-24 bg-noga-brown mt-2 rounded-full"></div>
          </div>
          <div className="flex flex-col items-center md:items-end uppercase tracking-[0.2em] text-[10px] md:text-xs font-bold space-y-1">
            <span className="text-noga-lightblue">Tarjeta de Registro</span>
            <span className="opacity-60 italic">Registration Card</span>
          </div>
          
          <div className="hidden md:block text-[10px] opacity-40 text-right font-medium">
            @HOTELNOGA<br />WWW.HNOGA.COM
          </div>
        </div>
        {/* Abstract design elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-noga-brown/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10">
        <div className="bg-white">
          {renderStep()}
        </div>
      </main>

      {/* Footer / Navigation */}
      <footer className="bg-noga-lightblue/10 py-8 px-6 border-t border-noga-midteal/10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start space-y-1">
            <span className="text-xs font-black uppercase tracking-widest text-noga-deepteal">Hotel Noga</span>
            <span className="text-[10px] text-noga-midteal/60 font-medium">Comunidad y Convivencia</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCurrentStep('login')}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-noga-midteal/20 rounded-2xl shadow-sm hover:shadow-md transition-all text-noga-deepteal text-[10px] font-bold uppercase tracking-widest group"
            >
              <Settings className="w-4 h-4 text-noga-midteal group-hover:rotate-90 transition-transform duration-500" />
              Registros
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
