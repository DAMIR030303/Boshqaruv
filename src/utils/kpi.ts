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

// type KpiSections = keyof KPIData;
export const createKPIUpdateHandler = (setKpiData: React.Dispatch<React.SetStateAction<KPIData>>) => {
  return (data: unknown) => {
    setKpiData(prev => {
      if (!data || typeof data !== 'object') {
        // Invalid data is silently ignored
        return prev;
      }

      const updated: KPIData = { ...prev };
      
      const d = data as any;
      if (d.type) {
        switch (d.type) {
          case 'attendance_update':
            if (updated.attendance && d.data) {
              updated.attendance = { ...updated.attendance, ...d.data };
            }
            break;
          case 'task_update':
            if (updated.tasks && d.data) {
              updated.tasks = { ...updated.tasks, ...d.data };
            }
            break;
          default:
            // Handle other update types
            break;
        }
      } else {
        // Regular update without type
        const partialData = d as Partial<KPIData>;
        (Object.keys(partialData) as Array<keyof KPIData>).forEach((key) => {
          if (key in updated && partialData[key]) {
            (updated as any)[key] = { ...updated[key], ...partialData[key] };
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
