import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from '../ui/breadcrumb';
import { 
  Search, 
  BarChart3, 
  Users, 
  Clock, 
  CheckSquare, 
  Calendar,
  AlertTriangle,
  FileText,
  Settings,
  Shield,
  Eye,
  Plus,
  Filter
} from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
  actions?: React.ReactNode;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
}

export function PageHeader({ 
  title, 
  description, 
  icon, 
  breadcrumbs = [], 
  actions,
  searchPlaceholder,
  onSearch
}: PageHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <div className="border-b bg-background">
      <div className="boshqaruv-container py-6">
        <div className="boshqaruv-content-max">
          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <Breadcrumb className="mb-4">
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                  <div key={index} className="flex items-center">
                    <BreadcrumbItem>
                      {crumb.href && index < breadcrumbs.length - 1 ? (
                        <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                    {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          )}

          {/* Header Content */}
          <div className="flex flex-col space-y-4 tablet:flex-row tablet:items-center tablet:justify-between tablet:space-y-0">
            <div className="flex items-center space-x-4">
              {icon && (
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  {icon}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-semibold">{title}</h1>
                {description && (
                  <p className="text-muted-foreground">{description}</p>
                )}
              </div>
            </div>

            {/* Search and Actions */}
            <div className="flex items-center space-x-4">
              {searchPlaceholder && (
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-80"
                  />
                </form>
              )}
              {actions}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Specific page headers
export function DashboardHeader() {
  return (
    <PageHeader
      title="Boshqaruv paneli"
      description="Kompaniya faoliyatining umumiy ko'rinishi"
      icon={<BarChart3 className="h-6 w-6 text-primary" />}
      breadcrumbs={[
        { label: "Bosh sahifa" }
      ]}
    />
  );
}

export function EmployeesHeader() {
  return (
    <PageHeader
      title="Xodimlar"
      description="Xodimlar ma'lumotlarini boshqarish"
      icon={<Users className="h-6 w-6 text-primary" />}
      breadcrumbs={[
        { label: "Bosh sahifa", href: "/" },
        { label: "Xodimlar" }
      ]}
      searchPlaceholder="Xodimlarni qidirish..."
      actions={
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">17 xodim</Badge>
        </div>
      }
    />
  );
}

export function ShiftsHeader() {
  return (
    <PageHeader
      title="Smenalar"
      description="Ish smenalarini rejalashtirish va boshqarish"
      icon={<Clock className="h-6 w-6 text-primary" />}
      breadcrumbs={[
        { label: "Bosh sahifa", href: "/" },
        { label: "Smenalar" }
      ]}
      actions={
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">8 smena</Badge>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Yangi smena
          </Button>
        </div>
      }
    />
  );
}

export function TasksHeader() {
  return (
    <PageHeader
      title="Vazifalar"
      description="Loyiha vazifalari va jarayonlarni kuzatish"
      icon={<CheckSquare className="h-6 w-6 text-primary" />}
      breadcrumbs={[
        { label: "Bosh sahifa", href: "/" },
        { label: "Vazifalar" }
      ]}
      searchPlaceholder="Vazifalarni qidirish..."
      actions={
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">24 vazifa</Badge>
          <Button size="sm" variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Yangi vazifa
          </Button>
        </div>
      }
    />
  );
}

export function AttendanceHeader() {
  return (
    <PageHeader
      title="Davomat"
      description="Xodimlar davomatini kuzatish va boshqarish"
      icon={<Calendar className="h-6 w-6 text-primary" />}
      breadcrumbs={[
        { label: "Bosh sahifa", href: "/" },
        { label: "Davomat" }
      ]}
      searchPlaceholder="Xodimlarni qidirish..."
      actions={
        <div className="flex items-center space-x-2">
          <Badge className="bg-success text-success-foreground">12 hozir</Badge>
          <Badge className="bg-warning text-warning-foreground">3 kech</Badge>
          <Badge className="bg-danger text-danger-foreground">2 yo'q</Badge>
        </div>
      }
    />
  );
}

export function PenaltiesHeader() {
  return (
    <PageHeader
      title="Jarimalar"
      description="Jarima qoidalari va jarimalarni boshqarish"
      icon={<AlertTriangle className="h-6 w-6 text-primary" />}
      breadcrumbs={[
        { label: "Bosh sahifa", href: "/" },
        { label: "Jarimalar" }
      ]}
      actions={
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">4 qoida</Badge>
          <Badge className="bg-warning text-warning-foreground">3 kutilmoqda</Badge>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Yangi qoida
          </Button>
        </div>
      }
    />
  );
}

export function ReportsHeader() {
  return (
    <PageHeader
      title="Hisobotlar"
      description="Davomat, jarimalar va vazifalar bo'yicha hisobotlar"
      icon={<FileText className="h-6 w-6 text-primary" />}
      breadcrumbs={[
        { label: "Bosh sahifa", href: "/" },
        { label: "Hisobotlar" }
      ]}
      actions={
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">3 hisobot turi</Badge>
        </div>
      }
    />
  );
}

export function SettingsHeader() {
  return (
    <PageHeader
      title="Sozlamalar"
      description="Tizim sozlamalari va konfiguratsiya"
      icon={<Settings className="h-6 w-6 text-primary" />}
      breadcrumbs={[
        { label: "Bosh sahifa", href: "/" },
        { label: "Sozlamalar" }
      ]}
      actions={
        <div className="flex items-center space-x-2">
          <Badge className="bg-success text-success-foreground">Sinxronlashtirilgan</Badge>
        </div>
      }
    />
  );
}

export function AuditHeader() {
  return (
    <PageHeader
      title="Audit jurnali"
      description="Tizim faoliyati va foydalanuvchi harakatlari jurnali"
      icon={<Eye className="h-6 w-6 text-primary" />}
      breadcrumbs={[
        { label: "Bosh sahifa", href: "/" },
        { label: "Audit" }
      ]}
      searchPlaceholder="Audit loglarni qidirish..."
      actions={
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">248 ta yozuv</Badge>
        </div>
      }
    />
  );
}

export function SuperAdminHeader() {
  return (
    <PageHeader
      title="Super Admin"
      description="Tizim boshqaruvi va konfiguratsiya"
      icon={<Shield className="h-6 w-6 text-primary" />}
      breadcrumbs={[
        { label: "Bosh sahifa", href: "/" },
        { label: "Super Admin" }
      ]}
      actions={
        <div className="flex items-center space-x-2">
          <Badge className="bg-danger text-danger-foreground">Maxfiy</Badge>
        </div>
      }
    />
  );
}