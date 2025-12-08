import type { Dispatch, SetStateAction } from 'react';

import { TIMING } from '../constants/app';
import type { KPIData } from '../types';

/**
 * KPI ma'lumotlarini yangilash uchun handler yaratadi
 *
 * Bu funksiya Supabase Realtime yoki boshqa real-time source'dan
 * kelgan ma'lumotlarni KPI state'ga to'g'ri formatda qo'shadi.
 *
 * @param setKpiData - React state setter funksiyasi
 * @returns Ma'lumotlarni yangilash funksiyasi
 */
export const createKPIUpdateHandler = (
  setKpiData: Dispatch<SetStateAction<KPIData>>
) => {
  return (data: unknown) => {
    setKpiData(prev => {
      if (!data || typeof data !== 'object') {
        // Invalid data is silently ignored
        return prev;
      }

      const updated: KPIData = { ...prev };

      // Type guard for typed updates
      interface TypedUpdate {
        type?: string;
        data?: Partial<KPIData[keyof KPIData]>;
      }

      const typedData = data as TypedUpdate | Partial<KPIData>;

      if ('type' in typedData && typedData.type) {
        // Typed update (e.g., from Supabase Realtime)
        switch (typedData.type) {
          case 'attendance_update':
            if (updated.attendance && typedData.data) {
              updated.attendance = {
                ...updated.attendance,
                ...(typedData.data as Partial<KPIData['attendance']>),
              };
            }
            break;
          case 'task_update':
            if (updated.tasks && typedData.data) {
              updated.tasks = {
                ...updated.tasks,
                ...(typedData.data as Partial<KPIData['tasks']>),
              };
            }
            break;
          default:
            // Handle other update types
            break;
        }
      } else {
        // Regular partial update
        const partialData = typedData as Partial<KPIData>;
        (Object.keys(partialData) as Array<keyof KPIData>).forEach(key => {
          if (key in updated && partialData[key]) {
            const section = updated[key];
            const update = partialData[key];
            if (
              section &&
              update &&
              typeof section === 'object' &&
              typeof update === 'object' &&
              !Array.isArray(section) &&
              !Array.isArray(update)
            ) {
              // Type-safe merge for KPI sections
              if (key === 'attendance') {
                updated.attendance = {
                  ...(section as KPIData['attendance']),
                  ...(update as Partial<KPIData['attendance']>),
                };
              } else if (key === 'tasks') {
                updated.tasks = {
                  ...(section as KPIData['tasks']),
                  ...(update as Partial<KPIData['tasks']>),
                };
              } else if (key === 'penalties') {
                updated.penalties = {
                  ...(section as KPIData['penalties']),
                  ...(update as Partial<KPIData['penalties']>),
                };
              }
            }
          }
        });
      }

      return updated;
    });
  };
};

/**
 * KPI ma'lumotlarini simulyatsiya qiladi (development uchun)
 *
 * Bu funksiya development muhitida real-time ma'lumotlar
 * o'rniga simulyatsiya qilingan yangilanishlarni yaratadi.
 *
 * @param setKpiData - React state setter funksiyasi
 * @returns Cleanup funksiyasi (interval'ni to'xtatish uchun)
 */
export const simulateKPIUpdates = (
  setKpiData: Dispatch<SetStateAction<KPIData>>
) => {
  const interval = setInterval(() => {
    if (Math.random() < 0.1) {
      setKpiData(prev => {
        if (!prev?.attendance) {
          // Missing attendance data is ignored
          return prev;
        }

        return {
          ...prev,
          attendance: {
            ...prev.attendance,
            present:
              (prev.attendance.present || 0) + (Math.random() > 0.5 ? 1 : 0),
          },
        };
      });
    }
  }, TIMING.KPI_UPDATE_INTERVAL);

  return () => clearInterval(interval);
};

/**
 * KPI ma'lumotlarini simulyatsiya qiladi (development uchun)
 *
 * Bu funksiya development muhitida real-time ma'lumotlar
 * o'rniga simulyatsiya qilingan yangilanishlarni yaratadi.
 *
 * @param setKpiData - React state setter funksiyasi
 * @returns Cleanup funksiyasi (interval'ni to'xtatish uchun)
 */
