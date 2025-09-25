'use client';

// ffmpeg command: ffmpeg -i input.mp4 -start_number 1 -vsync 0 -q:v 1 public/frames/frame_%04d.jpg
import React, { useRef, useEffect, useState } from "react";

const TOTAL_FRAMES = 238;
const PIXELS_PER_FRAME = 8; // number of vertical pixels of scroll per frame (tune to change scrub speed)

const FullScreenSection: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastDrawFrameRef = useRef<number | null>(null);
  const latestFrameIndexRef = useRef<number>(0);
  const [loadedCount, setLoadedCount] = useState(0);

  // preload images
  useEffect(() => {
    let mounted = true;
    const frameImages: HTMLImageElement[] = [];
    let localLoaded = 0;
    const onLoad = () => {
      localLoaded += 1;
      if (mounted) setLoadedCount(localLoaded);
    };

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `/frames/frame_${String(i).padStart(4, "0")}.jpg`;
      img.onload = onLoad;
      img.onerror = onLoad; // count errors as loaded to avoid blocking
      frameImages.push(img);
    }

    imagesRef.current = frameImages;

    return () => {
      mounted = false;
      frameImages.forEach((img) => {
        img.onload = null as any;
        img.onerror = null as any;
      });
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setCanvasSize = () => {
      const scale = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.round(w * scale);
      canvas.height = Math.round(h * scale);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      // redraw current frame after resize
      drawFrame(latestFrameIndexRef.current);
    };

    const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));

    const drawFrame = (frameIndex: number) => {
      const img = imagesRef.current[frameIndex];
      if (!img) return;
      if (!img.complete) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      try {
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
      } catch (e) {
        // ignore
      }
      lastDrawFrameRef.current = frameIndex;
    };

    // requestAnimationFrame-based render that reads the latest progress/frame index
    const renderLoop = () => {
      const rect = container.getBoundingClientRect();
      // total scrollable distance inside the container is container.height - viewportHeight
      const totalScrollable = Math.max(rect.height - window.innerHeight, 1);
      const progress = clamp((-rect.top) / totalScrollable, 0, 1);
      const frameIndex = Math.min(TOTAL_FRAMES - 1, Math.floor(progress * (TOTAL_FRAMES - 1)));
      if (frameIndex !== lastDrawFrameRef.current) {
        latestFrameIndexRef.current = frameIndex;
        drawFrame(frameIndex);
      }
      rafRef.current = requestAnimationFrame(renderLoop);
    };

    const setContainerHeight = () => {
      const scrollLength = TOTAL_FRAMES * PIXELS_PER_FRAME; // px of scroll that maps to frames
      const totalHeight = window.innerHeight + scrollLength; // container must be viewport + scroll length
      container.style.height = `${totalHeight}px`;
    };

    setContainerHeight();
    setCanvasSize();
    window.addEventListener("resize", () => {
      setContainerHeight();
      setCanvasSize();
    });

    // start RAF
    rafRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", setCanvasSize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedCount]);

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 1,
        }}
      />
    </div>
  );
};

export default FullScreenSection;
