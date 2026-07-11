/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Patient, NursingSheet } from '../types';
import { UserPlus, Edit2, Search, Heart, BadgeAlert, BadgeCheck, MapPin, Mail, CreditCard, Clock, FileText, PlusCircle, X, Check, Eye } from 'lucide-react';

interface PatientManagementProps {
  patients: Patient[];
  nursingSheets: NursingSheet[];
  onAddPatient: (patient: Patient) => void;
  onUpdatePatient: (patient: Patient) => void;
  onSelectPatientForSheet: (patientId: string, sheetId?: string) => void;
  onCreateNewSheet: (patientId: string) => void;
  activeRfidScanned?: string; // Passed down if an RFID is scanned in the simulator
  onClearRfidScan?: () => void;
}

export default function PatientManagement({
  patients,
  nursingSheets,
  onAddPatient,
  onUpdatePatient,
  onSelectPatientForSheet,
  onCreateNewSheet,
  activeRfidScanned,
  onClearRfidScan
}: PatientManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [curp, setCURP] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [age, setAge] = useState<number>(0);
  const [email, setEmail] = useState('');
  const [weight, setWeight] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [bloodType, setBloodType] = useState('O+');
  const [address, setAddress] = useState('');
  const [hasMedicalService, setHasMedicalService] = useState(true);
  const [rfidFolio, setRfidFolio] = useState('');

  // Handle auto-opening or pre-filling when a new RFID card is swiped
  useEffect(() => {
    if (activeRfidScanned) {
      // Check if patient already has this RFID. If not, open Add Patient form with prefilled RFID!
      const linkedPatient = patients.find(p => p.rfidFolio === activeRfidScanned);
      if (!linkedPatient) {
        openAddForm();
        setRfidFolio(activeRfidScanned);
      }
    }
  }, [activeRfidScanned, patients]);

  const openAddForm = () => {
    setEditingPatient(null);
    setFullName('');
    setCURP('');
    setBirthDate('');
    setAge(30);
    setEmail('');
    setWeight(70);
    setHeight(170);
    setBloodType('O+');
    setAddress('');
    setHasMedicalService(true);
    setRfidFolio('');
    setShowForm(true);
  };

  const openEditForm = (patient: Patient) => {
    setEditingPatient(patient);
    setFullName(patient.fullName);
    setCURP(patient.curp);
    setBirthDate(patient.birthDate || '');
    setAge(patient.age);
    setEmail(patient.email);
    setWeight(patient.weight);
    setHeight(patient.height);
    setBloodType(patient.bloodType);
    setAddress(patient.address);
    setHasMedicalService(patient.hasMedicalService);
    setRfidFolio(patient.rfidFolio || '');
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !curp || !age || !email || !weight || !height || !address || !birthDate) {
      alert('Por favor complete todos los campos obligatorios incluyendo la fecha de nacimiento.');
      return;
    }

    // Validate CURP length (roughly 18 chars)
    if (curp.length !== 18) {
      alert('La CURP debe tener exactamente 18 caracteres.');
      return;
    }

    if (editingPatient) {
      onUpdatePatient({
        ...editingPatient,
        fullName,
        curp: curp.toUpperCase(),
        birthDate,
        age: Number(age),
        email,
        weight: Number(weight),
        height: Number(height),
        bloodType,
        address,
        hasMedicalService,
        rfidFolio: rfidFolio.trim() || undefined
      });
    } else {
      // Check for duplicates
      if (patients.some(p => p.curp.toUpperCase() === curp.toUpperCase())) {
        alert('Este paciente con esta CURP ya se encuentra registrado.');
        return;
      }
      if (rfidFolio && patients.some(p => p.rfidFolio === rfidFolio)) {
        alert('Este código RFID ya está asignado a otro paciente.');
        return;
      }

      onAddPatient({
        id: `patient-${Date.now()}`,
        fullName,
        curp: curp.toUpperCase(),
        birthDate,
        age: Number(age),
        email,
        weight: Number(weight),
        height: Number(height),
        bloodType,
        address,
        hasMedicalService,
        rfidFolio: rfidFolio.trim() || undefined,
        createdAt: new Date().toISOString()
      });

      // Clear general scanning trigger if we just prefilled it
      if (activeRfidScanned === rfidFolio && onClearRfidScan) {
        onClearRfidScan();
      }
    }

    setShowForm(false);
  };

  // Quick link active scanned RFID to the current editing form
  const handleCaptureScannedRfid = () => {
    if (activeRfidScanned) {
      setRfidFolio(activeRfidScanned);
    }
  };

  const filteredPatients = patients.filter(p =>
    p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.curp.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.rfidFolio && p.rfidFolio.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top Banner and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Admisión y Registro de Pacientes</h2>
          <p className="text-sm text-slate-500">Módulo de alta médica, actualización y vinculación de tarjetas RFID.</p>
        </div>
        <div className="flex gap-2">
          {activeRfidScanned && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-1 text-xs text-amber-800 flex items-center gap-2 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>RFID Scanned: <strong>{activeRfidScanned}</strong></span>
              <button
                onClick={() => onClearRfidScan && onClearRfidScan()}
                className="hover:bg-amber-100 rounded-full p-0.5 ml-1 transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          <button
            onClick={openAddForm}
            className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all shadow-sm shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            Admitir Paciente
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Buscar pacientes por nombre completo, CURP o folio RFID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
        />
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => {
          // Count historic clinical sheets for this patient
          const sheetsCount = nursingSheets.filter(s => s.patientId === patient.id).length;

          return (
            <div
              key={patient.id}
              className="bg-white rounded-2xl border border-slate-100 hover:border-slate-200 transition-all shadow-sm hover:shadow-md overflow-hidden flex flex-col justify-between"
            >
              {/* Card Body */}
              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base leading-snug">{patient.fullName}</h3>
                    <p className="text-[11px] text-slate-400 font-mono font-semibold uppercase mt-0.5 tracking-wider">
                      CURP: {patient.curp}
                    </p>
                  </div>
                  {/* Blood Badge */}
                  <span className="shrink-0 inline-flex flex-col items-center justify-center w-11 h-11 rounded-full bg-red-50 text-red-600 border border-red-100 font-extrabold text-sm shadow-inner">
                    <Heart className="w-3 h-3 text-red-400 fill-red-400" />
                    {patient.bloodType}
                  </span>
                </div>

                {/* Info Pills */}
                <div className="grid grid-cols-3 gap-1.5 text-xs text-center border-y border-slate-50 py-3">
                  <div className="bg-slate-50 p-1.5 rounded-lg">
                    <div className="text-[9px] text-[#7F8C8D] font-semibold uppercase">Nacimiento</div>
                    <div className="font-bold text-slate-700 text-[10px] truncate" title={patient.birthDate || 'N/A'}>
                      {patient.birthDate || 'N/A'}
                    </div>
                  </div>
                  <div className="bg-slate-50 p-1.5 rounded-lg">
                    <div className="text-[9px] text-[#7F8C8D] font-semibold uppercase">Edad</div>
                    <div className="font-bold text-slate-700 text-[10px]">{patient.age} años</div>
                  </div>
                  <div className="bg-slate-50 p-1.5 rounded-lg">
                    <div className="text-[9px] text-[#7F8C8D] font-semibold uppercase">Medidas</div>
                    <div className="font-bold text-slate-700 text-[10px]">{patient.weight}kg / {patient.height}cm</div>
                  </div>
                </div>

                {/* Details list */}
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{patient.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{patient.email}</span>
                  </div>
                  
                  {/* RFID Status Indicator */}
                  <div className="flex items-center justify-between border-t border-slate-50 pt-2.5 mt-2.5">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-700">Folio RFID:</span>
                    </div>
                    {patient.rfidFolio ? (
                      <span className="bg-teal-50 border border-teal-200 text-teal-700 px-2 py-0.5 rounded-md font-mono text-[10px] font-bold">
                        {patient.rfidFolio}
                      </span>
                    ) : (
                      <span className="bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5 rounded-md text-[10px] font-bold">
                        No Vinculado
                      </span>
                    )}
                  </div>

                  {/* Medical Service Indicator */}
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-slate-600">Servicio Médico:</span>
                    {patient.hasMedicalService ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                        <BadgeCheck className="w-3.5 h-3.5 text-emerald-500" /> Asegurado (SI)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                        <BadgeAlert className="w-3.5 h-3.5 text-slate-400" /> Particular (NO)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="bg-slate-50 px-4 py-3 border-t border-slate-100 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    {sheetsCount} Hojas de Enfermería
                  </span>
                  
                  <button
                    onClick={() => openEditForm(patient)}
                    className="text-xs text-slate-700 hover:text-teal-600 font-bold flex items-center gap-1 hover:bg-slate-200/50 px-2 py-1 rounded transition"
                  >
                    <Edit2 className="w-3 h-3" /> Editar Ficha
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-150">
                  {/* Fill out clinical sheet */}
                  <button
                    onClick={() => onCreateNewSheet(patient.id)}
                    className="w-full text-center bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Llenar Hoja
                  </button>

                  {/* View history */}
                  <button
                    onClick={() => {
                      const sheets = nursingSheets.filter(s => s.patientId === patient.id);
                      if (sheets.length > 0) {
                        onSelectPatientForSheet(patient.id, sheets[sheets.length - 1].id);
                      } else {
                        alert('Este paciente no tiene hojas de enfermería guardadas aún. Por favor llene una nueva hoja.');
                      }
                    }}
                    disabled={sheetsCount === 0}
                    className="w-full text-center bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 disabled:opacity-50 font-semibold py-2 px-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
                  >
                    <Eye className="w-4 h-4 text-slate-500" />
                    Historial
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredPatients.length === 0 && (
          <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-slate-100">
            <span className="text-sm text-slate-400">No se encontraron pacientes registrados con los criterios.</span>
          </div>
        )}
      </div>

      {/* Patient Intake Form Dialog Overlay */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-150">
            {/* Header */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-150 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-950">
                {editingPatient ? 'Actualizar Ficha de Paciente' : 'Alta de Paciente Nuevo'}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-slate-600 rounded-full p-1 hover:bg-slate-150 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nombre Completo */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nombre Completo del Paciente *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Escriba el nombre tal como aparece en acta"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* CURP */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    CURP (Clave Única de Registro) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={18}
                    placeholder="18 caracteres alfanuméricos"
                    value={curp}
                    onChange={(e) => setCURP(e.target.value.toUpperCase())}
                    className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-xs"
                  />
                </div>

                {/* Edad */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Edad (Años) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={120}
                    placeholder="Ej. 42"
                    value={age || ''}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Fecha de Nacimiento */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Fecha de Nacimiento *
                  </label>
                  <input
                    type="date"
                    required
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Correo Electrónico */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="ejemplo@paciente.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Peso */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Peso (Kg) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    min={1}
                    placeholder="Ej. 74.5"
                    value={weight || ''}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Talla / Altura */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Talla / Estatura (Cm) *
                  </label>
                  <input
                    type="number"
                    required
                    min={10}
                    max={250}
                    placeholder="Ej. 172"
                    value={height || ''}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Tipo de Sangre */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tipo de Sangre *
                  </label>
                  <select
                    value={bloodType}
                    onChange={(e) => setBloodType(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="A+">A Positivo (A+)</option>
                    <option value="A-">A Negativo (A-)</option>
                    <option value="B+">B Positivo (B+)</option>
                    <option value="B-">B Negativo (B-)</option>
                    <option value="AB+">AB Positivo (AB+)</option>
                    <option value="AB-">AB Negativo (AB-)</option>
                    <option value="O+">O Positivo (O+)</option>
                    <option value="O-">O Negativo (O-)</option>
                  </select>
                </div>

                {/* Servicio Médico */}
                <div className="flex items-center justify-between border border-slate-200 rounded-xl p-3 bg-slate-50">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    ¿Cuenta con Servicio Médico?
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasMedicalService}
                      onChange={(e) => setHasMedicalService(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    <span className="ml-2 text-xs font-semibold text-slate-700 select-none">
                      {hasMedicalService ? 'SI (Asegurado)' : 'NO (Particular)'}
                    </span>
                  </label>
                </div>

                {/* Dirección */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Dirección Domiciliaria Completa *
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Calle, Número exterior/interior, Colonia, Municipio, Código Postal"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* RFID Folio */}
                <div className="sm:col-span-2 border-t border-slate-100 pt-3">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>Vincular Folio RFID</span>
                    {activeRfidScanned && (
                      <button
                        type="button"
                        onClick={handleCaptureScannedRfid}
                        className="text-[10px] text-teal-600 font-bold hover:underline"
                      >
                        Capturar RFID Leído ({activeRfidScanned})
                      </button>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Coloque tarjeta sobre el lector o escriba el código..."
                      value={rfidFolio}
                      onChange={(e) => setRfidFolio(e.target.value)}
                      className="w-full text-sm border border-slate-300 rounded-xl pl-10 pr-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                    />
                    <CreditCard className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    El código de tarjeta RFID se asigna automáticamente cuando aproximas una tarjeta al lector USB simulado.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-slate-150 pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition flex items-center gap-1 shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  Guardar Ficha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
