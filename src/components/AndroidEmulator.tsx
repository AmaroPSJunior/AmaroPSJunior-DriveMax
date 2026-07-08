import React, { useState, useEffect } from 'react';
import { MapProvider, RideRequest, FilterSettings } from '../types';
import { initialSimulatedRides, newSimulatedIncomingRides } from '../data/simulatedRides';
import { 
  Map, Navigation, Filter, Compass, DollarSign, ArrowRight, Play, 
  Terminal, RefreshCw, Layers, CheckCircle2, AlertCircle, ChevronDown, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AndroidEmulator() {
  // State
  const [rides, setRides] = useState<RideRequest[]>(initialSimulatedRides);
  const [mapProvider, setMapProvider] = useState<MapProvider>('google');
  const [selectedRideId, setSelectedRideId] = useState<string | null>('ride-2'); // Pinheiros is default selected
  const [isServiceActive, setIsServiceActive] = useState<boolean>(true);
  const [incomingIndex, setIncomingIndex] = useState<number>(0);
  const [showRedirect, setShowRedirect] = useState<string | null>(null);
  
  // Filtering & Sorting State
  const [filters, setFilters] = useState<FilterSettings>({
    minPrice: 15,
    maxDistance: 12,
    minValPerKm: 2.50,
    preferredDirection: 'Qualquer',
    sortBy: 'efficiency'
  });

  const [isFilterTrayOpen, setIsFilterTrayOpen] = useState<boolean>(true);
  const [logs, setLogs] = useState<string[]>([
    '[Serviço] Inciando InDriveAccessibilityService...',
    '[Serviço] Escutando eventos do pacote: com.indriver.client',
    '[Serviço] Sistema pronto. Aguardando novas propostas na tela...'
  ]);

  // Append logs
  const addLog = (message: string) => {
    const time = new Date().toLocaleTimeString('pt-BR');
    setLogs(prev => [`[${time}] ${message}`, ...prev.slice(0, 15)]);
  };

  // Simulate a new incoming ride parsed by accessibility service
  const simulateIncomingRide = () => {
    if (!isServiceActive) {
      addLog('⚠️ Alerta: Ative o serviço de monitoramento no botão do topo primeiro!');
      return;
    }

    if (incomingIndex >= newSimulatedIncomingRides.length) {
      addLog('ℹ️ Todas as corridas simuladas adicionais já foram injetadas. Reiniciando lista...');
      setRides(initialSimulatedRides);
      setIncomingIndex(0);
      return;
    }

    const nextRide = newSimulatedIncomingRides[incomingIndex];
    
    // Check if already injected
    if (rides.some(r => r.id === nextRide.id)) {
      addLog('ℹ️ Corrida já existente na tela.');
      return;
    }

    setRides(prev => [nextRide, ...prev]);
    setIncomingIndex(prev => prev + 1);
    setSelectedRideId(nextRide.id);

    addLog(`✨ [Acessibilidade] Capturou proposta inDrive: R$ ${nextRide.price.toFixed(2)} | ${nextRide.distance}km`);
    addLog(`🔍 [Parser] RegExp identificou: Origem: "${nextRide.pickup}" | Destino: "${nextRide.destination}"`);
    addLog(`📈 [Algoritmo] Calculado Rendimento: R$ ${nextRide.valuePerKm.toFixed(2)}/km (Score: ${nextRide.efficiencyScore}/100)`);
  };

  // Reset simulator state
  const resetSimulator = () => {
    setRides(initialSimulatedRides);
    setIncomingIndex(0);
    setSelectedRideId('ride-2');
    setLogs([
      '[Serviço] Simulador redefinido para as corridas de exemplo.',
      '[Serviço] Escutando eventos do pacote: com.indriver.client',
    ]);
  };

  // Filter & Sort Logic
  const filteredRides = rides.filter(ride => {
    if (!isServiceActive) return false;
    
    const matchesPrice = ride.price >= filters.minPrice;
    const matchesDistance = ride.distance <= filters.maxDistance;
    const matchesValPerKm = ride.valuePerKm >= filters.minValPerKm;
    const matchesDirection = filters.preferredDirection === 'Qualquer' || ride.direction === filters.preferredDirection;

    return matchesPrice && matchesDistance && matchesValPerKm && matchesDirection;
  });

  // Sort rides to get Top 5
  const sortedRides = [...filteredRides].sort((a, b) => {
    if (filters.sortBy === 'efficiency') return b.efficiencyScore - a.efficiencyScore;
    if (filters.sortBy === 'price') return b.price - a.price;
    if (filters.sortBy === 'distance') return a.distance - b.distance;
    if (filters.sortBy === 'valPerKm') return b.valuePerKm - a.valuePerKm;
    return 0;
  });

  // Limit to Top 5
  const top5Rides = sortedRides.slice(0, 5);

  // Triggered when clicking a ride to open inDrive
  const handleOpenInDrive = (ride: RideRequest) => {
    setShowRedirect(ride.pickup + ' ➔ ' + ride.destination);
    addLog(`📲 [Intent] Abrindo solicitação diretamente no app inDrive original (package: com.indriver.client)`);
    addLog(`📲 [Uri] Carregando deeplink simulated: indrive://ride-request?id=${ride.id}`);
    
    setTimeout(() => {
      setShowRedirect(null);
      addLog(`✅ [Acessibilidade] Retornou ao Driver Assistant. Corrida monitorada.`);
    }, 3000);
  };

  // Toggle active service
  const handleToggleService = () => {
    const nextState = !isServiceActive;
    setIsServiceActive(nextState);
    if (nextState) {
      addLog('🟢 Serviço de Acessibilidade ATIVADO. Analisando tela do inDrive...');
    } else {
      addLog('🔴 Serviço de Acessibilidade DESATIVADO. Coleta pausada.');
    }
  };

  // Map Rendering Variables
  const getMapStyles = () => {
    switch(mapProvider) {
      case 'osm':
        return {
          bg: 'bg-[#f4f3f0]',
          grid: 'stroke-stone-300/60',
          land: '#e4e2db',
          water: '#9bc2e6',
          park: '#c1e5c0',
          roads: 'stroke-white',
          river: 'stroke-[#9bc2e6]',
          labelColor: 'text-stone-600',
          providerName: 'OpenStreetMap (Raster Offline)'
        };
      case 'mapbox':
        return {
          bg: 'bg-[#08090B]',
          grid: 'stroke-white/5',
          land: '#0F1116',
          water: '#1e3a8a',
          park: '#064e3b',
          roads: 'stroke-white/10',
          river: 'stroke-[#1e3a8a]',
          labelColor: 'text-slate-400',
          providerName: 'Mapbox Premium Dark'
        };
      case 'google':
      default:
        return {
          bg: 'bg-[#fcf8f2]',
          grid: 'stroke-orange-200/40',
          land: '#f4ebd8',
          water: '#a5c9eb',
          park: '#d5ebd5',
          roads: 'stroke-yellow-100',
          river: 'stroke-[#a5c9eb]',
          labelColor: 'text-gray-700',
          providerName: 'Google Maps (Trânsito Vetorial)'
        };
    }
  };

  const mapStyle = getMapStyles();
  const selectedRide = rides.find(r => r.id === selectedRideId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* 1. Mobile Phone Emulator (Left - 5 Columns) */}
      <div className="lg:col-span-6 xl:col-span-5 flex justify-center">
        <div className="w-full max-w-[390px] aspect-[9/19] bg-[#0A0B0D] rounded-[48px] p-3.5 border-[8px] border-[#1A1D24] shadow-[0_25px_60px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col ring-4 ring-white/5">
          
          {/* Punch Hole Camera & Speaker */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-[#0A0B0D] rounded-b-2xl z-50 flex items-center justify-center">
            <div className="w-12 h-1 bg-white/10 rounded-full mb-1"></div>
            <div className="w-2.5 h-2.5 bg-slate-900 rounded-full ml-2 mb-1 border border-white/5"></div>
          </div>

          {/* Android Status Bar */}
          <div className="flex justify-between items-center px-6 pt-1 pb-2 text-[10px] font-mono text-slate-400 z-40 bg-[#12141A] select-none border-b border-white/5">
            <span>18:00</span>
            <div className="flex items-center gap-1.5">
              <span>5G</span>
              <div className="w-4 h-2 bg-white/10 rounded-sm relative">
                <div className="absolute top-0 left-0 h-full w-4/5 bg-emerald-500 rounded-sm shadow-[0_0_6px_rgba(16,185,129,0.5)]"></div>
              </div>
              <Compass className="w-3 h-3 text-emerald-400 animate-pulse" />
            </div>
          </div>

          {/* APP INTERFACE BODY */}
          <div className="flex-1 bg-[#0F1116] rounded-[32px] overflow-hidden flex flex-col relative border border-white/10">
            
            {/* Top Assistant Control App Bar */}
            <div className="bg-[#12141A]/95 px-4 py-3 border-b border-white/5 flex items-center justify-between z-30">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-emerald-500 rounded-lg shadow-[0_0_8px_rgba(16,185,129,0.4)]">
                  <Navigation className="w-4 h-4 text-black rotate-45 stroke-[2.5]" />
                </div>
                <div>
                  <h1 className="text-xs font-black uppercase tracking-wider text-white">DRIVEMAX</h1>
                  <span className="text-[9px] text-slate-400 flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${isServiceActive ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)] animate-ping' : 'bg-rose-500'}`}></span>
                    {isServiceActive ? 'PARSER ATIVO' : 'PAUSADO'}
                  </span>
                </div>
              </div>

              {/* Status Switcher Toggle */}
              <button 
                onClick={handleToggleService}
                id="toggle-accessibility-service"
                className={`text-[9px] font-bold px-2.5 py-1 rounded transition-all duration-300 flex items-center gap-1 ${
                  isServiceActive 
                    ? 'bg-emerald-500 text-black shadow-[0_0_8px_rgba(16,185,129,0.4)]' 
                    : 'bg-white/5 text-slate-400 border border-white/10'
                }`}
              >
                <span>{isServiceActive ? 'ATIVADO' : 'DESATIVADO'}</span>
              </button>
            </div>

            {/* MAP LAYOUT SECTION */}
            <div className="h-[210px] relative overflow-hidden shrink-0 border-b border-slate-800/80">
              
              {/* Dynamic Simulated Map (using SVG for extreme performance and beauty) */}
              <div className={`absolute inset-0 ${mapStyle.bg} transition-colors duration-500`}>
                <svg className="w-full h-full" viewBox="0 0 350 210">
                  {/* Grid Lines */}
                  <g className="opacity-40">
                    <line x1="0" y1="40" x2="350" y2="40" className={mapStyle.grid} strokeWidth="1" />
                    <line x1="0" y1="80" x2="350" y2="80" className={mapStyle.grid} strokeWidth="1" />
                    <line x1="0" y1="120" x2="350" y2="120" className={mapStyle.grid} strokeWidth="1" />
                    <line x1="0" y1="160" x2="350" y2="160" className={mapStyle.grid} strokeWidth="1" />
                    <line x1="60" y1="0" x2="60" y2="210" className={mapStyle.grid} strokeWidth="1" />
                    <line x1="120" y1="0" x2="120" y2="210" className={mapStyle.grid} strokeWidth="1" />
                    <line x1="180" y1="0" x2="180" y2="210" className={mapStyle.grid} strokeWidth="1" />
                    <line x1="240" y1="0" x2="240" y2="210" className={mapStyle.grid} strokeWidth="1" />
                    <line x1="300" y1="0" x2="300" y2="210" className={mapStyle.grid} strokeWidth="1" />
                  </g>

                  {/* Rivers / Lakes (Slight variations based on map) */}
                  <path d="M-10,130 Q120,110 200,160 T360,190" fill="none" stroke={mapStyle.water} strokeWidth="20" className="opacity-70" />
                  <rect x="250" y="20" width="50" height="40" fill={mapStyle.park} rx="10" className="opacity-80" />
                  <rect x="20" y="140" width="70" height="50" fill={mapStyle.park} rx="12" className="opacity-80" />

                  {/* Map Roads / Streets Networks */}
                  <g className="opacity-90">
                    {/* Av. Paulista & Faria Lima Grids */}
                    <line x1="20" y1="10" x2="330" y2="200" className={mapStyle.roads} strokeWidth="4" strokeLinecap="round" />
                    <line x1="150" y1="210" x2="150" y2="0" className={mapStyle.roads} strokeWidth="6" strokeLinecap="round" />
                    <line x1="0" y1="100" x2="350" y2="120" className={mapStyle.roads} strokeWidth="5" strokeLinecap="round" />
                    <line x1="20" y1="190" x2="300" y2="30" className={mapStyle.roads} strokeWidth="3" strokeLinecap="round" />
                    <line x1="220" y1="0" x2="220" y2="210" className={mapStyle.roads} strokeWidth="4" strokeLinecap="round" />
                  </g>

                  {/* 5 Colors Active Colored Routes Overlays */}
                  {top5Rides.map((ride) => {
                    const isSelected = selectedRideId === ride.id;
                    const pathD = ride.routePoints.map((pt, i) => `${i === 0 ? 'M' : 'L'}${pt.x},${pt.y - 180}`).join(' '); // Offset y coordinate slightly for map viewport
                    return (
                      <g key={ride.id}>
                        {/* Outer Glow / Outline */}
                        <path
                          d={pathD}
                          fill="none"
                          stroke={ride.routeColor}
                          strokeWidth={isSelected ? "7" : "3.5"}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={`transition-all duration-300 opacity-80 ${isSelected ? 'stroke-current shadow-lg animate-pulse' : 'opacity-40'}`}
                        />
                        {/* Core Line */}
                        <path
                          d={pathD}
                          fill="none"
                          stroke="white"
                          strokeWidth={isSelected ? "2" : "1"}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="opacity-90"
                        />
                        {/* Route Pin Points */}
                        {ride.routePoints.length > 0 && (
                          <>
                            {/* Start Pin */}
                            <circle 
                              cx={ride.routePoints[0].x} 
                              cy={ride.routePoints[0].y - 180} 
                              r={isSelected ? "5" : "3.5"} 
                              fill="#ffffff" 
                              stroke={ride.routeColor} 
                              strokeWidth="2" 
                            />
                            {/* End Pin */}
                            <circle 
                              cx={ride.routePoints[ride.routePoints.length - 1].x} 
                              cy={ride.routePoints[ride.routePoints.length - 1].y - 180} 
                              r={isSelected ? "6" : "4.5"} 
                              fill={ride.routeColor} 
                              stroke="#ffffff" 
                              strokeWidth="1.5" 
                            />
                          </>
                        )}
                      </g>
                    );
                  })}

                  {/* Current Driver Location Pin */}
                  <g transform="translate(150, 110)">
                    <circle r="12" fill="#3b82f6" fillOpacity="0.25" className="animate-ping" />
                    <circle r="7" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                    {/* Navigation arrow */}
                    <path d="M0,-3 L3,3 L0,1 L-3,3 Z" fill="#ffffff" />
                  </g>
                </svg>
              </div>

              {/* Map Provider Overlay Toggle Badge */}
              <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 text-[9px] font-medium text-slate-300 flex items-center gap-1 select-none">
                <Layers className="w-3 h-3 text-emerald-400" />
                <span>{mapStyle.providerName}</span>
              </div>

              {/* Map provider choices float selector */}
              <div className="absolute bottom-2 right-2 bg-black/90 backdrop-blur-md p-1 rounded-lg border border-white/10 flex gap-1 z-20">
                <button
                  onClick={() => setMapProvider('google')}
                  id="btn-provider-google"
                  className={`text-[8px] font-bold px-1.5 py-1 rounded transition-colors ${
                    mapProvider === 'google' ? 'bg-emerald-500 text-black font-black' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  GOOGLE
                </button>
                <button
                  onClick={() => setMapProvider('osm')}
                  id="btn-provider-osm"
                  className={`text-[8px] font-bold px-1.5 py-1 rounded transition-colors ${
                    mapProvider === 'osm' ? 'bg-emerald-500 text-black font-black' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  OSM
                </button>
                <button
                  onClick={() => setMapProvider('mapbox')}
                  id="btn-provider-mapbox"
                  className={`text-[8px] font-bold px-1.5 py-1 rounded transition-colors ${
                    mapProvider === 'mapbox' ? 'bg-emerald-500 text-black font-black' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  MAPBOX
                </button>
              </div>
            </div>

            {/* FILTERS TRAY SECTION */}
            <div className="bg-[#12141A] border-b border-white/5 flex flex-col z-20">
              <button 
                onClick={() => setIsFilterTrayOpen(!isFilterTrayOpen)}
                id="btn-toggle-filters-tray"
                className="px-4 py-1.5 flex items-center justify-between hover:bg-white/5 transition text-[10px] font-black uppercase tracking-wider text-slate-300 select-none"
              >
                <span className="flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-emerald-400" />
                  Filtros de Ganho Ideal
                </span>
                <span className="text-[9px] text-emerald-400 flex items-center gap-1 font-bold">
                  {isFilterTrayOpen ? 'Fechar Painel' : 'Abrir Painel'}
                  <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isFilterTrayOpen ? 'rotate-180' : ''}`} />
                </span>
              </button>

              {isFilterTrayOpen && (
                <div className="px-4 pb-3.5 pt-2 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-white/5 bg-[#12141A]/50 text-[10px] text-slate-400">
                  {/* Min Price Slider */}
                  <div className="flex flex-col gap-0.5">
                    <div className="flex justify-between items-center text-[9px]">
                      <span>Valor Mínimo</span>
                      <span className="font-semibold text-slate-200">R$ {filters.minPrice}</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="50" 
                      step="2"
                      value={filters.minPrice}
                      id="input-min-price"
                      onChange={(e) => setFilters(prev => ({...prev, minPrice: Number(e.target.value)}))}
                      className="w-full accent-emerald-500 h-1 bg-white/5 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Max Distance Slider */}
                  <div className="flex flex-col gap-0.5">
                    <div className="flex justify-between items-center text-[9px]">
                      <span>Distância Máxima</span>
                      <span className="font-semibold text-slate-200">{filters.maxDistance} km</span>
                    </div>
                    <input 
                      type="range" 
                      min="3" 
                      max="20" 
                      step="1"
                      value={filters.maxDistance}
                      id="input-max-distance"
                      onChange={(e) => setFilters(prev => ({...prev, maxDistance: Number(e.target.value)}))}
                      className="w-full accent-emerald-500 h-1 bg-white/5 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Price per KM Slider */}
                  <div className="flex flex-col gap-0.5">
                    <div className="flex justify-between items-center text-[9px]">
                      <span>Mínimo por KM</span>
                      <span className="font-semibold text-emerald-400">R$ {filters.minValPerKm.toFixed(2)}/km</span>
                    </div>
                    <input 
                      type="range" 
                      min="2.00" 
                      max="8.00" 
                      step="0.50"
                      value={filters.minValPerKm}
                      id="input-min-val-per-km"
                      onChange={(e) => setFilters(prev => ({...prev, minValPerKm: Number(e.target.value)}))}
                      className="w-full accent-emerald-500 h-1 bg-white/5 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Direction dropdown */}
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px]">Direção do Destino</span>
                    <select
                      value={filters.preferredDirection}
                      id="select-direction"
                      onChange={(e) => setFilters(prev => ({...prev, preferredDirection: e.target.value as any}))}
                      className="bg-[#0F1116] border border-white/10 text-[9px] text-slate-200 py-0.5 px-1.5 rounded outline-none cursor-pointer focus:border-emerald-500"
                    >
                      <option value="Qualquer">Qualquer Direção</option>
                      <option value="Norte">Norte (Ex: Paulista/Santana)</option>
                      <option value="Sul">Sul (Ex: Moema/Morumbi)</option>
                      <option value="Leste">Leste (Ex: Mooca/Guarulhos)</option>
                      <option value="Oeste">Oeste (Ex: Lapa/USP)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* TOP 5 RIDES LIST VIEWPORT */}
            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2 max-h-[320px]">
              <div className="flex items-center justify-between text-[9px] text-slate-500 px-1 font-mono uppercase tracking-wider mb-1">
                <span>Rotas Otimizadas ({top5Rides.length} disponíveis)</span>
                <span>Classificado por Lucro</span>
              </div>

              {top5Rides.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
                  <AlertCircle className="w-8 h-8 text-emerald-500/80 animate-bounce" id="no-rides-alert-icon" />
                  <p className="text-[11px] text-slate-300 font-medium px-4">
                    Nenhuma proposta atende aos filtros de rendimento mínimo.
                  </p>
                  <p className="text-[9px] text-slate-500 px-6 leading-relaxed">
                    Ajuste os filtros de R$/km ou preço mínimo para ver mais opções da tela do inDrive.
                  </p>
                </div>
              ) : (
                top5Rides.map((ride, idx) => {
                  const isSelected = selectedRideId === ride.id;
                  const isBest = idx === 0; // Top sorted ride
                  return (
                    <div
                      key={ride.id}
                      onClick={() => setSelectedRideId(ride.id)}
                      id={`ride-item-${ride.id}`}
                      className={`relative rounded-xl p-2.5 transition-all duration-200 border cursor-pointer ${
                        isSelected 
                          ? 'bg-gradient-to-br from-[#12141A] to-[#0F1116] border-emerald-500/30 ring-1 ring-emerald-500/10 shadow-lg scale-[1.01]' 
                          : 'bg-[#0F1116]/80 border-white/5 hover:border-white/10 hover:bg-[#12141A]/50'
                      }`}
                    >
                      {/* Top colored indicator line */}
                      <div 
                        className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl"
                        style={{ backgroundColor: ride.routeColor }}
                      ></div>

                      {/* Best tag */}
                      {isBest && (
                        <span className="absolute top-2 right-2.5 bg-emerald-500 text-black font-black text-[7.5px] px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-[0_0_8px_rgba(16,185,129,0.4)] tracking-wide uppercase">
                          <Sparkles className="w-2.5 h-2.5" />
                          TOP {idx + 1} RENDIMENTO
                        </span>
                      )}

                      <div className="pl-2 space-y-1">
                        {/* Financial Metrics */}
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-black text-white">R$ {ride.price.toFixed(2)}</span>
                          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                            R$ {ride.valuePerKm.toFixed(2)}/km
                          </span>
                        </div>

                        {/* Route Details */}
                        <div className="text-[10px] text-slate-300 font-medium flex items-center gap-1 mt-0.5">
                          <span className="truncate max-w-[120px]">{ride.pickup}</span>
                          <ArrowRight className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="truncate max-w-[120px] text-emerald-400">{ride.destination}</span>
                        </div>

                        {/* Technical Details */}
                        <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono pt-1 border-t border-white/5 mt-1">
                          <span className="flex items-center gap-1">
                            Distância: <strong className="text-slate-200">{ride.distance} km</strong>
                          </span>
                          <span className="flex items-center gap-1">
                            Sentido: <strong className="text-emerald-400">{ride.direction}</strong>
                          </span>
                          <span>Score: {ride.efficiencyScore}/100</span>
                        </div>

                        {/* Expand actions if selected */}
                        {isSelected && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="pt-2 mt-2 border-t border-white/5 flex justify-end"
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenInDrive(ride);
                              }}
                              id={`btn-accept-ride-${ride.id}`}
                              className="w-full py-1.5 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-black font-black uppercase tracking-wider text-[9px] rounded transition-all flex items-center justify-center gap-1 shadow-[0_0_12px_rgba(16,185,129,0.35)]"
                            >
                              <Play className="w-3 h-3 fill-current" />
                              ABRIR E ACEITAR NO INDRIVE
                            </button>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* ACCESSIBILITY LIVE LOG MONITOR (Bottom Terminal) */}
            <div className="bg-[#0A0B0D] border-t border-white/5 p-2.5 shrink-0 select-none">
              <div className="flex items-center justify-between text-[8px] font-mono font-black text-emerald-400 mb-1 tracking-wider">
                <span className="flex items-center gap-1">
                  <Terminal className="w-2.5 h-2.5 animate-pulse text-emerald-400" />
                  LOG DO SERVIÇO DE ACESSIBILIDADE
                </span>
                <span className="text-slate-500 text-[7px] uppercase font-bold">{isServiceActive ? 'ESCUTANDO TELA' : 'PAUSADO'}</span>
              </div>
              
              <div className="bg-[#0F1116] p-2 rounded-lg border border-white/5 h-[65px] overflow-y-auto font-mono text-[8px] text-slate-400 space-y-0.5 leading-snug scrollbar-none">
                {logs.map((log, i) => (
                  <div key={i} className="truncate select-text">
                    {log}
                  </div>
                ))}
              </div>
            </div>

            {/* Launch Simulated Redirect Pop-Up */}
            <AnimatePresence>
              {showRedirect && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-6 text-center space-y-4"
                >
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="p-3 bg-emerald-500/10 rounded-full border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                  >
                    <RefreshCw className="w-8 h-8 text-emerald-400" id="redirect-spinner" />
                  </motion.div>
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-black uppercase tracking-wider text-white">Redirecionando via Intent</h3>
                    <p className="text-[10px] text-slate-400 font-mono truncate max-w-[280px]">
                      {showRedirect}
                    </p>
                    <div className="bg-[#0F1116] border border-white/10 p-3 rounded text-[9px] font-mono text-left max-w-[250px] mx-auto text-slate-400 space-y-1">
                      <span className="text-emerald-400 font-bold">[Android Intent Dispatcher]</span><br />
                      <span>• Action: android.intent.action.VIEW</span><br />
                      <span>• Package: com.indriver.client</span><br />
                      <span>• Flags: FLAG_ACTIVITY_NEW_TASK</span>
                    </div>
                  </div>
                  <p className="text-[9px] text-slate-500 italic">
                    Simulando clique de confirmação via acessibilidade. Retornando em instantes...
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>

      {/* 2. Control Workshop Desk (Right - 7 Columns) */}
      <div className="lg:col-span-6 xl:col-span-7 flex flex-col gap-4">
        
        {/* Simulator controls card */}
        <div className="bg-[#12141A] border border-white/10 p-5 rounded-2xl text-slate-100 space-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                <Play className="text-emerald-500 w-4 h-4 fill-emerald-500" id="controls-icon" />
                Painel de Testes do Simulador
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Alimente a tela com propostas e visualize o cálculo de rentabilidade em tempo real.
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={simulateIncomingRide}
                id="btn-simulate-incoming"
                className="flex-1 sm:flex-initial px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-black rounded-lg text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition shadow-[0_4px_12px_rgba(16,185,129,0.2)]"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Injetar Proposta
              </button>
              <button
                onClick={resetSimulator}
                id="btn-reset-simulator"
                className="px-3 py-2 bg-white/5 hover:bg-white/10 active:bg-black text-slate-300 rounded-lg text-xs font-bold uppercase tracking-wider transition border border-white/10"
              >
                Limpar
              </button>
            </div>
          </div>

          {/* Quick stats board */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-[#0F1116] p-3 rounded-xl border border-white/5">
              <span className="text-[9px] text-slate-500 font-black tracking-wider uppercase block">RENDIMENTO TOTAL DISP.</span>
              <span className="text-base font-mono font-bold text-white mt-1 block">
                R$ {filteredRides.reduce((acc, curr) => acc + curr.price, 0).toFixed(2)}
              </span>
            </div>
            <div className="bg-[#0F1116] p-3 rounded-xl border border-white/5">
              <span className="text-[9px] text-slate-500 font-black tracking-wider uppercase block">MÉDIA DISTÂNCIA</span>
              <span className="text-base font-mono font-bold text-white mt-1 block">
                {(filteredRides.reduce((acc, curr) => acc + curr.distance, 0) / (filteredRides.length || 1)).toFixed(1)} km
              </span>
            </div>
            <div className="bg-[#0F1116] p-3 rounded-xl border border-white/5">
              <span className="text-[9px] text-slate-500 font-black tracking-wider uppercase block">RENDIMENTO MÉDIO</span>
              <span className="text-base font-mono font-bold text-emerald-400 mt-1 block">
                R$ {(filteredRides.reduce((acc, curr) => acc + curr.valuePerKm, 0) / (filteredRides.length || 1)).toFixed(2)}/km
              </span>
            </div>
            <div className="bg-[#0F1116] p-3 rounded-xl border border-white/5">
              <span className="text-[9px] text-slate-500 font-black tracking-wider uppercase block">STATUS MONITOR</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                ONLINE / ESCUTANDO
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 bg-black/40 p-3 rounded-xl border border-white/5 leading-relaxed">
            💡 <strong className="text-slate-200">Como testar:</strong> Ao clicar em <span className="text-emerald-400 font-bold">"Injetar Proposta"</span>, uma nova proposta do inDrive será simulada e inserida. O parser de acessibilidade filtra e classifica a corrida, posicionando-a no topo da lista. Troque o provedor de mapa na parte inferior do smartphone virtual para renderizar as rotas em diferentes estilos geográficos!
          </div>
        </div>

        {/* HUD de Status Operacional e Metas */}
        <div className="bg-[#12141A] border border-white/10 p-5 rounded-2xl text-slate-100 space-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-300">
            Métricas de Desempenho Operacional (HUD do Carro)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Shift Goals Progress */}
            <div className="bg-[#0F1116] p-4 rounded-xl border border-white/5 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold">Meta Diária de Faturamento</span>
                <span className="text-emerald-400 font-bold">68.5%</span>
              </div>
              
              <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-2.5 rounded-full" style={{ width: '68.5%' }}></div>
              </div>
              
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>R$ 342,80 faturados</span>
                <span>Meta: R$ 500,00</span>
              </div>
            </div>

            {/* Fuel Tracker Progress */}
            <div className="bg-[#0F1116] p-4 rounded-xl border border-white/5 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold">Nível de Combustível</span>
                <span className="text-emerald-400 font-bold">82%</span>
              </div>
              
              <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2.5 rounded-full" style={{ width: '82%' }}></div>
              </div>
              
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Autonomia: ~420 km</span>
                <span>Tanque: 45 Litros</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
