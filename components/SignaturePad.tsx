
import React, { useRef, useState, useEffect } from 'react';
import { GuestData, Language } from '../types';
import { RotateCcw, ArrowLeft } from 'lucide-react';
import { translations } from '../translations';

interface SignaturePadProps {
  data: GuestData;
  onComplete: (signature: string) => void;
  onBack: () => void;
  lang: Language;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ data, onComplete, onBack, lang }) => {
  const t = translations[lang];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = '#025159';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const pos = getPos(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
    setHasSignature(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const pos = getPos(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => setIsDrawing(false);

  const clear = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      setHasSignature(false);
    }
  };

  return (
    <div className="py-6 space-y-8 w-full max-w-2xl mx-auto animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-noga-deepteal uppercase tracking-widest">{t.signTitle}</h3>
        <p className="text-sm text-noga-deepteal/60">{t.signSub}</p>
      </div>

      <div className="bg-noga-lightblue/30 p-4 rounded-3xl border-2 border-noga-midteal/40">
        <div className="bg-white rounded-2xl border-2 border-dashed border-noga-midteal/20 overflow-hidden shadow-inner relative">
          <canvas
            ref={canvasRef}
            width={600}
            height={300}
            className="w-full h-64 signature-pad touch-none"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
          {!hasSignature && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-noga-deepteal">{t.signHere}</p>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center mt-3 px-2">
          <div className="text-[10px] text-noga-brown font-bold uppercase tracking-widest">{data.firstName} {data.lastName}</div>
          <button onClick={clear} className="flex items-center gap-1 text-[10px] text-noga-brown font-bold hover:opacity-80">
            <RotateCcw className="w-3 h-3" /> {t.clear}
          </button>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button onClick={onBack} className="flex-1 py-5 border-2 border-noga-midteal/30 text-noga-deepteal rounded-2xl font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2">
          <ArrowLeft className="w-4 h-4" /> {t.back}
        </button>
        <button 
          disabled={!hasSignature}
          onClick={() => onComplete(canvasRef.current?.toDataURL() || '')}
          className={`flex-[2] py-5 rounded-2xl font-bold transition-all shadow-xl active:scale-95 uppercase tracking-widest text-sm ${hasSignature ? 'bg-noga-deepteal text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
        >
          {t.finish}
        </button>
      </div>
    </div>
  );
};

export default SignaturePad;
