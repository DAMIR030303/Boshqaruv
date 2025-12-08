import { Edit, LogOut, Mail, User } from 'lucide-react';

import type { KPIData, UserProfile } from '../../types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface MobileProfileProps {
  kpiData?: KPIData;
  userProfile?: UserProfile;
  onDataUpdate?: (_data: unknown) => void;
  onProfileUpdate?: (profile: UserProfile) => void;
  onLogout?: () => void;
}

export function MobileProfile({ userProfile, onLogout }: MobileProfileProps) {
  if (!userProfile) {
    return (
      <div className="mobile-content">
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            Profil ma'lumotlari yuklanmoqda...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-content">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Profil
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Shaxsiy ma'lumotlar
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Profile Header */}
        <Card padding="lg" className="text-center">
          <div className="w-24 h-24 rounded-full bg-primary-500 flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-3xl font-bold">
              {userProfile.name.charAt(0)}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {userProfile.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {userProfile.role}
          </p>
          <Button variant="secondary" className="w-full">
            <Edit className="w-4 h-4 mr-2" />
            Profilni tahrirlash
          </Button>
        </Card>

        {/* Profile Info */}
        <Card padding="md">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            Ma'lumotlar
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Email
                </p>
                <p className="text-gray-900 dark:text-white">
                  Email ko'rsatilmagan
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  userProfile.status === 'online'
                    ? 'bg-green-500'
                    : 'bg-gray-400'
                }`}
              />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Holat
                </p>
                <p className="text-gray-900 dark:text-white">
                  {userProfile.status === 'online' ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <Card padding="md">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            Amallar
          </h3>
          <div className="space-y-2">
            <Button variant="secondary" className="w-full justify-start">
              <Edit className="w-4 h-4 mr-2" />
              Parolni o'zgartirish
            </Button>
            <Button
              variant="danger"
              className="w-full justify-start"
              onClick={onLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Chiqish
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
