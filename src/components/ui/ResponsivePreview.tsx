import { useEffect, useRef, useState } from 'react';

import {
  Maximize2,
  Minimize2,
  Monitor,
  Smartphone,
  Tablet,
  X,
} from 'lucide-react';

/**
 * Responsive Preview komponenti
 *
 * Bu komponent web'da turib mobil ko'rinishni ko'rish imkonini beradi.
 * Turli device preset'larni qo'llab-quvvatlaydi va real-time responsive preview ko'rsatadi.
 */

interface DevicePreset {
  name: string;
  width: number;
  height: number;
  icon: React.ReactNode;
}

const DEVICE_PRESETS: DevicePreset[] = [
  {
    name: 'iPhone 14 Pro',
    width: 393,
    height: 852,
    icon: <Smartphone className="w-4 h-4" />,
  },
  {
    name: 'iPhone SE',
    width: 375,
    height: 667,
    icon: <Smartphone className="w-4 h-4" />,
  },
  {
    name: 'Samsung Galaxy S21',
    width: 360,
    height: 800,
    icon: <Smartphone className="w-4 h-4" />,
  },
  {
    name: 'iPad Mini',
    width: 768,
    height: 1024,
    icon: <Tablet className="w-4 h-4" />,
  },
  {
    name: 'iPad Pro',
    width: 1024,
    height: 1366,
    icon: <Tablet className="w-4 h-4" />,
  },
  {
    name: 'Desktop',
    width: 1280,
    height: 720,
    icon: <Monitor className="w-4 h-4" />,
  },
];

interface ResponsivePreviewProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ResponsivePreview({ isOpen, onClose }: ResponsivePreviewProps) {
  const [selectedPreset, setSelectedPreset] = useState<DevicePreset>(
    DEVICE_PRESETS[0]
  );
  const [customWidth, setCustomWidth] = useState(393);
  const [customHeight, setCustomHeight] = useState(852);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Calculate current dimensions - must be before useEffect
  const currentWidth = isCustom ? customWidth : selectedPreset.width;
  const currentHeight = isCustom ? customHeight : selectedPreset.height;

  useEffect(() => {
    if (isOpen) {
      // Add viewport meta tag manipulation for responsive preview
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute(
          'content',
          `width=${currentWidth}, initial-scale=1, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover`
        );
      }
    } else {
      // Restore original viewport
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute(
          'content',
          'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover'
        );
      }
    }
  }, [isOpen, currentWidth]);

  if (!isOpen) return null;

  const handlePresetSelect = (preset: DevicePreset) => {
    setSelectedPreset(preset);
    setIsCustom(false);
    setCustomWidth(preset.width);
    setCustomHeight(preset.height);
  };

  const handleCustomSize = () => {
    setIsCustom(true);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-slate-900/95 backdrop-blur-sm ${
        isFullscreen ? '' : 'p-4'
      }`}
      onClick={e => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Header Controls */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-slate-800/95 backdrop-blur-xl border-b border-slate-700/50 shadow-lg">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Device Presets */}
          <div className="flex items-center gap-2 flex-wrap">
            {DEVICE_PRESETS.map(preset => (
              <button
                key={preset.name}
                onClick={() => handlePresetSelect(preset)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  !isCustom && selectedPreset.name === preset.name
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                title={preset.name}
              >
                {preset.icon}
                <span className="hidden sm:inline">{preset.name}</span>
                <span className="sm:hidden">{preset.width}px</span>
              </button>
            ))}

            {/* Custom Size Button */}
            <button
              onClick={handleCustomSize}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isCustom
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span className="hidden sm:inline">Maxsus</span>
            </button>
          </div>

          {/* Custom Size Inputs */}
          {isCustom && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-slate-700/50 rounded-lg px-3 py-1.5">
                <label className="text-xs text-slate-400">Kenglik:</label>
                <input
                  type="number"
                  value={customWidth}
                  onChange={e => setCustomWidth(Number(e.target.value))}
                  min={320}
                  max={1920}
                  className="w-20 px-2 py-1 bg-slate-600 text-white rounded text-sm border border-slate-500 focus:border-blue-500 focus:outline-none"
                />
                <span className="text-xs text-slate-400">px</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-700/50 rounded-lg px-3 py-1.5">
                <label className="text-xs text-slate-400">Balandlik:</label>
                <input
                  type="number"
                  value={customHeight}
                  onChange={e => setCustomHeight(Number(e.target.value))}
                  min={480}
                  max={2160}
                  className="w-20 px-2 py-1 bg-slate-600 text-white rounded text-sm border border-slate-500 focus:border-blue-500 focus:outline-none"
                />
                <span className="text-xs text-slate-400">px</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="btn-icon btn-ghost text-slate-300 hover:text-white hover:bg-slate-700"
              title={isFullscreen ? 'Kichiklashtirish' : "To'liq ekran"}
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5" />
              ) : (
                <Maximize2 className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={onClose}
              className="btn-icon btn-ghost text-slate-300 hover:text-white hover:bg-red-600/20 hover:text-red-400"
              title="Yopish"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Preview Container */}
      <div
        className={`flex items-center justify-center ${
          isFullscreen ? 'h-screen pt-16' : 'h-full pt-24'
        }`}
      >
        <div
          className="relative bg-slate-800 rounded-lg shadow-2xl overflow-hidden transition-all duration-300"
          style={{
            width: isFullscreen ? '100%' : `min(${currentWidth + 80}px, 95vw)`,
            height: isFullscreen
              ? '100%'
              : `min(${currentHeight + 120}px, 90vh)`,
            maxWidth: isFullscreen ? '100%' : '95vw',
            maxHeight: isFullscreen ? '100%' : '90vh',
          }}
        >
          {/* Device Frame (optional decorative border) - only for mobile sizes */}
          {currentWidth < 768 && (
            <div className="absolute inset-0 pointer-events-none z-10">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl opacity-50" />
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-900 rounded-t-full opacity-50" />
            </div>
          )}

          {/* Preview Content - Using iframe to show current page */}
          <div
            ref={previewRef}
            className="w-full h-full overflow-auto bg-slate-800 flex items-center justify-center"
            style={{
              padding: currentWidth < 768 ? '20px 10px' : '40px',
            }}
          >
            <div
              className="relative bg-white dark:bg-slate-900 rounded-lg shadow-xl overflow-hidden flex-shrink-0"
              style={{
                width: `${currentWidth}px`,
                height: `${currentHeight}px`,
                maxWidth: '100%',
                maxHeight: '100%',
              }}
            >
              <iframe
                src={`${window.location.href}${window.location.search ? '&' : '?'}responsive-preview=true&preview-width=${currentWidth}`}
                className="w-full h-full border-0"
                style={{
                  width: `${currentWidth}px`,
                  height: `${currentHeight}px`,
                }}
                title="Responsive Preview"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
              />
            </div>
          </div>

          {/* Size Indicator */}
          {!isFullscreen && (
            <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg font-mono z-20">
              {currentWidth} × {currentHeight}px
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
