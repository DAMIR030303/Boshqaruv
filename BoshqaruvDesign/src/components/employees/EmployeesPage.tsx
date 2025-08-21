import { useState } from 'react';
import { EmployeesTable } from './EmployeesTable';
import { EmployeeDrawer } from './EmployeeDrawer';
import { ImportCSVModal } from './ImportCSVModal';
import { toast } from 'sonner';

export function EmployeesPage() {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleViewEmployee = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    setIsDrawerOpen(true);
  };

  const handleEditEmployee = (employeeId: string) => {
    // In a real app, this would open an edit form
    toast.info(`Xodimni tahrirlash: ${employeeId}`);
    console.log('Edit employee:', employeeId);
  };

  const handleDeactivateEmployee = (employeeId: string) => {
    // In a real app, this would show a confirmation dialog and then deactivate
    toast.warning(`Xodim holati o'zgartirildi: ${employeeId}`);
    console.log('Deactivate employee:', employeeId);
  };

  const handleAddEmployee = () => {
    // In a real app, this would open an add employee form
    toast.info('Yangi xodim qo\'shish formasi ochiladi');
    console.log('Add new employee');
  };

  const handleImportCSV = () => {
    setIsImportModalOpen(true);
  };

  const handleImportData = (data: any[]) => {
    // In a real app, this would send data to the backend
    console.log('Importing employee data:', data);
    toast.success(`${data.length} ta xodim muvaffaqiyatli import qilindi`);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedEmployeeId(null);
  };

  const handleCloseImportModal = () => {
    setIsImportModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <EmployeesTable
        onViewEmployee={handleViewEmployee}
        onEditEmployee={handleEditEmployee}
        onDeactivateEmployee={handleDeactivateEmployee}
        onImportCSV={handleImportCSV}
        onAddEmployee={handleAddEmployee}
        loading={isLoading}
      />

      <EmployeeDrawer
        employeeId={selectedEmployeeId}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        onEdit={handleEditEmployee}
      />

      <ImportCSVModal
        isOpen={isImportModalOpen}
        onClose={handleCloseImportModal}
        onImport={handleImportData}
      />
    </div>
  );
}