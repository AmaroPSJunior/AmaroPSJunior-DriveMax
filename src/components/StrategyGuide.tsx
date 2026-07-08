import React from 'react';
import { Target, Shield, Compass, Cpu, DollarSign, Activity } from 'lucide-react';

export default function StrategyGuide() {
  return (
    <div className="bg-[#12141A] border border-white/10 rounded-2xl p-6 text-slate-100 space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
      <div className="border-b border-white/5 pb-4">
        <h2 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
          <Target className="text-emerald-500 w-5 h-5" id="strat-title-icon" />
          Diretrizes Estratégicas do Engenheiro Sênior
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Análise técnica e de negócios para maximizar os rendimentos do motorista com segurança e alto desempenho.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1 */}
        <div className="bg-[#0F1116] border border-white/5 rounded-xl p-4 space-y-2 hover:border-emerald-500/20 transition-all duration-300">
          <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-xs">
            <DollarSign className="w-4 h-4 text-emerald-400" id="strat-icon-dollar" />
            <span>Rendimento Líquido p/ KM</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            A corrida ideal não é apenas a que paga mais no total, mas sim a que possui o maior <strong className="text-slate-200">R$/km</strong>. Nosso algoritmo prioriza o ganho por km rodado para reduzir o desgaste mecânico e o consumo de combustível, focando na margem de lucro real.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-[#0F1116] border border-white/5 rounded-xl p-4 space-y-2 hover:border-emerald-500/20 transition-all duration-300">
          <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-xs">
            <Shield className="w-4 h-4 text-emerald-400" id="strat-icon-shield" />
            <span>Segurança e Zero Distrações</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Digitar ou ler propostas enquanto dirige é a maior causa de acidentes de motoristas parceiros. Nosso assistente de acessibilidade resume tudo em uma tela unificada de rápida leitura, evitando fadiga mental e toques repetitivos na tela.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-[#0F1116] border border-white/5 rounded-xl p-4 space-y-2 hover:border-emerald-500/20 transition-all duration-300">
          <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-xs">
            <Cpu className="w-4 h-4 text-emerald-400" id="strat-icon-cpu" />
            <span>Engenharia de Acessibilidade</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            O inDrive não disponibiliza uma API pública de corridas. A única forma técnica legítima e de alta performance no Android é o uso de um <strong className="text-slate-200">AccessibilityService</strong>. Ele captura a árvore de nós da tela ativamente quando o inDrive está aberto, parses os dados via Regex, e repassa ao nosso mapa de apoio.
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-[#0F1116] border border-white/5 rounded-xl p-4 space-y-2 hover:border-emerald-500/20 transition-all duration-300">
          <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-xs">
            <Compass className="w-4 h-4 text-emerald-400" id="strat-icon-compass" />
            <span>Hibridismo de Mapas</span>
          </div>
          <div className="text-xs text-slate-400 leading-relaxed">
            Disponibilizamos suporte a 3 provedores para dar autonomia ao motorista:
            <ul className="list-disc pl-4 mt-1 space-y-1 text-slate-400 text-xs">
              <li><strong className="text-slate-200">Google Maps:</strong> Precisão de trânsito em tempo real.</li>
              <li><strong className="text-slate-200">OpenStreetMap:</strong> 100% gratuito e econômico em dados móveis.</li>
              <li><strong className="text-slate-200">Mapbox:</strong> Visualização vetorizada premium e fluida.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2 mb-1">
          <Activity className="w-4 h-4" id="strat-icon-metric" />
          Fórmula de Score de Eficiência (Algoritmo do App)
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          O Score de Eficiência de cada corrida é calculado dinamicamente no aplicativo através da relação:
        </p>
        <div className="bg-[#0A0B0D] font-mono text-center py-2.5 my-2 rounded text-emerald-400 text-xs tracking-wider border border-white/5">
          Score = (R$/km * 12) + (Preço_Total * 0.5) - (Distância_Total * 0.8)
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Corridas curtas e de alto valor (como R$ 28 por 4 km) recebem pontuações acima de 95, enquanto trajetos extremamente longos e com margem baixa de KM recebem pontuações menores, alertando o motorista de forma colorida.
        </p>
      </div>
    </div>
  );
}
