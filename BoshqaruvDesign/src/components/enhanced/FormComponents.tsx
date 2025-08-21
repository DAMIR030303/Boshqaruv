import { forwardRef, useState } from 'react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '../ui/utils';
import { CalendarIcon, Clock, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { format } from 'date-fns';

// Enhanced Input with states
interface InputEnhancedProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  success?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const InputEnhanced = forwardRef<HTMLInputElement, InputEnhancedProps>(
  ({ className, label, error, helpText, success, leftIcon, rightIcon, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={props.id} className={cn(error && "text-danger")}>
            {label}
          </Label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}
          <Input
            type={inputType}
            className={cn(
              "transition-colors",
              leftIcon && "pl-10",
              (rightIcon || isPassword) && "pr-10",
              error && "border-danger focus:border-danger focus:ring-danger/20",
              success && "border-success focus:border-success focus:ring-success/20",
              className
            )}
            ref={ref}
            {...props}
          />
          {isPassword && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          )}
          {rightIcon && !isPassword && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {rightIcon}
            </div>
          )}
          {success && !rightIcon && !isPassword && (
            <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-success" />
          )}
          {error && !rightIcon && !isPassword && (
            <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-danger" />
          )}
        </div>
        {error && (
          <p className="text-sm text-danger flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {error}
          </p>
        )}
        {helpText && !error && (
          <p className="text-sm text-muted-foreground">{helpText}</p>
        )}
      </div>
    );
  }
);

InputEnhanced.displayName = "InputEnhanced";

// Enhanced Textarea
interface TextareaEnhancedProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helpText?: string;
  success?: boolean;
  maxLength?: number;
}

export const TextareaEnhanced = forwardRef<HTMLTextAreaElement, TextareaEnhancedProps>(
  ({ className, label, error, helpText, success, maxLength, value, ...props }, ref) => {
    const currentLength = typeof value === 'string' ? value.length : 0;

    return (
      <div className="space-y-2">
        {label && (
          <div className="flex items-center justify-between">
            <Label htmlFor={props.id} className={cn(error && "text-danger")}>
              {label}
            </Label>
            {maxLength && (
              <span className="text-xs text-muted-foreground">
                {currentLength}/{maxLength}
              </span>
            )}
          </div>
        )}
        <Textarea
          className={cn(
            "transition-colors resize-none",
            error && "border-danger focus:border-danger focus:ring-danger/20",
            success && "border-success focus:border-success focus:ring-success/20",
            className
          )}
          ref={ref}
          value={value}
          maxLength={maxLength}
          {...props}
        />
        {error && (
          <p className="text-sm text-danger flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {error}
          </p>
        )}
        {helpText && !error && (
          <p className="text-sm text-muted-foreground">{helpText}</p>
        )}
      </div>
    );
  }
);

TextareaEnhanced.displayName = "TextareaEnhanced";

// Enhanced Select
interface SelectEnhancedProps {
  label?: string;
  error?: string;
  helpText?: string;
  placeholder?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  value?: string;
  onValueChange?: (value: string) => void;
}

export function SelectEnhanced({ 
  label, 
  error, 
  helpText, 
  placeholder = "Tanlang...", 
  options,
  value,
  onValueChange
}: SelectEnhancedProps) {
  return (
    <div className="space-y-2">
      {label && (
        <Label className={cn(error && "text-danger")}>
          {label}
        </Label>
      )}
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className={cn(
          "transition-colors",
          error && "border-danger focus:border-danger focus:ring-danger/20"
        )}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-sm text-danger flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
      {helpText && !error && (
        <p className="text-sm text-muted-foreground">{helpText}</p>
      )}
    </div>
  );
}

// Date Picker
interface DatePickerProps {
  label?: string;
  error?: string;
  helpText?: string;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function DatePicker({ 
  label, 
  error, 
  helpText, 
  value, 
  onChange, 
  placeholder = "Sanani tanlang",
  disabled
}: DatePickerProps) {
  return (
    <div className="space-y-2">
      {label && (
        <Label className={cn(error && "text-danger")}>
          {label}
        </Label>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground",
              error && "border-danger focus:border-danger focus:ring-danger/20"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "dd.MM.yyyy") : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {error && (
        <p className="text-sm text-danger flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
      {helpText && !error && (
        <p className="text-sm text-muted-foreground">{helpText}</p>
      )}
    </div>
  );
}

// Time Picker
interface TimePickerProps {
  label?: string;
  error?: string;
  helpText?: string;
  value?: string;
  onChange?: (time: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function TimePicker({ 
  label, 
  error, 
  helpText, 
  value, 
  onChange, 
  placeholder = "Vaqtni tanlang",
  disabled
}: TimePickerProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
  
  const [selectedHour, selectedMinute] = value ? value.split(':') : ['', ''];

  const handleTimeChange = (hour: string, minute: string) => {
    if (hour && minute) {
      onChange?.(`${hour}:${minute}`);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <Label className={cn(error && "text-danger")}>
          {label}
        </Label>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground",
              error && "border-danger focus:border-danger focus:ring-danger/20"
            )}
            disabled={disabled}
          >
            <Clock className="mr-2 h-4 w-4" />
            {value || placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex divide-x">
            <div className="p-2">
              <p className="text-xs font-medium mb-2">Soat</p>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {hours.map((hour) => (
                  <Button
                    key={hour}
                    variant={selectedHour === hour ? "default" : "ghost"}
                    size="sm"
                    className="w-full"
                    onClick={() => handleTimeChange(hour, selectedMinute)}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
            </div>
            <div className="p-2">
              <p className="text-xs font-medium mb-2">Daqiqa</p>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {minutes.filter((_, i) => i % 5 === 0).map((minute) => (
                  <Button
                    key={minute}
                    variant={selectedMinute === minute ? "default" : "ghost"}
                    size="sm"
                    className="w-full"
                    onClick={() => handleTimeChange(selectedHour, minute)}
                  >
                    {minute}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {error && (
        <p className="text-sm text-danger flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
      {helpText && !error && (
        <p className="text-sm text-muted-foreground">{helpText}</p>
      )}
    </div>
  );
}

// Multi-Select with chips
interface MultiSelectProps {
  label?: string;
  error?: string;
  helpText?: string;
  placeholder?: string;
  options: Array<{ value: string; label: string }>;
  value?: string[];
  onChange?: (values: string[]) => void;
}

export function MultiSelect({ 
  label, 
  error, 
  helpText, 
  placeholder = "Tanlang...", 
  options,
  value = [],
  onChange
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleToggle = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange?.(newValue);
  };

  const selectedLabels = value.map(v => options.find(opt => opt.value === v)?.label).filter(Boolean);

  return (
    <div className="space-y-2">
      {label && (
        <Label className={cn(error && "text-danger")}>
          {label}
        </Label>
      )}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal min-h-10",
              value.length === 0 && "text-muted-foreground",
              error && "border-danger focus:border-danger focus:ring-danger/20"
            )}
          >
            {value.length === 0 ? (
              placeholder
            ) : (
              <div className="flex flex-wrap gap-1">
                {selectedLabels.slice(0, 2).map((label, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {label}
                  </Badge>
                ))}
                {selectedLabels.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{selectedLabels.length - 2} boshqa
                  </Badge>
                )}
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <div className="max-h-60 overflow-y-auto p-1">
            {options.map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-2 p-2 hover:bg-accent rounded-sm cursor-pointer"
                onClick={() => handleToggle(option.value)}
              >
                <input
                  type="checkbox"
                  checked={value.includes(option.value)}
                  onChange={() => {}}
                  className="rounded border-border"
                />
                <span className="text-sm">{option.label}</span>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      {error && (
        <p className="text-sm text-danger flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
      {helpText && !error && (
        <p className="text-sm text-muted-foreground">{helpText}</p>
      )}
    </div>
  );
}