/**
 * Aqua Nexus — Authentication Suite (Login, Registration, Password Reset)
 * Supports 4 User Roles (Admin, Operator, Researcher, Viewer) with 1-click demo presets
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types/telemetry';
import { 
  Waves, 
  Lock, 
  Mail, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { switchRole, setCurrentUser, users } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('admin@aquanexus.org');
  const [password, setPassword] = useState('AquaNexus2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const match = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (match) {
      setCurrentUser(match);
      setSuccessMsg(`Welcome back, ${match.name}! Authenticated as ${match.role.toUpperCase()}.`);
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1000);
    } else {
      setErrorMsg('Unrecognized email or invalid password credentials. Select a demo preset below.');
    }
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    switchRole(role);
    setSuccessMsg(`Logged in with role: ${role.toUpperCase()}`);
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 800);
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(`Password reset link transmitted to ${email}. Check your inbox.`);
    setTimeout(() => {
      setSuccessMsg('');
      setMode('login');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#111F30] border border-[#38BDF8]/40 rounded-2xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#F8FAFC] text-sm p-1"
        >
          &times;
        </button>

        {/* Branding Lockup */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#14B8A6] to-[#007065] flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(20,184,166,0.4)]">
            <Waves className="w-7 h-7 text-[#08111F] stroke-[2.5]" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#F8FAFC]">
            Aqua Nexus Portal
          </h2>
          <p className="text-xs text-[#94A3B8] mt-1">
            Smart Lake Intelligence & Autonomous Floating Robot Platform
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-2.5 rounded-lg bg-[#EF4444]/15 border border-[#EF4444]/40 text-[#EF4444] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-2.5 rounded-lg bg-[#22C55E]/15 border border-[#22C55E]/40 text-[#22C55E] text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Login Form */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[10px] font-mono uppercase text-[#94A3B8] block mb-1">
                Institutional Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="name@aquanexus.org"
                  className="w-full bg-[#08111F] border border-[#38BDF8]/30 rounded-lg pl-9 pr-3 py-2 text-xs text-[#F8FAFC] outline-none focus:border-[#14B8A6]"
                />
                <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-mono uppercase text-[#94A3B8]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-[11px] text-[#38BDF8] hover:underline"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#08111F] border border-[#38BDF8]/30 rounded-lg pl-9 pr-9 py-2 text-xs text-[#F8FAFC] outline-none focus:border-[#14B8A6]"
                />
                <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-[#94A3B8] hover:text-[#F8FAFC]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-[#DAE3F7] cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="rounded border-[#38BDF8]/30 bg-[#08111F] text-[#14B8A6] focus:ring-0"
                />
                <span>Remember session</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-[#14B8A6] text-[#08111F] font-bold text-xs hover:bg-[#0D9488] transition-all shadow-[0_0_16px_rgba(20,184,166,0.3)]"
            >
              Sign In to Telemetry Control
            </button>
          </form>
        )}

        {/* Forgot Password Flow */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgot} className="space-y-4">
            <p className="text-xs text-[#94A3B8]">
              Enter your registered institutional email to receive cryptographic password reset instructions.
            </p>
            <div>
              <label className="text-[10px] font-mono uppercase text-[#94A3B8] block mb-1">
                Institutional Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#08111F] border border-[#38BDF8]/30 rounded-lg pl-9 pr-3 py-2 text-xs text-[#F8FAFC] outline-none focus:border-[#14B8A6]"
                />
                <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-[#94A3B8] hover:text-[#F8FAFC]"
              >
                Back to Sign In
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#14B8A6] text-[#08111F] font-bold text-xs hover:bg-[#0D9488]"
              >
                Transmit Reset Link
              </button>
            </div>
          </form>
        )}

        {/* 1-Click Demo Role Accounts for instant QA & testing */}
        <div className="mt-6 pt-5 border-t border-[#38BDF8]/15">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#38BDF8] text-center mb-2">
            1-Click Demo Role Credentials (RBAC)
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <button
              onClick={() => handleQuickDemoLogin('admin')}
              className="p-2 rounded bg-[#08111F] border border-[#14B8A6]/40 text-[#4FDBC8] hover:bg-[#14B8A6]/10 text-left transition-colors"
            >
              <div className="font-bold flex items-center justify-between">
                <span>Admin</span>
                <ShieldCheck className="w-3 h-3" />
              </div>
              <div className="text-[9px] text-[#94A3B8]">Dr. Sarah Lin</div>
            </button>

            <button
              onClick={() => handleQuickDemoLogin('operator')}
              className="p-2 rounded bg-[#08111F] border border-[#38BDF8]/40 text-[#38BDF8] hover:bg-[#38BDF8]/10 text-left transition-colors"
            >
              <div className="font-bold flex items-center justify-between">
                <span>Operator</span>
                <ShieldCheck className="w-3 h-3" />
              </div>
              <div className="text-[9px] text-[#94A3B8]">Marcus Vance</div>
            </button>

            <button
              onClick={() => handleQuickDemoLogin('researcher')}
              className="p-2 rounded bg-[#08111F] border border-[#818CF8]/40 text-[#818CF8] hover:bg-[#818CF8]/10 text-left transition-colors"
            >
              <div className="font-bold flex items-center justify-between">
                <span>Researcher</span>
                <ShieldCheck className="w-3 h-3" />
              </div>
              <div className="text-[9px] text-[#94A3B8]">Dr. Elena Rostova</div>
            </button>

            <button
              onClick={() => handleQuickDemoLogin('viewer')}
              className="p-2 rounded bg-[#08111F] border border-[#94A3B8]/40 text-[#DAE3F7] hover:bg-[#94A3B8]/10 text-left transition-colors"
            >
              <div className="font-bold flex items-center justify-between">
                <span>Viewer</span>
                <ShieldCheck className="w-3 h-3" />
              </div>
              <div className="text-[9px] text-[#94A3B8]">Agency Guest</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
