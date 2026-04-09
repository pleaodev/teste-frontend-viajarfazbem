"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, ArrowLeft } from "lucide-react";
import Link from "next/link";

export function PlayerClient({ title }: { title: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Vídeo genérico para teste
  const videoUrl = "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4";

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setCurrentTime(current);
      setProgress((current / total) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setProgress(value);
    if (videoRef.current) {
      videoRef.current.currentTime = (value / 100) * videoRef.current.duration;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setVolume(value);
    if (videoRef.current) {
      videoRef.current.volume = value;
      setIsMuted(value === 0);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[99999] bg-black flex flex-col w-screen h-screen overflow-hidden font-sans"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        playsInline
      >
        <source src={videoUrl} type="video/mp4" />
        Seu navegador não suporta o elemento de vídeo.
      </video>

      {/* Box Play/Pause overlay */}
      {!isPlaying && (
        <button 
          onClick={togglePlay}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all hover:scale-110 focus:outline-none"
        >
          <Play className="w-10 h-10 ml-2 fill-current" />
        </button>
      )}

      {/* Header overlay */}
      <div className={`absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-300 flex items-center gap-4 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <Link 
          href="/" 
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-white font-medium text-lg drop-shadow-md">Assistindo: {title}</h1>
      </div>

      {/* Controles overlay */}
      <div className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Progress Bar */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-white text-sm font-medium w-12 text-right">{formatTime(currentTime)}</span>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={progress || 0}
            onChange={handleSeek}
            className="flex-1 h-1.5 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-sky-500 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
            style={{
              background: `linear-gradient(to right, #0ea5e9 ${progress}%, rgba(255,255,255,0.3) ${progress}%)`
            }}
          />
          <span className="text-white text-sm font-medium w-12">{formatTime(duration)}</span>
        </div>

        {/* Controles */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={togglePlay} className="text-white hover:text-sky-400 transition-colors focus:outline-none">
              {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current" />}
            </button>

            <div className="flex items-center gap-2 group">
              <button onClick={toggleMute} className="text-white hover:text-sky-400 transition-colors focus:outline-none">
                {isMuted || volume === 0 ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              </button>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-0 group-hover:w-24 h-1.5 bg-white/30 rounded-full appearance-none cursor-pointer transition-all duration-300 opacity-0 group-hover:opacity-100 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                style={{
                  background: `linear-gradient(to right, white ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.3) ${(isMuted ? 0 : volume) * 100}%)`
                }}
              />
            </div>
          </div>

          <button onClick={toggleFullscreen} className="text-white hover:text-sky-400 transition-colors focus:outline-none">
            {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </div>
  );
}