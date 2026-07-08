import React, { useState } from 'react';
import { androidCodeAssets } from '../data/androidCode';
import { FileCode, Copy, Check, FileCheck, Terminal } from 'lucide-react';

export default function CodeViewer() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const activeFile = androidCodeAssets[activeTab];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

  return (
    <div className="bg-[#12141A] border border-white/10 rounded-2xl overflow-hidden flex flex-col text-slate-100 h-full shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
      {/* Top Header */}
      <div className="bg-[#12141A] border-b border-white/5 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
            <FileCode className="text-emerald-400 w-4 h-4" id="codeviewer-icon" />
            Código-Fonte de Produção Android
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Arquivos Kotlin e Gradle prontos para compilar no Android Studio e automatizados no GitHub.
          </p>
        </div>
        <button
          onClick={handleCopy}
          id="btn-copy-code"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 active:bg-black rounded-lg text-xs font-bold uppercase tracking-wider transition text-slate-200 border border-white/10"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" id="icon-copied" />
              <span className="text-emerald-400">Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" id="icon-copy" />
              <span>Copiar Código</span>
            </>
          )}
        </button>
      </div>

      {/* Tabs Selector */}
      <div className="bg-[#0F1116] border-b border-white/5 p-2 overflow-x-auto flex gap-1 scrollbar-none">
        {androidCodeAssets.map((file, idx) => (
          <button
            key={file.name}
            onClick={() => {
              setActiveTab(idx);
              setCopied(false);
            }}
            id={`tab-code-${idx}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition shrink-0 flex items-center gap-1.5 ${
              activeTab === idx
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'hover:bg-white/5 text-slate-400 border border-transparent'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>{file.name}</span>
          </button>
        ))}
      </div>

      {/* Info Box */}
      <div className="bg-[#0A0B0D] p-3.5 border-b border-white/5 flex gap-2.5 items-start text-xs text-slate-300">
        <Terminal className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" id="codeviewer-info-icon" />
        <div>
          <span className="font-semibold text-slate-200">Destino: </span>
          <code className="bg-black/50 px-1.5 py-0.5 rounded text-emerald-400 font-mono text-[11px] border border-white/5">
            {activeFile.path}
          </code>
          <p className="text-slate-400 mt-1 text-[11px] leading-relaxed">
            {activeFile.description}
          </p>
        </div>
      </div>

      {/* Code Editor Body */}
      <div className="flex-1 overflow-auto bg-[#0A0B0D] p-4 font-mono text-xs leading-relaxed select-text max-h-[500px] min-h-[350px]">
        <pre className="text-slate-300 whitespace-pre scrollbar-thin">
          <code>{activeFile.content}</code>
        </pre>
      </div>
    </div>
  );
}
