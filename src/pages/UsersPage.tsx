/**
 * Aqua Nexus — User Administration & RBAC Permissions (Admin Only)
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types/telemetry';
import { 
  Users, 
  ShieldCheck, 
  UserPlus, 
  CheckCircle2, 
  XCircle, 
  Lock,
  Mail,
  Clock
} from 'lucide-react';

export const UsersPage: React.FC = () => {
  const { users, updateUserRole, toggleUserActive, createUser, currentUser } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('researcher');

  if (currentUser.role !== 'admin') {
    return (
      <div className="p-8 rounded-xl bg-[#0D1929] border border-[#EF4444]/30 text-center space-y-3">
        <Lock className="w-10 h-10 text-[#EF4444] mx-auto" />
        <h2 className="text-base font-bold text-[#F8FAFC]">Administrative Access Restricted</h2>
        <p className="text-xs text-[#94A3B8] max-w-md mx-auto">
          User administration is restricted to System Administrators. Switch your active role to <strong>Admin</strong> in the Top Bar to inspect and edit users.
        </p>
      </div>
    );
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;
    createUser(newName, newEmail, newRole);
    setNewName('');
    setNewEmail('');
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#0D1929]/90 border border-[#38BDF8]/15 rounded-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#14B8A6]" />
            <h1 className="text-base font-bold text-[#F8FAFC]">
              User Management & Access Control (RBAC)
            </h1>
          </div>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Role assignments, permissions enforcement, and operator account activations
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#14B8A6] text-[#08111F] hover:bg-[#0D9488] font-bold text-xs transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New User</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-[#38BDF8]/15 bg-[#0D1929]/95 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#08111F] border-b border-[#38BDF8]/15 text-[10px] font-mono uppercase tracking-wider text-[#94A3B8]">
              <tr>
                <th className="py-3 px-4">User Details</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#38BDF8]/10">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-[#111F30]/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-[#F8FAFC]">{u.name}</div>
                    <div className="text-[11px] text-[#94A3B8] font-mono">{u.email}</div>
                  </td>

                  <td className="py-3 px-4">
                    <select
                      value={u.role}
                      onChange={e => updateUserRole(u.id, e.target.value as UserRole)}
                      className="bg-[#08111F] border border-[#38BDF8]/30 px-2 py-1 rounded text-xs font-mono text-[#DAE3F7] capitalize outline-none"
                    >
                      <option value="admin">Admin</option>
                      <option value="operator">Operator</option>
                      <option value="researcher">Researcher</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </td>

                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleUserActive(u.id)}
                      className={`flex items-center gap-1.5 font-mono text-[11px] font-bold ${
                        u.isActive ? 'text-[#22C55E]' : 'text-[#EF4444]'
                      }`}
                    >
                      {u.isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      <span>{u.isActive ? 'ACTIVE' : 'DEACTIVATED'}</span>
                    </button>
                  </td>

                  <td className="py-3 px-4 font-mono text-[11px] text-[#94A3B8]">
                    {u.lastLogin}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => toggleUserActive(u.id)}
                      className="px-2.5 py-1 rounded bg-[#111F30] border border-[#38BDF8]/20 text-[#DAE3F7] hover:border-[#EF4444] hover:text-[#EF4444] text-[11px] font-mono transition-colors"
                    >
                      {u.isActive ? 'Deactivate' : 'Reactivate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreate} className="w-full max-w-md bg-[#111F30] border border-[#14B8A6]/40 rounded-xl p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-sm font-bold text-[#F8FAFC]">Create New User Account</h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-mono text-[#94A3B8] block mb-1">Full Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Alex Mercer"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full bg-[#08111F] border border-[#38BDF8]/30 px-3 py-2 rounded text-[#F8FAFC] outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-[#94A3B8] block mb-1">Email Address:</label>
                <input
                  type="email"
                  placeholder="alex.mercer@aquanexus.org"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  className="w-full bg-[#08111F] border border-[#38BDF8]/30 px-3 py-2 rounded text-[#F8FAFC] outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-[#94A3B8] block mb-1">Access Role:</label>
                <select
                  value={newRole}
                  onChange={e => setNewRole(e.target.value as UserRole)}
                  className="w-full bg-[#08111F] border border-[#38BDF8]/30 px-3 py-2 rounded text-[#F8FAFC] outline-none"
                >
                  <option value="admin">Administrator (Full Access)</option>
                  <option value="operator">Robot Operator (Missions & Controls)</option>
                  <option value="researcher">Limnology Researcher (Analytics & Reports)</option>
                  <option value="viewer">Public Agency Viewer (Read Only)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#38BDF8]/15">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-3 py-1.5 rounded text-xs text-[#94A3B8] hover:text-[#F8FAFC]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded bg-[#14B8A6] text-[#08111F] font-bold text-xs hover:bg-[#0D9488]"
              >
                Provision User
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
