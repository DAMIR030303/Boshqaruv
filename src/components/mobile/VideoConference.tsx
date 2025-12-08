import { useCallback, useEffect, useRef, useState } from 'react';

import {
  Mic,
  MicOff,
  PhoneOff,
  Share2,
  Users,
  Video,
  VideoOff,
} from 'lucide-react';
import { toast } from 'sonner';

import { MeetingService } from '../../services/meetingService';
import type {
  Meeting,
  VideoConference as VideoConferenceType,
} from '../../types';
import { Button } from '../ui/Button';

interface VideoConferenceProps {
  /** Meeting ma'lumotlari */
  meeting: Meeting;
  /** Uchrashuvni yopish handler */
  onClose?: () => void;
  /** Uchrashuv tugagandan keyin handler */
  onEnd?: () => void;
}

/**
 * VideoConference - Video konferensiya komponenti
 * Kontur.Tolk uslubida video konferensiya interfeysi
 */
export function VideoConference({
  meeting,
  onClose,
  onEnd,
}: VideoConferenceProps) {
  const [videoConference, setVideoConference] =
    useState<VideoConferenceType | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [participants] = useState<string[]>(meeting.participants || []);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Video konferensiyani boshlash
  const startConference = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await MeetingService.startMeeting(meeting.id);

      if (result.success && result.data) {
        setVideoConference(result.data);
        setIsConnected(true);

        // Video stream'ni olish
        if (localVideoRef.current) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({
              video: isVideoEnabled,
              audio: isAudioEnabled,
            });
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = stream;
            }
          } catch (error) {
            toast.error('Kamera yoki mikrofon ruxsati berilmagan');
          }
        }

        toast.success('Video konferensiya boshlandi');
      } else {
        toast.error(result.error || 'Video konferensiyani boshlashda xatolik');
      }
    } catch (error) {
      toast.error('Video konferensiyani boshlashda xatolik');
    } finally {
      setIsLoading(false);
    }
  }, [meeting.id, isVideoEnabled, isAudioEnabled]);

  // Video konferensiyani tugatish
  const endConference = async () => {
    try {
      // Stream'larni to'xtatish
      if (localVideoRef.current?.srcObject) {
        const stream = localVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = null;
        }
      }

      const result = await MeetingService.endMeeting(meeting.id);

      if (result.success) {
        setIsConnected(false);
        toast.success('Video konferensiya tugatildi');
        onEnd?.();
      } else {
        toast.error(result.error || 'Video konferensiyani tugatishda xatolik');
      }
    } catch (error) {
      toast.error('Video konferensiyani tugatishda xatolik');
    }
  };

  // Video yoqish/o'chirish
  const toggleVideo = async () => {
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled;
        setIsVideoEnabled(!isVideoEnabled);
      }
    }
  };

  // Audio yoqish/o'chirish
  const toggleAudio = async () => {
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioEnabled;
        setIsAudioEnabled(!isAudioEnabled);
      }
    }
  };

  // Link'ni ulashish
  const shareLink = async () => {
    if (videoConference?.link) {
      try {
        await navigator.clipboard.writeText(videoConference.link);
        toast.success('Link nusxalandi');
      } catch (error) {
        toast.error('Link nusxalashda xatolik');
      }
    }
  };

  // Komponent yuklanganda video konferensiyani boshlash
  useEffect(() => {
    if (meeting.id && !isConnected) {
      startConference();
    }

    // Cleanup - ref'ni o'zgaruvchiga ko'chirish
    const localVideo = localVideoRef.current;
    return () => {
      if (localVideo?.srcObject) {
        const stream = localVideo.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [meeting.id, isConnected, startConference]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h2 className="text-lg font-semibold truncate">{meeting.title}</h2>
          {videoConference && (
            <span className="text-xs bg-green-500 px-2 py-1 rounded">
              {videoConference.provider.toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={shareLink}
            className="text-white hover:bg-gray-800"
          >
            <Share2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-gray-800"
          >
            ×
          </Button>
        </div>
      </div>

      {/* Video area */}
      <div className="flex-1 relative bg-gray-900">
        {/* Remote video (asosiy) */}
        <div className="absolute inset-0 flex items-center justify-center">
          {isLoading ? (
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>Video konferensiya ulanmoqda...</p>
            </div>
          ) : (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
              style={{ display: isConnected ? 'block' : 'none' }}
            />
          )}
        </div>

        {/* Local video (kichik) */}
        <div className="absolute bottom-20 right-4 w-32 h-24 bg-gray-800 rounded-lg overflow-hidden border-2 border-white">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ display: isVideoEnabled ? 'block' : 'none' }}
          />
          {!isVideoEnabled && (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <VideoOff className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Participants count */}
        {participants.length > 0 && (
          <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-2 rounded-lg flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span className="text-sm">{participants.length} ishtirokchi</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-900 p-4">
        <div className="flex items-center justify-center space-x-4">
          {/* Video toggle */}
          <Button
            variant={isVideoEnabled ? 'primary' : 'danger'}
            size="lg"
            onClick={toggleVideo}
            className="rounded-full w-14 h-14 p-0"
          >
            {isVideoEnabled ? (
              <Video className="w-6 h-6" />
            ) : (
              <VideoOff className="w-6 h-6" />
            )}
          </Button>

          {/* Audio toggle */}
          <Button
            variant={isAudioEnabled ? 'primary' : 'danger'}
            size="lg"
            onClick={toggleAudio}
            className="rounded-full w-14 h-14 p-0"
          >
            {isAudioEnabled ? (
              <Mic className="w-6 h-6" />
            ) : (
              <MicOff className="w-6 h-6" />
            )}
          </Button>

          {/* End call */}
          <Button
            variant="danger"
            size="lg"
            onClick={endConference}
            className="rounded-full w-14 h-14 p-0"
          >
            <PhoneOff className="w-6 h-6" />
          </Button>
        </div>

        {/* Meeting info */}
        <div className="mt-4 text-center text-white text-sm">
          <p>{meeting.title}</p>
          {videoConference && (
            <p className="text-gray-400 text-xs mt-1">
              {videoConference.maxParticipants} ishtirokchi •{' '}
              {videoConference.recordingEnabled
                ? 'Yozuv yoqilgan'
                : "Yozuv o'chilgan"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
