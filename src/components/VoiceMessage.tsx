import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const WaveSurfer = dynamic(() => import('wavesurfer.js'), { ssr: false });

interface VoiceMessageProps {
  url: string;
}

export default function VoiceMessage({ url }: VoiceMessageProps) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (waveformRef.current && typeof window !== 'undefined') {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#4F46E5',
        progressColor: '#818CF8',
        cursorColor: '#C7D2FE',
        barWidth: 2,
        barRadius: 3,
        responsive: true,
        height: 50,
      });

      wavesurfer.current.load(url);

      wavesurfer.current.on('finish', () => setIsPlaying(false));
    }

    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
      }
    };
  }, [url]);

  const togglePlayPause = () => {
    if (wavesurfer.current) {
      wavesurfer.current.playPause();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="flex items-center space-x-2 bg-white rounded-lg p-2">
      <button
        onClick={togglePlayPause}
        className="p-2 rounded-full hover:bg-gray-100"
      >
        {isPlaying ? '⏸️' : '▶️'}
      </button>
      <div ref={waveformRef} className="flex-1 min-w-[200px]" />
    </div>
  );
}
