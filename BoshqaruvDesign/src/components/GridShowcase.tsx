import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

export function GridShowcase() {
  // Generate column demonstration items
  const generateColumns = (count: number) => {
    return Array.from({ length: count }, (_, i) => (
      <div 
        key={i} 
        className="bg-primary/10 border border-primary/20 rounded-md p-2 text-center"
      >
        <span className="text-xs text-primary font-medium">{i + 1}</span>
      </div>
    ));
  };

  return (
    <div className="boshqaruv-container boshqaruv-auto-layout py-8">
      <div className="boshqaruv-content-max">
        
        {/* Desktop Grid (12 columns) */}
        <Card className="boshqaruv-card mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Desktop Grid - 12 Ustun</CardTitle>
                <CardDescription>1024px+ ekranlar uchun</CardDescription>
              </div>
              <Badge className="hidden desktop:inline-flex">Hozir ko'rsatilmoqda</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="boshqaruv-grid mb-4">
              {generateColumns(12)}
            </div>
            <p className="text-sm text-muted-foreground">
              Margin: 24px • Gutter: 20px • Max Width: 1280px
            </p>
          </CardContent>
        </Card>

        {/* Tablet Grid (8 columns) */}
        <Card className="boshqaruv-card mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Tablet Grid - 8 Ustun</CardTitle>
                <CardDescription>768px - 1023px ekranlar uchun</CardDescription>
              </div>
              <Badge className="hidden tablet:inline-flex desktop:hidden">Hozir ko'rsatilmoqda</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-8 gap-4 mb-4">
              {generateColumns(8)}
            </div>
            <p className="text-sm text-muted-foreground">
              Margin: 20px • Gutter: 16px • Responsive Layout
            </p>
          </CardContent>
        </Card>

        {/* Mobile Grid (4 columns) */}
        <Card className="boshqaruv-card mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Mobile Grid - 4 Ustun</CardTitle>
                <CardDescription>{'< 768px'} ekranlar uchun</CardDescription>
              </div>
              <Badge className="tablet:hidden">Hozir ko'rsatilmoqda</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-3 mb-4">
              {generateColumns(4)}
            </div>
            <p className="text-sm text-muted-foreground">
              Margin: 16px • Gutter: 12px • Mobile Optimized
            </p>
          </CardContent>
        </Card>

        {/* Auto Layout Example */}
        <Card className="boshqaruv-card">
          <CardHeader>
            <CardTitle>Auto Layout Namunasi</CardTitle>
            <CardDescription>Moslashuvchan elementlar tartibga solish</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="boshqaruv-auto-layout">
              <div className="boshqaruv-grid">
                <div className="col-span-2 tablet:col-span-3 desktop:col-span-4">
                  <div className="bg-card border border-border rounded-lg p-4">
                    <h4 className="mb-2">Birinchi Blok</h4>
                    <p className="text-sm text-muted-foreground">
                      Bu blok turli ekranlarda turlicha joylashadi
                    </p>
                  </div>
                </div>
                <div className="col-span-2 tablet:col-span-3 desktop:col-span-4">
                  <div className="bg-card border border-border rounded-lg p-4">
                    <h4 className="mb-2">Ikkinchi Blok</h4>
                    <p className="text-sm text-muted-foreground">
                      Responsive grid tizimi orqali
                    </p>
                  </div>
                </div>
                <div className="col-span-4 tablet:col-span-2 desktop:col-span-4">
                  <div className="bg-card border border-border rounded-lg p-4">
                    <h4 className="mb-2">Uchinchi Blok</h4>
                    <p className="text-sm text-muted-foreground">
                      Auto Layout bilan optimallashtirish
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}