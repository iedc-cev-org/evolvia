
// ffmpeg command: ffmpeg -i input.mp4 -start_number 1 -vsync 0 -q:v 1 public/frames/frame_%04d.jpg
import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 238;

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);

  useEffect(() => {
    const frameImages: HTMLImageElement[] = [];
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `/frames/frame_${String(i).padStart(4, "0")}.jpg`;
      frameImages.push(img);
    }
    setImages(frameImages);
  }, []);

  useEffect(() => {
    if (images.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const scale = window.devicePixelRatio || 1;
    canvas.width = 1920 * scale;
    canvas.height = 1080 * scale;
    context.scale(scale, scale);

    const frameState = { frame: 0 };

    const render = () => {
      const currentFrame = Math.round(frameState.frame);
      const img = images[currentFrame];
      if (img?.complete) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0, 1920, 1080);
      }
    };

    images[0].onload = render;
    if (images[0].complete) render();

    const st = gsap.to(frameState, {
      frame: TOTAL_FRAMES - 1,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        scrub: true,
        start: "top top",
        end: "+=5000",
      },
      onUpdate: render,
    });

    return () => {
      st.scrollTrigger?.kill();
      st.kill();
    };
  }, [images]);

  return (
    <div style={{ height: "5000px" }}>
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

export default App;
