/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Nurse, Patient, NursingSheet } from '../types';

export const initialNurses: Nurse[] = [
  {
    id: 'n1',
    fullName: 'Desarrollador IT',
    employeeNumber: 'EMP-1001',
    licenseId: 'CED-9912048',
    specialty: 'TI',
    email: 'a_nurse@app.com.mx',
    blocked: false,
    password: '12345678',
    role: 'admin',
    createdAt: '2026-07-10T22:19:30Z'
  },
  {
    id: 'n2',
    fullName: 'Lic. Victor Hugo Campos Rubio',
    employeeNumber: 'EMP-1778',
    licenseId: 'CED-9912046',
    specialty: 'Cuidados Intensivos',
    email: 'victor@app.com.mx',
    blocked: false,
    password: '12345678',
    role: 'enfermero',
    createdAt: '2026-07-10T22:19:30Z'
  }
];

export const initialPatients: Patient[] = [
  {
    id: 'p1',
    fullName: 'Alejandra Torres Mendoza',
    curp: 'TOMA930812HDFMND09',
    birthDate: '1993-08-12',
    age: 32,
    email: 'alejandra.torres@gmail.com',
    weight: 64,
    height: 165,
    bloodType: 'O+',
    address: 'Av. Chapultepec #45, Col. Roma Norte, CDMX, CP 06700',
    hasMedicalService: true,
    rfidFolio: 'RFID-8812',
    createdAt: '2026-05-12T10:00:00Z'
  },
  {
    id: 'p2',
    fullName: 'Roberto Esquivel Martínez',
    curp: 'EQMR750410HDFMSN01',
    birthDate: '1975-04-10',
    age: 51,
    email: 'roberto.esquivel@outlook.com',
    weight: 82,
    height: 178,
    bloodType: 'A+',
    address: 'Calle Hidalgo #104, Col. Centro, Toluca, EdoMex',
    hasMedicalService: false,
    rfidFolio: 'RFID-3401',
    createdAt: '2026-06-18T14:20:00Z'
  },
  {
    id: 'p3',
    fullName: 'Sofía Martínez Vega',
    curp: 'MAVS010214MDFVNS02',
    birthDate: '2001-02-14',
    age: 25,
    email: 'sofia.martinez@live.com.mx',
    weight: 55,
    height: 160,
    bloodType: 'B-',
    address: 'Paseo de las Palomas #322, Metepec, EdoMex',
    hasMedicalService: true,
    createdAt: '2026-07-01T11:05:00Z' // Sin RFID asociado aún para asignación manual
  }
];

export const initialNursingSheets: NursingSheet[] = [
  {
    id: 'sheet-101',
    patientId: 'p1',
    nurseId: 'n1',
    date: '2026-07-09',
    medicalUnit: 'Hospital General de Toluca "Dr. Nicolás San Juan"',
    service: 'Medicina Interna - Cama 204',
    bedNumber: '204-B',
    expedientNumber: 'EXP-99238',
    admissionDate: '2026-07-07',
    hospitalStayDays: 2,
    medicalDiagnosis: 'Neumonía adquirida en la comunidad, Diabetes Mellitus Tipo 2 compensada.',
    allergies: 'Penicilina (Reacción urticariana grave)',
    consciousnessState: 'Consciente',
    gait: 'Normal',
    movements: 'Normales',
    facies: 'No característica',
    attitude: 'Libremente escogida',
    bodyConstitution: 'Mesomorfa',
    vitalSignsHistory: [
      {
        hour: '08:00',
        respiratoryRate: 18,
        temperature: 36.8,
        heartRate: 78,
        bloodPressure: '120/80',
        meanBloodPressure: 93.3,
        oxygenSaturation: 96
      },
      {
        hour: '14:00',
        respiratoryRate: 20,
        temperature: 37.2,
        heartRate: 82,
        bloodPressure: '125/82',
        meanBloodPressure: 96.3,
        oxygenSaturation: 95
      },
      {
        hour: '20:00',
        respiratoryRate: 19,
        temperature: 36.9,
        heartRate: 76,
        bloodPressure: '118/76',
        meanBloodPressure: 90.0,
        oxygenSaturation: 97
      }
    ],
    painScale: 2,
    fallRisk: 'Bajo',
    pressureUlcerRisk: 'Bajo',
    glasgowComaScale: 15,
    phlebitisScale: 0,
    skinColoration: 'R', // Rosado
    pupillaryEvaluation: 'Iso', // Isocórica
    evacuationsBristol: 4,
    cephalicPerimeter: 56,
    thoracicPerimeter: 92,
    abdominalPerimeter: 84,
    capillaryRefill: 2,
    capillaryGlycemia: 110,
    dietType: 'Dieta blanda con restricción de azúcares simples',
    intakeDetails: 'Toleró adecuadamente el 80% de la ingesta asignada en desayuno y comida.',
    liquids: {
      oralRoute: 800,
      parenteralSolutions: 1000,
      intravenousMeds: 150,
      bloodDerivatives: 0,
      diuresis: 1200,
      evacuations: 150,
      bleeding: 0,
      emesis: 0,
      drains: 0
    },
    parenteralSolutionsActive: [
      {
        solution: 'Solución Fisiológica 0.9% 1000ml + KCL 20mEq',
        mlHour: 83,
        startTime: '08:00',
        endTime: '20:00',
        pendingToInfuse: '0 ml',
        doubleCheck: 'CG / MC'
      }
    ],
    medications: [
      {
        name: 'CEFTRIAXONA (1G)',
        schedule: '12:00',
        dose: '1g',
        route: 'Intravenosa',
        doubleCheck: 'CG / MC',
        isHighRisk: false,
        isLasa: false
      },
      {
        name: 'INSULINA RAPIDA (ALTO RIESGO)',
        schedule: '08:00',
        dose: '4 UI',
        route: 'Subcutánea',
        doubleCheck: 'CG / HS',
        isHighRisk: true,
        isLasa: false
      }
    ],
    skinLesions: [
      {
        location: 'Glúteo derecho',
        type: 'Rash',
        observations: 'Ligera dermatitis por contacto, se aplica crema protectora.'
      }
    ],
    invasiveDevices: [
      {
        device: 'Catéter Venoso Periférico calibre 20G en miembro superior izquierdo',
        installationDate: '2026-07-07',
        removalDate: '',
        observations: 'Permeable, sin signos de flebitis, sitio limpio.'
      }
    ],
    nursingCarePlan: {
      nursingDiagnosis: 'Patrón respiratorio ineficaz relacionado con proceso infeccioso pulmonar manifestado por taquipnea ligera.',
      indicator: 'Estado respiratorio: ventilación espontánea',
      initialScore: 3,
      interventions: 'Monitorización respiratoria, oxigenoterapia si satura < 94%, control de temperatura corporal y administración de antipiréticos indicados.',
      finalScore: 4,
      resultEvaluation: 'Paciente estable, mantiene saturación de oxígeno por encima del 95% con aire ambiente, frecuencia respiratoria dentro de rangos normales durante el turno.'
    },
    dischargePlan: 'Educar en signos de alarma respiratoria, control térmico en casa y apego estricto al tratamiento antibiótico vía oral.',
    observations: 'Sin eventualidades mayores en el turno. Paciente cooperadora con los procedimientos de enfermería.',
    responsibleNurseName: 'Dev Jorge Erick Aguilar Susano',
    responsibleNurseLicense: 'CED-9912048'
  }
];
