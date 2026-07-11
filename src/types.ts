/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Nurse {
  id: string;
  fullName: string;
  employeeNumber: string;
  licenseId: string; // Cédula profesional
  specialty: string;
  email: string;
  blocked: boolean;
  password?: string;
  role?: 'admin' | 'nurse'; // Perfil de usuario (admin o enfermero)
  createdAt: string;
}

export interface Patient {
  id: string;
  fullName: string;
  curp: string;
  birthDate?: string; // Fecha de nacimiento (AAAA-MM-DD)
  age: number;
  email: string;
  weight: number; // en kg
  height: number; // en cm / m
  bloodType: string; // Seleccionable (A+, A-, B+, B-, AB+, AB-, O+, O-)
  address: string;
  hasMedicalService: boolean;
  rfidFolio?: string; // Código RFID vinculado
  createdAt: string;
}

// Full structure of the clinical nursing sheet based on the attached PDF
export interface NursingSheet {
  id: string;
  patientId: string;
  nurseId: string;
  date: string;
  
  // 1/ Identificación
  medicalUnit: string;
  service: string;
  bedNumber: string;
  expedientNumber: string;
  admissionDate: string;
  hospitalStayDays: number;
  medicalDiagnosis: string;
  allergies: string; // DESCONOCIDAS, NEGADAS, o lista

  // 17/ Habitus Exterior
  consciousnessState: 'Consciente' | 'Somnoliento' | 'Confuso' | 'Obnubilado' | 'Estuporoso' | 'Soporoso' | 'Comatoso' | 'Muerte cerebral' | '';
  gait: 'Normal' | 'Unilateral' | 'Bilateral' | ''; // Marcha
  movements: 'Normales' | 'Anormales' | '';
  facies: 'No característica' | 'Dolorosa' | 'Febril' | 'Cushiniana' | 'Hipertiroidea' | 'Tetánica' | 'Parkinsoniana' | 'Adenoidea' | '';
  attitude: 'Libremente escogida' | 'Instintiva' | 'Forzada' | 'Pasiva' | '';
  bodyConstitution: 'Ectomorfa' | 'Mesomorfa' | 'Endomorfa' | '';

  // 18/ Signos Vitales (Simplified logs for rendering over shifts/hours)
  vitalSignsHistory: Array<{
    hour: string; // "08:00", "12:00", etc.
    respiratoryRate: number; // Tinta verde
    temperature: number; // Tinta roja
    heartRate: number; // Tinta azul
    bloodPressure: string; // "120/80"
    meanBloodPressure: number; // Presión Arterial Media
    oxygenSaturation: number;
  }>;

  // 19/ Valoración
  painScale: number; // 0-10 (Dolor)
  fallRisk: 'Bajo' | 'Medio' | 'Alto' | ''; // Riesgo de Caídas
  pressureUlcerRisk: 'Bajo' | 'Medio' | 'Alto' | ''; // Riesgo de Úlceras por Presión
  glasgowComaScale: number; // 3-15
  phlebitisScale: number; // 0-5 (Flebitis)
  skinColoration: 'I' | 'P' | 'R' | 'C' | 'RB' | 'M' | 'T' | ''; // Ictérico, Pálido, Rosado, Cianótico, Rubicundo, Marmóreo, Terroso
  pupillaryEvaluation: 'Iso' | 'Mid' | 'Mio' | 'Ani' | ''; // Isocórica, Midriática, Miótica, Anisocórica
  evacuationsBristol: number | ''; // Escala de Bristol (1-7)
  
  // Perímetros
  cephalicPerimeter: number | ''; // cm
  thoracicPerimeter: number | ''; // cm
  abdominalPerimeter: number | ''; // cm
  capillaryRefill: number | ''; // segundos
  capillaryGlycemia: number | ''; // mg/dl

  // 20/ Dieta
  dietType: string;
  intakeDetails: string;

  // 21/ Control de Líquidos (ml)
  liquids: {
    // Ingresos
    oralRoute: number;
    parenteralSolutions: number;
    intravenousMeds: number;
    bloodDerivatives: number;
    // Egresos
    diuresis: number;
    evacuations: number;
    bleeding: number; // Sangrado
    emesis: number;
    drains: number; // Drenajes
  };

  // 22/ Soluciones Parenterales Activas
  parenteralSolutionsActive: Array<{
    solution: string;
    mlHour: number;
    startTime: string;
    endTime: string;
    pendingToInfuse: string;
    doubleCheck: string; // Iniciales de los 2 enfermeros
  }>;

  // 23/ Medicamentos
  medications: Array<{
    name: string; // Mayúsculas si es ALTO RIESGO, minúsculas si es LASA
    schedule: string;
    dose: string;
    route: string; // Vía de aplicación
    doubleCheck: string;
    isHighRisk: boolean;
    isLasa: boolean;
  }>;

  // 24/ Valoración de la Piel (tipo de lesión en figura)
  skinLesions: Array<{
    location: string; // "Cuerpo", "Espalda", etc.
    type: 'Rash' | 'Hematoma' | 'Equimosis' | 'Dermoabrasión' | 'Quemadura' | 'Úlcera por Presión' | 'Herida Quirúrgica' | 'Herida Penetrante' | '';
    observations: string;
  }>;

  // 25/ Dispositivos Invasivos
  invasiveDevices: Array<{
    device: string;
    installationDate: string;
    removalDate: string;
    observations: string;
  }>;

  // 26/ Plan de Cuidados de Enfermería
  nursingCarePlan: {
    nursingDiagnosis: string; // Taxonomía NANDA
    indicator: string;
    initialScore: number; // Puntuación Inicial NOC
    interventions: string; // NIC
    finalScore: number; // Puntuación Final NOC
    resultEvaluation: string;
  };

  // 27/ Alta & Observaciones
  dischargePlan: string;
  observations: string;
  responsibleNurseName: string;
  responsibleNurseLicense: string;
}
