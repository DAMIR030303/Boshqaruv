// Boshqaruv Design System Components
// Complete component library with proper naming convention and accessibility

// Core UI Components
export { Button, buttonVariants, type ButtonProps } from './ui/button-enhanced';
export { Input, Textarea, inputVariants, type InputProps, type TextareaProps } from './ui/input-enhanced';
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './ui/card';

// Navigation Components  
export { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
export { Dialog, DialogPortal, DialogOverlay, DialogClose, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from './ui/dialog';

// Data Display
export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption } from './ui/table';
export { Badge, badgeVariants } from './ui/badge';
export { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
export { Progress } from './ui/progress';

// Feedback
export { Toaster } from './ui/sonner';
export { Alert, AlertDescription, AlertTitle } from './ui/alert';

// Complex Components
export { KanbanBoard, type KanbanTask, type KanbanColumn, type KanbanBoardProps } from './ui/kanban';

// Accessibility Utilities
export {
  SkipLink,
  VisuallyHidden,
  LiveRegion,
  Landmark,
  useFocusTrap,
  useKeyboardNavigation,
  useScreenReaderAnnouncement,
  useHighContrast,
  useReducedMotion,
  UzbekScreenReaderText
} from './ui/accessibility';

// All other existing UI components
export { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
export { AlertDialog, AlertDialogPortal, AlertDialogOverlay, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from './ui/alert-dialog';
export { AspectRatio } from './ui/aspect-ratio';
export { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';
export { Calendar } from './ui/calendar';
export { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from './ui/carousel';
export { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from './ui/chart';
export { Checkbox } from './ui/checkbox';
export { Collapsible, CollapsibleTrigger, CollapsibleContent } from './ui/collapsible';
export { Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut, CommandSeparator } from './ui/command';
export { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuCheckboxItem, ContextMenuRadioItem, ContextMenuLabel, ContextMenuSeparator, ContextMenuShortcut, ContextMenuGroup, ContextMenuPortal, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuRadioGroup } from './ui/context-menu';
export { Drawer, DrawerPortal, DrawerOverlay, DrawerTrigger, DrawerClose, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription } from './ui/drawer';
export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuGroup, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuRadioGroup } from './ui/dropdown-menu';
export { Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField, useFormField } from './ui/form';
export { HoverCard, HoverCardTrigger, HoverCardContent } from './ui/hover-card';
export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from './ui/input-otp';
export { Label } from './ui/label';
export { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarSeparator, MenubarLabel, MenubarCheckboxItem, MenubarRadioGroup, MenubarRadioItem, MenubarPortal, MenubarSubContent, MenubarSubTrigger, MenubarGroup, MenubarSub, MenubarShortcut } from './ui/menubar';
export { navigationMenuTriggerStyle, NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuContent, NavigationMenuTrigger, NavigationMenuLink, NavigationMenuIndicator, NavigationMenuViewport } from './ui/navigation-menu';
export { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './ui/pagination';
export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor } from './ui/popover';
export { RadioGroup, RadioGroupItem } from './ui/radio-group';
export { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './ui/resizable';
export { ScrollArea, ScrollBar } from './ui/scroll-area';
export { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectSeparator, SelectScrollUpButton, SelectScrollDownButton } from './ui/select';
export { Separator } from './ui/separator';
export { Sheet, SheetPortal, SheetOverlay, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription } from './ui/sheet';
export { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInput, SidebarInset, SidebarMenu, SidebarMenuAction, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarMenuSkeleton, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarProvider, SidebarRail, SidebarSeparator, SidebarTrigger, useSidebar } from './ui/sidebar';
export { Skeleton } from './ui/skeleton';
export { Slider } from './ui/slider';
export { Switch } from './ui/switch';
export { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';
export { Toggle, toggleVariants } from './ui/toggle';
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './ui/tooltip';

// Utilities
export { cn } from './ui/utils';
export { useMobile } from './ui/use-mobile';

/**
 * BOSHQARUV DESIGN SYSTEM COMPONENT MAPPING
 * 
 * Design File → React Component
 * ======================================
 * 
 * Boshqaruv/Components/Button → Button
 * Boshqaruv/Components/Input → Input, Textarea
 * Boshqaruv/Components/Table → Table
 * Boshqaruv/Components/Dialog → Dialog
 * Boshqaruv/Components/Tabs → Tabs
 * Boshqaruv/Components/Card → Card
 * Boshqaruv/Components/Toast → Toaster (from sonner)
 * Boshqaruv/Components/Kanban → KanbanBoard
 * 
 * VARIANT PROPS SPECIFICATION
 * ===========================
 * 
 * All components include the following props:
 * - size: 'sm' | 'md' | 'lg'
 * - variant/tone: varies by component
 * - state: 'default' | 'hover' | 'pressed' | 'disabled' | 'loading'
 * - className: string (for customization)
 * - aria-label: string (required for accessibility)
 * 
 * ACCESSIBILITY FEATURES
 * ======================
 * 
 * ✅ WCAG AA contrast compliance (4.5:1 minimum)
 * ✅ Keyboard navigation support
 * ✅ Screen reader compatibility
 * ✅ Focus management
 * ✅ ARIA labels in Uzbek language
 * ✅ Role attributes for semantic meaning
 * ✅ Live regions for dynamic content
 * 
 * RESPONSIVE DESIGN
 * =================
 * 
 * All components follow the 8-pt grid system:
 * Mobile: 360px+ (4 columns)
 * Tablet: 768px+ (8 columns)  
 * Desktop: 1024px+ (12 columns)
 * 
 * AUTO LAYOUT SPECIFICATIONS
 * ==========================
 * 
 * Components use CSS Grid and Flexbox with:
 * - Content hugging for text/icons
 * - Fill container for inputs/cards
 * - Proper constraints for responsive behavior
 * - 8px gap spacing between elements
 * 
 * THEMING SUPPORT
 * ===============
 * 
 * Light and dark themes supported via CSS custom properties:
 * - --color-primary: #2563EB
 * - --color-success: #10B981
 * - --color-warning: #F59E0B
 * - --color-danger: #EF4444
 * 
 * EXPORT SPECIFICATIONS
 * ====================
 * 
 * Icons: SVG format with 24×24 viewbox
 * Images: PNG @2x resolution for retina displays
 * Components: TypeScript interfaces with full prop types
 * 
 * USAGE EXAMPLES
 * ==============
 * 
 * import { Button, Input, KanbanBoard } from './components/BoshqaruvComponents';
 * 
 * <Button variant="primary" size="lg" aria-label="Saqlash">
 *   Saqlash
 * </Button>
 * 
 * <Input 
 *   label="Email manzil" 
 *   required 
 *   aria-label="Email manzilini kiriting"
 * />
 * 
 * <KanbanBoard 
 *   columns={columns} 
 *   onTaskMove={handleTaskMove}
 * />
 */

// Version and metadata
export const BOSHQARUV_VERSION = '1.0.0';
export const BOSHQARUV_LANGUAGE = 'uz';
export const BOSHQARUV_THEME_SUPPORT = ['light', 'dark'];