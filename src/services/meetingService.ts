import type {
  ApiResponse,
  CalendarEvent,
  Meeting,
  VideoConference,
} from '../types';

import { CalendarService } from './calendarService';

/**
 * Meeting servisi - Kontur.Tolk uslubida
 * Uchrashuvlar va video konferensiya boshqaruvi
 */
export class MeetingService {
  /**
   * Uchrashuvlarni olish
   */
  static async getMeetings(
    startDate?: Date,
    endDate?: Date,
    organizer?: string
  ): Promise<ApiResponse<Meeting[]>> {
    try {
      // Hozircha Supabase'da meetings jadvali yo'q, shuning uchun
      // Calendar eventlardan meeting'larni olamiz
      // Production'da alohida meetings jadvali bo'lishi kerak

      const start = startDate || new Date();
      const end = endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 kun

      const result = await CalendarService.getEvents(start, end, organizer);

      if (!result.success || !result.data) {
        return {
          success: false,
          error: result.error || 'Uchrashuvlarni olishda xatolik',
        };
      }

      // Calendar eventlardan meeting'larni filter qilish
      // Hozircha barcha eventlarni meeting sifatida ko'rsatamiz
      const meetings: Meeting[] = result.data
        .filter(event => event.type === 'meeting' || event.type === 'task')
        .map(event => ({
          id: event.id,
          title: event.title,
          description: event.description,
          startTime: event.startDate,
          endTime:
            event.endDate ||
            new Date(event.startDate.getTime() + 60 * 60 * 1000), // 1 soat
          participants: event.assignee ? [event.assignee] : [],
          status: 'scheduled' as const,
          reminderSent: false,
          organizer: event.assignee || 'Unknown',
        }));

      return {
        success: true,
        data: meetings,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Noma'lum xatolik yuz berdi",
      };
    }
  }

  /**
   * Uchrashuv yaratish
   */
  static async createMeeting(
    meeting: Omit<Meeting, 'id' | 'status' | 'reminderSent'>
  ): Promise<ApiResponse<Meeting>> {
    try {
      // Calendar event sifatida yaratish
      const calendarEvent: Omit<CalendarEvent, 'id'> = {
        title: meeting.title,
        type: 'meeting',
        startDate: meeting.startTime,
        endDate: meeting.endTime,
        assignee: meeting.organizer,
        description: meeting.description,
      };

      const result = await CalendarService.createEvent(calendarEvent);

      if (!result.success || !result.data) {
        return {
          success: false,
          error: result.error || 'Uchrashuv yaratishda xatolik',
        };
      }

      const newMeeting: Meeting = {
        id: result.data.id,
        title: meeting.title,
        description: meeting.description,
        startTime: meeting.startTime,
        endTime: meeting.endTime,
        participants: meeting.participants,
        organizer: meeting.organizer,
        status: 'scheduled',
        reminderSent: false,
        calendarEventId: result.data.id,
      };

      return {
        success: true,
        data: newMeeting,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Noma'lum xatolik yuz berdi",
      };
    }
  }

  /**
   * Uchrashuvni yangilash
   */
  static async updateMeeting(
    meetingId: string,
    updates: Partial<Meeting>
  ): Promise<ApiResponse<Meeting>> {
    try {
      // Calendar event sifatida yangilash
      const calendarUpdates: Partial<CalendarEvent> = {};
      if (updates.title) calendarUpdates.title = updates.title;
      if (updates.description)
        calendarUpdates.description = updates.description;
      if (updates.startTime) calendarUpdates.startDate = updates.startTime;
      if (updates.endTime) calendarUpdates.endDate = updates.endTime;
      if (updates.organizer) calendarUpdates.assignee = updates.organizer;

      const result = await CalendarService.updateEvent(
        meetingId,
        calendarUpdates
      );

      if (!result.success || !result.data) {
        return {
          success: false,
          error: result.error || 'Uchrashuv yangilashda xatolik',
        };
      }

      const updatedMeeting: Meeting = {
        id: result.data.id,
        title: updates.title || result.data.title,
        description: updates.description || result.data.description,
        startTime: updates.startTime || result.data.startDate,
        endTime:
          updates.endTime ||
          result.data.endDate ||
          new Date(result.data.startDate.getTime() + 60 * 60 * 1000),
        participants: updates.participants || [],
        organizer: updates.organizer || result.data.assignee || 'Unknown',
        status: updates.status || 'scheduled',
        reminderSent: updates.reminderSent ?? false,
        calendarEventId: result.data.id,
      };

      return {
        success: true,
        data: updatedMeeting,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Noma'lum xatolik yuz berdi",
      };
    }
  }

  /**
   * Uchrashuvni o'chirish
   */
  static async deleteMeeting(meetingId: string): Promise<ApiResponse<void>> {
    try {
      const result = await CalendarService.deleteEvent(meetingId, 'meeting');
      return result;
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Noma'lum xatolik yuz berdi",
      };
    }
  }

  /**
   * Video konferensiya yaratish
   */
  static async createVideoConference(
    meetingId: string,
    provider: VideoConference['provider'] = 'webrtc',
    maxParticipants: number = 200
  ): Promise<ApiResponse<VideoConference>> {
    try {
      // Hozircha mock video conference link yaratamiz
      // Production'da real video conference API integratsiyasi kerak
      const link =
        provider === 'webrtc'
          ? `https://meet.boshqaruv.uz/${meetingId}`
          : provider === 'zoom'
            ? `https://zoom.us/j/${meetingId}`
            : `https://meet.google.com/${meetingId}`;

      const videoConference: VideoConference = {
        meetingId,
        link,
        provider,
        maxParticipants,
        recordingEnabled: true,
        status: 'not_started',
      };

      // Meeting'ga video conference link qo'shish
      await this.updateMeeting(meetingId, {
        videoConferenceLink: link,
      });

      return {
        success: true,
        data: videoConference,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Noma'lum xatolik yuz berdi",
      };
    }
  }

  /**
   * Kelgusi uchrashuvlarni olish
   */
  static async getUpcomingMeetings(
    days: number = 7,
    organizer?: string
  ): Promise<ApiResponse<Meeting[]>> {
    try {
      const start = new Date();
      const end = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

      const result = await this.getMeetings(start, end, organizer);

      if (!result.success || !result.data) {
        return result;
      }

      // Faqat kelgusi uchrashuvlarni qaytarish
      const now = new Date();
      const upcoming = result.data.filter(
        meeting => meeting.startTime >= now && meeting.status === 'scheduled'
      );

      return {
        success: true,
        data: upcoming,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Noma'lum xatolik yuz berdi",
      };
    }
  }

  /**
   * Uchrashuvni boshlash
   */
  static async startMeeting(
    meetingId: string
  ): Promise<ApiResponse<VideoConference>> {
    try {
      // Meeting status'ni yangilash
      await this.updateMeeting(meetingId, {
        status: 'in_progress',
      });

      // Video conference yaratish yoki olish
      const result = await this.createVideoConference(meetingId);

      if (result.success && result.data) {
        // Video conference status'ni yangilash
        result.data.status = 'in_progress';
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Noma'lum xatolik yuz berdi",
      };
    }
  }

  /**
   * Uchrashuvni tugatish
   */
  static async endMeeting(meetingId: string): Promise<ApiResponse<void>> {
    try {
      const result = await this.updateMeeting(meetingId, {
        status: 'completed',
      });

      if (result.success) {
        return {
          success: true,
          message: 'Uchrashuv tugatildi',
        };
      }

      return {
        success: false,
        error: result.error || 'Uchrashuv tugatishda xatolik',
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Noma'lum xatolik yuz berdi",
      };
    }
  }

  /**
   * Ishtirokchilarni qo'shish
   */
  static async addParticipant(
    meetingId: string,
    participant: string
  ): Promise<ApiResponse<Meeting>> {
    try {
      const meetingsResult = await this.getMeetings();
      if (!meetingsResult.success || !meetingsResult.data) {
        return {
          success: false,
          error: 'Uchrashuv topilmadi',
        };
      }

      const meeting = meetingsResult.data.find(m => m.id === meetingId);
      if (!meeting) {
        return {
          success: false,
          error: 'Uchrashuv topilmadi',
        };
      }

      if (!meeting.participants.includes(participant)) {
        meeting.participants.push(participant);
      }

      return this.updateMeeting(meetingId, {
        participants: meeting.participants,
      });
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Noma'lum xatolik yuz berdi",
      };
    }
  }

  /**
   * Ishtirokchilarni olib tashlash
   */
  static async removeParticipant(
    meetingId: string,
    participant: string
  ): Promise<ApiResponse<Meeting>> {
    try {
      const meetingsResult = await this.getMeetings();
      if (!meetingsResult.success || !meetingsResult.data) {
        return {
          success: false,
          error: 'Uchrashuv topilmadi',
        };
      }

      const meeting = meetingsResult.data.find(m => m.id === meetingId);
      if (!meeting) {
        return {
          success: false,
          error: 'Uchrashuv topilmadi',
        };
      }

      const updatedParticipants = meeting.participants.filter(
        p => p !== participant
      );

      return this.updateMeeting(meetingId, {
        participants: updatedParticipants,
      });
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Noma'lum xatolik yuz berdi",
      };
    }
  }
}
