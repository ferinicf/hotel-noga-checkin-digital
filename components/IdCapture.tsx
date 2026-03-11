
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
  const [isAutoCapturing, setIsAutoCapturing] = useState(true);
  const [detectionProgress, setDetectionProgress] = useState(0);
  const [debugSharpness, setDebugSharpness] = useState(0);
  const animationRef = useRef<number>();
  const lastSharpnessRef = useRef<number[]>([]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !videoRef.current.videoWidth) return;

    const canvas = document.createElement('canvas');
    // Usamos resolución alta para la captura final
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

      // Stop animation and camera
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
      setIsCameraActive(false);

      onCapture(base64);
    }
  }, [facingMode, onCapture, stream]);

  // Sharpness Detection Loop
  useEffect(() => {
    if (!isCameraActive || !isAutoCapturing || !videoRef.current) return;

    const analyzeFrame = () => {
      if (!videoRef.current || !canvasRef.current) {
        animationRef.current = requestAnimationFrame(analyzeFrame);
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', { alpha: false });

      if (ctx && video.readyState === video.HAVE_ENOUGH_DATA) {
        // Analizamos el centro de la imagen donde suele estar el documento
        const scanWidth = canvas.width;
        const scanHeight = canvas.height;
        ctx.drawImage(video, 0, 0, scanWidth, scanHeight);

        // Obtenemos solo el área central (60% del centro) para enfocar la detección
        const rectSize = 0.7;
        const startX = Math.floor(scanWidth * (1 - rectSize) / 2);
        const startY = Math.floor(scanHeight * (1 - rectSize) / 2);
        const width = Math.floor(scanWidth * rectSize);
        const height = Math.floor(scanHeight * rectSize);

        const imageData = ctx.getImageData(startX, startY, width, height);
        const data = imageData.data;

        let diff = 0;
        let brightness = 0;
        // Salto de 4 para mayor velocidad pero buena precisión
        for (let i = 0; i < data.length - 4; i += 4) {
          const gray1 = (data[i] + data[i + 1] + data[i + 2]) / 3;
          // Comparamos con el siguiente pixel para detectar bordes
          const gray2 = (data[i + 4] + data[i + 5] + data[i + 6]) / 3;
          diff += Math.abs(gray1 - gray2);
          brightness += gray1;
        }

        const pixelsCount = (width * height);
        const currentSharpness = (diff / pixelsCount) * 10; // Escalado para mejor lectura
        const avgBrightness = brightness / pixelsCount;

        setDebugSharpness(currentSharpness);

        // Suavizado (mantenemos las últimas 5 muestras)
        lastSharpnessRef.current.push(currentSharpness);
        if (lastSharpnessRef.current.length > 5) lastSharpnessRef.current.shift();
        const avgSharpness = lastSharpnessRef.current.reduce((a, b) => a + b, 0) / lastSharpnessRef.current.length;

        // Umbral de nitidez mucho más estricto (12.0) para asegurar que el documento esté legible
        const minSharpness = 12.0;
        const minBrightness = 45;

        if (avgSharpness > minSharpness && avgBrightness > minBrightness) {
          setDetectionProgress(prev => {
            // Incremento MUCHO más lento para obligar al usuario a mantenerlo fijo (2% o 3%)
            const increment = avgSharpness > 15 ? 4 : 2; 
            const next = prev + increment;
            if (next >= 100) {
              if (prev < 100) {
                // Retardo adicional para asegurar que la cámara haya enfocado bien
                setTimeout(() => capturePhoto(), 800);
              }
              return 100;
            }
            return next;
          });
        } else {
          // Penalización mayor si se mueve o sale del foco
          setDetectionProgress(prev => Math.max(0, prev - 15));
        }
      }

      animationRef.current = requestAnimationFrame(analyzeFrame);
    };

    animationRef.current = requestAnimationFrame(analyzeFrame);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isCameraActive, isAutoCapturing, capturePhoto]);

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
    setDetectionProgress(0);
    lastSharpnessRef.current = [];

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
              {/* Frame central */}
              <div className={`w-[80%] h-[70%] border-4 border-dashed rounded-3xl transition-all duration-300 ${detectionProgress > 10 ? (detectionProgress > 80 ? 'border-green-400 scale-105' : 'border-yellow-400') : 'border-white/40'}`}>
              </div>

              {isAutoCapturing && (
                <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center space-y-3">
                  <div className="bg-black/60 backdrop-blur-md px-6 py-2 rounded-full flex items-center gap-2 border border-white/20">
                    <Zap className={`w-4 h-4 ${detectionProgress > 50 ? 'text-yellow-400 fill-yellow-400' : 'text-white'}`} />
                    <span className="text-xs font-bold text-white uppercase tracking-widest">
                      {detectionProgress > 0 ? (lang === 'es' ? `Escaneando: ${detectionProgress}%` : `Scanning: ${detectionProgress}%`) : (lang === 'es' ? 'Centra el documento' : 'Center the document')}
                    </span>
                  </div>
                  <div className="w-48 h-2 bg-white/20 rounded-full overflow-hidden border border-white/10">
                    <div
                      className="h-full bg-noga-brown transition-all duration-100 ease-out"
                      style={{ width: `${detectionProgress}%` }}
                    />
                  </div>

                  {/* Debug info (invisible para el usuario normal por transparencia) */}
                  <span className="text-[8px] text-white/5 font-mono">DEBUG_SHARP: {debugSharpness.toFixed(2)}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => startCamera(facingMode === 'environment' ? 'user' : 'environment')}
              className="absolute top-4 right-4 bg-black/60 text-white p-3 rounded-full shadow-lg"
            >
              <RefreshCw className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsAutoCapturing(!isAutoCapturing)}
              className={`absolute top-4 left-4 p-3 rounded-full shadow-lg ${isAutoCapturing ? 'bg-noga-brown text-white' : 'bg-black/60 text-white'}`}
            >
              <Zap className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={capturePhoto}
              className="flex-1 bg-noga-brown text-white py-5 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2"
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

      <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-noga-midteal uppercase pt-2">
        <ArrowLeft className="w-3 h-3" /> {t.back}
      </button>
    </div>
  );
};

export default IdCapture;
