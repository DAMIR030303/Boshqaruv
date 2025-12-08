import type { NFCConfig } from '../types';

/**
 * NFC integratsiyasi - Kontur.Diadoc uslubida
 * Davomat tizimi uchun NFC bilan check-in
 */
export class NFCService {
  private static config: NFCConfig = {
    enabled: false,
  };

  /**
   * NFC qo'llab-quvvatlashini tekshirish
   */
  static async isSupported(): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    // Web NFC API mavjudligini tekshirish
    if ('NDEFReader' in window) {
      return true;
    }

    // React Native uchun (agar kerak bo'lsa)
    // @ts-expect-error - React Native specific
    if (window.nfc && window.nfc.isSupported) {
      return true;
    }

    return false;
  }

  /**
   * NFC'ni yoqish
   */
  static async enable(): Promise<{ success: boolean; error?: string }> {
    try {
      const supported = await this.isSupported();
      if (!supported) {
        return {
          success: false,
          error: "NFC qurilmangizda qo'llab-quvvatlanmaydi",
        };
      }

      // Web NFC API
      if ('NDEFReader' in window) {
        // @ts-expect-error - Web NFC API
        const reader = new NDEFReader();
        await reader.scan();

        this.config.enabled = true;
        return { success: true };
      }

      return {
        success: false,
        error: 'NFC API topilmadi',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'NFC yoqishda xatolik',
      };
    }
  }

  /**
   * NFC'dan ma'lumot o'qish
   */
  static async read(): Promise<{
    success: boolean;
    data?: string;
    error?: string;
  }> {
    try {
      if (!this.config.enabled) {
        const enableResult = await this.enable();
        if (!enableResult.success) {
          return enableResult;
        }
      }

      // Web NFC API
      if ('NDEFReader' in window) {
        // @ts-expect-error - Web NFC API
        const reader = new NDEFReader();

        return new Promise(resolve => {
          reader.addEventListener('reading', (event: unknown) => {
            const message = (
              event as { message: { records: Array<{ data: Uint8Array }> } }
            ).message;
            const record = message.records[0];
            const decoder = new TextDecoder();
            const data = decoder.decode(record.data);

            resolve({
              success: true,
              data,
            });
          });

          reader.addEventListener('readingerror', () => {
            resolve({
              success: false,
              error: "NFC o'qishda xatolik",
            });
          });

          reader.scan().catch((error: Error) => {
            resolve({
              success: false,
              error: error.message,
            });
          });
        });
      }

      return {
        success: false,
        error: 'NFC API topilmadi',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "NFC o'qishda xatolik",
      };
    }
  }

  /**
   * NFC'ga ma'lumot yozish
   */
  static async write(
    data: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.config.enabled) {
        const enableResult = await this.enable();
        if (!enableResult.success) {
          return enableResult;
        }
      }

      // Web NFC API
      if ('NDEFReader' in window) {
        // @ts-expect-error - Web NFC API
        const writer = new NDEFWriter();

        await writer.write({
          records: [
            {
              recordType: 'text',
              data,
            },
          ],
        });

        return { success: true };
      }

      return {
        success: false,
        error: 'NFC API topilmadi',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'NFC yozishda xatolik',
      };
    }
  }

  /**
   * NFC konfiguratsiyasini olish
   */
  static getConfig(): NFCConfig {
    return { ...this.config };
  }

  /**
   * NFC konfiguratsiyasini o'rnatish
   */
  static setConfig(config: Partial<NFCConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * NFC'ni o'chirish
   */
  static disable(): void {
    this.config.enabled = false;
  }
}

/**
 * NFC bilan check-in funksiyasi
 */
export async function nfcCheckIn(employeeId: string): Promise<{
  success: boolean;
  data?: { employeeId: string; timestamp: Date };
  error?: string;
}> {
  try {
    const readResult = await NFCService.read();

    if (!readResult.success || !readResult.data) {
      return {
        success: false,
        error: readResult.error || "NFC ma'lumot o'qilmadi",
      };
    }

    // NFC'dan o'qilgan ma'lumotni tekshirish
    // Bu yerda employeeId bilan solishtirish kerak
    const nfcData = readResult.data;

    // Oddiy tekshiruv (production'da hash yoki token bilan tekshirish kerak)
    if (nfcData.includes(employeeId)) {
      return {
        success: true,
        data: {
          employeeId,
          timestamp: new Date(),
        },
      };
    }

    return {
      success: false,
      error: "NFC ma'lumot mos kelmadi",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'NFC check-in xatolik',
    };
  }
}
