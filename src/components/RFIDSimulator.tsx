/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CreditCard, Cpu, Wifi, Usb, AlertCircle, Sparkles } from 'lucide-react';

interface RFIDSimulatorProps {
  onScan: (rfidCode: string) => void;
}

export default function RFIDSimulator({ onScan }: RFIDSimulatorProps) {
  const [customCode, setCustomCode] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState('');

  const handleScan = (code: string) => {
    if (isScanning) return;
    setIsScanning(true);
    setScannedCode(code);
    
    // Simulate keyboard delay of RFID reader typing the code
    setTimeout(() => {
      onScan(code);
      setIsScanning(false);
      // Sound effect or light blink can be visual
    }, 800);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCode.trim()) return;
    handleScan(customCode.trim().toUpperCase());
    setCustomCode('');
  };

  const generateRandomCard = () => {
    const num = Math.floor(1000 + Math.random() * 9000);
    handleScan(`RFID-${num}`);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full font-sans">
      {/* Mini Toggle Trigger if closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-full shadow-lg transition-all duration-300 border border-teal-500 text-sm font-medium animate-bounce"
        >
          <Cpu className="w-4 h-4" />
          Simular Lector RFID USB
        </button>
      )}

      {/* Expanded Widget */}
      {isOpen && (
        <div className="bg-slate-900 text-slate-100 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 transform scale-100">
          {/* Header */}
          <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Usb className="w-5 h-5 text-emerald-400" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full" />
              </div>
              <div>
                <h3 className="font-semibold text-xs text-white uppercase tracking-wider">Simulador Lector RFID</h3>
                <span className="text-[10px] text-emerald-400 font-mono">Conectado por USB</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-700/50 hover:bg-slate-700 transition"
            >
              Ocultar
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            {/* Status indicator */}
            {isScanning ? (
              <div className="bg-teal-950/40 border border-teal-700/50 text-teal-300 px-3 py-2.5 rounded-xl flex items-center gap-3 text-xs animate-pulse font-mono">
                <Wifi className="w-4 h-4 text-teal-400 animate-spin" />
                <span>Transmitiendo código: <strong className="text-white">{scannedCode}</strong>...</span>
              </div>
            ) : (
              <div className="bg-slate-800/50 border border-slate-700 text-slate-300 px-3 py-2 rounded-xl text-[11px] leading-relaxed">
                El lector emula una entrada de teclado USB. Selecciona un escenario abajo para aproximar una tarjeta de enfermería o paciente.
              </div>
            )}

            {/* Quick Cards Grid */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Tarjetas de Prueba</span>
              <div className="grid grid-cols-1 gap-2">
                {/* Alejandra Card */}
                <button
                  type="button"
                  onClick={() => handleScan('RFID-8812')}
                  disabled={isScanning}
                  className="w-full text-left bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-teal-500/50 px-3 py-2 rounded-xl transition flex items-center justify-between group disabled:opacity-50"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Alejandra Torres</div>
                      <div className="text-[10px] text-slate-400 font-mono">RFID-8812 (Paciente Registrado)</div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full group-hover:bg-teal-500/30 transition">Tap</span>
                </button>

                {/* Roberto Card */}
                <button
                  type="button"
                  onClick={() => handleScan('RFID-3401')}
                  disabled={isScanning}
                  className="w-full text-left bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-teal-500/50 px-3 py-2 rounded-xl transition flex items-center justify-between group disabled:opacity-50"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Roberto Esquivel</div>
                      <div className="text-[10px] text-slate-400 font-mono">RFID-3401 (Paciente Registrado)</div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full group-hover:bg-teal-500/30 transition">Tap</span>
                </button>

                {/* Unassigned Card */}
                <button
                  type="button"
                  onClick={() => handleScan('RFID-5050')}
                  disabled={isScanning}
                  className="w-full text-left bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-amber-500/50 px-3 py-2 rounded-xl transition flex items-center justify-between group disabled:opacity-50"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                      <CreditCard className="w-4 h-4 animate-pulse" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Nueva Tarjeta RFID</div>
                      <div className="text-[10px] text-slate-400 font-mono">RFID-5050 (No Registrado)</div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full group-hover:bg-amber-500/30 transition">Alta</span>
                </button>
              </div>
            </div>

            {/* Custom Scan & Random Scan */}
            <div className="border-t border-slate-800 pt-3 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Otras Opciones</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={generateRandomCard}
                  disabled={isScanning}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium py-1.5 px-3 rounded-lg border border-slate-750 flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  Tarjeta Aleatoria
                </button>
              </div>

              <form onSubmit={handleCustomSubmit} className="flex gap-2 mt-2">
                <input
                  type="text"
                  placeholder="ID RFID personalizado..."
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value)}
                  disabled={isScanning}
                  className="flex-1 bg-slate-950 border border-slate-750 text-slate-100 px-2.5 py-1.5 rounded-lg text-xs font-mono focus:outline-none focus:border-teal-500 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isScanning || !customCode.trim()}
                  className="bg-teal-600 hover:bg-teal-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition disabled:opacity-40"
                >
                  Leer
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
