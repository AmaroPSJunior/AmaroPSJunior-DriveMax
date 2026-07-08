import React, { useState } from 'react';
import AndroidEmulator from './components/AndroidEmulator';
import CodeViewer from './components/CodeViewer';
import StrategyGuide from './components/StrategyGuide';
import { Smartphone, FileCode, Target, Github, Compass } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'emulator' | 'code' | 'strategy'>('emulator');

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      
      {/* Sophisticated Dark Header */}
      <header className="border-b border-white/10 bg-[#12141A] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)] animate-pulse"></div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black tracking-wider text-white">
                  DRIVEMAX AI <span className="text-emerald-500 font-bold">• ATIVO</span>
                </span>
                <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest">
                  ASSISTENTE SÊNIOR
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Otimização contínua de rotas e cálculo de rendimento líquido do inDrive.
              </p>
            </div>
          </div>

          {/* HUD Session Stats & Build indicators */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6">
            <div className="flex flex-col items-start md:items-end">
              <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Ganhos Estimados do Dia</span>
              <span className="text-lg font-mono font-bold text-white tracking-tight">R$ 342,80</span>
            </div>

            <div className="h-8 w-px bg-white/10 hidden sm:block"></div>

            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-xs font-mono text-slate-300">
              <Github className="w-4 h-4 text-slate-400" id="github-header-icon" />
              <span>CI Build:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                Ativado
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Navigation Tabs Selector */}
        <div className="flex border-b border-white/5 p-1 bg-[#0F1116] rounded-xl max-w-lg">
          <button
            onClick={() => setActiveTab('emulator')}
            id="tab-btn-emulator"
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 ${
              activeTab === 'emulator'
                ? 'bg-white/10 text-white shadow-lg border border-white/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Simulador Móvel</span>
          </button>
          
          <button
            onClick={() => setActiveTab('code')}
            id="tab-btn-code"
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 ${
              activeTab === 'code'
                ? 'bg-white/10 text-white shadow-lg border border-white/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>Código Fonte (Kotlin)</span>
          </button>

          <button
            onClick={() => setActiveTab('strategy')}
            id="tab-btn-strategy"
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 ${
              activeTab === 'strategy'
                ? 'bg-white/10 text-white shadow-lg border border-white/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>Estratégia & Negócios</span>
          </button>
        </div>

        {/* Tab Content Renderer with Animation */}
        <div className="min-h-[450px]">
          {activeTab === 'emulator' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AndroidEmulator />
            </motion.div>
          )}

          {activeTab === 'code' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <CodeViewer />
            </motion.div>
          )}

          {activeTab === 'strategy' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <StrategyGuide />
            </motion.div>
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/50 py-6 text-center text-xs text-slate-500">
        <p>
          Driver Optimal Assistant © {new Date().getFullYear()} — Desenvolvido com Kotlin, Gradle, e CI via GitHub Actions.
        </p>
        <p className="mt-1 text-[10px] text-slate-600">
          O arquivo <code className="bg-slate-900 px-1 py-0.5 rounded">.github/workflows/android-build.yml</code> está ativado para realizar a compilação contínua da APK de depuração.
        </p>
      </footer>
    </div>
  );
}
