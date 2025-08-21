import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import { 
  Search, 
  Bell, 
  Plus, 
  Settings, 
  User, 
  LogOut, 
  HelpCircle,
  Moon,
  Sun,
  Menu
} from 'lucide-react';

interface TopbarProps {
  onSidebarToggle?: () => void;
  isDark?: boolean;
  onThemeToggle?: () => void;
}

export function Topbar({ onSidebarToggle, isDark, onThemeToggle }: TopbarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // Handle global search shortcut
  const handleSearchShortcut = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === '/') {
      e.preventDefault();
      setIsSearchOpen(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="boshqaruv-container">
          <div className="flex h-16 items-center justify-between">
            {/* Left Section: Mobile Menu + Logo */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="desktop:hidden"
                onClick={onSidebarToggle}
              >
                <Menu className="h-4 w-4" />
                <span className="sr-only">Menuni ochish</span>
              </Button>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="font-semibold text-primary-foreground">B</span>
                </div>
                <span className="hidden tablet:inline-block font-semibold">Boshqaruv</span>
              </div>
            </div>

            {/* Center Section: Search */}
            <div className="flex-1 max-w-lg mx-4" onKeyDown={handleSearchShortcut}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Qidirish... (⌘/)"
                  className="pl-9 pr-4 w-full"
                  onClick={() => setIsSearchOpen(true)}
                  readOnly
                />
              </div>
            </div>

            {/* Right Section: Actions + Avatar */}
            <div className="flex items-center gap-2">
              {/* Quick Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Plus className="h-4 w-4" />
                    <span className="hidden tablet:ml-2 tablet:inline">Yaratish</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Yangi yaratish</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Yangi xodim
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Yangi vazifa
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Theme Toggle */}
              <Button variant="ghost" size="sm" onClick={onThemeToggle}>
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                <span className="sr-only">Mavzuni o'zgartirish</span>
              </Button>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-4 w-4" />
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                      3
                    </Badge>
                    <span className="sr-only">Bildirishnomalar</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Bildirishnomalar</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">Yangi xodim qo'shildi</p>
                      <p className="text-xs text-muted-foreground">5 daqiqa oldin</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">Smena yakunlandi</p>
                      <p className="text-xs text-muted-foreground">1 soat oldin</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">Yangi hisobot tayyor</p>
                      <p className="text-xs text-muted-foreground">2 soat oldin</p>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Avatar */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-avatar.jpg" alt="Foydalanuvchi" />
                      <AvatarFallback>AF</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Mening hisobim</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profil
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Sozlamalar
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Yordam
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    Chiqish
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Global Search Dialog */}
      <CommandDialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <CommandInput placeholder="Qidirish..." value={searchValue} onValueChange={setSearchValue} />
        <CommandList>
          <CommandEmpty>Hech narsa topilmadi.</CommandEmpty>
          <CommandGroup heading="Sahifalar">
            <CommandItem>
              <User className="mr-2 h-4 w-4" />
              Xodimlar
            </CommandItem>
            <CommandItem>
              <Settings className="mr-2 h-4 w-4" />
              Smenalar
            </CommandItem>
            <CommandItem>
              <Settings className="mr-2 h-4 w-4" />
              Vazifalar
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Xodimlar">
            <CommandItem>
              <User className="mr-2 h-4 w-4" />
              Alisher Fayzullayev
            </CommandItem>
            <CommandItem>
              <User className="mr-2 h-4 w-4" />
              Nozima Karimova
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}