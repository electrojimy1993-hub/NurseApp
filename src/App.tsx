/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Nurse, Patient, NursingSheet } from './types';
import { initialNurses, initialPatients, initialNursingSheets } from './data/mockData';
import Login from './components/Login';
import NurseManagement from './components/NurseManagement';
import PatientManagement from './components/PatientManagement';
import NursingSheetForm from './components/NursingSheetForm';
import RFIDSimulator from './components/RFIDSimulator';
import MyNurseLogo from './components/MyNurseLogo';
import {
  Activity,
  User,
  Users,
  Search,
  LogOut,
  CreditCard,
  PlusCircle,
  FileText,
  BadgeAlert,
  ClipboardList,
  Cpu,
  Wifi,
  History,
  Clock,
  Sparkles,
  ArrowLeft,
  Menu,
  X
} from 'lucide-react';

export default function App() {
  // Global persistent states in localStorage
  const [nurses, setNurses] = useState<Nurse[]>(() => {
    const saved = localStorage.getItem('isem_nurses');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Nurse[];
        if (!parsed.some(n => n.email === 'a_nurse@app.com.mx')) {
          localStorage.removeItem('isem_nurses');
          localStorage.removeItem('isem_current_user');
          return initialNurses;
        }
        return parsed;
      } catch (e) {
        return initialNurses;
      }
    }
    return initialNurses;
  });

  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('isem_patients');
    return saved ? JSON.parse(saved) : initialPatients;
  });

  const [nursingSheets, setNursingSheets] = useState<NursingSheet[]>(() => {
    const saved = localStorage.getItem('isem_nursing_sheets');
    return saved ? JSON.parse(saved) : initialNursingSheets;
  });

  const [currentUser, setCurrentUser] = useState<Nurse | null>(() => {
    const saved = localStorage.getItem('isem_current_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Nurse;
        if (parsed.email !== 'a_nurse@app.com.mx') {
          localStorage.removeItem('isem_current_user');
          return null;
        }
        return parsed;
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Navigation states
  // 'home' | 'patients' | 'nurses' | 'sheet-editor' | 'sheet-history'
  const [activeTab, setActiveTab] = useState<'home' | 'patients' | 'nurses' | 'sheet-editor' | 'sheet-history'>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // RFID search / scan triggers
  const [rfidInput, setRfidInput] = useState('');
  const [activeRfidScanned, setActiveRfidScanned] = useState<string | undefined>(undefined);
  const [scanMessage, setScanMessage] = useState<{ text: string; type: 'success' | 'warning' | 'info' | null }>({ text: '', type: null });

  // Active records selected
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedSheetId, setSelectedSheetId] = useState<string | null>(null);

  // Sync state changes with LocalStorage
  useEffect(() => {
    localStorage.setItem('isem_nurses', JSON.stringify(nurses));
  }, [nurses]);

  useEffect(() => {
    localStorage.setItem('isem_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('isem_nursing_sheets', JSON.stringify(nursingSheets));
  }, [nursingSheets]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('isem_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('isem_current_user');
    }
  }, [currentUser]);

  // Auth Handlers
  const handleLoginSuccess = (nurse: Nurse) => {
    setCurrentUser(nurse);
    setActiveTab('home');
    setScanMessage({ text: `Bienvenido(a) de nuevo, ${nurse.fullName}`, type: 'success' });
    setTimeout(() => setScanMessage({ text: '', type: null }), 4000);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('home');
    setSelectedPatientId(null);
    setSelectedSheetId(null);
  };

  // RFID scan action from Simulator or Manual Enter
  const handleRfidScan = (code: string) => {
    setRfidInput(code);
    setActiveRfidScanned(code);

    // Look for patient with this code
    const linkedPatient = patients.find(p => p.rfidFolio === code);

    if (linkedPatient) {
      // 1. Existing patient: Flash success, load the clinical sheet editor for this patient!
      setScanMessage({
        text: `Tarjeta reconocida: ${linkedPatient.fullName}. Abriendo hoja de llenado de datos...`,
        type: 'success'
      });
      setSelectedPatientId(linkedPatient.id);
      setSelectedSheetId(null); // Blank / new sheet for this patient

      setTimeout(() => {
        setActiveTab('sheet-editor');
        setScanMessage({ text: '', type: null });
      }, 1500);

    } else {
      // 2. Unregistered card: Flash alert, redirect to register new patient pre-loaded with this RFID code
      setScanMessage({
        text: `Código RFID "${code}" no registrado. Abriendo alta de paciente para vinculación...`,
        type: 'warning'
      });

      setTimeout(() => {
        setActiveTab('patients');
        setScanMessage({ text: '', type: null });
      }, 2000);
    }
  };

  // Nurse CRUD actions
  const handleAddNurse = (newNurse: Nurse) => {
    setNurses([...nurses, newNurse]);
  };

  const handleUpdateNurse = (updatedNurse: Nurse) => {
    setNurses(nurses.map(n => n.id === updatedNurse.id ? updatedNurse : n));
    // If we updated ourselves, sync current user state
    if (currentUser && currentUser.id === updatedNurse.id) {
      setCurrentUser(updatedNurse);
    }
  };

  // Patient CRUD actions
  const handleAddPatient = (newPatient: Patient) => {
    setPatients([...patients, newPatient]);
    setActiveRfidScanned(undefined); // Clear active scan trigger
    setScanMessage({ text: `Paciente ${newPatient.fullName} registrado correctamente.`, type: 'success' });
    setTimeout(() => setScanMessage({ text: '', type: null }), 3000);
  };

  const handleUpdatePatient = (updatedPatient: Patient) => {
    setPatients(patients.map(p => p.id === updatedPatient.id ? updatedPatient : p));
  };

  // Nursing Clinical Sheet Save
  const handleSaveNursingSheet = (newSheet: NursingSheet) => {
    const exists = nursingSheets.some(s => s.id === newSheet.id);
    if (exists) {
      setNursingSheets(nursingSheets.map(s => s.id === newSheet.id ? newSheet : s));
    } else {
      setNursingSheets([...nursingSheets, newSheet]);
    }
    setActiveTab('home');
    setSelectedPatientId(null);
    setSelectedSheetId(null);
    setScanMessage({ text: 'Hoja de Enfermería guardada exitosamente en el expediente.', type: 'success' });
    setTimeout(() => setScanMessage({ text: '', type: null }), 4000);
  };

  const handlePatientSheetHistory = (patientId: string, sheetId?: string) => {
    setSelectedPatientId(patientId);
    if (sheetId) {
      setSelectedSheetId(sheetId);
      setActiveTab('sheet-editor');
    } else {
      setActiveTab('sheet-history');
    }
  };

  const handleCreateNewSheetDirectly = (patientId: string) => {
    setSelectedPatientId(patientId);
    setSelectedSheetId(null); // Create new
    setActiveTab('sheet-editor');
  };

  // If not logged in, render the login page
  if (!currentUser) {
    return <Login nurses={nurses} onLoginSuccess={handleLoginSuccess} />;
  }

  // Find active patient and sheet objects if relevant
  const selectedPatient = patients.find(p => p.id === selectedPatientId);
  const selectedSheet = nursingSheets.find(s => s.id === selectedSheetId);

  return (
    <div className="min-h-screen bg-[#F7F8F3] flex flex-col font-sans text-[#2D3436]">
      
      {/* Hospital Masthead Header */}
      <header className="bg-[#5A7D6C] text-white shadow-md print:hidden shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Branding */}
            <div className="flex items-center gap-2">
              <MyNurseLogo size={40} className="bg-white/10 rounded-xl p-0.5 shrink-0" />
              <div>
                <span className="text-[10px] text-[#E9EDC9] font-extrabold uppercase tracking-widest leading-none block">Sistema de Registro</span>
                <span className="text-md font-bold tracking-tight text-white leading-none block mt-0.5 font-serif-title">MyNurse App</span>
              </div>
            </div>

            {/* Navigation tabs */}
            <nav className="hidden md:flex gap-1">
              <button
                onClick={() => { setActiveTab('home'); setSelectedPatientId(null); }}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                  activeTab === 'home' ? 'bg-[#344E41]/35 text-[#FEFAE0] border border-[#CCD5AE]/30' : 'text-white/80 hover:text-white hover:bg-white/5'
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                Lector RFID
              </button>
              <button
                onClick={() => setActiveTab('patients')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                  activeTab === 'patients' ? 'bg-[#344E41]/35 text-[#FEFAE0] border border-[#CCD5AE]/30' : 'text-white/80 hover:text-white hover:bg-white/5'
                }`}
              >
                <Users className="w-4 h-4" />
                Admisión de Pacientes
              </button>
              <button
                onClick={() => setActiveTab('nurses')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                  activeTab === 'nurses' ? 'bg-[#344E41]/35 text-[#FEFAE0] border border-[#CCD5AE]/30' : 'text-white/80 hover:text-white hover:bg-white/5'
                }`}
              >
                <User className="w-4 h-4" />
                Módulo Enfermeros
              </button>
            </nav>

            {/* Nurse Info / Logout */}
            <div className="flex items-center gap-2 md:gap-4">
              <div className="hidden sm:block text-right">
                <div className="text-xs font-extrabold text-white leading-none">{currentUser.fullName}</div>
                <div className="text-[10px] text-[#E9EDC9] font-mono mt-1">{currentUser.employeeNumber} • {currentUser.specialty}</div>
              </div>
              <button
                onClick={handleLogout}
                title="Cerrar Sesión"
                className="bg-[#344E41]/20 hover:bg-[#344E41]/50 text-white p-2.5 rounded-xl transition border border-white/10"
              >
                <LogOut className="w-4 h-4" />
              </button>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden bg-[#344E41]/20 hover:bg-[#344E41]/50 text-white p-2.5 rounded-xl transition border border-white/10 flex items-center justify-center"
                aria-label="Menú principal"
              >
                {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile collapsible menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-[#344E41]/30 bg-[#4e6d5e] animate-in slide-in-from-top-4 duration-200">
            <nav className="flex flex-col p-4 gap-2">
              <div className="px-3 py-1.5 text-[10px] uppercase font-extrabold text-[#E9EDC9]/85 tracking-wider border-b border-white/10 mb-1">
                Menú de Navegación
              </div>
              <button
                onClick={() => { setActiveTab('home'); setSelectedPatientId(null); setIsMobileMenuOpen(false); }}
                className={`px-3 py-3 rounded-xl text-xs font-semibold transition flex items-center gap-2.5 ${
                  activeTab === 'home' ? 'bg-[#344E41]/50 text-[#FEFAE0] border border-[#CCD5AE]/30' : 'text-white/80 hover:text-white hover:bg-white/5'
                }`}
              >
                <ClipboardList className="w-4.5 h-4.5" />
                Lector RFID
              </button>
              <button
                onClick={() => { setActiveTab('patients'); setIsMobileMenuOpen(false); }}
                className={`px-3 py-3 rounded-xl text-xs font-semibold transition flex items-center gap-2.5 ${
                  activeTab === 'patients' ? 'bg-[#344E41]/50 text-[#FEFAE0] border border-[#CCD5AE]/30' : 'text-white/80 hover:text-white hover:bg-white/5'
                }`}
              >
                <Users className="w-4.5 h-4.5" />
                Admisión de Pacientes
              </button>
              <button
                onClick={() => { setActiveTab('nurses'); setIsMobileMenuOpen(false); }}
                className={`px-3 py-3 rounded-xl text-xs font-semibold transition flex items-center gap-2.5 ${
                  activeTab === 'nurses' ? 'bg-[#344E41]/50 text-[#FEFAE0] border border-[#CCD5AE]/30' : 'text-white/80 hover:text-white hover:bg-white/5'
                }`}
              >
                <User className="w-4.5 h-4.5" />
                Módulo Enfermeros
              </button>
              
              {/* Nurse profile info inside menu for mobile */}
              <div className="sm:hidden mt-2 pt-3 border-t border-white/10 flex flex-col gap-1 px-3 text-white">
                <span className="text-xs font-bold">{currentUser.fullName}</span>
                <span className="text-[10px] text-[#E9EDC9] font-mono">{currentUser.employeeNumber} • {currentUser.specialty}</span>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">

        {/* Floating Scan Alerts Banner */}
        {scanMessage.text && (
          <div className={`p-4 rounded-2xl shadow-md border animate-in slide-in-from-top duration-200 flex items-start gap-3 ${
            scanMessage.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
              : scanMessage.type === 'warning'
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-teal-50 border-teal-200 text-teal-900'
          }`}>
            <Wifi className="w-5 h-5 shrink-0 mt-0.5 animate-bounce" />
            <div>
              <span className="font-extrabold text-xs uppercase tracking-wider block">Notificación del Lector RFID</span>
              <p className="text-sm font-semibold mt-0.5">{scanMessage.text}</p>
            </div>
          </div>
        )}

        {/* Render Views depending on activeTab */}
        
        {/* VIEW 1: HOME/RFID SEARCH */}
        {activeTab === 'home' && (
          <div className="space-y-6 max-w-2xl mx-auto py-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-[#344E41] tracking-tight font-serif-title">Acceso Rápido por Tarjeta RFID</h2>
              <p className="text-sm text-[#7F8C8D] max-w-lg mx-auto">
                El sistema consultará automáticamente el expediente médico en cuanto se pase una tarjeta por el lector USB.
              </p>
            </div>

            {/* Giant Simulated RFID Reader Spot */}
            <div className="bg-white border border-[#E0E2D9] rounded-3xl p-8 shadow-xl text-center space-y-6 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#5A7D6C] via-[#E9EDC9] to-[#5A7D6C]" />
              
              <div className="mx-auto w-24 h-24 rounded-full bg-[#E9EDC9]/30 border-2 border-dashed border-[#5A7D6C]/50 flex items-center justify-center text-[#5A7D6C] animate-pulse">
                <Cpu className="w-12 h-12" />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#7F8C8D] uppercase tracking-widest">
                  Estatus de conexión del lector
                </label>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-[#E9EDC9] text-[#344E41]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#5A7D6C] animate-ping" />
                  <span>LECTOR USB CONECTADO</span>
                </div>
              </div>

              {/* Form to submit manual RFID or wait for simulation */}
              <form 
                onSubmit={(e) => { e.preventDefault(); if (rfidInput.trim()) handleRfidScan(rfidInput.trim().toUpperCase()); }}
                className="max-w-md mx-auto space-y-3"
              >
                <div className="relative">
                  <input
                    type="text"
                    value={rfidInput}
                    onChange={(e) => setRfidInput(e.target.value)}
                    placeholder="Esperando lectura de tarjeta RFID..."
                    className="w-full text-center text-lg font-mono font-bold tracking-wider uppercase border border-[#E0E2D9] focus:border-[#5A7D6C] focus:ring-4 focus:ring-[#5A7D6C]/10 rounded-2xl px-4 py-3.5 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                  <CreditCard className="absolute left-4 top-4.5 text-slate-400 w-5 h-5" />
                </div>
                
                <button
                  type="submit"
                  disabled={!rfidInput.trim()}
                  className="w-full bg-[#5A7D6C] hover:bg-[#344E41] text-white font-bold py-3 px-4 rounded-2xl text-xs uppercase tracking-wider transition disabled:opacity-40 shadow-md"
                >
                  Consultar Código Ingresado
                </button>
              </form>

              <div className="text-xs text-[#7F8C8D] max-w-sm mx-auto leading-relaxed">
                Utilice el <strong>Simulador Lector RFID</strong> flotante abajo a la derecha para simular aproximaciones de pacientes registrados o nuevos.
              </div>
            </div>

            {/* Quick overview metrics / records shortcut */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setActiveTab('patients')}
                className="bg-white hover:bg-[#FEFAE0]/40 border border-[#E0E2D9] p-5 rounded-2xl text-left transition shadow-sm space-y-2 group"
              >
                <Users className="w-6 h-6 text-[#5A7D6C] group-hover:scale-105 transition-transform" />
                <h3 className="font-bold text-[#344E41] text-sm">Registro de Pacientes</h3>
                <p className="text-xs text-[#7F8C8D]">Total admitidos: <strong className="text-slate-600 font-mono">{patients.length}</strong></p>
              </button>

              <button
                type="button"
                onClick={() => {
                  const withSheets = nursingSheets.length;
                  if (withSheets > 0) {
                    const last = nursingSheets[nursingSheets.length - 1];
                    handlePatientSheetHistory(last.patientId, last.id);
                  } else {
                    setActiveTab('patients');
                  }
                }}
                className="bg-white hover:bg-[#FEFAE0]/40 border border-[#E0E2D9] p-5 rounded-2xl text-left transition shadow-sm space-y-2 group"
              >
                <FileText className="w-6 h-6 text-[#5A7D6C] group-hover:scale-105 transition-transform" />
                <h3 className="font-bold text-[#344E41] text-sm">Hojas Clínicas Guardadas</h3>
                <p className="text-xs text-[#7F8C8D]">Total expedientes: <strong className="text-slate-600 font-mono">{nursingSheets.length}</strong></p>
              </button>
            </div>
          </div>
        )}

        {/* VIEW 2: PATIENTS MANAGEMENT (Alta de Pacientes) */}
        {activeTab === 'patients' && (
          <PatientManagement
            patients={patients}
            nursingSheets={nursingSheets}
            onAddPatient={handleAddPatient}
            onUpdatePatient={handleUpdatePatient}
            onSelectPatientForSheet={handlePatientSheetHistory}
            onCreateNewSheet={handleCreateNewSheetDirectly}
            activeRfidScanned={activeRfidScanned}
            onClearRfidScan={() => setActiveRfidScanned(undefined)}
          />
        )}

        {/* VIEW 3: NURSES MANAGEMENT (Personal de enfermería) */}
        {activeTab === 'nurses' && (
          <NurseManagement
            nurses={nurses}
            onAddNurse={handleAddNurse}
            onUpdateNurse={handleUpdateNurse}
            currentUser={currentUser}
          />
        )}

        {/* VIEW 4: DIGITAL NURSING SHEET FORM */}
        {activeTab === 'sheet-editor' && selectedPatient && (
          <NursingSheetForm
            patient={selectedPatient}
            nurse={currentUser}
            existingSheet={selectedSheet}
            onSave={handleSaveNursingSheet}
            onCancel={() => { setActiveTab('home'); setSelectedPatientId(null); setSelectedSheetId(null); }}
          />
        )}

        {/* VIEW 5: CLINICAL SHEETS HISTORY PER PATIENT */}
        {activeTab === 'sheet-history' && selectedPatient && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => { setActiveTab('patients'); setSelectedPatientId(null); }}
                className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 p-2 rounded-xl transition"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Historial Clínico: {selectedPatient.fullName}</h2>
                <p className="text-xs text-slate-500">Expediente de hojas de atención de enfermería ISEM guardadas.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {nursingSheets
                .filter(s => s.patientId === selectedPatient.id)
                .map((sheet) => {
                  const signingNurse = nurses.find(n => n.id === sheet.nurseId);
                  
                  return (
                    <div key={sheet.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="bg-teal-50 border border-teal-200 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-md font-mono">
                            {sheet.id}
                          </span>
                          <h3 className="font-bold text-slate-900 text-base mt-1.5 flex items-center gap-2">
                            <ClipboardList className="w-4 h-4 text-slate-400" />
                            Hoja del: {sheet.date}
                          </h3>
                        </div>
                        <div className="text-xs text-right text-slate-400">
                          <Clock className="w-3.5 h-3.5 inline mr-1" />
                          Ingresado
                        </div>
                      </div>

                      <div className="text-xs text-slate-600 space-y-1.5 border-t border-slate-50 pt-3">
                        <div><strong className="text-slate-800">Diagnóstico:</strong> {sheet.medicalDiagnosis}</div>
                        <div><strong className="text-slate-800">Cama:</strong> {sheet.bedNumber} • <strong className="text-slate-800">Servicio:</strong> {sheet.service}</div>
                        <div><strong className="text-slate-800">Enfermero(a) responsable:</strong> {sheet.responsibleNurseName}</div>
                      </div>

                      <div className="flex gap-2 pt-2 border-t border-slate-50">
                        <button
                          onClick={() => { setSelectedSheetId(sheet.id); setActiveTab('sheet-editor'); }}
                          className="flex-1 text-center bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 rounded-xl text-xs transition"
                        >
                          Ver Detalle / Editar
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

      </main>

      {/* Persistent Floating RFID USB Reader Simulator Widget */}
      <RFIDSimulator onScan={handleRfidScan} />

      {/* Simple Professional Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-400 font-medium print:hidden shrink-0">
        Portal de Control de Enfermería • Su uso esta restringido con propósitos educativos © 2026
      </footer>

    </div>
  );
}
