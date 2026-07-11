/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Nurse } from '../types';
import { ShieldCheck, Lock, User, AlertTriangle, Activity } from 'lucide-react';
import MyNurseLogo from './MyNurseLogo';

interface LoginProps {
  nurses: Nurse[];
  onLoginSuccess: (nurse: Nurse) => void;
}

export default function Login({ nurses, onLoginSuccess }: LoginProps) {
  const [emailOrEmp, setEmailOrEmp] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!emailOrEmp || !password) {
      setError('Por favor ingrese todos los campos.');
      return;
    }

    // Find nurse by email or employee number
    const nurse = nurses.find(
      (n) =>
        (n.email.toLowerCase() === emailOrEmp.toLowerCase() ||
          n.employeeNumber.toLowerCase() === emailOrEmp.toLowerCase())
    );

    if (!nurse) {
      setError('Usuario o contraseña incorrectos.');
      return;
    }

    // Check if blocked
    if (nurse.blocked) {
      setError('Acceso denegado: Este usuario ha sido BLOQUEADO por administración.');
      return;
    }

    // Check password (simple simulation)
    if (nurse.password !== password) {
      setError('Contraseña incorrecta.');
      return;
    }

    // Success!
    onLoginSuccess(nurse);
  };

  return (
    <div className="min-h-screen bg-[#F7F8F3] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl shadow-xl border border-[#E0E2D9]">
        
        {/* Hospital Branding */}
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center">
            <MyNurseLogo size={80} />
          </div>
          <h2 className="mt-2 text-3xl font-extrabold text-[#344E41] tracking-tight font-serif-title">
            MyNurse App
          </h2>
          <p className="mt-1 text-sm text-[#7F8C8D]">
            Sistema de Control de Enfermería
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg text-sm text-red-700 flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email / Employee Number */}
            <div>
              <label htmlFor="emailOrEmp" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Correo Electrónico o Núm. de Empleado
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  id="emailOrEmp"
                  name="emailOrEmp"
                  type="text"
                  required
                  value={emailOrEmp}
                  onChange={(e) => setEmailOrEmp(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                  placeholder="ejemplo@hospital.gob.mx o EMP-XXXX"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-[#E0E2D9] rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5A7D6C]/20 focus:border-[#5A7D6C] text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-[#5A7D6C] hover:bg-[#344E41] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5A7D6C] transition-all duration-150 shadow-md"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <ShieldCheck className="h-5 h-5 text-[#E9EDC9] group-hover:text-white" aria-hidden="true" />
              </span>
              Ingresar al Sistema
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
