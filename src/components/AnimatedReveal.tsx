"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ElementType } from "react";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  start?: string;
  end?: string;
  once?: boolean;
  stagger?: number;
  duration?: number;
  initialYOffset?: number;
  mode?: 'once' | 'scrub';
  split?: 'chars' | 'words';
};

export default function AnimatedReveal({
  text,
  as = 'div',
  className,
  start = 'top 80%',
  end = '+=200',
  once = true,
  stagger = 0.025,
  duration = 0.45,
  initialYOffset = 16,
  mode = 'once',
  split = 'chars',
}: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current as HTMLElement | null;
    if (!el) return;

    if (!(el as HTMLElement).dataset.split) {
      el.textContent = '';
      const frag = document.createDocumentFragment();
      if (split === 'chars') {
        const words = text.split(' ');
        words.forEach((word, wi) => {
          const wordSpan = document.createElement('span');
          wordSpan.className = 'inline-block';
          for (const ch of word) {
            const span = document.createElement('span');
            span.className = 'ar-char inline-block';
            span.textContent = ch;
            wordSpan.appendChild(span);
          }
          frag.appendChild(wordSpan);
          if (wi < words.length - 1) frag.appendChild(document.createTextNode(' '));
        });
      } else {
        const words = text.split(' ');
        words.forEach((word, wi) => {
          const wordSpan = document.createElement('span');
          wordSpan.className = 'inline-block';
          const inner = document.createElement('span');
          inner.className = 'ar-word inline-block';
          inner.textContent = word;
          wordSpan.appendChild(inner);
          frag.appendChild(wordSpan);
          if (wi < words.length - 1) frag.appendChild(document.createTextNode(' '));
        });
      }
      el.appendChild(frag);
      (el as HTMLElement).dataset.split = '1';
    }

    const targets = el.querySelectorAll(split === 'chars' ? '.ar-char' : '.ar-word');
    gsap.set(targets, { opacity: 0, y: initialYOffset });
    gsap.set(el, { opacity: 1 });

    let st: ScrollTrigger | undefined;
    if (mode === 'scrub') {
      const tl = gsap.timeline();
      tl.to(targets, {
        opacity: 1,
        y: 0,
        duration,
        ease: 'power3.out',
        stagger,
      });
      st = ScrollTrigger.create({ trigger: el, start, end, scrub: true, animation: tl });
    } else {
      st = ScrollTrigger.create({
        trigger: el,
        start,
        once,
        onEnter: () => {
          gsap.to(targets, {
            opacity: 1,
            y: 0,
            duration,
            ease: 'power3.out',
            stagger,
          });
        },
      });
    }

    return () => {
      if (st) st.kill();
    };
  }, [text, start, end, once, stagger, duration, initialYOffset, mode, split]);

  const Tag = (as as unknown) as ElementType;
  const classes = ["opacity-0", className].filter(Boolean).join(" ");
  const setRef = (node: Element | null) => {
    ref.current = node as HTMLElement | null;
  };
  return <Tag ref={setRef} className={classes}>{text}</Tag>;
}
