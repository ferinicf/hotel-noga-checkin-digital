
import React from 'react';

export type Language = 'es' | 'en' | 'fr' | 'it' | 'de' | 'pt';

export interface GuestData {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  cellphone: string;
  nationality: string;
  birthday: string;
  checkInDate: string;
  checkOutDate: string;
  acceptedAt?: string;
  signature?: string;
  idPhoto?: string;
}

export interface Rule {
  id: string;
  title: Record<Language, string>;
  subtitle: Record<Language, string>;
  description: Record<Language, string>;
  icon: React.ReactNode;
  color: string;
}

export type AppStep = 'welcome' | 'id-capture' | 'registration' | 'rules' | 'signature' | 'confirmation' | 'history';
