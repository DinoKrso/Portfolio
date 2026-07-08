import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hls from "hls.js";

// Register ScrollTrigger with GSAP
gsap.registerPlugin(ScrollTrigger);

interface CinematicVideoBgProps {
  src: string;
  className?: string;
}

export default function CinematicVideoBg({ src, className = "" }: CinematicVideoBgProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // References to keep track of seeking throttling without causing re-renders
  const currentTargetTime = useRef(0);
  const isSeekingActive = useRef(false);
  const seekPending = useRef(false);
  const hlsInstance = useRef<Hls | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Reset loading state on source change
    setIsLoading(true);
    setProgress(0);

    const isHlsSource = src.includes(".m3u8");
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    const onCanPlay = () => {
      setIsLoading(false);
    };

    video.addEventListener("canplay", onCanPlay);

    // Standard progress tracker for nonHLS fallback (.mp4 files)
    const handleNativeProgress = () => {
      if (isHlsSource) return; // Managed by HLS event
      if (video.duration && video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const percent = Math.min(100, Math.round((bufferedEnd / video.duration) * 100));
        setProgress(percent);
      }
    };

    video.addEventListener("progress", handleNativeProgress);

    // Video config as specified
    if (isHlsSource && !isSafari && Hls.isSupported()) {
      // Configuration parameters requested:
      // maxBufferLength: 120, maxMaxBufferLength: 600, maxBufferSize: 200 * 1024, startPosition: 0, capLevelToPlayerSize: false, startLevel: -1, autoStartLoad: true
      const hls = new Hls({
        maxBufferLength: 120,
        maxMaxBufferLength: 600,
        maxBufferSize: 200 * 1024,
        startPosition: 0,
        capLevelToPlayerSize: false,
        startLevel: -1,
        autoStartLoad: true,
      });

      hlsInstance.current = hls;
      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        // Force highest quality level
        const maxLevel = hls.levels.length - 1;
        hls.currentLevel = maxLevel;
        hls.startLevel = maxLevel;
      });

      hls.on(Hls.Events.FRAG_BUFFERED, (event, data) => {
        if (video.duration) {
          // Track progress: (bufferedEnd / duration) * 100
          const bufferedEnd = video.buffered.length > 0 ? video.buffered.end(video.buffered.length - 1) : 0;
          const percent = Math.min(100, Math.round((bufferedEnd / video.duration) * 100));
          setProgress(percent);
        }
      });
    } else {
      // Direct load for native HLS (Safari) or fallback (.mp4 source like ours)
      video.src = src;
      video.load();
    }

    return () => {
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("progress", handleNativeProgress);
      if (hlsInstance.current) {
        hlsInstance.current.destroy();
        hlsInstance.current = null;
      }
    };
  }, [src]);

  // Throttled Scroll seeking using GSAP ScrollTrigger
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const performSeek = (targetTime: number) => {
      // Skip micro-seeks: re-seeking for sub-frame deltas causes visible stutter
      if (Math.abs(targetTime - currentTargetTime.current) < 0.035 && !isSeekingActive.current) {
        return;
      }
      currentTargetTime.current = targetTime;
      if (!isSeekingActive.current) {
        isSeekingActive.current = true;
        video.currentTime = targetTime;
      } else {
        seekPending.current = true;
      }
    };

    const handleSeeked = () => {
      isSeekingActive.current = false;
      if (seekPending.current) {
        seekPending.current = false;
        isSeekingActive.current = true;
        video.currentTime = currentTargetTime.current;
      }
    };

    video.addEventListener("seeked", handleSeeked);

    // Smoothing proxy: instead of seeking raw on every scroll event, tween
    // towards the target time so fast scrolling doesn't flood the decoder
    const timeProxy = { time: 0 };

    // Create ScrollTrigger to tie video time to scroll position
    let scrollTriggerInstance: globalThis.ScrollTrigger | null = null;
    let fallbackTimeout: ReturnType<typeof setTimeout> | null = null;

    const initScrollTrigger = () => {
      const targetScroller = document.getElementById("main-scroll-container");

      if (!targetScroller) {
        // If the scroll container isn't rendered in DOM yet, poll shortly
        fallbackTimeout = setTimeout(initScrollTrigger, 100);
        return;
      }

      if (scrollTriggerInstance) {
        return;
      }

      scrollTriggerInstance = ScrollTrigger.create({
        scroller: targetScroller,
        start: 0,
        end: "max",
        onUpdate: (self) => {
          // Read duration live: it's NaN/undefined until metadata loads
          const duration = video.duration;
          if (!duration || !isFinite(duration)) return;

          gsap.to(timeProxy, {
            time: self.progress * duration,
            duration: 0.5,
            ease: "power2.out",
            overwrite: true,
            onUpdate: () => performSeek(timeProxy.time),
          });
        },
      });
    };

    // Recalculate scroll range once media/layout settles (images, video, fonts)
    const refreshTriggers = () => ScrollTrigger.refresh();
    const handleMetadata = () => refreshTriggers();

    video.addEventListener("loadedmetadata", handleMetadata);
    window.addEventListener("load", refreshTriggers);

    initScrollTrigger();

    return () => {
      video.removeEventListener("seeked", handleSeeked);
      video.removeEventListener("loadedmetadata", handleMetadata);
      window.removeEventListener("load", refreshTriggers);
      gsap.killTweensOf(timeProxy);
      if (fallbackTimeout) {
        clearTimeout(fallbackTimeout);
      }
      if (scrollTriggerInstance) {
        scrollTriggerInstance.kill();
      }
    };
  }, [src]);

  // Mouse Parallax on wrapper container
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (window.matchMedia("(max-width: 767px)").matches) return;

      const { innerWidth, innerHeight } = window;
      const moveX = (e.clientX / innerWidth) * 2 - 1;
      const moveY = (e.clientY / innerHeight) * 2 - 1;

      gsap.to(wrapper, {
        x: moveX * -30,
        y: moveY * -30,
        duration: 1,
        ease: "power2.out"
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      {/* Cinematic Loading Overlay */}
      {isLoading && (
        <div id="video-loader-overlay" className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-4">
          <div className="flex flex-col items-center gap-4">
            {/* Minimalist modern loading indicator */}
            <div className="w-16 h-[2px] bg-neutral-900 overflow-hidden relative rounded-full">
              <div className="absolute top-0 bottom-0 left-0 bg-cream animate-loading-line w-1/2" />
            </div>
            <div className="text-cream text-2xl font-sans tracking-widest uppercase text-center font-light">
              Loading... {progress}%
            </div>
          </div>
        </div>
      )}

      {/* Video Canvas Free Wrapper */}
      <div 
        ref={wrapperRef}
        id="video-background-viewport"
        className="fixed top-0 left-0 w-full h-full z-0 scale-[1.05] origin-center pointer-events-none overflow-hidden"
      >
        <video
          ref={videoRef}
          className={`w-full h-full object-cover scale-[1.15] md:scale-[1.35] pointer-events-none select-none overflow-hidden opacity-100 mix-blend-screen transition-opacity duration-1000 ${className}`}
          muted
          playsInline
          crossOrigin="anonymous"
        />
        {/* Cinematic dark mask vignette over the background */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none opacity-80" />
      </div>
    </>
  );
}
