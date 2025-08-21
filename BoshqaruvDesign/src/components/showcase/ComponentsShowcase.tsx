import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { ButtonEnhanced, ButtonGroup } from '../enhanced/ButtonEnhanced';
import { InputEnhanced, TextareaEnhanced, SelectEnhanced, DatePicker, TimePicker, MultiSelect } from '../enhanced/FormComponents';
import { 
  Plus, 
  Download, 
  Mail
} from 'lucide-react';

interface ComponentsShowcaseProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  selectedEmployees: string[];
  setSelectedEmployees: (employees: string[]) => void;
  employeeOptions: Array<{ value: string; label: string }>;
}

export function ComponentsShowcase({
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  selectedEmployees,
  setSelectedEmployees,
  employeeOptions
}: ComponentsShowcaseProps) {
  return (
    <div className="space-y-8">
      {/* Button Variants */}
      <Card>
        <CardHeader>
          <CardTitle>Button Variants</CardTitle>
          <CardDescription>Turli xil tugma turlari va holatlari</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <h4 className="mb-3 font-medium">Asosiy variantlar</h4>
              <div className="flex flex-wrap gap-2">
                <ButtonEnhanced variant="primary">Asosiy</ButtonEnhanced>
                <ButtonEnhanced variant="neutral">Neytral</ButtonEnhanced>
                <ButtonEnhanced variant="success">Muvaffaqiyat</ButtonEnhanced>
                <ButtonEnhanced variant="warning">Ogohlantirish</ButtonEnhanced>
                <ButtonEnhanced variant="danger">Xavfli</ButtonEnhanced>
                <ButtonEnhanced variant="outline">Chiziq</ButtonEnhanced>
                <ButtonEnhanced variant="ghost">Shaffof</ButtonEnhanced>
              </div>
            </div>

            <div>
              <h4 className="mb-3 font-medium">O'lchamlar</h4>
              <div className="flex flex-wrap gap-2 items-center">
                <ButtonEnhanced size="sm">Kichik</ButtonEnhanced>
                <ButtonEnhanced size="md">O'rta</ButtonEnhanced>
                <ButtonEnhanced size="lg">Katta</ButtonEnhanced>
              </div>
            </div>

            <div>
              <h4 className="mb-3 font-medium">Ikonlar bilan</h4>
              <div className="flex flex-wrap gap-2">
                <ButtonEnhanced iconLeft={<Plus className="h-4 w-4" />}>
                  Chap ikon
                </ButtonEnhanced>
                <ButtonEnhanced iconRight={<Download className="h-4 w-4" />}>
                  O'ng ikon
                </ButtonEnhanced>
                <ButtonEnhanced loading>
                  Yuklanmoqda
                </ButtonEnhanced>
                <ButtonEnhanced disabled>
                  O'chirilgan
                </ButtonEnhanced>
              </div>
            </div>

            <div>
              <h4 className="mb-3 font-medium">Button Group</h4>
              <ButtonGroup>
                <ButtonEnhanced variant="outline">Chap</ButtonEnhanced>
                <ButtonEnhanced variant="outline">O'rta</ButtonEnhanced>
                <ButtonEnhanced variant="outline">O'ng</ButtonEnhanced>
              </ButtonGroup>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Components */}
      <Card>
        <CardHeader>
          <CardTitle>Form Components</CardTitle>
          <CardDescription>Turli xil forma elementlari</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-6">
            <div className="space-y-4">
              <InputEnhanced
                label="Ism"
                placeholder="Ismingizni kiriting"
                helpText="Kamida 2 ta harf bo'lishi kerak"
              />
              
              <InputEnhanced
                label="Email"
                type="email"
                placeholder="pochta@example.com"
                leftIcon={<Mail className="h-4 w-4" />}
                success
              />
              
              <InputEnhanced
                label="Parol"
                type="password"
                placeholder="Parolingizni kiriting"
                error="Parol juda qisqa"
              />

              <TextareaEnhanced
                label="Izoh"
                placeholder="Qo'shimcha ma'lumotlar..."
                maxLength={200}
                helpText="200 belgigacha yozishingiz mumkin"
              />
            </div>

            <div className="space-y-4">
              <SelectEnhanced
                label="Lavozim"
                placeholder="Lavozimni tanlang"
                options={[
                  { value: 'manager', label: 'Menejer' },
                  { value: 'developer', label: 'Dasturchi' },
                  { value: 'designer', label: 'Dizayner' },
                  { value: 'analyst', label: 'Tahlilchi' },
                ]}
              />

              <DatePicker
                label="Tug'ilgan sana"
                value={selectedDate}
                onChange={setSelectedDate}
                helpText="DD.MM.YYYY formatida"
              />

              <TimePicker
                label="Ish vaqti"
                value={selectedTime}
                onChange={setSelectedTime}
                helpText="24-soat formatida"
              />

              <MultiSelect
                label="Xodimlar"
                placeholder="Xodimlarni tanlang"
                options={employeeOptions}
                value={selectedEmployees}
                onChange={setSelectedEmployees}
                helpText="Bir nechta xodimni tanlashingiz mumkin"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Tabs</CardTitle>
          <CardDescription>Turli xil tab turlari</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="underline" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="underline">Underline Tabs</TabsTrigger>
              <TabsTrigger value="pill">Pill Tabs</TabsTrigger>
            </TabsList>
            <TabsContent value="underline" className="space-y-4">
              <Tabs defaultValue="tab1" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="tab1">Birinchi</TabsTrigger>
                  <TabsTrigger value="tab2">Ikkinchi</TabsTrigger>
                  <TabsTrigger value="tab3">Uchinchi</TabsTrigger>
                </TabsList>
                <TabsContent value="tab1">
                  <div className="p-4 border rounded-lg">
                    <p>Birinchi tab kontenti</p>
                  </div>
                </TabsContent>
                <TabsContent value="tab2">
                  <div className="p-4 border rounded-lg">
                    <p>Ikkinchi tab kontenti</p>
                  </div>
                </TabsContent>
                <TabsContent value="tab3">
                  <div className="p-4 border rounded-lg">
                    <p>Uchinchi tab kontenti</p>
                  </div>
                </TabsContent>
              </Tabs>
            </TabsContent>
            <TabsContent value="pill">
              <div className="p-4 border rounded-lg">
                <p>Pill tabs misolida kontentlar ko'rsatiladi</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Badges and Avatars */}
      <div className="grid grid-cols-1 tablet:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Badges</CardTitle>
            <CardDescription>Turli xil nishonlar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge className="bg-success text-success-foreground">Success</Badge>
              <Badge className="bg-warning text-warning-foreground">Warning</Badge>
              <Badge className="bg-danger text-danger-foreground">Danger</Badge>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <Badge>Oddiy <span className="ml-1 text-xs">5</span></Badge>
              <Badge variant="secondary">Hisob <span className="ml-1 bg-primary text-primary-foreground rounded-full px-1 text-xs">12</span></Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Avatars</CardTitle>
            <CardDescription>Foydalanuvchi rasmlari</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-8 w-8">
                <AvatarFallback>AF</AvatarFallback>
              </Avatar>
              <Avatar className="h-10 w-10">
                <AvatarFallback>NK</AvatarFallback>
              </Avatar>
              <Avatar className="h-12 w-12">
                <AvatarFallback>JT</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
              <Avatar className="h-8 w-8">
                <AvatarFallback>B</AvatarFallback>
              </Avatar>
              <Avatar className="h-8 w-8">
                <AvatarFallback>C</AvatarFallback>
              </Avatar>
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                +5
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}