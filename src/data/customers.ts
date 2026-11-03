import { Customer } from '../types/game';

export const CUSTOMER_NAMES = [
  'Gatita Mimí',
  'Don Félix Barista',
  'Michi Gamer',
  'Luna Kawaii',
  'Profesor Bigotes',
  'Charly Futbolero',
  'Neko Vamp',
  'Tía Pelusa',
  'Samurái Ronrón',
  'Artista Sofía',
];

export const CUSTOMER_DIALOGUES: Record<string, string[]> = {
  arigato_gold: [
    '¡Hola maestro! Necesito una taza de la buena suerte para mi café mañanero.',
    '¡Una taza Súper Arigato por favor! Me dijeron que atrae clientes.',
    '¡Quiero la taza oficial del gatito dorado!',
  ],
  taller_foco: [
    '¡Vengo por una taza del Laboratorio de Ideas! Estoy diseñando mi tesis.',
    'Ese foco con orejitas es lo más genial. ¡Prepárame una bien calentita!',
    '¡Una taza para inspirarme en la oficina, por favor!',
  ],
  gato_vampiro: [
    '¡Miau! Busco algo tenebroso pero adorable para noche de películas.',
    '¡La taza del Conde Michi con su calabacita es perfecta para té negro!',
    '¡Una taza espeluznante para mi colección de Halloween!',
  ],
  silla_estrellada: [
    '¡Qué arte! Esa panorámica de La Silla con noche estrellada es una joya.',
    '¡Para recordar las montañas de Monterrey con un buen café caliente!',
    '¡Una de La Silla Estrellada para regalar a mi mejor amigo!',
  ],
  balon_gato: [
    '¡Golazo! El domingo hay partido y quiero mi taza futbolera.',
    '¡Ese gato balón me da toda la energía para entrenar temprano!',
  ],
  super_gracias: [
    '¡Quiero agradecerle a mi equipo de trabajo con una taza Súper Gracias!',
    '¡El diseño pop con estrellas amarillas está increíble!',
  ],
  gato_rosa: [
    '¡Adoro el color rosa! Prepárame esa taza tan tierna.',
    '¡Para mi matcha latte diario, qué lindura!',
  ],
  gato_azul: [
    '¡El azul de la fortuna me dará serenidad en mis jornadas de estudio!',
    '¡Una taza azul cobalto con el maneki-neko, por favor!',
  ],
};

export const WORKSHOP_UPGRADES = [
  {
    id: 'turbo_press',
    name: 'Prensa Turbo 333',
    description: 'La resistencia calienta 25% más rápido y da mayor zona de perfección.',
    cost: 150,
    level: 1,
    maxLevel: 4,
    icon: '🔥',
    bonusText: '+25% Velocidad de calor',
  },
  {
    id: 'golden_lever',
    name: 'Palanca de Oro',
    description: 'Palanca ergonómica que duplica las propinas de clientes felices.',
    cost: 200,
    level: 0,
    maxLevel: 3,
    icon: '✨',
    bonusText: '+20% Propinas extras',
  },
  {
    id: 'auto_tape',
    name: 'Dispensador Rápido de Cinta',
    description: 'Aplica cinta térmica en un solo toque instantáneo.',
    cost: 120,
    level: 0,
    maxLevel: 2,
    icon: '🟡',
    bonusText: 'Fijado de papel ultra-rápido',
  },
  {
    id: 'ceramic_shelf',
    name: 'Estantería de Lujo',
    description: 'Atrae clientes VIP que pagan el doble de monedas.',
    cost: 300,
    level: 0,
    maxLevel: 3,
    icon: '🏆',
    bonusText: 'Clientes VIP frecuentes',
  },
];
