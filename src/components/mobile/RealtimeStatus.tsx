import { useEffect, useRef, useState } from 'react';

import { Activity, Wifi, WifiOff } from 'lucide-react';

import { isSupabaseConfigured, supabase } from '../../utils/supabaseClient';

/**
 * Real-time connection holati
 */
interface RealtimeStatus {
  connected: boolean;
  configured: boolean;
  lastCheck: Date | null;
}

/**
 * RealtimeStatus komponenti - Supabase real-time holatini ko'rsatadi
 *
 * Yashil: Real-time ishlayapti ✅
 * Qizil: Real-time ishlamayapti ❌
 */
export function RealtimeStatus() {
  const [status, setStatus] = useState<RealtimeStatus>({
    connected: false,
    configured: false,
    lastCheck: null,
  });

  // Channel va timeout reference'larni saqlash
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cleanupTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Supabase sozlanganligini tekshirish
    const configured = isSupabaseConfigured();

    if (!configured) {
      setStatus({
        connected: false,
        configured: false,
        lastCheck: new Date(),
      });
      return;
    }

    // Faqat bir marta channel yaratish va uzoq vaqt saqlash
    let isMounted = true;
    let testChannel: ReturnType<typeof supabase.channel> | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let reconnectTimeoutId: ReturnType<typeof setTimeout> | null = null;

    const setupConnection = () => {
      // Avvalgi channel va timeout'larni to'xtatish
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      if (testChannel) {
        try {
          testChannel.unsubscribe();
          supabase.removeChannel(testChannel);
        } catch (e) {
          // Silent fail
        }
        testChannel = null;
      }

      if (!isMounted) return;

      try {
        // Test channel yaratish - unique name
        const channelName = `realtime-status-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        testChannel = supabase.channel(channelName, {
          config: {
            broadcast: { self: false },
            presence: { key: '' },
          },
        });

        channelRef.current = testChannel;

        // Subscription holatini kuzatish
        testChannel.subscribe(subscriptionStatus => {
          if (!isMounted) return;

          if (subscriptionStatus === 'SUBSCRIBED') {
            setStatus({
              connected: true,
              configured: true,
              lastCheck: new Date(),
            });

            // Timeout'ni to'xtatish
            if (timeoutId) {
              clearTimeout(timeoutId);
              timeoutId = null;
            }
          } else if (
            subscriptionStatus === 'CHANNEL_ERROR' ||
            subscriptionStatus === 'TIMED_OUT' ||
            subscriptionStatus === 'CLOSED'
          ) {
            if (!isMounted) return;

            setStatus({
              connected: false,
              configured: true,
              lastCheck: new Date(),
            });

            // Timeout'ni to'xtatish
            if (timeoutId) {
              clearTimeout(timeoutId);
              timeoutId = null;
            }

            // Qayta ulanish - 5 soniyadan keyin
            if (reconnectTimeoutId) {
              clearTimeout(reconnectTimeoutId);
            }
            reconnectTimeoutId = setTimeout(() => {
              if (isMounted) {
                setupConnection();
              }
            }, 5000);
          }
        });

        // Timeout - agar 5 soniyada ulanish bo'lmasa
        timeoutId = setTimeout(() => {
          if (!isMounted) return;

          if (testChannel && testChannel.state !== 'joined') {
            setStatus({
              connected: false,
              configured: true,
              lastCheck: new Date(),
            });

            // Qayta ulanish - 5 soniyadan keyin
            if (reconnectTimeoutId) {
              clearTimeout(reconnectTimeoutId);
            }
            reconnectTimeoutId = setTimeout(() => {
              if (isMounted) {
                setupConnection();
              }
            }, 5000);
          }
        }, 5000);
        timeoutRef.current = timeoutId;
      } catch (error) {
        if (!isMounted) return;

        // Xatolarni silent qilish
        setStatus({
          connected: false,
          configured: true,
          lastCheck: new Date(),
        });

        // Qayta ulanish - 5 soniyadan keyin
        if (reconnectTimeoutId) {
          clearTimeout(reconnectTimeoutId);
        }
        reconnectTimeoutId = setTimeout(() => {
          if (isMounted) {
            setupConnection();
          }
        }, 5000);
      }
    };

    // Birinchi marta ulanish
    setupConnection();

    return () => {
      isMounted = false;

      // Barcha timeout'larni to'xtatish
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      if (reconnectTimeoutId) {
        clearTimeout(reconnectTimeoutId);
        reconnectTimeoutId = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
        cleanupTimeoutRef.current = null;
      }

      // Channel'ni to'xtatish
      if (testChannel) {
        try {
          testChannel.unsubscribe();
          supabase.removeChannel(testChannel);
        } catch (e) {
          // Silent fail
        }
        testChannel = null;
      }
      if (channelRef.current) {
        try {
          const channel = channelRef.current;
          channel.unsubscribe();
          supabase.removeChannel(channel);
        } catch (e) {
          // Silent fail
        }
        channelRef.current = null;
      }
    };
  }, []);

  // Agar Supabase sozlanmagan bo'lsa, hech narsa ko'rsatmaymiz
  if (!status.configured && !isSupabaseConfigured()) {
    return null;
  }

  // Status ko'rsatkich
  const getStatusColor = () => {
    if (!status.configured) return 'text-gray-400';
    return status.connected ? 'text-green-500' : 'text-red-500';
  };

  const getStatusBg = () => {
    if (!status.configured) return 'bg-gray-100 dark:bg-gray-800';
    return status.connected
      ? 'bg-green-100 dark:bg-green-900/30'
      : 'bg-red-100 dark:bg-red-900/30';
  };

  const getStatusText = () => {
    if (!status.configured) return 'Supabase sozlanmagan';
    return status.connected ? 'Real-time ishlayapti' : 'Real-time ishlamayapti';
  };

  const getStatusIcon = () => {
    if (!status.configured) return <WifiOff className="w-3.5 h-3.5" />;
    return status.connected ? (
      <Wifi className="w-3.5 h-3.5" />
    ) : (
      <WifiOff className="w-3.5 h-3.5" />
    );
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md ${getStatusBg()} transition-colors duration-200`}
      title={getStatusText()}
    >
      <div className={`${getStatusColor()} transition-colors duration-200`}>
        {getStatusIcon()}
      </div>
      <span
        className={`text-xs font-medium ${getStatusColor()} transition-colors duration-200`}
      >
        {status.connected ? 'RT' : 'RT'}
      </span>
      {status.connected && (
        <Activity className="w-2.5 h-2.5 text-green-500 animate-pulse" />
      )}
    </div>
  );
}

/**
 * Compact RealtimeStatus - faqat icon ko'rsatadi
 */
export function CompactRealtimeStatus() {
  const [connected, setConnected] = useState(false);
  const [configured, setConfigured] = useState(false);

  // Channel va timeout reference'larni saqlash
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cleanupTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const configured = isSupabaseConfigured();
    setConfigured(configured);

    if (!configured) {
      return;
    }

    // Faqat bir marta channel yaratish va uzoq vaqt saqlash
    let isMounted = true;
    let testChannel: ReturnType<typeof supabase.channel> | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let reconnectTimeoutId: ReturnType<typeof setTimeout> | null = null;

    const setupConnection = () => {
      // Avvalgi channel va timeout'larni to'xtatish
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      if (testChannel) {
        try {
          testChannel.unsubscribe();
          supabase.removeChannel(testChannel);
        } catch (e) {
          // Silent fail
        }
        testChannel = null;
      }

      if (!isMounted) return;

      try {
        const channelName = `realtime-compact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        testChannel = supabase.channel(channelName, {
          config: {
            broadcast: { self: false },
            presence: { key: '' },
          },
        });

        channelRef.current = testChannel;

        testChannel.subscribe(status => {
          if (!isMounted) return;

          if (status === 'SUBSCRIBED') {
            setConnected(true);
            if (timeoutId) {
              clearTimeout(timeoutId);
              timeoutId = null;
            }
          } else if (
            status === 'CHANNEL_ERROR' ||
            status === 'TIMED_OUT' ||
            status === 'CLOSED'
          ) {
            if (!isMounted) return;

            setConnected(false);
            if (timeoutId) {
              clearTimeout(timeoutId);
              timeoutId = null;
            }

            // Qayta ulanish - 5 soniyadan keyin
            if (reconnectTimeoutId) {
              clearTimeout(reconnectTimeoutId);
            }
            reconnectTimeoutId = setTimeout(() => {
              if (isMounted) {
                setupConnection();
              }
            }, 5000);
          }
        });

        timeoutId = setTimeout(() => {
          if (!isMounted) return;

          if (testChannel && testChannel.state !== 'joined') {
            setConnected(false);

            // Qayta ulanish - 5 soniyadan keyin
            if (reconnectTimeoutId) {
              clearTimeout(reconnectTimeoutId);
            }
            reconnectTimeoutId = setTimeout(() => {
              if (isMounted) {
                setupConnection();
              }
            }, 5000);
          }
        }, 5000);
        timeoutRef.current = timeoutId;
      } catch (error) {
        if (!isMounted) return;

        setConnected(false);

        // Qayta ulanish - 5 soniyadan keyin
        if (reconnectTimeoutId) {
          clearTimeout(reconnectTimeoutId);
        }
        reconnectTimeoutId = setTimeout(() => {
          if (isMounted) {
            setupConnection();
          }
        }, 5000);
      }
    };

    // Birinchi marta ulanish
    setupConnection();

    return () => {
      isMounted = false;

      // Barcha timeout'larni to'xtatish
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      if (reconnectTimeoutId) {
        clearTimeout(reconnectTimeoutId);
        reconnectTimeoutId = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
        cleanupTimeoutRef.current = null;
      }

      // Channel'ni to'xtatish
      if (testChannel) {
        try {
          testChannel.unsubscribe();
          supabase.removeChannel(testChannel);
        } catch (e) {
          // Silent fail
        }
        testChannel = null;
      }
      if (channelRef.current) {
        try {
          const channel = channelRef.current;
          channel.unsubscribe();
          supabase.removeChannel(channel);
        } catch (e) {
          // Silent fail
        }
        channelRef.current = null;
      }
    };
  }, []);

  if (!configured) {
    return null;
  }

  return (
    <div
      className={`w-2 h-2 rounded-full ${
        connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
      } transition-colors duration-200`}
      title={connected ? 'Real-time ishlayapti' : 'Real-time ishlamayapti'}
    />
  );
}
