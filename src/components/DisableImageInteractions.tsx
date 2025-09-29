"use client";

import { useEffect } from "react";

export default function NoImageInteractions() {
  useEffect(() => {
    const handler = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
  const allow = target.closest('[data-allow-image-interactions="true"]');
  const isImg = target.closest("img, picture, svg, canvas, video");
      if (isImg && !allow) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const events: Array<keyof DocumentEventMap> = [
      "contextmenu",
      "dragstart",
      "pointerdown",
      "mousedown",
      "touchstart",
      "click",
      "dblclick",
    ];

    events.forEach((evt) => document.addEventListener(evt, handler, { capture: true }));

    return () => {
      events.forEach((evt) => document.removeEventListener(evt, handler, { capture: true }));
    };
  }, []);

  return null;
}
