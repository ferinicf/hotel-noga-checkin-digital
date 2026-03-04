
import React, { useRef, useState, useEffect } from 'react';
import { Camera, ArrowLeft, Loader2, RefreshCw, ShieldAlert } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface IdCaptureProps {
  onCapture: (base64Image: string) => void;
  onBack: () => void;
  lang: Language;
}

const IdCapture: React.FC<IdCaptureProps> = ({ onCapture, onBack, lang }) => {
  const t = translations[lang];
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [permissionError, setPermissionError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const setupVideo = async () => {
      if (isCameraActive && stream && videoRef.current) {
        if (videoRef.current.srcObject !== stream) {
          videoRef.current.srcObject = stream;
        }
        
        const handleLoadedMetadata = async () => {
          if (!videoRef.current) return;
          try {
            await videoRef.current.play();
          } catch (err) {
            console.error("Autoplay failed:", err);
          }
        };

        videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);

        try {
          await videoRef.current.play();
        } catch (err) {
          if (isMounted) {
            setTimeout(() => {
              if (isMounted && videoRef.current) {
                videoRef.current.play().catch(e => console.error("Retry play failed:", e));
              }
            }, 500);
          }
        }

        return () => {
          if (videoRef.current) {
            videoRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
          }
        };
      }
    };

    setupVideo();
    return () => { isMounted = false; };
  }, [isCameraActive, stream]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async (mode: 'user' | 'environment' = facingMode) => {
    setIsLoading(true);
    setPermissionError(null);
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }

    // Verificar contexto seguro (HTTPS) - Indispensable para getUserMedia
    if (!window.isSecureContext) {
      setPermissionError(lang === 'es' 
        ? "La cámara requiere una conexión segura (HTTPS). Por favor verifica que la URL comience con https://" 
        : "Camera access requires a secure connection (HTTPS). Please ensure the URL starts with https://");
      setIsLoading(false);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("API de cámara no disponible en este navegador");
      }

      const attempts = [
        { video: { facingMode: { ideal: mode }, width: { ideal: 1920 }, height: { ideal: 1080 } } },
        { video: { facingMode: mode } },
        { video: true }
      ];

      let mediaStream: MediaStream | null = null;
      let lastError: any = null;

      for (const constraints of attempts) {
        try {
          mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
          if (mediaStream) break;
        } catch (e) {
          lastError = e;
        }
      }

      if (!mediaStream) throw lastError || new Error("Permission Denied");

      setStream(mediaStream);
      setFacingMode(mode);
      setIsCameraActive(true);
    } catch (err: any) {
      console.error("Error de cámara:", err);
      let errorMsg = lang === 'es' 
        ? "Acceso denegado. Por favor, permite el uso de la cámara en los ajustes de tu navegador y recarga la página." 
        : "Permission denied. Please allow camera access in your browser settings and refresh the page.";
      
      if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMsg = lang === 'es'
          ? "La cámara está siendo usada por otra aplicación o no está disponible."
          : "Camera is already in use by another application or is unavailable.";
      }
      
      setPermissionError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCamera = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    startCamera(nextMode);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !videoRef.current.videoWidth) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      const base64 = canvas.toDataURL('image/jpeg', 0.9);
      stopCamera();
      onCapture(base64);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  return (
    <div className="flex flex-col items-center justify-center py-4 md:py-8 space-y-6 animate-in fade-in duration-500 max-w-2xl mx-auto w-full">
      <div className="text-center space-y-2 px-4">
        <h3 className="text-xl md:text-2xl font-bold text-noga-deepteal uppercase tracking-widest">{t.idTitle}</h3>
        <p className="text-xs md:text-sm text-noga-deepteal/60">{t.idSub}</p>
      </div>

      {permissionError && (
        <div className="w-full mx-4 p-6 bg-red-50 border-2 border-red-200 rounded-3xl flex flex-col items-center text-center space-y-4 animate-in zoom-in duration-300">
          <div className="p-3 bg-red-100 rounded-full text-red-600">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <p className="text-sm font-bold text-red-700 leading-relaxed">{permissionError}</p>
          <button 
            onClick={() => startCamera()} 
            className="text-xs font-bold uppercase tracking-widest bg-red-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-red-700"
          >
            {lang === 'es' ? 'INTENTAR DE NUEVO' : 'TRY AGAIN'}
          </button>
        </div>
      )}

      {!isCameraActive ? (
        <div className="w-full aspect-[4/3] md:aspect-[3/2] bg-noga-lightblue/20 rounded-3xl border-2 border-dashed border-noga-midteal/40 flex flex-col items-center justify-center p-8 space-y-6 mx-4">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center shadow-sm text-noga-brown">
            {isLoading ? <Loader2 className="w-10 h-10 animate-spin" /> : <Camera className="w-10 h-10" />}
          </div>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button 
              disabled={isLoading}
              onClick={() => startCamera('environment')}
              className="bg-noga-deepteal text-white px-6 py-4 rounded-2xl font-bold hover:bg-noga-brown transition-all shadow-xl active:scale-95 disabled:opacity-50 text-sm flex items-center justify-center gap-2"
            >
              {isLoading && facingMode === 'environment' ? <Loader2 className="w-4 h-4 animate-spin" /> : (lang === 'es' ? 'CÁMARA TRASERA' : 'BACK CAMERA')}
            </button>
            <button 
              disabled={isLoading}
              onClick={() => startCamera('user')}
              className="bg-white border-2 border-noga-deepteal text-noga-deepteal px-6 py-4 rounded-2xl font-bold hover:bg-noga-lightblue transition-all shadow-md active:scale-95 disabled:opacity-50 text-sm flex items-center justify-center gap-2"
            >
              {isLoading && facingMode === 'user' ? <Loader2 className="w-4 h-4 animate-spin" /> : (lang === 'es' ? 'CÁMARA FRONTAL' : 'FRONT CAMERA')}
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full space-y-4 px-4">
          <div className="relative rounded-3xl overflow-hidden border-4 border-noga-deepteal shadow-2xl aspect-[4/3] md:aspect-[3/2] bg-black">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`} 
            />
            <div className="absolute inset-0 border-[20px] md:border-[40px] border-black/40 pointer-events-none flex items-center justify-center">
               <div className="w-full h-full border-2 border-dashed border-white/40 rounded-xl"></div>
            </div>
            
            <button 
              onClick={toggleCamera}
              className="absolute top-4 right-4 bg-black/60 text-white p-3 rounded-full hover:bg-noga-brown transition-colors shadow-lg active:scale-90"
              title="Cambiar Cámara"
            >
              <RefreshCw className="w-5 h-5" />
            </button>

            {isLoading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-white animate-spin" />
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={capturePhoto}
              className="flex-1 bg-noga-brown text-white py-5 rounded-2xl font-bold text-lg shadow-lg active:scale-95 flex items-center justify-center gap-2"
            >
              <Camera className="w-6 h-6" /> {t.captureBtn}
            </button>
            <button 
              onClick={stopCamera}
              className="px-6 border-2 border-noga-midteal/30 text-noga-deepteal py-4 rounded-2xl font-bold uppercase text-xs"
            >
              {t.cancel}
            </button>
          </div>
        </div>
      )}

      <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-bold text-noga-midteal uppercase tracking-widest hover:underline pt-2">
        <ArrowLeft className="w-3 h-3" /> {t.back}
      </button>
    </div>
  );
};

export default IdCapture;
