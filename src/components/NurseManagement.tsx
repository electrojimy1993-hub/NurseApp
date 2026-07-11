/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Nurse } from '../types';
import { UserPlus, Edit2, ShieldAlert, ShieldCheck, Search, Mail, Key, Briefcase, Award, X, Check } from 'lucide-react';

interface NurseManagementProps {
  nurses: Nurse[];
  onAddNurse: (nurse: Nurse) => void;
  onUpdateNurse: (nurse: Nurse) => void;
  currentUser: Nurse;
}

export default function NurseManagement({ nurses, onAddNurse, onUpdateNurse, currentUser }: NurseManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingNurse, setEditingNurse] = useState<Nurse | null>(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [licenseId, setLicenseId] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [email, setEmail] = useState('');
  const [blocked, setBlocked] = useState(false);
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState<'admin' | 'nurse'>('nurse');

  const openAddForm = () => {
    if (currentUser.role !== 'admin') {
      alert('Tu perfil actual no cuenta con permisos de administrador para dar de alta usuarios.');
      return;
    }
    setEditingNurse(null);
    setFullName('');
    setEmployeeNumber(`EMP-${Math.floor(1000 + Math.random() * 9000)}`);
    setLicenseId('');
    setSpecialty('');
    setEmail('');
    setBlocked(false);
    setPassword('password123');
    setRole('nurse');
    setShowForm(true);
  };

  const openEditForm = (nurse: Nurse) => {
    if (currentUser.role !== 'admin') {
      alert('Tu perfil actual no cuenta con permisos de administrador para modificar usuarios.');
      return;
    }
    setEditingNurse(nurse);
    setFullName(nurse.fullName);
    setEmployeeNumber(nurse.employeeNumber);
    setLicenseId(nurse.licenseId);
    setSpecialty(nurse.specialty);
    setEmail(nurse.email);
    setBlocked(nurse.blocked);
    setPassword(nurse.password || 'password123');
    setRole(nurse.role || 'nurse');
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentUser.role !== 'admin') {
      alert('No tienes permisos de administrador para registrar o modificar usuarios.');
      return;
    }

    if (!fullName || !employeeNumber || !licenseId || !specialty || !email) {
      alert('Por favor complete todos los campos obligatorios.');
      return;
    }

    if (editingNurse) {
      // Prevent current user from blocking themselves
      let isBlocked = blocked;
      if (editingNurse.id === currentUser.id && blocked) {
        alert('No puedes bloquear tu propia cuenta activa actual.');
        isBlocked = false;
      }

      onUpdateNurse({
        ...editingNurse,
        fullName,
        employeeNumber,
        licenseId,
        specialty,
        email,
        blocked: isBlocked,
        password,
        role
      });
    } else {
      // Check for duplicate employee number or email
      if (nurses.some(n => n.employeeNumber.toLowerCase() === employeeNumber.toLowerCase())) {
        alert('Este número de empleado ya está registrado.');
        return;
      }
      if (nurses.some(n => n.email.toLowerCase() === email.toLowerCase())) {
        alert('Este correo electrónico ya está registrado.');
        return;
      }

      onAddNurse({
        id: `nurse-${Date.now()}`,
        fullName,
        employeeNumber,
        licenseId,
        specialty,
        email,
        blocked,
        password,
        role,
        createdAt: new Date().toISOString()
      });
    }

    setShowForm(false);
  };

  const toggleBlockStatus = (nurse: Nurse) => {
    if (currentUser.role !== 'admin') {
      alert('No tienes permisos de administrador para cambiar el estatus de acceso de un usuario.');
      return;
    }
    if (nurse.id === currentUser.id) {
      alert('No puedes bloquear tu propia cuenta.');
      return;
    }
    onUpdateNurse({
      ...nurse,
      blocked: !nurse.blocked
    });
  };

  const filteredNurses = nurses.filter(n =>
    n.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.employeeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Gestión de Personal de Enfermería</h2>
          <p className="text-sm text-slate-500">Administración de credenciales, especialidades y control de acceso.</p>
        </div>
        <button
          onClick={openAddForm}
          disabled={currentUser.role !== 'admin'}
          className={`flex items-center justify-center gap-2 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all shadow-sm shrink-0 ${
            currentUser.role === 'admin'
              ? 'bg-teal-600 hover:bg-teal-700 text-white cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          Nuevo Enfermero(a) {currentUser.role !== 'admin' && '🔒'}
        </button>
      </div>

      {/* Admin Required Alert */}
      {currentUser.role !== 'admin' && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-amber-800">Acceso de Solo Lectura</h4>
            <p className="text-xs text-amber-700 mt-1 leading-relaxed">
              Para dar de alta o modificar usuarios (personal de enfermería) es obligatorio contar con un perfil de <strong>Administrador</strong>.
              Tu perfil actual es de <strong>Enfermero(a)</strong>, por lo que estas acciones se encuentran deshabilitadas.
            </p>
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Buscar por nombre, especialidad, correo o número de empleado..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
        />
      </div>

      {/* Nurses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNurses.map((nurse) => (
          <div
            key={nurse.id}
            className={`bg-white rounded-2xl border transition-all shadow-sm overflow-hidden flex flex-col justify-between ${
              nurse.blocked
                ? 'border-red-200 bg-red-50/5'
                : 'border-slate-100 hover:shadow-md hover:border-slate-200'
            }`}
          >
            {/* Card Body */}
            <div className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-base">{nurse.fullName}</h3>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 font-mono">
                      {nurse.employeeNumber}
                    </span>
                    {nurse.role === 'admin' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#E9EDC9] text-[#344E41] tracking-wider uppercase">
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-[#1E40AF] tracking-wider uppercase">
                        Enfermero
                      </span>
                    )}
                  </div>
                </div>
                {/* Status Badge */}
                {nurse.blocked ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                    <ShieldAlert className="w-3 h-3" /> Bloqueado
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                    <ShieldCheck className="w-3 h-3" /> Activo
                  </span>
                )}
              </div>

              {/* Specs */}
              <div className="space-y-2 text-xs text-slate-600 border-t border-slate-50 pt-3">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-slate-400" />
                  <span><strong className="text-slate-800">Cédula:</strong> {nurse.licenseId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-slate-400" />
                  <span><strong className="text-slate-800">Especialidad:</strong> {nurse.specialty}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="truncate"><strong className="text-slate-800">Correo:</strong> {nurse.email}</span>
                </div>
              </div>
            </div>

            {/* Card Footer Actions */}
            {currentUser.role === 'admin' ? (
              <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => openEditForm(nurse)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-teal-600 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 transition-all shadow-sm"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Modificar
                </button>

                <button
                  onClick={() => toggleBlockStatus(nurse)}
                  disabled={nurse.id === currentUser.id}
                  className={`flex items-center gap-1.5 text-xs font-semibold rounded-lg px-3 py-1.5 transition-all shadow-sm border ${
                    nurse.blocked
                      ? 'text-emerald-700 hover:text-white bg-emerald-50 hover:bg-emerald-600 border-emerald-200'
                      : 'text-red-700 hover:text-white bg-red-50 hover:bg-red-600 border-red-200 disabled:opacity-40 disabled:hover:bg-red-50'
                  }`}
                >
                  {nurse.blocked ? (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Desbloquear
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Bloquear
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="bg-slate-50/50 px-5 py-2.5 border-t border-slate-100 text-center">
                <span className="text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1 select-none">
                  🔒 Solo lectura (Requiere Admin)
                </span>
              </div>
            )}
          </div>
        ))}

        {filteredNurses.length === 0 && (
          <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-slate-100">
            <span className="text-sm text-slate-400">No se encontraron enfermeros con los criterios de búsqueda.</span>
          </div>
        )}
      </div>

      {/* Form Drawer Modal overlay */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-150">
            {/* Header */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-150 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-950">
                {editingNurse ? 'Modificar Datos del Enfermero' : 'Alta de Nuevo Enfermero'}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-slate-600 rounded-full p-1 hover:bg-slate-150 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nombre Completo */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Lic. María Elena Pérez Solís"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                {/* Número de Empleado */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Número de Empleado *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="EMP-XXXX"
                    value={employeeNumber}
                    onChange={(e) => setEmployeeNumber(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Cédula Profesional */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Cédula Profesional *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="CED-XXXXXXXX"
                    value={licenseId}
                    onChange={(e) => setLicenseId(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Especialidad */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Especialidad / Área *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Cuidados Intensivos, Obstetricia, Urgencias"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
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
                    placeholder="enfermero@hospital.gob.mx"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Password Simulado */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Key className="w-3 h-3" /> Contraseña de Acceso
                  </label>
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Perfil de Usuario / Rol */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Perfil / Rol *
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'admin' | 'nurse')}
                    className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="nurse">Enfermero(a)</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>

                {/* Bloqueo Switch */}
                <div className="flex items-center justify-between border border-slate-200 rounded-xl p-3 bg-slate-50">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Estatus de Acceso
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={blocked}
                      onChange={(e) => setBlocked(e.target.checked)}
                      disabled={editingNurse?.id === currentUser.id}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    <span className="ml-2 text-xs font-semibold text-slate-700 select-none">
                      {blocked ? 'Bloqueado' : 'Activo'}
                    </span>
                  </label>
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
                  Guardar Datos
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
