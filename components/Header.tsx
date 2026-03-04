import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-noga-deepteal text-white p-6 sticky top-0 z-50 shadow-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <h1 className="text-3xl font-light tracking-tighter italic" style={{ fontFamily: 'serif' }}>
              Hotel <span className="font-bold text-noga-brown not-italic">Noga</span>
            </h1>
          </div>
          <div className="h-10 w-px bg-noga-brown/30 hidden md:block"></div>
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-widest text-noga-brown">Tarjeta de Registro</span>
            <span className="text-xs text-noga-lightblue/70">Registration Card</span>
          </div>
        </div>
        <div className="flex flex-col text-right text-[10px] text-noga-lightblue/50">
          <span>@HOTELNOGA</span>
          <a href="https://www.hnoga.com" className="text-noga-brown hover:underline">WWW.HNOGA.COM</a>
        </div>
      </div>
    </header>
  );
};

export default Header;
