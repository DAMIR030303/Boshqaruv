import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { 
  LogIn,
  Eye,
  EyeOff,
  User,
  Lock,
  Smartphone,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';

interface MobileLoginProps {
  onLogin: (credentials: { username: string; password: string }) => Promise<boolean>;
  isDark?: boolean;
}

export function MobileLogin({ onLogin, isDark = false }: MobileLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      toast.error('Iltimos, barcha maydonlarni to\'ldiring');
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await onLogin({ username, password });
      
      if (success) {
        toast.success('Tizimga muvaffaqiyatli kirildi!');
      } else {
        toast.error('Foydalanuvchi nomi yoki parol noto\'g\'ri');
        setPassword(''); // Clear password on failed login
      }
    } catch (error) {
      toast.error('Tizimga kirishda xatolik yuz berdi');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setUsername('admin');
    setPassword('admin123');
    
    // Small delay to show the form update
    setTimeout(async () => {
      await handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    }, 300);
  };

  return (
    <div className={`min-h-screen bg-background ${isDark ? 'dark' : ''}`}>
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-full max-w-sm"
        >
          {/* Logo and Title */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary text-primary-foreground rounded-2xl mb-4">
              <Shield className="h-8 w-8" />
            </div>
            <h1 className="text-foreground mb-2">Boshqaruv Tizimi</h1>
            <p className="text-muted-foreground">
              Xodimlar boshqaruv ilovasi
            </p>
          </motion.div>

          {/* Login Form */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Tizimga kirish</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Foydalanuvchi nomi</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="username"
                        type="text"
                        placeholder="Foydalanuvchi nomingizni kiriting"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="pl-10"
                        disabled={isLoading}
                        autoComplete="username"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Parol</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Parolingizni kiriting"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        disabled={isLoading}
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        Kirilmoqda...
                      </>
                    ) : (
                      <>
                        <LogIn className="h-4 w-4 mr-2" />
                        Kirish
                      </>
                    )}
                  </Button>
                </form>

                {/* Demo Login Button */}
                <div className="mt-6 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground text-center mb-3">
                    Demo sifatida sinab ko'rish uchun:
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleDemoLogin}
                    disabled={isLoading}
                  >
                    <Smartphone className="h-4 w-4 mr-2" />
                    Demo bilan kirish
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Login: admin / Parol: admin123<br/>
                    Marketolog: marketolog / marketing123
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="text-center mt-8"
          >
            <p className="text-xs text-muted-foreground">
              Boshqaruv Tizimi v1.0 © 2024
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}