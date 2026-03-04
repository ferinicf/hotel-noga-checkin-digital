
import React from 'react';
import { 
  LogIn, LogOut, CreditCard, Dog, Vault, 
  WineOff, Footprints, Volume2, Waves, 
  Wind, Key, Ban, Users, 
  Cigarette, UtensilsCrossed, AlertTriangle,
  Shirt, ShieldAlert
} from 'lucide-react';
import { Rule } from './types';

export const HOTEL_NOGA_RULES: Rule[] = [
  {
    id: 'check-in',
    title: { es: 'CHECK IN', en: 'CHECK IN', fr: 'ARRIVÉE', it: 'ARRIVO', de: 'CHECK-IN', pt: 'ENTRADA' },
    subtitle: { es: 'Entrada 3 pm', en: 'Entry 3 pm', fr: 'Entrée 15h', it: 'Ingresso ore 15', de: 'Check-in 15:00', pt: 'Entrada 15:00' },
    description: {
      es: 'Entrada 3 pm.',
      en: 'Entry 3 pm.',
      fr: 'Entrée 15h.',
      it: 'Ingresso ore 15.',
      de: 'Check-in 15:00 Uhr.',
      pt: 'Entrada 15h.'
    },
    icon: <LogIn className="w-8 h-8" />,
    color: 'text-brown'
  },
  {
    id: 'check-out',
    title: { es: 'CHECK OUT', en: 'CHECK OUT', fr: 'DÉPART', it: 'PARTENZA', de: 'CHECK-OUT', pt: 'SAÍDA' },
    subtitle: { es: 'Salida 11 am', en: 'Exit 11 am', fr: 'Départ 11h', it: 'Partenza ore 11', de: 'Check-out 11:00', pt: 'Saída 11:00' },
    description: {
      es: 'Salida 11 am.',
      en: 'Exit 11 am.',
      fr: 'Départ 11h.',
      it: 'Partenza ore 11.',
      de: 'Check-out 11:00 Uhr.',
      pt: 'Saída 11h.'
    },
    icon: <LogOut className="w-8 h-8" />,
    color: 'text-deepteal'
  },
  {
    id: 'payment',
    title: { es: 'PAGOS', en: 'PAYMENT', fr: 'PAIEMENT', it: 'PAGAMENTO', de: 'ZAHLUNG', pt: 'PAGAMENTO' },
    subtitle: { es: 'Al llegar', en: 'On arrival', fr: 'À l\'arrivée', it: 'All\'arrivo', de: 'Bei Ankunft', pt: 'À chegada' },
    description: {
      es: 'Al llegar realizar el pago.',
      en: 'Payment is due on arrival.',
      fr: 'Paiement à l\'arrivée.',
      it: 'Pagamento all\'arrivo.',
      de: 'Zahlung bei Ankunft fällig.',
      pt: 'Pagamento à llegada.'
    },
    icon: <CreditCard className="w-8 h-8" />,
    color: 'text-brown'
  },
  {
    id: 'pets',
    title: { es: 'MASCOTAS', en: 'PETS', fr: 'ANIMAUX', it: 'ANIMALI', de: 'HAUSTIERE', pt: 'ANIMAIS' },
    subtitle: { es: 'Solo excepciones', en: 'Only exceptions', fr: 'Exceptions', it: 'Solo eccezioni', de: 'Ausnahmen', pt: 'Exceções' },
    description: {
      es: 'Solo excepciones bajo solicitud.',
      en: 'Only exceptions upon request.',
      fr: 'Seulement exceptions sur demande.',
      it: 'Solo eccezioni su richiesta.',
      de: 'Nur Ausnahmen auf Anfrage.',
      pt: 'Apenas exceções sob consulta.'
    },
    icon: <Dog className="w-8 h-8" />,
    color: 'text-brown'
  },
  {
    id: 'safe',
    title: { es: 'CAJA FUERTE', en: 'SAFE', fr: 'COFFRE', it: 'CASSAFORTE', de: 'SAFE', pt: 'COFRE' },
    subtitle: { es: 'En el cuarto', en: 'In room', fr: 'En chambre', it: 'In camera', de: 'Im Zimmer', pt: 'No quarto' },
    description: {
      es: 'En todos los cuartos.',
      en: 'In every room.',
      fr: 'Dans toutes les chambres.',
      it: 'In ogni camera.',
      de: 'In jedem Zimmer.',
      pt: 'Em todos os quartos.'
    },
    icon: <Vault className="w-8 h-8" />,
    color: 'text-deepteal'
  },
  {
    id: 'food',
    title: { es: 'ALIMENTOS', en: 'FOOD', fr: 'ALIMENTS', it: 'CIBO', de: 'ESSEN', pt: 'ALIMENTOS' },
    subtitle: { es: 'No externos', en: 'No external', fr: 'Pas d\'externe', it: 'No esterno', de: 'Keine externen', pt: 'Não externos' },
    description: {
      es: 'No se puede introducir alimentos ajenos al restaurante.',
      en: 'No external food allowed from outside the restaurant.',
      fr: 'Aliments extérieurs non autorisés.',
      it: 'Cibo esterno non consentito.',
      de: 'Keine externen Speisen erlaubt.',
      pt: 'Não é permitido comida externa.'
    },
    icon: <UtensilsCrossed className="w-8 h-8" />,
    color: 'text-brown'
  },
  {
    id: 'alcohol',
    title: { es: 'ALCOHOL', en: 'ALCOHOL', fr: 'ALCOOL', it: 'ALCOL', de: 'ALKOHOL', pt: 'ÁLCOOL' },
    subtitle: { es: 'Prohibido', en: 'Prohibited', fr: 'Interdit', it: 'Vietato', de: 'Verboten', pt: 'Proibido' },
    description: {
      es: 'El ingreso de bebidas alcohólicas está estrictamente prohibido.',
      en: 'Do not enter alcoholic beverages into our facilities.',
      fr: 'Boissons alcoolisées interdites.',
      it: 'Bevande alcoliche vietate.',
      de: 'Alkoholische Getränke verboten.',
      pt: 'Bebidas alcoólicas proibidas.'
    },
    icon: <WineOff className="w-8 h-8" />,
    color: 'text-brown'
  },
  {
    id: 'dont-run',
    title: { es: 'NO CORRER', en: 'DON\'T RUN', fr: 'NE PAS COURIR', it: 'NON CORRERE', de: 'NICHT RENNEN', pt: 'NÃO CORRER' },
    subtitle: { es: 'Seguridad', en: 'Safety first', fr: 'Sécurité', it: 'Sicurezza', de: 'Sicherheit', pt: 'Segurança' },
    description: {
      es: 'No corra dentro de las instalaciones.',
      en: 'Please don’t run inside the facilities.',
      fr: 'Ne pas courir dans l\'établissement.',
      it: 'Non correre all\'interno della struttura.',
      de: 'Bitte rennen Sie nicht in der Anlage.',
      pt: 'Não corra dentro das instalações.'
    },
    icon: <Footprints className="w-8 h-8" />,
    color: 'text-deepteal'
  },
  {
    id: 'noise',
    title: { es: 'RUIDO', en: 'NOISE', fr: 'BRUIT', it: 'RUMORE', de: 'LÄRM', pt: 'RUÍDO' },
    subtitle: { es: '¡Moderado!', en: 'Be quiet!', fr: 'Soyez calme', it: 'Moderato', de: 'Leise bitte', pt: 'Moderado' },
    description: {
      es: 'Mantén un volumen moderado ¡Siempre!',
      en: 'Keep the noise level reasonable at all times.',
      fr: 'Gardez le silence à tout moment.',
      it: 'Mantenere il volume moderato sempre.',
      de: 'Lärmpegel jederzeit niedrig halten.',
      pt: 'Mantenha o volume moderado siempre.'
    },
    icon: <Volume2 className="w-8 h-8" />,
    color: 'text-deepteal'
  },
  {
    id: 'towels',
    title: { es: 'TOALLAS', en: 'TOWELS', fr: 'SERVIETTES', it: 'ASCIUGAMANI', de: 'HANDTÜCHER', pt: 'TOALHAS' },
    subtitle: { es: 'Cuídalas', en: 'Take care', fr: 'Prendre soin', it: 'Curale', de: 'Pflege', pt: 'Cuide' },
    description: {
      es: 'Cuida las toallas de playa y de habitación.',
      en: 'Take care of the beach and room towels.',
      fr: 'Prenez soin des serviettes de plage et de chambre.',
      it: 'Cura gli asciugamani da spiaggia e da camera.',
      de: 'Strand- und Zimmerhandtücher schonen.',
      pt: 'Cuide das toalhas de praia e de quarto.'
    },
    icon: <Shirt className="w-8 h-8" />,
    color: 'text-brown'
  },
  {
    id: 'ac',
    title: { es: 'AIRE ACC', en: 'A/C', fr: 'CLIM', it: 'A/C', de: 'KLIMA', pt: 'AR COND.' },
    subtitle: { es: 'Apágalo', en: 'Turn off', fr: 'Éteindre', it: 'Spegni', de: 'Ausschalten', pt: 'Desligue' },
    description: {
      es: 'Apágalo al salir del cuarto.',
      en: 'Turn the A/C off when you leave the room.',
      fr: 'Éteignez la clim en sortant.',
      it: 'Spegni l\'aria condizionata quando esci.',
      de: 'Klimaanlage beim Verlassen ausschalten.',
      pt: 'Desligue o ar condicionado ao sair.'
    },
    icon: <Wind className="w-8 h-8" />,
    color: 'text-deepteal'
  },
  {
    id: 'keys',
    title: { es: 'LLAVES', en: 'KEYS', fr: 'CLÉS', it: 'CHIAVI', de: 'SCHLÜSSEL', pt: 'CHAVES' },
    subtitle: { es: 'No las pierdas', en: 'Don\'t lose', fr: 'Ne perdez pas', it: 'Non perderle', de: 'Nicht verlieren', pt: 'Não perca' },
    description: {
      es: 'Llévalas siempre contigo, no las pierdas.',
      en: 'Always keep it with you, don’t lose them.',
      fr: 'Gardez-les sur vous, ne les perdez pas.',
      it: 'Portile sempre con te, non perderle.',
      de: 'Immer dabei haben, nicht verlieren.',
      pt: 'Leve-as siempre consigo, não as perca.'
    },
    icon: <Key className="w-8 h-8" />,
    color: 'text-brown'
  },
  {
    id: 'drugs',
    title: { es: 'DROGAS', en: 'DRUGS', fr: 'DROGUES', it: 'DROGHE', de: 'DROGEN', pt: 'DROGAS' },
    subtitle: { es: 'Prohibido', en: 'Prohibited', fr: 'Interdit', it: 'Vietato', de: 'Verboten', pt: 'Proibido' },
    description: {
      es: 'Compra, venta y consumo están totalmente prohibidos.',
      en: 'Strictly prohibited.',
      fr: 'Strictement interdit.',
      it: 'Severamente vietato.',
      de: 'Strengstens verboten.',
      pt: 'Estritamente proibido.'
    },
    icon: <Ban className="w-8 h-8" />,
    color: 'text-brown'
  },
  {
    id: 'damages',
    title: { es: 'DAÑOS', en: 'DAMAGES', fr: 'DOMMAGES', it: 'DANNI', de: 'SCHÄDEN', pt: 'DANOS' },
    subtitle: { es: 'Responsable', en: 'Responsible', fr: 'Responsable', it: 'Responsabile', de: 'Verantwortlich', pt: 'Responsável' },
    description: {
      es: 'Daños serán penalizados.',
      en: 'Enjoy responsibly. Fees apply for damage.',
      fr: 'Dommages pénalisés.',
      it: 'I danni saranno penalizzati.',
      de: 'Schäden werden in Rechnung gestellt.',
      pt: 'Danos serão penalizados.'
    },
    icon: <ShieldAlert className="w-8 h-8" />,
    color: 'text-brown'
  },
  {
    id: 'visitors',
    title: { es: 'VISITANTES', en: 'VISITORS', fr: 'VISITEURS', it: 'VISITATORI', de: 'BESUCHER', pt: 'VISITAS' },
    subtitle: { es: 'Zonas comunes', en: 'Common areas', fr: 'Zones communes', it: 'Zone comuni', de: 'Gemeinschafts.', pt: 'Áreas comuns' },
    description: {
      es: 'Solo en zonas sociales, no en los cuartos.',
      en: 'Welcome in common areas, not in rooms.',
      fr: 'Zones sociales seulement.',
      it: 'Solo aree sociali, no camere.',
      de: 'Nur in Gemeinschaftsbereichen.',
      pt: 'Apenas áreas comuns, não nos quartos.'
    },
    icon: <Users className="w-8 h-8" />,
    color: 'text-deepteal'
  },
  {
    id: 'tobacco',
    title: { es: 'TABACO', en: 'TOBACCO', fr: 'TABAC', it: 'TABACCO', de: 'TABAK', pt: 'TABACO' },
    subtitle: { es: 'No fumar', en: 'No smoking', fr: 'Non fumeur', it: 'Vietato fumare', de: 'Nicht rauchen', pt: 'Não fumar' },
    description: {
      es: 'Estrictamente prohibido fumar en las habitaciones.',
      en: 'Strictly forbidden inside rooms.',
      fr: 'Interdit dans les chambres.',
      it: 'Vietato nelle camere.',
      de: 'In den Zimmern verboten.',
      pt: 'Proibido nos quartos.'
    },
    icon: <Cigarette className="w-8 h-8" />,
    color: 'text-brown'
  }
];
