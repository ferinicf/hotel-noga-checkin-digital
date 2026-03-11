
import React, { useState } from 'react';
import { Lock, User, Key, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface AdminLoginProps {
    onLogin: () => void;
    onBack: () => void;
    lang: Language;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onBack, lang }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username === 'admin_noga' && password === '11Ballenas.com') {
            onLogin();
        } else {
            setError(true);
            setTimeout(() => setError(false), 3000);
        }
    };

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 animate-in fade-in zoom-in duration-500">
            <div className="w-full max-w-md bg-white rounded-[40px] shadow-2xl border border-noga-midteal/10 p-8 md:p-12 space-y-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-noga-brown"></div>

                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-20 h-20 bg-noga-brown/10 rounded-full flex items-center justify-center text-noga-brown">
                        <ShieldCheck className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-bold text-noga-deepteal uppercase tracking-widest">Acceso Restringido</h2>
                    <p className="text-sm text-noga-midteal">Ingresa tus credenciales para ver los registros del hotel.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-noga-brown uppercase tracking-widest ml-1">Usuario</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-noga-midteal" />
                            <input
                                required
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                className="w-full bg-noga-lightblue/30 border-2 border-transparent focus:border-noga-brown rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-medium text-noga-deepteal"
                                placeholder="Nombre de usuario"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-noga-brown uppercase tracking-widest ml-1">Contraseña</label>
                        <div className="relative">
                            <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-noga-midteal" />
                            <input
                                required
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full bg-noga-lightblue/30 border-2 border-transparent focus:border-noga-brown rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-medium text-noga-deepteal"
                                placeholder="••••••••••••"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-xs font-bold text-center animate-bounce">
                            Credenciales incorrectas. Intenta de nuevo.
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-noga-deepteal text-white py-5 rounded-2xl font-bold shadow-xl active:scale-95 transition-all text-lg uppercase tracking-widest hover:bg-noga-brown"
                    >
                        INGRESAR
                    </button>
                </form>

                <button
                    onClick={onBack}
                    className="w-full flex items-center justify-center gap-2 text-xs font-bold text-noga-midteal uppercase pt-2 hover:text-noga-brown transition-colors"
                >
                    <ArrowLeft className="w-3 h-3" /> Volver al Inicio
                </button>
            </div>
        </div>
    );
};

export default AdminLogin;
