/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Patient, Nurse, NursingSheet } from '../types';
import { FileText, Printer, Save, ArrowLeft, Heart, Layers, Activity, Droplets, Thermometer, CheckCircle, Shield, AlertCircle, Plus, Trash2 } from 'lucide-react';

interface NursingSheetFormProps {
  patient: Patient;
  nurse: Nurse;
  existingSheet?: NursingSheet | null;
  onSave: (sheet: NursingSheet) => void;
  onCancel: () => void;
}

export default function NursingSheetForm({
  patient,
  nurse,
  existingSheet,
  onSave,
  onCancel
}: NursingSheetFormProps) {
  const [activeTab, setActiveTab] = useState<'id' | 'vitals' | 'val' | 'meds' | 'plan'>('id');

  // 1. Identificación states
  const [medicalUnit, setMedicalUnit] = useState('Hospital General ISEM');
  const [service, setService] = useState('Medicina Interna');
  const [bedNumber, setBedNumber] = useState('');
  const [expedientNumber, setExpedientNumber] = useState(`EXP-${Math.floor(10000 + Math.random() * 90000)}`);
  const [admissionDate, setAdmissionDate] = useState(new Date().toISOString().split('T')[0]);
  const [hospitalStayDays, setHospitalStayDays] = useState(1);
  const [medicalDiagnosis, setMedicalDiagnosis] = useState('');
  const [allergies, setAllergies] = useState('NEGADAS');

  // 17. Habitus Exterior states
  const [consciousnessState, setConsciousnessState] = useState<NursingSheet['consciousnessState']>('Consciente');
  const [gait, setGait] = useState<NursingSheet['gait']>('Normal');
  const [movements, setMovements] = useState<NursingSheet['movements']>('Normales');
  const [facies, setFacies] = useState<NursingSheet['facies']>('No característica');
  const [attitude, setAttitude] = useState<NursingSheet['attitude']>('Libremente escogida');
  const [bodyConstitution, setBodyConstitution] = useState<NursingSheet['bodyConstitution']>('Mesomorfa');

  // 18. Vital Signs logs
  const [vitalSignsHistory, setVitalSignsHistory] = useState<NursingSheet['vitalSignsHistory']>([]);
  // Individual sign form states
  const [vHour, setVHour] = useState('08:00');
  const [vResp, setVResp] = useState(18);
  const [vTemp, setVTemp] = useState(36.5);
  const [vHeart, setVHeart] = useState(72);
  const [vBp, setVBp] = useState('120/80');
  const [vPam, setVPam] = useState(93);
  const [vSat, setVSat] = useState(98);

  // 19. Valoración states
  const [painScale, setPainScale] = useState(0);
  const [fallRisk, setFallRisk] = useState<'Bajo' | 'Medio' | 'Alto' | ''>('Bajo');
  const [pressureUlcerRisk, setPressureUlcerRisk] = useState<'Bajo' | 'Medio' | 'Alto' | ''>('Bajo');
  const [glasgowComaScale, setGlasgowComaScale] = useState(15);
  const [phlebitisScale, setPhlebitisScale] = useState(0);
  const [skinColoration, setSkinColoration] = useState<NursingSheet['skinColoration']>('R');
  const [pupillaryEvaluation, setPupillaryEvaluation] = useState<NursingSheet['pupillaryEvaluation']>('Iso');
  const [evacuationsBristol, setEvacuationsBristol] = useState<number | ''>('');
  const [cephalicPerimeter, setCephalicPerimeter] = useState<number | ''>('');
  const [thoracicPerimeter, setThoracicPerimeter] = useState<number | ''>('');
  const [abdominalPerimeter, setAbdominalPerimeter] = useState<number | ''>('');
  const [capillaryRefill, setCapillaryRefill] = useState<number | ''>('');
  const [capillaryGlycemia, setCapillaryGlycemia] = useState<number | ''>('');

  // 20. Dieta states
  const [dietType, setDietType] = useState('');
  const [intakeDetails, setIntakeDetails] = useState('');

  // 21. Líquidos states
  const [oralRoute, setOralRoute] = useState(0);
  const [parenteralSolutions, setParenteralSolutions] = useState(0);
  const [intravenousMeds, setIntravenousMeds] = useState(0);
  const [bloodDerivatives, setBloodDerivatives] = useState(0);
  const [diuresis, setDiuresis] = useState(0);
  const [evacuations, setEvacuations] = useState(0);
  const [bleeding, setBleeding] = useState(0);
  const [emesis, setEmesis] = useState(0);
  const [drains, setDrains] = useState(0);

  // 22. Soluciones Parenterales states
  const [solutions, setSolutions] = useState<NursingSheet['parenteralSolutionsActive']>([]);
  // Individual sol form states
  const [solName, setSolName] = useState('');
  const [solMlHour, setSolMlHour] = useState(83);
  const [solStart, setSolStart] = useState('08:00');
  const [solEnd, setSolEnd] = useState('20:00');
  const [solPending, setSolPending] = useState('0 ml');
  const [solDoubleCheck, setSolDoubleCheck] = useState('');

  // 23. Medicamentos states
  const [medsList, setMedsList] = useState<NursingSheet['medications']>([]);
  // Individual med form states
  const [medName, setMedName] = useState('');
  const [medSchedule, setMedSchedule] = useState('12:00');
  const [medDose, setMedDose] = useState('');
  const [medRoute, setMedRoute] = useState('Intravenosa');
  const [medDoubleCheck, setMedDoubleCheck] = useState('');
  const [medIsHighRisk, setMedIsHighRisk] = useState(false);
  const [medIsLasa, setMedIsLasa] = useState(false);

  // 24. Lesiones de Piel states
  const [lesionsList, setLesionsList] = useState<NursingSheet['skinLesions']>([]);
  const [lesionLocation, setLesionLocation] = useState('');
  const [lesionType, setLesionType] = useState<NursingSheet['skinLesions'][number]['type']>('');
  const [lesionObs, setLesionObs] = useState('');

  // 25. Dispositivos Invasivos states
  const [devicesList, setDevicesList] = useState<NursingSheet['invasiveDevices']>([]);
  const [deviceName, setDeviceName] = useState('');
  const [deviceInstDate, setDeviceInstDate] = useState('');
  const [deviceRemDate, setDeviceRemDate] = useState('');
  const [deviceObs, setDeviceObs] = useState('');

  // 26 & 27. Plan states
  const [nursingDiagnosis, setNursingDiagnosis] = useState('');
  const [careIndicator, setCareIndicator] = useState('');
  const [initialScore, setInitialScore] = useState(3);
  const [interventions, setInterventions] = useState('');
  const [finalScore, setFinalScore] = useState(4);
  const [resultEvaluation, setResultEvaluation] = useState('');
  const [dischargePlan, setDischargePlan] = useState('');
  const [observations, setObservations] = useState('');

  // Load existing sheet if viewing/editing
  useEffect(() => {
    if (existingSheet) {
      setMedicalUnit(existingSheet.medicalUnit);
      setService(existingSheet.service);
      setBedNumber(existingSheet.bedNumber);
      setExpedientNumber(existingSheet.expedientNumber);
      setAdmissionDate(existingSheet.admissionDate);
      setHospitalStayDays(existingSheet.hospitalStayDays);
      setMedicalDiagnosis(existingSheet.medicalDiagnosis);
      setAllergies(existingSheet.allergies);

      setConsciousnessState(existingSheet.consciousnessState);
      setGait(existingSheet.gait);
      setMovements(existingSheet.movements);
      setFacies(existingSheet.facies);
      setAttitude(existingSheet.attitude);
      setBodyConstitution(existingSheet.bodyConstitution);

      setVitalSignsHistory(existingSheet.vitalSignsHistory);

      setPainScale(existingSheet.painScale);
      setFallRisk(existingSheet.fallRisk);
      setPressureUlcerRisk(existingSheet.pressureUlcerRisk);
      setGlasgowComaScale(existingSheet.glasgowComaScale);
      setPhlebitisScale(existingSheet.phlebitisScale);
      setSkinColoration(existingSheet.skinColoration);
      setPupillaryEvaluation(existingSheet.pupillaryEvaluation);
      setEvacuationsBristol(existingSheet.evacuationsBristol);
      setCephalicPerimeter(existingSheet.cephalicPerimeter);
      setThoracicPerimeter(existingSheet.thoracicPerimeter);
      setAbdominalPerimeter(existingSheet.abdominalPerimeter);
      setCapillaryRefill(existingSheet.capillaryRefill);
      setCapillaryGlycemia(existingSheet.capillaryGlycemia);

      setDietType(existingSheet.dietType);
      setIntakeDetails(existingSheet.intakeDetails);

      setOralRoute(existingSheet.liquids.oralRoute);
      setParenteralSolutions(existingSheet.liquids.parenteralSolutions);
      setIntravenousMeds(existingSheet.liquids.intravenousMeds);
      setBloodDerivatives(existingSheet.liquids.bloodDerivatives);
      setDiuresis(existingSheet.liquids.diuresis);
      setEvacuations(existingSheet.liquids.evacuations);
      setBleeding(existingSheet.liquids.bleeding);
      setEmesis(existingSheet.liquids.emesis);
      setDrains(existingSheet.liquids.drains);

      setSolutions(existingSheet.parenteralSolutionsActive);
      setMedsList(existingSheet.medications);
      setLesionsList(existingSheet.skinLesions);
      setDevicesList(existingSheet.invasiveDevices);

      setNursingDiagnosis(existingSheet.nursingCarePlan.nursingDiagnosis);
      setCareIndicator(existingSheet.nursingCarePlan.indicator);
      setInitialScore(existingSheet.nursingCarePlan.initialScore);
      setInterventions(existingSheet.nursingCarePlan.interventions);
      setFinalScore(existingSheet.nursingCarePlan.finalScore);
      setResultEvaluation(existingSheet.nursingCarePlan.resultEvaluation);

      setDischargePlan(existingSheet.dischargePlan);
      setObservations(existingSheet.observations);
    } else {
      // Prefill defaults for a brand new sheet using the patient's data
      setMedicalDiagnosis('Ingreso clínico en observación.');
      setBedNumber('Cama ' + Math.floor(100 + Math.random() * 200));
      setVitalSignsHistory([
        {
          hour: '08:00',
          respiratoryRate: 18,
          temperature: 36.5,
          heartRate: 72,
          bloodPressure: '120/80',
          meanBloodPressure: 93.3,
          oxygenSaturation: 98
        }
      ]);
      setSolutions([
        {
          solution: 'Solución Glucosada 5% 500ml',
          mlHour: 41,
          startTime: '08:00',
          endTime: '20:00',
          pendingToInfuse: '100 ml',
          doubleCheck: `${nurse.fullName.split(' ').map(n=>n[0]).join('')}`
        }
      ]);
    }
  }, [existingSheet, patient, nurse]);

  // Liquid Balance calculations
  const totalIngresos = Number(oralRoute) + Number(parenteralSolutions) + Number(intravenousMeds) + Number(bloodDerivatives);
  const totalEgresos = Number(diuresis) + Number(evacuations) + Number(bleeding) + Number(emesis) + Number(drains);
  const balanceTotal = totalIngresos - totalEgresos;

  // Add Vitals handler
  const handleAddVitals = () => {
    const newVital = {
      hour: vHour,
      respiratoryRate: Number(vResp),
      temperature: Number(vTemp),
      heartRate: Number(vHeart),
      bloodPressure: vBp,
      meanBloodPressure: Number(vPam),
      oxygenSaturation: Number(vSat)
    };
    setVitalSignsHistory([...vitalSignsHistory, newVital].sort((a,b)=>a.hour.localeCompare(b.hour)));
  };

  const handleRemoveVitals = (index: number) => {
    setVitalSignsHistory(vitalSignsHistory.filter((_, i) => i !== index));
  };

  // Add Sol handler
  const handleAddSol = () => {
    if (!solName) return;
    setSolutions([...solutions, {
      solution: solName,
      mlHour: Number(solMlHour),
      startTime: solStart,
      endTime: solEnd,
      pendingToInfuse: solPending,
      doubleCheck: solDoubleCheck || `${nurse.fullName.split(' ').map(n=>n[0]).join('')}`
    }]);
    setSolName('');
    setSolDoubleCheck('');
  };

  // Add Med handler
  const handleAddMed = () => {
    if (!medName) return;
    
    // Apply PDF formatting rule: "ALTO RIESGO" auto-capitalized, "lasa" auto-lowercased
    let formattedName = medName;
    if (medIsHighRisk) {
      formattedName = medName.toUpperCase() + " (ALTO RIESGO)";
    } else if (medIsLasa) {
      formattedName = medName.toLowerCase() + " [lasa]";
    }

    setMedsList([...medsList, {
      name: formattedName,
      schedule: medSchedule,
      dose: medDose,
      route: medRoute,
      doubleCheck: medDoubleCheck || `${nurse.fullName.split(' ').map(n=>n[0]).join('')}`,
      isHighRisk: medIsHighRisk,
      isLasa: medIsLasa
    }]);
    setMedName('');
    setMedDose('');
    setMedDoubleCheck('');
    setMedIsHighRisk(false);
    setMedIsLasa(false);
  };

  // Add Skin Lesion handler
  const handleAddLesion = () => {
    if (!lesionLocation || !lesionType) return;
    setLesionsList([...lesionsList, {
      location: lesionLocation,
      type: lesionType,
      observations: lesionObs
    }]);
    setLesionLocation('');
    setLesionType('');
    setLesionObs('');
  };

  // Add Invasive Device handler
  const handleAddDevice = () => {
    if (!deviceName) return;
    setDevicesList([...devicesList, {
      device: deviceName,
      installationDate: deviceInstDate || new Date().toISOString().split('T')[0],
      removalDate: deviceRemDate,
      observations: deviceObs
    }]);
    setDeviceName('');
    setDeviceInstDate('');
    setDeviceRemDate('');
    setDeviceObs('');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalSheet: NursingSheet = {
      id: existingSheet?.id || `sheet-${Date.now()}`,
      patientId: patient.id,
      nurseId: existingSheet?.nurseId || nurse.id,
      date: existingSheet?.date || new Date().toISOString().split('T')[0],
      
      medicalUnit,
      service,
      bedNumber,
      expedientNumber,
      admissionDate,
      hospitalStayDays: Number(hospitalStayDays),
      medicalDiagnosis,
      allergies,

      consciousnessState,
      gait,
      movements,
      facies,
      attitude,
      bodyConstitution,

      vitalSignsHistory,

      painScale,
      fallRisk,
      pressureUlcerRisk,
      glasgowComaScale,
      phlebitisScale,
      skinColoration,
      pupillaryEvaluation,
      evacuationsBristol,
      cephalicPerimeter: cephalicPerimeter !== '' ? Number(cephalicPerimeter) : '',
      thoracicPerimeter: thoracicPerimeter !== '' ? Number(thoracicPerimeter) : '',
      abdominalPerimeter: abdominalPerimeter !== '' ? Number(abdominalPerimeter) : '',
      capillaryRefill: capillaryRefill !== '' ? Number(capillaryRefill) : '',
      capillaryGlycemia: capillaryGlycemia !== '' ? Number(capillaryGlycemia) : '',

      dietType,
      intakeDetails,

      liquids: {
        oralRoute: Number(oralRoute),
        parenteralSolutions: Number(parenteralSolutions),
        intravenousMeds: Number(intravenousMeds),
        bloodDerivatives: Number(bloodDerivatives),
        diuresis: Number(diuresis),
        evacuations: Number(evacuations),
        bleeding: Number(bleeding),
        emesis: Number(emesis),
        drains: Number(drains)
      },

      parenteralSolutionsActive: solutions,
      medications: medsList,
      skinLesions: lesionsList,
      invasiveDevices: devicesList,

      nursingCarePlan: {
        nursingDiagnosis,
        indicator: careIndicator,
        initialScore: Number(initialScore),
        interventions,
        finalScore: Number(finalScore),
        resultEvaluation
      },

      dischargePlan,
      observations,
      responsibleNurseName: existingSheet?.responsibleNurseName || nurse.fullName,
      responsibleNurseLicense: existingSheet?.responsibleNurseLicense || nurse.licenseId
    };

    onSave(finalSheet);
  };

  const triggerPrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden font-sans">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2.5 rounded-xl transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-teal-400 font-bold text-xs uppercase tracking-widest font-mono">Formato Oficial ISEM</span>
            <h1 className="text-xl font-black text-white leading-tight">
              {existingSheet ? 'Visualizar / Editar Hoja de Enfermería' : 'Nueva Hoja de Llenado Clínico'}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Paciente: <strong>{patient.fullName}</strong> • Folio RFID: <strong>{patient.rfidFolio || 'N/A'}</strong></p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={triggerPrint}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-1.5 transition"
          >
            <Printer className="w-4 h-4" />
            Imprimir Hoja (PDF)
          </button>
          <button
            type="button"
            onClick={handleFormSubmit}
            className="bg-teal-600 hover:bg-teal-500 text-white font-bold py-2.5 px-5 rounded-xl text-xs flex items-center gap-1.5 transition shadow-md"
          >
            <Save className="w-4 h-4" />
            Guardar Todo
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-100/70 border-b border-slate-200 p-2 flex flex-wrap gap-1 print:hidden">
        <button
          onClick={() => setActiveTab('id')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'id' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" /> 1. Identificación y Habitus
        </button>
        <button
          onClick={() => setActiveTab('vitals')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'vitals' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Activity className="w-3.5 h-3.5" /> 2. Signos Vitales
        </button>
        <button
          onClick={() => setActiveTab('val')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'val' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Thermometer className="w-3.5 h-3.5" /> 3. Valoración y Líquidos
        </button>
        <button
          onClick={() => setActiveTab('meds')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'meds' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Droplets className="w-3.5 h-3.5" /> 4. Medicación y Dispositivos
        </button>
        <button
          onClick={() => setActiveTab('plan')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'plan' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <CheckCircle className="w-3.5 h-3.5" /> 5. Cuidados y Alta
        </button>
      </div>

      {/* Main Print Layout / Interactive Form */}
      <form onSubmit={handleFormSubmit} className="p-6 md:p-8 space-y-8 print:p-0 print:space-y-4 print:text-black">
        
        {/* PHYSICAL DOCUMENT LOGO/HERO IN PRINT MODE OR TAB ID */}
        <div className="hidden print:flex flex-col border-b border-double border-slate-400 pb-4 mb-4">
          <div className="flex justify-between items-center text-xs">
            <div className="font-extrabold uppercase tracking-wide">GOBIERNO DEL ESTADO DE MÉXICO</div>
            <div className="text-right text-[9px] font-mono">Código: 208C0101100000L-609-24</div>
          </div>
          <div className="text-center my-2">
            <h1 className="text-md font-black tracking-tight uppercase">ISEM - SECRETARÍA DE SALUD</h1>
            <h2 className="text-sm font-bold">HOJA DE ENFERMERÍA PARA LA ATENCIÓN A LA PERSONA USUARIA EN UNIDADES HOSPITALARIAS</h2>
          </div>
        </div>

        {/* TAB 1: IDENTIFICACIÓN Y HABITUS */}
        {(activeTab === 'id' || window.matchMedia('print').matches) && (
          <div className="space-y-6">
            <div className="border-l-4 border-teal-500 pl-3">
              <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wide">1. Datos de Identificación de la Persona Usuaria</h2>
              <p className="text-xs text-slate-500">Información de hospitalización y demografía básica.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-slate-50 p-5 rounded-2xl border border-slate-100 print:bg-white print:border-none print:p-0">
              {/* Unidad Médica */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Unidad Médica</label>
                <input
                  type="text"
                  value={medicalUnit}
                  onChange={(e) => setMedicalUnit(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-900"
                />
              </div>

              {/* Servicio */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Servicio</label>
                <input
                  type="text"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-900"
                />
              </div>

              {/* Núm de Cama */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Núm. de Cama</label>
                <input
                  type="text"
                  placeholder="Ej. Cama 104"
                  value={bedNumber}
                  onChange={(e) => setBedNumber(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-900 font-bold text-teal-800"
                />
              </div>

              {/* Paciente Nombre readonly */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Nombre de la Persona Usuaria</label>
                <input
                  type="text"
                  disabled
                  value={patient.fullName}
                  className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 bg-slate-100 text-slate-700 font-bold"
                />
              </div>

              {/* Edad, Nacimiento & Sexo readonly */}
              <div className="grid grid-cols-3 gap-1.5 md:col-span-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Fecha Nac.</label>
                  <input
                    type="text"
                    disabled
                    value={patient.birthDate || 'N/A'}
                    className="w-full text-sm border border-slate-200 rounded-xl px-1.5 py-2 bg-slate-100 text-slate-700 font-bold text-center"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Edad</label>
                  <input
                    type="text"
                    disabled
                    value={`${patient.age} años`}
                    className="w-full text-sm border border-slate-200 rounded-xl px-1.5 py-2 bg-slate-100 text-slate-700 text-center"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Grupo Rh</label>
                  <input
                    type="text"
                    disabled
                    value={patient.bloodType}
                    className="w-full text-sm border border-slate-200 rounded-xl px-1.5 py-2 bg-slate-100 text-red-700 font-bold text-center"
                  />
                </div>
              </div>

              {/* Expediente */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Núm. de Expediente</label>
                <input
                  type="text"
                  value={expedientNumber}
                  onChange={(e) => setExpedientNumber(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-900 font-mono"
                />
              </div>

              {/* Fecha Ingreso */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Fecha de Ingreso</label>
                <input
                  type="date"
                  value={admissionDate}
                  onChange={(e) => setAdmissionDate(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-900"
                />
              </div>

              {/* Estancia hospitalaria */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Estancia Hospitalaria (Días)</label>
                <input
                  type="number"
                  min={1}
                  value={hospitalStayDays}
                  onChange={(e) => setHospitalStayDays(Number(e.target.value))}
                  className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-900"
                />
              </div>

              {/* Alergias */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Alergias</label>
                <input
                  type="text"
                  placeholder="Escriba medicamentos o NEGADAS"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-red-600 font-bold placeholder-slate-400"
                />
              </div>

              {/* Diagnostico */}
              <div className="md:col-span-3">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Diagnóstico Médico</label>
                <textarea
                  rows={2}
                  value={medicalDiagnosis}
                  onChange={(e) => setMedicalDiagnosis(e.target.value)}
                  placeholder="Diagnóstico clínico principal..."
                  className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-900"
                />
              </div>
            </div>

            {/* Habitus Exterior Section */}
            <div className="border-l-4 border-teal-500 pl-3">
              <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wide">17. Habitus Exterior</h2>
              <p className="text-xs text-slate-500">Evaluación física y conductual externa al ingreso del turno.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100 print:bg-white print:border-none">
              {/* Estado de Consciencia */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Estado de Consciencia</label>
                <select
                  value={consciousnessState}
                  onChange={(e) => setConsciousnessState(e.target.value as any)}
                  className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white"
                >
                  <option value="Consciente">Consciente</option>
                  <option value="Somnoliento">Somnoliento (a)</option>
                  <option value="Confuso">Confuso (a)</option>
                  <option value="Obnubilado">Obnubilado (a)</option>
                  <option value="Estuporoso">Estuporoso (a)</option>
                  <option value="Soporoso">Soporoso (a)</option>
                  <option value="Comatoso">Comatoso (a)</option>
                  <option value="Muerte cerebral">Muerte cerebral</option>
                </select>
              </div>

              {/* Marcha */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Marcha</label>
                <select
                  value={gait}
                  onChange={(e) => setGait(e.target.value as any)}
                  className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white"
                >
                  <option value="Normal">Normal</option>
                  <option value="Unilateral">Unilateral</option>
                  <option value="Bilateral">Bilateral</option>
                </select>
              </div>

              {/* Movimientos */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Movimientos</label>
                <select
                  value={movements}
                  onChange={(e) => setMovements(e.target.value as any)}
                  className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white"
                >
                  <option value="Normales">Normales</option>
                  <option value="Anormales">Anormales</option>
                </select>
              </div>

              {/* Facies */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Facies</label>
                <select
                  value={facies}
                  onChange={(e) => setFacies(e.target.value as any)}
                  className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white"
                >
                  <option value="No característica">No característica</option>
                  <option value="Dolorosa">Dolorosa</option>
                  <option value="Febril">Febril</option>
                  <option value="Cushiniana">Cushiniana</option>
                  <option value="Hipertiroidea">Hipertiroidea</option>
                  <option value="Tetánica">Tetánica</option>
                  <option value="Parkinsoniana">Parkinsoniana</option>
                  <option value="Adenoidea">Adenoidea</option>
                </select>
              </div>

              {/* Actitud */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Actitud</label>
                <select
                  value={attitude}
                  onChange={(e) => setAttitude(e.target.value as any)}
                  className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white"
                >
                  <option value="Libremente escogida">Libremente escogida</option>
                  <option value="Instintiva">Instintiva</option>
                  <option value="Forzada">Forzada</option>
                  <option value="Pasiva">Pasiva</option>
                </select>
              </div>

              {/* Constitución Física */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Constitución Física</label>
                <select
                  value={bodyConstitution}
                  onChange={(e) => setBodyConstitution(e.target.value as any)}
                  className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white"
                >
                  <option value="Ectomorfa">Ectomorfa</option>
                  <option value="Mesomorfa">Mesomorfa</option>
                  <option value="Endomorfa">Endomorfa</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SIGNOS VITALES */}
        {(activeTab === 'vitals' || window.matchMedia('print').matches) && (
          <div className="space-y-6">
            <div className="border-l-4 border-teal-500 pl-3">
              <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wide">18. Registro de Signos Vitales (Timeline de 24 Horas)</h2>
              <p className="text-xs text-slate-500">Historial colorimétrico por turno: Frecuencia Respiratoria (Verde), Temperatura (Roja), Frecuencia Cardíaca (Azul).</p>
            </div>

            {/* Quick add vital form - Hidden in print */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-wrap gap-4 items-end print:hidden">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Hora</label>
                <input
                  type="text"
                  value={vHour}
                  onChange={(e) => setVHour(e.target.value)}
                  className="w-20 text-sm border rounded-xl px-2.5 py-1.5"
                  placeholder="08:00"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-emerald-600 uppercase mb-1">FR (Resp/min)</label>
                <input
                  type="number"
                  value={vResp}
                  onChange={(e) => setVResp(Number(e.target.value))}
                  className="w-24 text-sm border rounded-xl px-2.5 py-1.5 border-emerald-300 text-emerald-700"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-red-600 uppercase mb-1">Temp (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={vTemp}
                  onChange={(e) => setVTemp(Number(e.target.value))}
                  className="w-24 text-sm border rounded-xl px-2.5 py-1.5 border-red-300 text-red-700"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-blue-600 uppercase mb-1">FC (Lat/min)</label>
                <input
                  type="number"
                  value={vHeart}
                  onChange={(e) => setVHeart(Number(e.target.value))}
                  className="w-24 text-sm border rounded-xl px-2.5 py-1.5 border-blue-300 text-blue-700"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">T/A (P. Art.)</label>
                <input
                  type="text"
                  value={vBp}
                  onChange={(e) => setVBp(e.target.value)}
                  className="w-28 text-sm border rounded-xl px-2.5 py-1.5"
                  placeholder="120/80"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">PAM (Art. Med.)</label>
                <input
                  type="number"
                  value={vPam}
                  onChange={(e) => setVPam(Number(e.target.value))}
                  className="w-20 text-sm border rounded-xl px-2.5 py-1.5"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Sat O₂ (%)</label>
                <input
                  type="number"
                  value={vSat}
                  onChange={(e) => setVSat(Number(e.target.value))}
                  className="w-24 text-sm border rounded-xl px-2.5 py-1.5"
                />
              </div>
              <button
                type="button"
                onClick={handleAddVitals}
                className="bg-slate-800 hover:bg-slate-900 text-white rounded-xl px-4 py-2 text-xs font-bold transition flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar Toma
              </button>
            </div>

            {/* Vitals logs table */}
            <div className="overflow-x-auto border border-slate-100 rounded-2xl bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500 border-b">
                  <tr>
                    <th className="px-4 py-3">Hora</th>
                    <th className="px-4 py-3 text-emerald-700">FR (Frec. Resp)</th>
                    <th className="px-4 py-3 text-red-700">T° (Temperatura)</th>
                    <th className="px-4 py-3 text-blue-700">FC (Frec. Card)</th>
                    <th className="px-4 py-3">Presión Arterial</th>
                    <th className="px-4 py-3">PAM (Media)</th>
                    <th className="px-4 py-3">Sat O₂</th>
                    <th className="px-4 py-3 text-right print:hidden">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-xs">
                  {vitalSignsHistory.map((vital, index) => (
                    <tr key={index} className="hover:bg-slate-50/50 transition">
                      <td className="px-4 py-3 font-bold text-slate-900">{vital.hour} Hrs</td>
                      <td className="px-4 py-3 text-emerald-600 font-extrabold">{vital.respiratoryRate} /min</td>
                      <td className="px-4 py-3 text-red-600 font-extrabold">{vital.temperature} °C</td>
                      <td className="px-4 py-3 text-blue-600 font-extrabold">{vital.heartRate} lpm</td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{vital.bloodPressure}</td>
                      <td className="px-4 py-3 text-slate-600">{vital.meanBloodPressure} mmHg</td>
                      <td className="px-4 py-3 text-teal-600 font-bold">{vital.oxygenSaturation}%</td>
                      <td className="px-4 py-3 text-right print:hidden">
                        <button
                          type="button"
                          onClick={() => handleRemoveVitals(index)}
                          className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {vitalSignsHistory.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center py-6 text-slate-400">No se han registrado tomas de signos vitales.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Micro Visual Chart simulation matching the PDF "Tinta Verde, Roja, Azul" */}
            {vitalSignsHistory.length > 0 && (
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3">
                <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">Tendencias del Turno</span>
                <div className="flex gap-4 items-center flex-wrap">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                    Frecuencia Respiratoria
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-red-600 font-semibold">
                    <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                    Temperatura Corporal
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold">
                    <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
                    Frecuencia Cardíaca
                  </div>
                </div>

                {/* Simulated Chart Bars */}
                <div className="space-y-3 pt-2">
                  {vitalSignsHistory.slice(-3).map((v, i) => (
                    <div key={i} className="space-y-1 bg-white p-3 rounded-xl border border-slate-200">
                      <div className="text-xs font-bold text-slate-800">{v.hour} Hrs</div>
                      <div className="space-y-1.5">
                        {/* FR bar */}
                        <div className="flex items-center gap-2 text-[10px]">
                          <span className="w-12 text-slate-500">FR: {v.respiratoryRate}/min</span>
                          <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(100, (v.respiratoryRate / 40) * 100)}%` }} />
                          </div>
                        </div>
                        {/* Temp bar */}
                        <div className="flex items-center gap-2 text-[10px]">
                          <span className="w-12 text-slate-500">Temp: {v.temperature}°C</span>
                          <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-red-500 h-full rounded-full" style={{ width: `${Math.min(100, ((v.temperature - 35) / 7) * 100)}%` }} />
                          </div>
                        </div>
                        {/* FC bar */}
                        <div className="flex items-center gap-2 text-[10px]">
                          <span className="w-12 text-slate-500">FC: {v.heartRate} lpm</span>
                          <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${Math.min(100, (v.heartRate / 160) * 100)}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: VALORACIÓN, DIETA Y LÍQUIDOS */}
        {(activeTab === 'val' || window.matchMedia('print').matches) && (
          <div className="space-y-6">
            <div className="border-l-4 border-teal-500 pl-3">
              <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wide">19. Valoración Clínica, Escalas y Perímetros</h2>
              <p className="text-xs text-slate-500">Resultados de valoración integral y mediciones corporales específicas.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100 print:bg-white print:border-none">
              {/* Dolor */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Dolor (Escala Eva 0-10)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={0}
                    max={10}
                    value={painScale}
                    onChange={(e) => setPainScale(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-250 rounded-lg appearance-none cursor-pointer accent-teal-600"
                  />
                  <span className="font-mono font-bold text-sm text-teal-800 bg-teal-50 border px-2.5 py-1 rounded-lg shrink-0">{painScale}</span>
                </div>
              </div>

              {/* Riesgo Caídas */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Riesgo de Caídas</label>
                <select
                  value={fallRisk}
                  onChange={(e) => setFallRisk(e.target.value as any)}
                  className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white"
                >
                  <option value="Bajo">Bajo Riesgo</option>
                  <option value="Medio">Medio Riesgo</option>
                  <option value="Alto">Alto Riesgo</option>
                </select>
              </div>

              {/* Riesgo Úlceras */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Riesgo Úlceras por Presión</label>
                <select
                  value={pressureUlcerRisk}
                  onChange={(e) => setPressureUlcerRisk(e.target.value as any)}
                  className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white"
                >
                  <option value="Bajo">Bajo (Norton/Braden)</option>
                  <option value="Medio">Medio (Norton/Braden)</option>
                  <option value="Alto">Alto (Norton/Braden)</option>
                </select>
              </div>

              {/* Glasgow */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Coma de Glasgow (3-15)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={3}
                    max={15}
                    value={glasgowComaScale}
                    onChange={(e) => setGlasgowComaScale(Number(e.target.value))}
                    className="w-full text-sm border border-slate-300 rounded-xl px-3 py-1.5"
                  />
                  <span className="text-[10px] font-bold text-slate-400">Pts</span>
                </div>
              </div>

              {/* Flebitis */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Flebitis (Escala 0-5)</label>
                <input
                  type="number"
                  min={0}
                  max={5}
                  value={phlebitisScale}
                  onChange={(e) => setPhlebitisScale(Number(e.target.value))}
                  className="w-full text-sm border border-slate-300 rounded-xl px-3 py-1.5"
                />
              </div>

              {/* Coloración */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Coloración de la Piel</label>
                <select
                  value={skinColoration}
                  onChange={(e) => setSkinColoration(e.target.value as any)}
                  className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white"
                >
                  <option value="R">R - Rosado (a)</option>
                  <option value="I">I - Ictérico (a)</option>
                  <option value="P">P - Pálido (a)</option>
                  <option value="C">C - Cianótico (a)</option>
                  <option value="RB">RB - Rubicundo (a)</option>
                  <option value="M">M - Marmóreo (a)</option>
                  <option value="T">T - Terroso (a)</option>
                </select>
              </div>

              {/* Valoración Pupilar */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Valoración Pupilar</label>
                <select
                  value={pupillaryEvaluation}
                  onChange={(e) => setPupillaryEvaluation(e.target.value as any)}
                  className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white"
                >
                  <option value="Iso">Iso - Isocórica</option>
                  <option value="Mid">Mid - Midriática</option>
                  <option value="Mio">Mio - Miótica</option>
                  <option value="Ani">Ani - Anisocórica</option>
                </select>
              </div>

              {/* Evacuaciones Bristol */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Evacuaciones (Escala Bristol 1-7)</label>
                <input
                  type="number"
                  min={1}
                  max={7}
                  placeholder="Ej. 4"
                  value={evacuationsBristol}
                  onChange={(e) => setEvacuationsBristol(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full text-sm border border-slate-300 rounded-xl px-3 py-1.5"
                />
              </div>

              {/* Perímetro Cefálico */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Perímetro Cefálico (cm)</label>
                <input
                  type="number"
                  value={cephalicPerimeter}
                  onChange={(e) => setCephalicPerimeter(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full text-sm border border-slate-300 rounded-xl px-3 py-1.5"
                />
              </div>

              {/* Perímetro Torácico */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Perímetro Torácico (cm)</label>
                <input
                  type="number"
                  value={thoracicPerimeter}
                  onChange={(e) => setThoracicPerimeter(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full text-sm border border-slate-300 rounded-xl px-3 py-1.5"
                />
              </div>

              {/* Perímetro Abdominal */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Perímetro Abdominal (cm)</label>
                <input
                  type="number"
                  value={abdominalPerimeter}
                  onChange={(e) => setAbdominalPerimeter(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full text-sm border border-slate-300 rounded-xl px-3 py-1.5"
                />
              </div>

              {/* Llenado Capilar */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Llenado Capilar (Segundos)</label>
                <input
                  type="number"
                  placeholder="Segundos"
                  value={capillaryRefill}
                  onChange={(e) => setCapillaryRefill(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full text-sm border border-slate-300 rounded-xl px-3 py-1.5"
                />
              </div>

              {/* Glicemia Capilar */}
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Glicemia Capilar (mg/dl)</label>
                <input
                  type="number"
                  placeholder="Ej. 110"
                  value={capillaryGlycemia}
                  onChange={(e) => setCapillaryGlycemia(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full text-sm border border-slate-300 rounded-xl px-3 py-1.5 text-teal-800 font-bold"
                />
              </div>
            </div>

            {/* 20. Dieta */}
            <div className="border-l-4 border-teal-500 pl-3">
              <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wide">20. Dieta e Ingesta</h2>
              <p className="text-xs text-slate-500">Especificación del régimen nutricional asignado y tolerancia del usuario.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100 print:bg-white print:border-none">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Tipo de Dieta</label>
                <input
                  type="text"
                  placeholder="Ej. Dieta blanda hiposódica, Ayuno..."
                  value={dietType}
                  onChange={(e) => setDietType(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-900"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Observaciones de Ingesta</label>
                <input
                  type="text"
                  placeholder="Ej. Tolera 100% de alimentos sólidos sin náusea"
                  value={intakeDetails}
                  onChange={(e) => setIntakeDetails(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-900"
                />
              </div>
            </div>

            {/* 21. Control de Líquidos */}
            <div className="border-l-4 border-teal-500 pl-3">
              <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wide">21. Control de Líquidos (Balance de Fluidos en ml)</h2>
              <p className="text-xs text-slate-500">Cálculo en tiempo real de ingresos y egresos totales del paciente.</p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6 print:bg-white print:border-none">
              {/* Ingresos Column */}
              <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-150">
                <span className="text-xs font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Ingresos (Entradas de Líquidos)
                </span>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">Vía Oral (ml)</label>
                    <input type="number" value={oralRoute} onChange={(e) => setOralRoute(Number(e.target.value))} className="w-full border rounded-lg px-2.5 py-1.5" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">Soluciones Parenterales (ml)</label>
                    <input type="number" value={parenteralSolutions} onChange={(e) => setParenteralSolutions(Number(e.target.value))} className="w-full border rounded-lg px-2.5 py-1.5" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">Meds Intravenosos (ml)</label>
                    <input type="number" value={intravenousMeds} onChange={(e) => setIntravenousMeds(Number(e.target.value))} className="w-full border rounded-lg px-2.5 py-1.5" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">Hemoderivados / Sangre (ml)</label>
                    <input type="number" value={bloodDerivatives} onChange={(e) => setBloodDerivatives(Number(e.target.value))} className="w-full border rounded-lg px-2.5 py-1.5" />
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-2 flex justify-between items-center text-xs font-bold text-slate-700">
                  <span>Total de Ingresos:</span>
                  <span className="text-emerald-700 font-mono">{totalIngresos} ml</span>
                </div>
              </div>

              {/* Egresos Column */}
              <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-150">
                <span className="text-xs font-black text-red-800 uppercase tracking-wider flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500" /> Egresos (Salidas / Eliminación)
                </span>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">Diuresis / Orina (ml)</label>
                    <input type="number" value={diuresis} onChange={(e) => setDiuresis(Number(e.target.value))} className="w-full border rounded-lg px-2.5 py-1.5" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">Evacuaciones (ml)</label>
                    <input type="number" value={evacuations} onChange={(e) => setEvacuations(Number(e.target.value))} className="w-full border rounded-lg px-2.5 py-1.5" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">Sangrado (ml)</label>
                    <input type="number" value={bleeding} onChange={(e) => setBleeding(Number(e.target.value))} className="w-full border rounded-lg px-2.5 py-1.5" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">Emesis / Vómito (ml)</label>
                    <input type="number" value={emesis} onChange={(e) => setEmesis(Number(e.target.value))} className="w-full border rounded-lg px-2.5 py-1.5" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] text-slate-500 mb-0.5">Drenajes / Sondas (ml)</label>
                    <input type="number" value={drains} onChange={(e) => setDrains(Number(e.target.value))} className="w-full border rounded-lg px-2.5 py-1.5" />
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-2 flex justify-between items-center text-xs font-bold text-slate-700">
                  <span>Total de Egresos:</span>
                  <span className="text-red-700 font-mono">{totalEgresos} ml</span>
                </div>
              </div>

              {/* Dynamic Fluids balance total summary box */}
              <div className="md:col-span-2 bg-slate-900 text-white rounded-xl p-4 flex items-center justify-between shadow-inner">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Balance Clínico Total (Ingresos - Egresos)</span>
                  <p className="text-xs text-slate-300 mt-0.5">Balance deseable determinado por plan de líquidos médico.</p>
                </div>
                <div className="text-right">
                  <span className={`text-xl font-mono font-black ${balanceTotal >= 0 ? 'text-teal-400' : 'text-rose-400'}`}>
                    {balanceTotal > 0 ? `+${balanceTotal}` : balanceTotal} ml
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: MEDICACION, SOLUCIONES Y DISPOSITIVOS INVASIVOS */}
        {(activeTab === 'meds' || window.matchMedia('print').matches) && (
          <div className="space-y-6">
            <div className="border-l-4 border-teal-500 pl-3">
              <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wide">22. Soluciones Parenterales Activas</h2>
              <p className="text-xs text-slate-500">Sueros, electrolitos concentrados e infusiones continuas intravenosas.</p>
            </div>

            {/* Soluciones Form - Hidden in print */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4 items-end print:hidden">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nombre de la Solución e Integrantes</label>
                <input
                  type="text"
                  placeholder="Ej. Solución Fisiológica 0.9% 1000ml + Gluconato de Calcio 1g"
                  value={solName}
                  onChange={(e) => setSolName(e.target.value)}
                  className="w-full text-sm border rounded-xl px-3 py-1.5"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Goteo (Ml/Hora)</label>
                <input
                  type="number"
                  value={solMlHour}
                  onChange={(e) => setSolMlHour(Number(e.target.value))}
                  className="w-full text-sm border rounded-xl px-3 py-1.5"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Inicio (hh:mm)</label>
                <input
                  type="text"
                  value={solStart}
                  onChange={(e) => setSolStart(e.target.value)}
                  className="w-full text-sm border rounded-xl px-3 py-1.5"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Fin / Término (hh:mm)</label>
                <input
                  type="text"
                  value={solEnd}
                  onChange={(e) => setSolEnd(e.target.value)}
                  className="w-full text-sm border rounded-xl px-3 py-1.5"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Solución por Pasar</label>
                <input
                  type="text"
                  value={solPending}
                  onChange={(e) => setSolPending(e.target.value)}
                  className="w-full text-sm border rounded-xl px-3 py-1.5"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Doble Verificación (Inic. de 2 Enfermeros)</label>
                <input
                  type="text"
                  placeholder="Ej. CG / MO"
                  value={solDoubleCheck}
                  onChange={(e) => setSolDoubleCheck(e.target.value)}
                  className="w-full text-sm border rounded-xl px-3 py-1.5"
                />
              </div>
              <button
                type="button"
                onClick={handleAddSol}
                className="bg-slate-800 hover:bg-slate-900 text-white rounded-xl px-4 py-2 text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar Solución
              </button>
            </div>

            {/* Soluciones table */}
            <div className="overflow-x-auto border border-slate-100 rounded-2xl bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500 border-b">
                  <tr>
                    <th className="px-4 py-3">Solución Parenteral</th>
                    <th className="px-4 py-3">Ml/Hora</th>
                    <th className="px-4 py-3">Inicio</th>
                    <th className="px-4 py-3">Término</th>
                    <th className="px-4 py-3">Por Pasar</th>
                    <th className="px-4 py-3">Doble Verif.</th>
                    <th className="px-4 py-3 text-right print:hidden">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-xs">
                  {solutions.map((sol, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 font-semibold text-slate-900">{sol.solution}</td>
                      <td className="px-4 py-3">{sol.mlHour} ml/h</td>
                      <td className="px-4 py-3">{sol.startTime} Hrs</td>
                      <td className="px-4 py-3">{sol.endTime} Hrs</td>
                      <td className="px-4 py-3 text-amber-700 font-bold">{sol.pendingToInfuse}</td>
                      <td className="px-4 py-3 text-teal-800 font-bold bg-teal-50/20">{sol.doubleCheck}</td>
                      <td className="px-4 py-3 text-right print:hidden">
                        <button
                          type="button"
                          onClick={() => setSolutions(solutions.filter((_, i) => i !== index))}
                          className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {solutions.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-6 text-slate-400">No hay soluciones parenterales activas.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* 23. Medicamentos */}
            <div className="border-l-4 border-teal-500 pl-3">
              <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wide">23. Registro de Medicamentos</h2>
              <p className="text-xs text-slate-500">Administración de fármacos. NOTA: Medicamentos de Alto Riesgo en MAYÚSCULAS y LASA en minúsculas.</p>
            </div>

            {/* Medicamentos Form - Hidden in print */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4 items-end print:hidden">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Fármaco (Nombre Genérico)</label>
                <input
                  type="text"
                  placeholder="Ej. Ceftriaxona o Insulina"
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                  className="w-full text-sm border rounded-xl px-3 py-1.5"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Horario de Toma</label>
                <input
                  type="text"
                  value={medSchedule}
                  onChange={(e) => setMedSchedule(e.target.value)}
                  className="w-full text-sm border rounded-xl px-3 py-1.5"
                  placeholder="12:00, 20:00"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Dosis (Cant. / Unidad)</label>
                <input
                  type="text"
                  placeholder="Ej. 1g o 4 UI"
                  value={medDose}
                  onChange={(e) => setMedDose(e.target.value)}
                  className="w-full text-sm border rounded-xl px-3 py-1.5"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Vía de Aplicación</label>
                <select
                  value={medRoute}
                  onChange={(e) => setMedRoute(e.target.value)}
                  className="w-full text-sm border rounded-xl px-3 py-1.5 bg-white"
                >
                  <option value="Intravenosa">Intravenosa</option>
                  <option value="Subcutánea">Subcutánea</option>
                  <option value="Intramuscular">Intramuscular</option>
                  <option value="Vía Oral">Vía Oral</option>
                  <option value="Inhalatoria">Inhalatoria</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Doble Verificación</label>
                <input
                  type="text"
                  placeholder="Inic. Ej. CG"
                  value={medDoubleCheck}
                  onChange={(e) => setMedDoubleCheck(e.target.value)}
                  className="w-full text-sm border rounded-xl px-3 py-1.5"
                />
              </div>

              {/* High Risk / LASA toggles */}
              <div className="flex gap-4 p-2 bg-white rounded-xl border">
                <label className="flex items-center gap-1.5 text-xs font-bold text-red-600 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={medIsHighRisk}
                    onChange={(e) => {
                      setMedIsHighRisk(e.target.checked);
                      if (e.target.checked) setMedIsLasa(false);
                    }}
                    className="accent-red-600"
                  />
                  Alto Riesgo
                </label>
                <label className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={medIsLasa}
                    onChange={(e) => {
                      setMedIsLasa(e.target.checked);
                      if (e.target.checked) setMedIsHighRisk(false);
                    }}
                    className="accent-indigo-600"
                  />
                  LASA
                </label>
              </div>

              <button
                type="button"
                onClick={handleAddMed}
                className="bg-slate-800 hover:bg-slate-900 text-white rounded-xl px-4 py-2 text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Registrar Med
              </button>
            </div>

            {/* Meds table */}
            <div className="overflow-x-auto border border-slate-100 rounded-2xl bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500 border-b">
                  <tr>
                    <th className="px-4 py-3">Medicamento (Fármaco)</th>
                    <th className="px-4 py-3">Horario</th>
                    <th className="px-4 py-3">Dosis</th>
                    <th className="px-4 py-3">Vía</th>
                    <th className="px-4 py-3">Doble Verif.</th>
                    <th className="px-4 py-3 text-right print:hidden">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {medsList.map((med, index) => (
                    <tr key={index} className={med.isHighRisk ? 'bg-red-50/20 text-red-900' : ''}>
                      <td className="px-4 py-3">
                        <span className={`font-mono font-extrabold ${
                          med.isHighRisk ? 'uppercase tracking-wide text-red-600' : 
                          med.isLasa ? 'lowercase underline decoration-indigo-400 text-indigo-700' : 'text-slate-800'
                        }`}>
                          {med.name}
                        </span>
                        {med.isHighRisk && (
                          <span className="ml-2 text-[8px] bg-red-100 text-red-700 font-extrabold px-1.5 py-0.5 rounded uppercase">Alta Vigilancia</span>
                        )}
                        {med.isLasa && (
                          <span className="ml-2 text-[8px] bg-indigo-100 text-indigo-700 font-extrabold px-1.5 py-0.5 rounded uppercase">LASA</span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono">{med.schedule}</td>
                      <td className="px-4 py-3 font-semibold">{med.dose}</td>
                      <td className="px-4 py-3 text-slate-600">{med.route}</td>
                      <td className="px-4 py-3 font-bold text-teal-800 bg-teal-50/10">{med.doubleCheck}</td>
                      <td className="px-4 py-3 text-right print:hidden">
                        <button
                          type="button"
                          onClick={() => setMedsList(medsList.filter((_, i) => i !== index))}
                          className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {medsList.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-6 text-slate-400">No hay medicamentos programados.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* 25. Dispositivos Invasivos */}
            <div className="border-l-4 border-teal-500 pl-3">
              <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wide">25. Dispositivos Invasivos Activos</h2>
              <p className="text-xs text-slate-500">Catéteres, sondas urinarias, tubos endotraqueales y vías venosas instaladas.</p>
            </div>

            {/* Device intake Form - Hidden in print */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4 items-end print:hidden">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nombre del Dispositivo e Indicación / Calibre</label>
                <input
                  type="text"
                  placeholder="Ej. CVP en flexura izquierda 18G"
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                  className="w-full text-sm border rounded-xl px-3 py-1.5"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Fecha de Instalación</label>
                <input
                  type="date"
                  value={deviceInstDate}
                  onChange={(e) => setDeviceInstDate(e.target.value)}
                  className="w-full text-sm border rounded-xl px-3 py-1.5"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Fecha de Retiro (Si aplica)</label>
                <input
                  type="date"
                  value={deviceRemDate}
                  onChange={(e) => setDeviceRemDate(e.target.value)}
                  className="w-full text-sm border rounded-xl px-3 py-1.5"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Observaciones de Permeabilidad</label>
                <input
                  type="text"
                  placeholder="Ej. Permeable, sin signos inflamatorios"
                  value={deviceObs}
                  onChange={(e) => setDeviceObs(e.target.value)}
                  className="w-full text-sm border rounded-xl px-3 py-1.5"
                />
              </div>
              <button
                type="button"
                onClick={handleAddDevice}
                className="bg-slate-800 hover:bg-slate-900 text-white rounded-xl px-4 py-2 text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Registrar Disp
              </button>
            </div>

            {/* Devices list table */}
            <div className="overflow-x-auto border border-slate-100 rounded-2xl bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500 border-b">
                  <tr>
                    <th className="px-4 py-3">Dispositivo / Calibre</th>
                    <th className="px-4 py-3">F. Instalación</th>
                    <th className="px-4 py-3">F. Retiro</th>
                    <th className="px-4 py-3">Observaciones / Estatus</th>
                    <th className="px-4 py-3 text-right print:hidden">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {devicesList.map((dev, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 font-semibold text-slate-900">{dev.device}</td>
                      <td className="px-4 py-3 font-mono">{dev.installationDate}</td>
                      <td className="px-4 py-3 font-mono text-slate-500">{dev.removalDate || 'Vigente'}</td>
                      <td className="px-4 py-3 text-slate-600">{dev.observations}</td>
                      <td className="px-4 py-3 text-right print:hidden">
                        <button
                          type="button"
                          onClick={() => setDevicesList(devicesList.filter((_, i) => i !== index))}
                          className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {devicesList.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-slate-400">No hay dispositivos invasivos instalados.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* 24. Valoración de la Piel (tipo de lesión) */}
            <div className="border-l-4 border-teal-500 pl-3">
              <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wide">24. Valoración de la Piel</h2>
              <p className="text-xs text-slate-500">Localización y tipología de lesiones cutáneas o úlceras por presión.</p>
            </div>

            {/* Lesiones Form - Hidden in print */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4 items-end print:hidden">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Región / Localización</label>
                <input
                  type="text"
                  placeholder="Ej. Talón izquierdo, Sacro..."
                  value={lesionLocation}
                  onChange={(e) => setLesionLocation(e.target.value)}
                  className="w-full text-sm border rounded-xl px-3 py-1.5"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tipo de Lesión Cutánea</label>
                <select
                  value={lesionType}
                  onChange={(e) => setLesionType(e.target.value as any)}
                  className="w-full text-sm border rounded-xl px-3 py-1.5 bg-white"
                >
                  <option value="">Seleccione tipo...</option>
                  <option value="Rash">Rash cutáneo / Alergia</option>
                  <option value="Hematoma">Hematoma</option>
                  <option value="Equimosis">Equimosis</option>
                  <option value="Dermoabrasión">Dermoabrasión / Raspón</option>
                  <option value="Quemadura">Quemadura</option>
                  <option value="Úlcera por Presión">Úlcera por Presión (UPP)</option>
                  <option value="Herida Quirúrgica">Herida Quirúrgica</option>
                  <option value="Herida Penetrante">Herida Penetrante</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Estatus clínico o tratamiento local</label>
                <input
                  type="text"
                  placeholder="Ej. Lavado con jabón neutro, aplicación de crema protectora"
                  value={lesionObs}
                  onChange={(e) => setLesionObs(e.target.value)}
                  className="w-full text-sm border rounded-xl px-3 py-1.5"
                />
              </div>
              <button
                type="button"
                onClick={handleAddLesion}
                className="bg-slate-800 hover:bg-slate-900 text-white rounded-xl px-4 py-2 text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Registrar Lesión
              </button>
            </div>

            {/* Lesiones list table */}
            <div className="overflow-x-auto border border-slate-100 rounded-2xl bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500 border-b">
                  <tr>
                    <th className="px-4 py-3">Localización anatómica</th>
                    <th className="px-4 py-3">Tipo de Lesión</th>
                    <th className="px-4 py-3">Tratamiento o Evolución</th>
                    <th className="px-4 py-3 text-right print:hidden">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {lesionsList.map((les, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 font-semibold text-slate-900">{les.location}</td>
                      <td className="px-4 py-3 text-red-600 font-bold">{les.type}</td>
                      <td className="px-4 py-3 text-slate-600">{les.observations}</td>
                      <td className="px-4 py-3 text-right print:hidden">
                        <button
                          type="button"
                          onClick={() => setLesionsList(lesionsList.filter((_, i) => i !== index))}
                          className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {lesionsList.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-6 text-slate-400">No hay lesiones dérmicas registradas en el turno.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: PLAN DE CUIDADOS, ALTA Y OBSERVACIONES */}
        {(activeTab === 'plan' || window.matchMedia('print').matches) && (
          <div className="space-y-6">
            <div className="border-l-4 border-teal-500 pl-3">
              <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wide">26. Plan de Cuidados de Enfermería (Taxonomía NANDA - NIC - NOC)</h2>
              <p className="text-xs text-slate-500">Juicio de enfermería basado en modelos y teorías para la mejora de la salud del paciente.</p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4 print:bg-white print:border-none print:p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Diagnóstico de Enfermería (NANDA) */}
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Diagnóstico de Enfermería (Taxonomía NANDA I)
                  </label>
                  <input
                    type="text"
                    value={nursingDiagnosis}
                    onChange={(e) => setNursingDiagnosis(e.target.value)}
                    placeholder="Problema + Factores relacionados (r/c) + Signos/síntomas manifestados (m/p)"
                    className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-900"
                  />
                </div>

                {/* Indicador */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Indicador de Evaluación
                  </label>
                  <input
                    type="text"
                    value={careIndicator}
                    onChange={(e) => setCareIndicator(e.target.value)}
                    placeholder="Ej. Control del dolor, Patrón respiratorio eficaz..."
                    className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white"
                  />
                </div>

                {/* Puntuación Inicial NOC */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Puntuación Inicial (Escala Likert 1-5 NOC)
                  </label>
                  <select
                    value={initialScore}
                    onChange={(e) => setInitialScore(Number(e.target.value))}
                    className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white"
                  >
                    <option value={1}>1 - Gravemente comprometido</option>
                    <option value={2}>2 - Sustancialmente comprometido</option>
                    <option value={3}>3 - Moderadamente comprometido</option>
                    <option value={4}>4 - Levemente comprometido</option>
                    <option value={5}>5 - No comprometido</option>
                  </select>
                </div>

                {/* Intervenciones NIC */}
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Intervenciones Realizadas (NIC)
                  </label>
                  <textarea
                    rows={2}
                    value={interventions}
                    onChange={(e) => setInterventions(e.target.value)}
                    placeholder="Escriba las intervenciones científicas clave realizadas durante el turno..."
                    className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white"
                  />
                </div>

                {/* Puntuación Final NOC */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Puntuación Final (Escala Likert 1-5 NOC)
                  </label>
                  <select
                    value={finalScore}
                    onChange={(e) => setFinalScore(Number(e.target.value))}
                    className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white"
                  >
                    <option value={1}>1 - Gravemente comprometido</option>
                    <option value={2}>2 - Sustancialmente comprometido</option>
                    <option value={3}>3 - Moderadamente comprometido</option>
                    <option value={4}>4 - Levemente comprometido</option>
                    <option value={5}>5 - No comprometido</option>
                  </select>
                </div>

                {/* Evaluación del Resultado Obtenido */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Evaluación de Resultados Obtenidos
                  </label>
                  <input
                    type="text"
                    value={resultEvaluation}
                    onChange={(e) => setResultEvaluation(e.target.value)}
                    placeholder="Resumen del estado evolutivo del paciente post-intervención..."
                    className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* 27 & 28. Plan Alta y Observaciones */}
            <div className="border-l-4 border-teal-500 pl-3">
              <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wide">27. Plan de Alta, Promoción y Observaciones</h2>
              <p className="text-xs text-slate-500">Educación para la salud, pautas de prevención y notas de evolución finales.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100 print:bg-white print:border-none print:p-0">
              {/* Plan Alta */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Plan de Alta y Promoción de la Salud</label>
                <textarea
                  rows={2}
                  value={dischargePlan}
                  onChange={(e) => setDischargePlan(e.target.value)}
                  placeholder="Ej. Cuidado de herida en casa, dieta baja en sodio..."
                  className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-900"
                />
              </div>

              {/* Observaciones */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Observaciones / Notas Clínicas del Turno</label>
                <textarea
                  rows={2}
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="Notas, incidentes o aclaraciones relevantes sobre el cuidado..."
                  className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-900"
                />
              </div>
            </div>

            {/* 29. Firmas de Enfermería */}
            <div className="bg-slate-150 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-center gap-4 print:bg-white print:border-t print:pt-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">Personal de Enfermería Responsable</span>
                <p className="text-sm font-black text-slate-800 mt-1">{existingSheet?.responsibleNurseName || nurse.fullName}</p>
                <p className="text-xs text-slate-600 font-mono">Cédula Profesional: {existingSheet?.responsibleNurseLicense || nurse.licenseId}</p>
              </div>

              <div className="w-48 border-t border-slate-400 text-center pt-2 text-[10px] uppercase font-bold text-slate-500">
                Firma Autógrafa de Validación
              </div>
            </div>
          </div>
        )}

        {/* Form Bottom Save bar - Hidden in print */}
        <div className="border-t border-slate-150 pt-6 flex items-center justify-end gap-3 print:hidden">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
          >
            Regresar
          </button>
          <button
            type="submit"
            className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold px-6 py-2.5 rounded-xl text-sm transition-all shadow-md"
          >
            Guardar Hoja de Enfermería
          </button>
        </div>
      </form>
    </div>
  );
}
