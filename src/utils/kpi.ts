// import { DEFAULT_KPI_DATA } from '../constants/app';

export interface KPIData {
  attendance: {
    present: number;
    late: number;
    absent: number;
    total: number;
  };
  tasks: {
    completed: number;
    inProgress: number;
    pending: number;
    total: number;
  };
  penalties: {
    active: number;
    resolved: number;
    total: number;
  };
}

type KpiSections = keyof KPIData;
export const createKPIUpdateHandler = (setKpiData: React.Dispatch<React.SetStateAction<KPIData>>) => {
  return (data: unknown) => {
    setKpiData(prev => {
      if (!data || typeof data !== 'object') {
        // Invalid data is silently ignored
        return prev;
      }

      const updated: KPIData = { ...prev };
      
      const d = data as Partial<KPIData>;
      if (d.type) {
        switch (d.type) {
          case 'attendance_update':
            if (updated.attendance) {
              updated.attendance = { ...updated.attendance, ...d.data };
            }
            break;
          case 'task_update':
            if (updated.tasks) {
              updated.tasks = { ...updated.tasks, ...d.data };
            }
            break;
          default:
            (Object.keys(d) as Array<KpiSections | string>).forEach((key) => {
              if (key !== 'type' && (key as KpiSections) in updated) {
                const section = key as KpiSections;
                updated[section] = { ...updated[section], ...d[section] };
              }
            });
        }
      } else {
        (Object.keys(d) as Array<KpiSections | string>).forEach((key) => {
          if ((key as KpiSections) in updated && typeof d[key] === 'object') {
            const section = key as KpiSections;
            updated[section] = { ...updated[section], ...(d as Record<string, any>)[key] };
          }
        });
      }

      return updated;
    });
  };
};

export const simulateKPIUpdates = (setKpiData: React.Dispatch<React.SetStateAction<KPIData>>) => {
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
            present: (prev.attendance.present || 0) + (Math.random() > 0.5 ? 1 : 0)
          }
        };
      });
    }
  }, 5000);

  return () => clearInterval(interval);
};
