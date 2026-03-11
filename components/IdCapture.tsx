
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Camera, ArrowLeft, Loader2, RefreshCw, ShieldAlert, Zap } from 'lucide-react';
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [permissionError, setPermissionError] = useState<string | null>(null);

  // Auto-capture state
  const [countdown, setCountdown] = useState(15);
  const animationRef = useRef<number>();
  const cameraStartTimeRef = useRef<number>(0);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !videoRef.current.videoWidth) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d', { alpha: false });

    if (ctx) {
      if (facingMode === 'user') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(videoRef.current, 0, 0);
      const base64 = canvas.toDataURL('image/jpeg', 0.9);

      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
      setIsCameraActive(false);
      onCapture(base64);
    }
  }, [facingMode, onCapture, stream]);

  // Timer for 15 seconds
  useEffect(() => {
    if (!isCameraActive) {
      setCountdown(15);
      return;
    }

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          capturePhoto();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isCameraActive, capturePhoto]);

  useEffect(() => {
    let isMounted = true;
    const setupVideo = async () => {
      if (isCameraActive && stream && videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch (err) {
          if (isMounted) setTimeout(() => videoRef.current?.play(), 500);
        }
      }
    };
    setupVideo();
    return () => { isMounted = false; };
  }, [isCameraActive, stream]);

  const startCamera = async (mode: 'user' | 'environment' = facingMode) => {
    setIsLoading(true);
    setPermissionError(null);
    setCountdown(15);
    cameraStartTimeRef.current = Date.now();

    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }

    try {
      const constraints = {
        video: {
          facingMode: mode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      };
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setFacingMode(mode);
      setIsCameraActive(true);
    } catch (err: any) {
      setPermissionError(lang === 'es' ? "Error al acceder a la cámara." : "Error accessing camera.");
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (stream) stream.getTracks().forEach(track => track.stop());
    setStream(null);
    setIsCameraActive(false);
  };

  return (
    <div className="flex flex-col items-center justify-center py-4 space-y-6 animate-in fade-in duration-500 max-w-2xl mx-auto w-full">
      <canvas ref={canvasRef} width="320" height="240" className="hidden" />

      <div className="text-center space-y-2 px-4">
        <h3 className="text-xl md:text-2xl font-bold text-noga-deepteal uppercase tracking-widest">{t.idTitle}</h3>
        <p className="text-xs md:text-sm text-noga-deepteal/60">{t.idSub}</p>
      </div>

      {!isCameraActive ? (
        <div className="w-full aspect-[4/3] bg-noga-lightblue/20 rounded-3xl border-2 border-dashed border-noga-midteal/40 flex flex-col items-center justify-center p-8 space-y-6 mx-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-noga-brown">
            {isLoading ? <Loader2 className="animate-spin" /> : <Camera className="w-10 h-10" />}
          </div>
          <button
            onClick={() => startCamera('environment')}
            className="bg-noga-deepteal text-white px-8 py-4 rounded-2xl font-bold shadow-xl active:scale-95 flex items-center gap-2"
          >
            {lang === 'es' ? 'ABRIR CÁMARA' : 'OPEN CAMERA'}
          </button>
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

            {/* Guide Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[80%] h-[70%] border-4 border-dashed rounded-3xl border-white/40">
              </div>

              <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center space-y-3">
                <div className="bg-black/60 backdrop-blur-md px-6 py-2 rounded-full flex items-center gap-2 border border-white/20">
                  <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-widest">
                    {t.autoCaptureMessage.replace('{seconds}', countdown.toString())}
                  </span>
                </div>
                <div className="w-48 h-2 bg-white/20 rounded-full overflow-hidden border border-white/10">
                  <div
                    className="h-full bg-noga-brown transition-all duration-100 ease-out"
                    style={{ width: `${(1 - (countdown / 15)) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => startCamera(facingMode === 'environment' ? 'user' : 'environment')}
              className="absolute top-4 right-4 bg-black/60 text-white p-3 rounded-full shadow-lg"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col items-center justify-center py-4 bg-noga-brown/10 rounded-2xl border border-noga-brown/20 px-6 text-center">
            <p className="text-noga-deepteal font-bold text-sm md:text-base uppercase tracking-wider">
               {t.autoCaptureMessage.replace('{seconds}', countdown.toString())}
            </p>
          </div>
        </div>
      )}

      <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-noga-midteal uppercase pt-2">
        <ArrowLeft className="w-3 h-3" /> {lang === 'es' ? 'VOLVER' : 'BACK'}
      </button>
    </div>
  );
};

export default IdCapture;
