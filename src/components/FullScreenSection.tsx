"use client";

import React, { useRef, useEffect, useState } from "react";

const TOTAL_FRAMES = 238;
const PIXELS_PER_FRAME = 8;

const FullScreenSection: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastDrawFrameRef = useRef<number | null>(null);
  const latestFrameIndexRef = useRef<number>(0);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Preload images
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
      img.onerror = onLoad;
      frameImages.push(img);
    }

    imagesRef.current = frameImages;

    return () => {
      mounted = false;
      frameImages.forEach((img) => {
        img.onload = null;
        img.onerror = null;
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

      drawFrame(latestFrameIndexRef.current);
    };

    const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));

    const drawFrame = (exactFrameIndex: number) => {
      const currentFrameIndex = Math.floor(exactFrameIndex);
      const nextFrameIndex = Math.min(currentFrameIndex + 1, TOTAL_FRAMES - 1);
      const progress = exactFrameIndex - currentFrameIndex;

      const currentImg = imagesRef.current[currentFrameIndex];
      const nextImg = imagesRef.current[nextFrameIndex];
      
      if (!currentImg || !currentImg.complete) return;

      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.clearRect(0, 0, w, h);

      const imgAspect = currentImg.width / currentImg.height;
      const canvasAspect = w / h;

      let drawWidth = w;
      let drawHeight = h;
      let offsetX = 0;
      let offsetY = 0;

      // COVER mode: Fill screen, crop excess
      if (canvasAspect > imgAspect) {
        drawWidth = w;
        drawHeight = w / imgAspect;
        offsetY = (h - drawHeight) / 2;
      } else {
        drawHeight = h;
        drawWidth = h * imgAspect;
        offsetX = (w - drawWidth) / 2;
      }

      // Draw current frame
      ctx.globalAlpha = 1 - progress;
      ctx.drawImage(currentImg, offsetX, offsetY, drawWidth, drawHeight);

      // Draw next frame with interpolation if it exists and progress > 0
      if (nextImg && nextImg.complete && progress > 0 && currentFrameIndex !== nextFrameIndex) {
        ctx.globalAlpha = progress;
        ctx.drawImage(nextImg, offsetX, offsetY, drawWidth, drawHeight);
      }

      // Reset global alpha
      ctx.globalAlpha = 1;
      
      lastDrawFrameRef.current = exactFrameIndex;
    };

    const renderLoop = () => {
      const rect = container.getBoundingClientRect();
      const totalScrollable = Math.max(rect.height - window.innerHeight, 1);
      const progress = clamp((-rect.top) / totalScrollable, 0, 1);
      const frameIndex = Math.min(
        TOTAL_FRAMES - 1,
        Math.floor(progress * (TOTAL_FRAMES - 1))
      );
      if (frameIndex !== lastDrawFrameRef.current) {
        latestFrameIndexRef.current = frameIndex;
        drawFrame(frameIndex);
      }
      rafRef.current = requestAnimationFrame(renderLoop);
    };

    const setContainerHeight = () => {
      const scrollLength = TOTAL_FRAMES * PIXELS_PER_FRAME;
      container.style.height = `${window.innerHeight + scrollLength}px`;
    };

    setContainerHeight();
    setCanvasSize();

    const handleResize = () => {
      setContainerHeight();
      setCanvasSize();
    };

    window.addEventListener("resize", handleResize);

    rafRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [loadedCount, isClient]);

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
      {children && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 10,
            mixBlendMode: 'difference',
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default FullScreenSection;
