import { DEFAULT_KPI_DATA } from '../constants/app';

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

export const createKPIUpdateHandler = (setKpiData: React.Dispatch<React.SetStateAction<KPIData>>) => {
  return (data: any) => {
    setKpiData(prev => {
      if (!data || typeof data !== 'object') {
        console.warn('Invalid data update received, skipping');
        return prev;
      }

      const updated = { ...prev };
      
      if (data.type) {
        switch (data.type) {
          case 'attendance_update':
            if (updated.attendance) {
              updated.attendance = { ...updated.attendance, ...data.data };
            }
            break;
          case 'task_update':
            if (updated.tasks) {
              updated.tasks = { ...updated.tasks, ...data.data };
            }
            break;
          default:
            Object.keys(data).forEach(key => {
              if (key !== 'type' && updated[key]) {
                updated[key] = { ...updated[key], ...data[key] };
              }
            });
        }
      } else {
        Object.keys(data).forEach(key => {
          if (updated[key] && typeof data[key] === 'object') {
            updated[key] = { ...updated[key], ...data[key] };
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
          console.warn('KPI data attendance object is missing, skipping update');
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
