import { motion, useReducedMotion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

import { ANIMATION } from '../../../constants/app';
import type { UserProfile } from '../../../types';
import { QuickAction } from '../../ui/QuickAction';
import { SectionTitle } from '../../ui/SectionTitle';
import { SkeletonCard } from '../../ui/SkeletonCard';
import { StatCard } from '../../ui/StatCard';

/**
 * Dashboard card ma'lumotlari
 */
export interface DashboardCard {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  onClick?: () => void;
  bgClass?: string;
  progressCurrent?: number;
  progressTotal?: number;
  progressColorClass?: string;
  trackColorClass?: string;
}

/**
 * Quick action ma'lumotlari
 */
export interface QuickActionItem {
  label: string;
  icon: LucideIcon;
  action: () => void;
}

/**
 * Dashboard Layout komponenti props
 */
export interface DashboardLayoutProps {
  /** Foydalanuvchi profil ma'lumotlari */
  userProfile: UserProfile;
  /** Welcome xabari (ixtiyoriy) */
  welcomeMessage?: string;
  /** KPI kartalar ro'yxati */
  kpiCards: DashboardCard[];
  /** Tezkor amallar ro'yxati */
  quickActions: QuickActionItem[];
  /** Qo'shimcha kontent (children) */
  children?: React.ReactNode;
  /** Loading holati */
  isLoading?: boolean;
}

/**
 * Responsive Dashboard Layout
 *
 * Mobile: 1 ustun
 * Tablet: 2 ustun
 * Desktop: 3-4 ustun
 */
export function DashboardLayout({
  userProfile,
  welcomeMessage,
  kpiCards,
  quickActions,
  children,
  isLoading = false,
}: DashboardLayoutProps) {
  const prefersReducedMotion = useReducedMotion();

  if (isLoading) {
    return (
      <div className="app-content">
        <div className="app-container">
          {/* Welcome Header Skeleton */}
          <div className="page-header mb-8">
            <div className="w-64 h-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-2" />
            <div className="w-96 h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          </div>

          {/* KPI Cards Skeleton */}
          <div className="grid gap-4 sm:gap-5 lg:gap-6 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {Array.from({ length: 3 }).map((_, index) => (
                <SkeletonCard key={index} lines={3} />
              ))}
            </div>
          </div>

          {/* Quick Actions Skeleton */}
          <div className="mb-8">
            <div className="w-32 h-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <SkeletonCard key={index} lines={2} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-content">
      <div className="app-container">
        {/* Welcome Header */}
        {prefersReducedMotion ? (
          <div className="page-header">
            <h1 className="page-title">
              Xush kelibsiz, {userProfile?.name || 'Foydalanuvchi'}!
            </h1>
            {welcomeMessage && (
              <p className="page-subtitle">{welcomeMessage}</p>
            )}
          </div>
        ) : (
          <motion.div
            className="page-header"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: ANIMATION.DURATION_LONG }}
          >
            <h1 className="page-title">
              Xush kelibsiz, {userProfile?.name || 'Foydalanuvchi'}!
            </h1>
            {welcomeMessage && (
              <p className="page-subtitle">{welcomeMessage}</p>
            )}
          </motion.div>
        )}

        {/* KPI Cards - Responsive Grid */}
        <div className="grid gap-4 sm:gap-5 lg:gap-6 mb-8">
          {/* Mobile: 1 col, Tablet: 2 col, Desktop: 3+ col */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {kpiCards.map((card, index) => {
              const cardContent = (
                <StatCard
                  title={card.title}
                  value={card.value}
                  subtitle={card.subtitle}
                  icon={card.icon}
                  colorClass={card.color}
                  bgClass={card.bgClass}
                  progressCurrent={card.progressCurrent}
                  progressTotal={card.progressTotal}
                  progressColorClass={card.progressColorClass}
                  trackColorClass={card.trackColorClass}
                  onClick={card.onClick}
                />
              );

              if (prefersReducedMotion) {
                return <div key={card.title}>{cardContent}</div>;
              }

              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: ANIMATION.DURATION_LONG,
                    delay: index * ANIMATION.DELAY_SMALL,
                  }}
                >
                  {cardContent}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        {prefersReducedMotion ? (
          <div className="mb-8">
            <SectionTitle>Tezkor amallar</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {quickActions.map(action => (
                <div key={action.label}>
                  <QuickAction
                    title={action.label}
                    icon={action.icon}
                    onClick={action.action}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: ANIMATION.DURATION_LONG,
              delay: ANIMATION.DELAY_LARGE,
            }}
          >
            <SectionTitle>Tezkor amallar</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: ANIMATION.DURATION_MEDIUM,
                    delay:
                      ANIMATION.DELAY_XLARGE + index * ANIMATION.DELAY_MINIMAL,
                  }}
                >
                  <QuickAction
                    title={action.label}
                    icon={action.icon}
                    onClick={action.action}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Qo'shimcha kontent */}
        {children}
      </div>
    </div>
  );
}
