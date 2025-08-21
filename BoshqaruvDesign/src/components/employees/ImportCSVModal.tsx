import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { ButtonEnhanced } from '../enhanced/ButtonEnhanced';
import { SelectEnhanced } from '../enhanced/FormComponents';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Download,
  Eye,
  X
} from 'lucide-react';

interface ImportCSVModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: any) => void;
}

// Mock CSV data for demonstration
const mockCSVData = [
  ['Ism Familiya', 'Email', 'Telefon', 'Bo\'lim', 'Lavozim'],
  ['Aziza Tursunova', 'aziza.t@company.uz', '+998 90 111 22 33', 'Marketing', 'Specialist'],
  ['Otabek Karimov', 'otabek.k@company.uz', '+998 91 222 33 44', 'IT', 'Developer'],
  ['Nigora Abdullayeva', 'nigora.a@company.uz', '+998 93 333 44 55', 'HR', 'Manager'],
];

const fieldMappingOptions = [
  { value: 'none', label: 'Tanlang...' },
  { value: 'name', label: 'Ism Familiya' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Telefon' },
  { value: 'dept', label: 'Bo\'lim' },
  { value: 'role', label: 'Lavozim' },
  { value: 'startDate', label: 'Ish boshlagan sana' },
  { value: 'salary', label: 'Maosh' },
  { value: 'address', label: 'Manzil' },
  { value: 'ignore', label: 'E\'tibor bermaslik' },
];

export function ImportCSVModal({ isOpen, onClose, onImport }: ImportCSVModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [fieldMappings, setFieldMappings] = useState<{ [key: number]: string }>({});
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setUploadedFile(file);
      setIsUploading(true);
      
      // Simulate file reading
      setTimeout(() => {
        setCsvData(mockCSVData);
        setIsUploading(false);
        setCurrentStep(2);
      }, 1500);
    } else {
      alert('Iltimos, CSV fayl tanlang');
    }
  };

  const handleFieldMapping = (columnIndex: number, fieldValue: string) => {
    setFieldMappings(prev => ({
      ...prev,
      [columnIndex]: fieldValue
    }));
  };

  const validateMappings = () => {
    const errors: string[] = [];
    const requiredFields = ['name', 'email'];
    const mappedFields = Object.values(fieldMappings);
    
    // Check required fields
    requiredFields.forEach(field => {
      if (!mappedFields.includes(field)) {
        errors.push(`${field === 'name' ? 'Ism Familiya' : 'Email'} maydoni majburiy`);
      }
    });
    
    // Check for duplicate mappings
    const nonIgnoreFields = mappedFields.filter(field => field !== 'ignore' && field !== 'none');
    const uniqueFields = [...new Set(nonIgnoreFields)];
    if (nonIgnoreFields.length !== uniqueFields.length) {
      errors.push('Bir xil maydonni bir necha marta tanlab bo\'lmaydi');
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleNext = () => {
    if (currentStep === 2) {
      if (validateMappings()) {
        setCurrentStep(3);
      }
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleImport = () => {
    // Process the data and call onImport
    const mappedData = csvData.slice(1).map(row => {
      const employee: any = {};
      Object.entries(fieldMappings).forEach(([columnIndex, fieldName]) => {
        if (fieldName && fieldName !== 'ignore' && fieldName !== 'none') {
          employee[fieldName] = row[parseInt(columnIndex)];
        }
      });
      return employee;
    });
    
    onImport(mappedData);
    handleClose();
  };

  const handleClose = () => {
    setCurrentStep(1);
    setUploadedFile(null);
    setCsvData([]);
    setFieldMappings({});
    setValidationErrors([]);
    setIsUploading(false);
    onClose();
  };

  const getStepIcon = (stepNumber: number) => {
    if (currentStep > stepNumber) {
      return <CheckCircle2 className="h-5 w-5 text-success" />;
    } else if (currentStep === stepNumber) {
      return <div className="h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">{stepNumber}</div>;
    } else {
      return <div className="h-5 w-5 rounded-full border-2 border-muted-foreground text-muted-foreground flex items-center justify-center text-xs font-medium">{stepNumber}</div>;
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <Upload className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">CSV fayl yuklash</h3>
          <p className="text-muted-foreground">
            Xodimlar ma'lumotlari bilan CSV faylni tanlang
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Fayl talablari</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-success" />
            CSV format (.csv)
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-success" />
            Birinchi qator - sarlavhalar
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-success" />
            UTF-8 kodlash
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-success" />
            Maksimal 1000 qator
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Label htmlFor="csvFile">CSV fayl tanlang</Label>
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
          <input
            id="csvFile"
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />
          <label
            htmlFor="csvFile"
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            <FileText className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="font-medium">Fayl tanlash uchun bosing</p>
              <p className="text-sm text-muted-foreground">yoki bu yerga tashlang</p>
            </div>
          </label>
        </div>
        {uploadedFile && (
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <FileText className="h-4 w-4" />
            <span className="text-sm">{uploadedFile.name}</span>
            <Badge variant="secondary">{Math.round(uploadedFile.size / 1024)} KB</Badge>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <ButtonEnhanced
          variant="outline"
          iconLeft={<Download className="h-4 w-4" />}
          className="flex-1"
        >
          Namuna faylni yuklab olish
        </ButtonEnhanced>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Maydonlarni moslash</h3>
        <p className="text-muted-foreground">
          CSV ustunlarini tizim maydonlari bilan moslang
        </p>
      </div>

      {validationErrors.length > 0 && (
        <Card className="border-danger">
          <CardContent className="pt-6">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-danger mt-0.5" />
              <div className="space-y-2">
                <p className="font-medium text-danger">Xatoliklar mavjud:</p>
                <ul className="space-y-1 text-sm text-danger">
                  {validationErrors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Maydonlarni moslash</CardTitle>
          <CardDescription>
            Har bir CSV ustuni uchun mos keladigan maydonni tanlang
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {csvData[0]?.map((header, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex-1">
                  <Label className="text-sm font-medium">{header}</Label>
                  <p className="text-xs text-muted-foreground">
                    Misol: {csvData[1]?.[index]}
                  </p>
                </div>
                <div className="flex-1">
                  <SelectEnhanced
                    placeholder="Maydonni tanlang"
                    options={fieldMappingOptions}
                    value={fieldMappings[index] || 'none'}
                    onValueChange={(value) => handleFieldMapping(index, value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Ma'lumotlar ko'rinishi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {csvData[0]?.map((header, index) => (
                    <TableHead key={index} className="text-xs">
                      {header}
                      {fieldMappings[index] && fieldMappings[index] !== 'none' && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {fieldMappingOptions.find(opt => opt.value === fieldMappings[index])?.label}
                        </Badge>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {csvData.slice(1, 4).map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <TableCell key={cellIndex} className="text-xs">
                        {cell}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {csvData.length > 4 && (
            <p className="text-xs text-muted-foreground mt-2">
              ... va yana {csvData.length - 4} ta qator
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderStep3 = () => {
    const mappedFields = Object.values(fieldMappings).filter(field => field && field !== 'ignore' && field !== 'none');
    const dataCount = csvData.length - 1;
    
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Import tayyor</h3>
            <p className="text-muted-foreground">
              Ma'lumotlarni import qilishga tayyor
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 tablet:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-primary">{dataCount}</div>
              <div className="text-sm text-muted-foreground">Xodimlar soni</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-success">{mappedFields.length}</div>
              <div className="text-sm text-muted-foreground">Moslangan maydonlar</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-muted-foreground">{csvData[0]?.length - mappedFields.length}</div>
              <div className="text-sm text-muted-foreground">E'tibor berilmagan</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Moslangan maydonlar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(fieldMappings).map(([columnIndex, fieldValue]) => {
                if (!fieldValue || fieldValue === 'ignore' || fieldValue === 'none') return null;
                const columnName = csvData[0]?.[parseInt(columnIndex)];
                const fieldLabel = fieldMappingOptions.find(opt => opt.value === fieldValue)?.label;
                
                return (
                  <div key={columnIndex} className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm">{columnName}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="secondary">{fieldLabel}</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-warning">
          <CardContent className="pt-6">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
              <div className="space-y-2">
                <p className="font-medium text-warning">Diqqat!</p>
                <p className="text-sm text-muted-foreground">
                  Import amalga oshirilgandan so'ng, {dataCount} ta yangi xodim tizimga qo'shiladi. 
                  Bu amalni bekor qilib bo'lmaydi.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>CSV Import</DialogTitle>
          <DialogDescription>
            Xodimlar ma'lumotlarini CSV fayldan import qiling
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-8 py-6">
          <div className="flex items-center gap-2">
            {getStepIcon(1)}
            <span className={`text-sm ${currentStep >= 1 ? 'text-foreground' : 'text-muted-foreground'}`}>
              Fayl yuklash
            </span>
          </div>
          <div className={`h-px flex-1 ${currentStep > 1 ? 'bg-primary' : 'bg-muted'}`} />
          <div className="flex items-center gap-2">
            {getStepIcon(2)}
            <span className={`text-sm ${currentStep >= 2 ? 'text-foreground' : 'text-muted-foreground'}`}>
              Maydonlarni moslash
            </span>
          </div>
          <div className={`h-px flex-1 ${currentStep > 2 ? 'bg-primary' : 'bg-muted'}`} />
          <div className="flex items-center gap-2">
            {getStepIcon(3)}
            <span className={`text-sm ${currentStep >= 3 ? 'text-foreground' : 'text-muted-foreground'}`}>
              Tasdiqlash
            </span>
          </div>
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          {isUploading && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground">Fayl yuklanmoqda...</p>
              </div>
            </div>
          )}
          {!isUploading && currentStep === 1 && renderStep1()}
          {!isUploading && currentStep === 2 && renderStep2()}
          {!isUploading && currentStep === 3 && renderStep3()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t">
          <div>
            {currentStep > 1 && (
              <ButtonEnhanced
                variant="outline"
                iconLeft={<ArrowLeft className="h-4 w-4" />}
                onClick={handlePrevious}
              >
                Orqaga
              </ButtonEnhanced>
            )}
          </div>
          <div className="flex gap-2">
            <ButtonEnhanced
              variant="outline"
              iconLeft={<X className="h-4 w-4" />}
              onClick={handleClose}
            >
              Bekor qilish
            </ButtonEnhanced>
            {currentStep < 3 ? (
              <ButtonEnhanced
                variant="primary"
                iconRight={<ArrowRight className="h-4 w-4" />}
                onClick={handleNext}
                disabled={currentStep === 1 && !csvData.length}
              >
                Keyingi
              </ButtonEnhanced>
            ) : (
              <ButtonEnhanced
                variant="primary"
                iconLeft={<Upload className="h-4 w-4" />}
                onClick={handleImport}
              >
                Import qilish
              </ButtonEnhanced>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}