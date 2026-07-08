import { RideRequest } from '../types';

export const initialSimulatedRides: RideRequest[] = [
  {
    id: 'ride-1',
    timestamp: '18:02:15',
    pickup: 'Aeroporto de Congonhas (CGH)',
    destination: 'Av. Paulista, 1000',
    price: 52.00,
    distance: 9.2,
    durationMinutes: 22,
    valuePerKm: 5.65,
    direction: 'Norte',
    efficiencyScore: 96,
    routeColor: '#ef4444', // Red
    status: 'pending',
    rawText: 'Nova oferta recebida!\nDe: Aeroporto de Congonhas\nPara: Av. Paulista, 1000\nValor oferecido: R$ 52,00\nDistância: 9,2 km\nToque para ver detalhes.',
    routePoints: [
      { x: 150, y: 380 }, // Congonhas
      { x: 160, y: 320 },
      { x: 180, y: 260 },
      { x: 170, y: 180 }, // Paulista
    ]
  },
  {
    id: 'ride-2',
    timestamp: '18:03:00',
    pickup: 'Estação Pinheiros Metro',
    destination: 'Vila Olímpia (Rua Funchal)',
    price: 28.00,
    distance: 4.1,
    durationMinutes: 11,
    valuePerKm: 6.82,
    direction: 'Sul',
    efficiencyScore: 98,
    routeColor: '#22c55e', // Green
    status: 'pending',
    rawText: 'Oferta de Viagem!\nDe: Metrô Pinheiros\nPara: R. Funchal - Vila Olímpia\nValor: R$ 28,00\nDistância: 4.1 km\nTarifa proposta pelo passageiro.',
    routePoints: [
      { x: 80, y: 200 }, // Pinheiros
      { x: 100, y: 240 },
      { x: 120, y: 290 }, // Vila Olimpia
    ]
  },
  {
    id: 'ride-3',
    timestamp: '18:01:40',
    pickup: 'Shopping Morumbi',
    destination: 'Itaim Bibi (Av. Faria Lima)',
    price: 36.50,
    distance: 6.8,
    durationMinutes: 18,
    valuePerKm: 5.36,
    direction: 'Norte',
    efficiencyScore: 89,
    routeColor: '#3b82f6', // Blue
    status: 'pending',
    rawText: 'inDrive Passagem:\nShopping Morumbi -> Av. Brigadeiro Faria Lima, 3500\nValor: R$ 36,50 | Distância: 6,8km',
    routePoints: [
      { x: 110, y: 420 }, // Morumbi
      { x: 130, y: 350 },
      { x: 140, y: 270 }, // Itaim
    ]
  },
  {
    id: 'ride-4',
    timestamp: '18:00:10',
    pickup: 'Barra Funda Terminal',
    destination: 'Lapa (Rua Clélia)',
    price: 18.00,
    distance: 3.5,
    durationMinutes: 10,
    valuePerKm: 5.14,
    direction: 'Oeste',
    efficiencyScore: 84,
    routeColor: '#eab308', // Yellow
    status: 'pending',
    rawText: 'inDrive Viagem Rápida:\nTerminal Barra Funda para Rua Clélia, Lapa\nR$ 18,00 | 3,5 km',
    routePoints: [
      { x: 190, y: 80 }, // Barra Funda
      { x: 140, y: 90 },
      { x: 110, y: 110 }, // Lapa
    ]
  },
  {
    id: 'ride-5',
    timestamp: '18:04:10',
    pickup: 'Metrô Santana',
    destination: 'Guarulhos Centro',
    price: 64.00,
    distance: 14.8,
    durationMinutes: 35,
    valuePerKm: 4.32,
    direction: 'Leste',
    efficiencyScore: 78,
    routeColor: '#a855f7', // Purple
    status: 'pending',
    rawText: 'inDrive Longa Distância:\nMetrô Santana para Guarulhos Centro\nValor Proposto: R$ 64,00\nTotal: 14,8 km',
    routePoints: [
      { x: 220, y: 140 }, // Santana
      { x: 270, y: 150 },
      { x: 320, y: 170 }, // Guarulhos
    ]
  },
  {
    id: 'ride-6',
    timestamp: '17:59:30',
    pickup: 'Bela Vista',
    destination: 'Liberdade (Metrô)',
    price: 12.00,
    distance: 2.1,
    durationMinutes: 8,
    valuePerKm: 5.71,
    direction: 'Leste',
    efficiencyScore: 75,
    routeColor: '#f97316', // Orange
    status: 'pending',
    rawText: 'Corrida Curta:\nBela Vista para Metrô Liberdade\nPreço: R$ 12,00 | Distância: 2,1 km',
    routePoints: [
      { x: 180, y: 210 },
      { x: 210, y: 220 },
    ]
  },
  {
    id: 'ride-7',
    timestamp: '18:05:00',
    pickup: 'Ibirapuera Park',
    destination: 'Moema (Av. Ibirapuera)',
    price: 16.00,
    distance: 2.8,
    durationMinutes: 7,
    valuePerKm: 5.71,
    direction: 'Sul',
    efficiencyScore: 82,
    routeColor: '#06b6d4', // Cyan
    status: 'pending',
    rawText: 'Nova Corrida:\nParque do Ibirapuera para Av. Ibirapuera, Moema\nR$ 16,00 - 2,8 km',
    routePoints: [
      { x: 160, y: 300 },
      { x: 150, y: 340 },
    ]
  },
  {
    id: 'ride-8',
    timestamp: '18:05:40',
    pickup: 'Jardins (Rua Oscar Freire)',
    destination: 'Butantã (USP)',
    price: 32.00,
    distance: 7.5,
    durationMinutes: 20,
    valuePerKm: 4.26,
    direction: 'Oeste',
    efficiencyScore: 76,
    routeColor: '#ec4899', // Pink
    status: 'pending',
    rawText: 'Pedido de Corrida:\nOscar Freire para Portão 1 USP Butantã\nOferecido: R$ 32,00 | Distância: 7,5 km',
    routePoints: [
      { x: 140, y: 230 },
      { x: 90, y: 220 },
      { x: 50, y: 210 },
    ]
  }
];

export const newSimulatedIncomingRides: RideRequest[] = [
  {
    id: 'ride-9',
    timestamp: '18:06:15',
    pickup: 'República (Praça)',
    destination: 'Mooca (Rua Juventus)',
    price: 45.00,
    distance: 6.2,
    durationMinutes: 15,
    valuePerKm: 7.25,
    direction: 'Leste',
    efficiencyScore: 99,
    routeColor: '#10b981', // Emerald green
    status: 'pending',
    rawText: 'Oportunidade Imperdível!\nDe: Praça da República\nPara: Rua Juventus, Mooca\nValor: R$ 45,00\nDistância: 6,2 km\nEficiência Excelente!',
    routePoints: [
      { x: 200, y: 180 },
      { x: 230, y: 200 },
      { x: 260, y: 210 },
    ]
  },
  {
    id: 'ride-10',
    timestamp: '18:07:05',
    pickup: 'Vila Madalena',
    destination: 'Santana (Voluntários)',
    price: 58.00,
    distance: 12.1,
    durationMinutes: 28,
    valuePerKm: 4.79,
    direction: 'Norte',
    efficiencyScore: 81,
    routeColor: '#6366f1', // Indigo
    status: 'pending',
    rawText: 'Corrida Longa:\nVila Madalena para Rua Voluntários da Pátria, Santana\nValor: R$ 58,00 | Distância: 12,1 km',
    routePoints: [
      { x: 90, y: 170 },
      { x: 130, y: 130 },
      { x: 180, y: 120 },
      { x: 210, y: 140 },
    ]
  },
  {
    id: 'ride-11',
    timestamp: '18:08:20',
    pickup: 'Santo Amaro',
    destination: 'Aeroporto de Congonhas',
    price: 40.00,
    distance: 8.0,
    durationMinutes: 18,
    valuePerKm: 5.00,
    direction: 'Norte',
    efficiencyScore: 85,
    routeColor: '#ec4899', // Pink
    status: 'pending',
    rawText: 'Passageiro inDrive:\nDe: Santo Amaro\nPara: Aeroporto de Congonhas\nR$ 40,00 | 8,0 km',
    routePoints: [
      { x: 90, y: 460 },
      { x: 120, y: 420 },
      { x: 150, y: 380 },
    ]
  }
];
