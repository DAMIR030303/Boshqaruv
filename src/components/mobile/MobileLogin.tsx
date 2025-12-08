import React, { useState } from 'react';

import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import { toast } from 'sonner';

import { getTranslation } from '../../i18n';

interface MobileLoginProps {
  onLogin: (username: string, password: string) => Promise<void>;
  isLoading: boolean;
}

export function MobileLogin({ onLogin, isLoading }: MobileLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // i18n tarjimalar
  const t = (key: string) => getTranslation(key, 'uz');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast.error(t('auth.login.errors.emptyFields'));
      return;
    }

    try {
      setIsSubmitting(true);
      await onLogin(username.trim(), password);
      toast.success(t('auth.login.success'));
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : t('auth.login.errors.loginFailed');
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-slate-900">
      {/* Animated Background Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-3000" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-5000" />

      <motion.div
        className="w-full max-w-sm relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Logo and Title */}
        <div className="text-center mb-10">
          <motion.div
            className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/30 rotate-3"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 3 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </motion.div>

          <motion.h1
            className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 mb-2 tracking-tight"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {t('common.appName') || 'Boshqaruv'}
          </motion.h1>

          <motion.p
            className="text-blue-100/60 text-lg font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {t('auth.login.subtitle')}
          </motion.p>
        </div>

        {/* Login Form Card */}
        <motion.div
          className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field */}
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="text-sm font-medium text-blue-100/80 ml-1"
              >
                {t('auth.login.username')}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-blue-300/50 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-blue-100/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                  placeholder={t('auth.login.username')}
                  disabled={isSubmitting || isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-blue-100/80 ml-1"
              >
                {t('auth.login.password')}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-blue-300/50 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3.5 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-blue-100/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                  placeholder={t('auth.login.password')}
                  disabled={isSubmitting || isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-blue-100/40 hover:text-blue-100/80 transition-colors rounded-lg hover:bg-white/5"
                  disabled={isSubmitting || isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 active:scale-[0.98] transition-all duration-200 relative overflow-hidden group mt-2"
              disabled={isSubmitting || isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <div className="relative flex items-center justify-center">
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    <span>{t('common.loading')}</span>
                  </>
                ) : (
                  <span>{t('auth.login.submit')}</span>
                )}
              </div>
            </motion.button>
          </form>
        </motion.div>

        {/* Demo Credentials */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div className="inline-flex flex-col items-center bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/5 mx-auto max-w-xs w-full">
            <p className="text-blue-100/60 text-xs font-semibold uppercase tracking-wider mb-3">
              Demo hisoblar
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-blue-100/50 w-full">
              <div className="text-right">Admin:</div>
              <div className="text-left font-mono text-blue-100/80">
                admin / admin123
              </div>
              <div className="text-right">Manager:</div>
              <div className="text-left font-mono text-blue-100/80">
                manager / manager123
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
